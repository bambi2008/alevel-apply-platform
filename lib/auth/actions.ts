"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { signIn, signOut } from "@/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type AuthState = { error?: "INVALID" | "EXISTS" | "BADCREDS" };

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const guardian = formData.get("guardian") === "on";

  const parsed = schema.safeParse({ email, password });
  if (!parsed.success) return { error: "INVALID" };

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { error: "EXISTS" };

  const passwordHash = await bcrypt.hash(password, 10);
  const consents: { type: "PRIVACY_PIPL" | "GUARDIAN"; version: string }[] = [
    { type: "PRIVACY_PIPL", version: "1.0" },
  ];
  if (guardian) consents.push({ type: "GUARDIAN", version: "1.0" });

  await db.user.create({
    data: { email, passwordHash, role: "STUDENT", consents: { create: consents } },
  });

  // 注册后自动登录（成功会抛出重定向）
  await signIn("credentials", { email, password, redirectTo: "/profile" });
  return {};
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  try {
    await signIn("credentials", { email, password, redirectTo: "/profile" });
    return {};
  } catch (e) {
    if (e instanceof AuthError) return { error: "BADCREDS" };
    throw e; // 重定向等非认证错误，继续抛出
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
