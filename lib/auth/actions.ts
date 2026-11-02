"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
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
import { parseRegistrationIntent, registrationIntentSchema } from "@/lib/auth/registration-intent";
import { getRegistrationMode } from "@/lib/auth/registration-mode";
import { classifyRegistrationInvite, hashInviteCode, normalizeInviteCode } from "@/lib/beta/invites";

class InviteUnavailable extends Error {}

const schema = z.object({
  email: z.string().email(),
  password: z.string().refine(isStrongPassword),
  intendedUniversities: registrationIntentSchema,
  intendedMajors: registrationIntentSchema,
});

export type AuthState = {
  error?: "INVALID" | "EXISTS" | "BADCREDS" | "CONSENT_REQUIRED" | "RATE_LIMITED" | "INVITE_INVALID";
};

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const locale = formData.get("locale") === "en" ? "en" : "zh-CN";
  const intendedUniversities = parseRegistrationIntent(formData.get("intendedUniversities"));
  const intendedMajors = parseRegistrationIntent(formData.get("intendedMajors"));
  const privacyConsent = formData.get("privacyConsent") === "on";
  const termsConsent = formData.get("termsConsent") === "on";
  const crossBorderConsent = formData.get("crossBorderConsent") === "on";
  const guardian = formData.get("guardian") === "on";

  if (!privacyConsent || !termsConsent) return { error: "CONSENT_REQUIRED" };
  const parsed = schema.safeParse({ email, password, intendedUniversities, intendedMajors });
  if (!parsed.success) return { error: "INVALID" };
  const requestHeaders = await headers();
  const ip = clientIp(requestHeaders);
  const ipLimit = await consumePersistentRateLimit(
    rateLimitKey("registration-ip", ip),
    { limit: 10, windowMs: 60 * 60_000 },
  );
  if (!ipLimit.allowed) return { error: "RATE_LIMITED" };
  const limit = await consumePersistentRateLimit(
    rateLimitKey("registration", ip, email),
    { limit: 5, windowMs: 60 * 60_000 },
  );
  if (!limit.allowed) return { error: "RATE_LIMITED" };

  const inviteRequired = getRegistrationMode() === "invite";
  const inviteCode = normalizeInviteCode(formData.get("inviteCode"));
  if (inviteRequired && (!inviteCode || inviteCode.length > 64)) return { error: "INVITE_INVALID" };

  const passwordHash = await bcrypt.hash(password, 12);
  const consents: { type: "PRIVACY_PIPL" | "TERMS" | "GUARDIAN" | "CROSS_BORDER"; version: string }[] = [
    { type: "PRIVACY_PIPL", version: LEGAL_VERSION },
    { type: "TERMS", version: LEGAL_VERSION },
  ];
  if (guardian) consents.push({ type: "GUARDIAN", version: LEGAL_VERSION });
  if (crossBorderConsent) consents.push({ type: "CROSS_BORDER", version: LEGAL_VERSION });

  let registrationError: "EXISTS" | "INVITE_INVALID" | null;
  try {
    registrationError = await db.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({ where: { email }, select: { id: true } });
    const now = new Date();
    const invite = inviteRequired ? await tx.betaInvite.findUnique({ where: { codeHash: hashInviteCode(inviteCode) } }) : null;
    if (inviteRequired && classifyRegistrationInvite(invite, email, existing?.id ?? null, now) === "INVALID") return "INVITE_INVALID" as const;
    if (existing) return "EXISTS" as const;

    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        role: "STUDENT",
        consents: { create: consents },
        profile: {
          create: {
            intendedMajors: parsed.data.intendedMajors,
          },
        },
      },
      select: { id: true, profile: { select: { id: true } } },
    });
    if (!user.profile) throw new Error("Student profile was not created");
    if (inviteRequired && invite) {
      const claimed = await tx.betaInvite.updateMany({
        where: { id: invite.id, email, status: "AVAILABLE", usedByUserId: null,
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
        data: { status: "USED", usedByUserId: user.id, usedAt: now },
      });
      // The transaction rolls back a concurrently revoked/consumed invitation.
      if (claimed.count !== 1) throw new InviteUnavailable();
    }
    await tx.$executeRaw(
      Prisma.sql`UPDATE "StudentProfile"
        SET "intendedUniversities" = ARRAY(
          SELECT jsonb_array_elements_text(${JSON.stringify(parsed.data.intendedUniversities)}::jsonb)
        )
        WHERE "id" = ${user.profile.id}`,
    );
    await tx.learningEvent.create({
      data: {
        studentId: user.profile.id,
        type: "REGISTERED",
        eventKey: `registered:${user.id}`,
      },
    });
    return null;
    });
  } catch (error) {
    if (error instanceof InviteUnavailable) return { error: "INVITE_INVALID" };
    // Concurrent requests can both pass the lookup. The database email unique
    // constraint remains authoritative; do not mask unrelated write failures.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
      && String(error.meta?.target ?? "").includes("email")) return { error: "EXISTS" };
    throw error;
  }
  if (registrationError) return { error: registrationError };

  // 注册后自动登录（成功会抛出重定向）
  await signIn("credentials", { email, password, redirectTo: `/${locale}` });
  return {};
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const locale = formData.get("locale") === "en" ? "en" : "zh-CN";
  try {
    // 注册完成后的首次进入由 registerAction 引导填写档案；已有账号再次登录直接进入工作台。
    // 档案是否完整由工作台展示待办，不应阻断登录，也不应因历史数据差异反复把用户送回档案页。
    await signIn("credentials", { email, password, redirectTo: `/${locale}` });
    return {};
  } catch (e) {
    if (e instanceof AuthError) return { error: "BADCREDS" };
    throw e; // 重定向等非认证错误，继续抛出
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
