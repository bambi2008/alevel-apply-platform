"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { getEmail } from "@/lib/email";
import { captureError } from "@/lib/monitoring";
import { clientIp, consumeRateLimit, rateLimitKey } from "@/lib/security/rate-limit";
import {
  createOpaqueToken,
  hashOpaqueToken,
  isStrongPassword,
  normalizeEmail,
  PASSWORD_RESET_TTL_MS,
} from "./security";

export type RecoveryState = {
  status?: "sent" | "reset";
  error?: "INVALID" | "EXPIRED" | "RATE_LIMITED";
  devUrl?: string;
};

const localeSchema = z.enum(["zh-CN", "en"]).catch("zh-CN");

export async function requestPasswordResetAction(
  _previous: RecoveryState,
  formData: FormData,
): Promise<RecoveryState> {
  const email = normalizeEmail(formData.get("email"));
  const parsed = z.string().email().safeParse(email);
  if (!parsed.success) return { error: "INVALID" };

  const requestHeaders = await headers();
  const limit = consumeRateLimit(
    rateLimitKey("password-reset-request", clientIp(requestHeaders), email),
    { limit: 4, windowMs: 60 * 60_000 },
  );
  if (!limit.allowed) return { error: "RATE_LIMITED" };

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return { status: "sent" };

  const token = createOpaqueToken();
  const tokenHash = hashOpaqueToken(token);
  const locale = localeSchema.parse(formData.get("locale"));
  const origin = process.env.APP_ORIGIN || "http://localhost:3100";
  const resetUrl = `${origin}/${locale}/reset-password?token=${encodeURIComponent(token)}`;

  await db.$transaction([
    db.passwordResetToken.deleteMany({ where: { userId: user.id } }),
    db.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
      },
    }),
  ]);

  try {
    const emailAdapter = getEmail();
    await emailAdapter.send({
      to: email,
      subject: "桥申密码重置",
      text: `请在 30 分钟内打开以下链接重置密码：${resetUrl}\n如果不是你本人发起，请忽略本邮件。`,
      html: `<p>请在 30 分钟内重置桥申账号密码：</p><p><a href="${resetUrl}">重置密码</a></p><p>如果不是你本人发起，请忽略本邮件。</p>`,
      idempotencyKey: `password-reset-${tokenHash.slice(0, 32)}`,
    });
    return {
      status: "sent",
      devUrl: emailAdapter.isDev ? resetUrl : undefined,
    };
  } catch (error) {
    captureError(error, { action: "password-reset-email" });
    return { status: "sent" };
  }
}

export async function resetPasswordAction(
  _previous: RecoveryState,
  formData: FormData,
): Promise<RecoveryState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  if (
    !token
    || !isStrongPassword(password)
    || password !== confirmPassword
  ) {
    return { error: "INVALID" };
  }

  const requestHeaders = await headers();
  const tokenHash = hashOpaqueToken(token);
  const limit = consumeRateLimit(
    rateLimitKey("password-reset-submit", clientIp(requestHeaders), tokenHash),
    { limit: 6, windowMs: 30 * 60_000 },
  );
  if (!limit.allowed) return { error: "RATE_LIMITED" };

  const resetToken = await db.passwordResetToken.findUnique({
    where: { tokenHash },
  });
  if (!resetToken || resetToken.expiresAt <= new Date()) {
    if (resetToken) {
      await db.passwordResetToken.delete({ where: { id: resetToken.id } }).catch(() => {});
    }
    return { error: "EXPIRED" };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const changed = await db.$transaction(async (tx) => {
    const consumed = await tx.passwordResetToken.deleteMany({
      where: { id: resetToken.id, expiresAt: { gt: new Date() } },
    });
    if (consumed.count !== 1) return false;
    await tx.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    });
    await tx.passwordResetToken.deleteMany({ where: { userId: resetToken.userId } });
    await tx.auditLog.create({
      data: {
        actorId: resetToken.userId,
        action: "PASSWORD_RESET",
        entity: "User",
        entityId: resetToken.userId,
      },
    });
    return true;
  });
  return changed ? { status: "reset" } : { error: "EXPIRED" };
}
