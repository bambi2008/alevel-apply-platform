"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { AuthError, signIn, signOut } from "@/auth";
import { clientIp, consumePersistentRateLimit, rateLimitKey } from "@/lib/security/rate-limit";
import {
  isStrongPassword,
  LEGAL_VERSION,
  normalizeEmail,
} from "@/lib/auth/security";
import {
  BETA_COHORT,
  BETA_INVITE_LOCK_ID,
  BETA_REGISTRATION_LIMIT,
  hashInviteCode,
  normalizeInviteCode,
} from "@/lib/beta/invites";

const schema = z.object({
  email: z.string().email(),
  password: z.string().refine(isStrongPassword),
  inviteCode: z.string().min(8).max(32),
});

export type AuthState = {
  error?: "INVALID" | "EXISTS" | "BADCREDS" | "CONSENT_REQUIRED" | "INVITE_INVALID" | "BETA_FULL";
};

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const inviteCode = normalizeInviteCode(formData.get("inviteCode"));
  const privacyConsent = formData.get("privacyConsent") === "on";
  const termsConsent = formData.get("termsConsent") === "on";
  const crossBorderConsent = formData.get("crossBorderConsent") === "on";
  const guardian = formData.get("guardian") === "on";

  if (!privacyConsent || !termsConsent) return { error: "CONSENT_REQUIRED" };
  const parsed = schema.safeParse({ email, password, inviteCode });
  if (!parsed.success) return { error: "INVALID" };
  const requestHeaders = await headers();
  const limit = await consumePersistentRateLimit(
    rateLimitKey("registration", clientIp(requestHeaders), email),
    { limit: 5, windowMs: 60 * 60_000 },
  );
  if (!limit.allowed) return { error: "INVALID" };

  const passwordHash = await bcrypt.hash(password, 12);
  const consents: { type: "PRIVACY_PIPL" | "TERMS" | "GUARDIAN" | "CROSS_BORDER"; version: string }[] = [
    { type: "PRIVACY_PIPL", version: LEGAL_VERSION },
    { type: "TERMS", version: LEGAL_VERSION },
  ];
  if (guardian) consents.push({ type: "GUARDIAN", version: LEGAL_VERSION });
  if (crossBorderConsent) consents.push({ type: "CROSS_BORDER", version: LEGAL_VERSION });

  const registrationError = await db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(${BETA_INVITE_LOCK_ID})::text`;

    const invite = await tx.betaInvite.findUnique({
      where: { codeHash: hashInviteCode(inviteCode) },
      select: { id: true, email: true, cohort: true, status: true, expiresAt: true },
    });
    if (
      !invite
      || invite.email !== email
      || invite.cohort !== BETA_COHORT
      || invite.status !== "AVAILABLE"
      || (invite.expiresAt && invite.expiresAt <= new Date())
    ) return "INVITE_INVALID" as const;

    const existing = await tx.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) return "EXISTS" as const;

    const usedCount = await tx.betaInvite.count({
      where: { cohort: BETA_COHORT, status: "USED" },
    });
    if (usedCount >= BETA_REGISTRATION_LIMIT) return "BETA_FULL" as const;

    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        role: "STUDENT",
        consents: { create: consents },
        profile: { create: {} },
      },
      select: { id: true, profile: { select: { id: true } } },
    });
    if (!user.profile) throw new Error("Student profile was not created");
    await tx.betaParticipant.create({
      data: { studentId: user.profile.id, cohort: BETA_COHORT, source: "EMAIL_INVITE" },
    });
    await tx.learningEvent.create({
      data: {
        studentId: user.profile.id,
        type: "REGISTERED",
        eventKey: `registered:${user.id}`,
      },
    });
    const consumed = await tx.betaInvite.updateMany({
      where: { id: invite.id, status: "AVAILABLE", usedByUserId: null },
      data: { status: "USED", usedByUserId: user.id, usedAt: new Date() },
    });
    if (consumed.count !== 1) throw new Error("Invite could not be consumed");
    return null;
  });
  if (registrationError) return { error: registrationError };

  // 注册后自动登录（成功会抛出重定向）
  await signIn("credentials", { email, password, redirectTo: "/profile" });
  return {};
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  try {
    // 注册完成后的首次进入由 registerAction 引导填写档案；已有账号再次登录直接进入工作台。
    // 档案是否完整由工作台展示待办，不应阻断登录，也不应因历史数据差异反复把用户送回档案页。
    await signIn("credentials", { email, password, redirectTo: "/" });
    return {};
  } catch (e) {
    if (e instanceof AuthError) return { error: "BADCREDS" };
    throw e; // 重定向等非认证错误，继续抛出
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
