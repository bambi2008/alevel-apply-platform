"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { auth, revokeOtherUserSessions, signOut } from "@/auth";
import { db } from "@/lib/db";
import { getStorage } from "@/lib/storage";
import { clientIp, consumePersistentRateLimit, rateLimitKey } from "@/lib/security/rate-limit";
import { isStrongPassword, LEGAL_VERSION } from "./security";

export type AccountActionState = {
  status?: "password-changed" | "ai-consent-updated";
  error?: "UNAUTHORIZED" | "INVALID" | "WRONG_PASSWORD" | "RATE_LIMITED";
};

export async function updateAiConsentAction(
  _previous: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const userId = await currentUserId();
  if (!userId) return { error: "UNAUTHORIZED" };
  const granted = formData.get("granted") === "on";
  await db.$transaction(async (tx) => {
    await tx.consent.deleteMany({ where: { userId, type: "CROSS_BORDER" } });
    if (granted) {
      await tx.consent.create({
        data: { userId, type: "CROSS_BORDER", version: LEGAL_VERSION },
      });
    }
    await tx.auditLog.create({
      data: {
        actorId: userId,
        action: granted ? "AI_PROCESSING_CONSENT_GRANTED" : "AI_PROCESSING_CONSENT_WITHDRAWN",
        entity: "User",
        entityId: userId,
      },
    });
  });
  return { status: "ai-consent-updated" };
}

async function currentUserId(): Promise<string | null> {
  const session = await auth();
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

export async function changePasswordAction(
  _previous: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const userId = await currentUserId();
  if (!userId) return { error: "UNAUTHORIZED" };

  const requestHeaders = await headers();
  const limit = await consumePersistentRateLimit(
    rateLimitKey("change-password", clientIp(requestHeaders), userId),
    { limit: 5, windowMs: 30 * 60_000 },
  );
  if (!limit.allowed) return { error: "RATE_LIMITED" };

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  if (!isStrongPassword(password) || password !== confirmPassword) {
    return { error: "INVALID" };
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user?.passwordHash || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
    return { error: "WRONG_PASSWORD" };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await db.$transaction([
    db.user.update({ where: { id: userId }, data: { passwordHash } }),
    db.passwordResetToken.deleteMany({ where: { userId } }),
    db.auditLog.create({
      data: {
        actorId: userId,
        action: "PASSWORD_CHANGED",
        entity: "User",
        entityId: userId,
      },
    }),
  ]);
  await revokeOtherUserSessions(userId);
  return { status: "password-changed" };
}

export async function deleteAccountAction(
  _previous: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const userId = await currentUserId();
  if (!userId) return { error: "UNAUTHORIZED" };

  const requestHeaders = await headers();
  const limit = await consumePersistentRateLimit(
    rateLimitKey("delete-account", clientIp(requestHeaders), userId),
    { limit: 3, windowMs: 60 * 60_000 },
  );
  if (!limit.allowed) return { error: "RATE_LIMITED" };
  if (String(formData.get("confirmation") ?? "") !== "DELETE") {
    return { error: "INVALID" };
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      passwordHash: true,
      documents: { select: { fileKey: true } },
    },
  });
  if (!user) return { error: "UNAUTHORIZED" };
  if (user.passwordHash) {
    const currentPassword = String(formData.get("currentPassword") ?? "");
    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
      return { error: "WRONG_PASSWORD" };
    }
  }

  await db.$transaction(async (tx) => {
    await tx.user.delete({ where: { id: userId } });
    await tx.auditLog.create({
      data: {
        action: "ACCOUNT_DELETED",
        entity: "User",
        entityId: userId,
        meta: { documentCount: user.documents.length },
      },
    });
  });

  const storage = getStorage();
  await Promise.allSettled(user.documents.map(({ fileKey }) => storage.delete(fileKey)));
  await signOut({ redirectTo: "/" });
  return {};
}
