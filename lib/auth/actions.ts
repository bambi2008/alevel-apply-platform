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

const schema = z.object({
  email: z.string().email(),
  password: z.string().refine(isStrongPassword),
});

export type AuthState = {
  error?: "INVALID" | "EXISTS" | "BADCREDS" | "CONSENT_REQUIRED";
};

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const privacyConsent = formData.get("privacyConsent") === "on";
  const termsConsent = formData.get("termsConsent") === "on";
  const crossBorderConsent = formData.get("crossBorderConsent") === "on";
  const guardian = formData.get("guardian") === "on";

  if (!privacyConsent || !termsConsent) return { error: "CONSENT_REQUIRED" };
  const parsed = schema.safeParse({ email, password });
  if (!parsed.success) return { error: "INVALID" };
  const requestHeaders = await headers();
  const limit = await consumePersistentRateLimit(
    rateLimitKey("registration", clientIp(requestHeaders), email),
    { limit: 5, windowMs: 60 * 60_000 },
  );
  if (!limit.allowed) return { error: "INVALID" };

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { error: "EXISTS" };

  const passwordHash = await bcrypt.hash(password, 12);
  const consents: { type: "PRIVACY_PIPL" | "TERMS" | "GUARDIAN" | "CROSS_BORDER"; version: string }[] = [
    { type: "PRIVACY_PIPL", version: LEGAL_VERSION },
    { type: "TERMS", version: LEGAL_VERSION },
  ];
  if (guardian) consents.push({ type: "GUARDIAN", version: LEGAL_VERSION });
  if (crossBorderConsent) consents.push({ type: "CROSS_BORDER", version: LEGAL_VERSION });

  await db.$transaction(async (tx) => {
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
    await tx.betaParticipant.create({ data: { studentId: user.profile.id } });
    await tx.learningEvent.create({
      data: {
        studentId: user.profile.id,
        type: "REGISTERED",
        eventKey: `registered:${user.id}`,
      },
    });
  });

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
