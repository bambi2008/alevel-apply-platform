"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { getSms } from "@/lib/sms";
import {
  generateCode,
  saveCode,
  canSend,
  cooldownRemaining,
} from "@/lib/auth/phone-codes";

const PHONE_RE = /^1[3-9]\d{9}$/; // 中国大陆手机号

export interface RequestCodeResult {
  ok: boolean;
  error?: "INVALID_PHONE" | "COOLDOWN";
  cooldown?: number;
  /** 仅开发模式回显，便于本地测试；生产为 undefined。 */
  devCode?: string;
}

export async function requestPhoneCodeAction(
  phone: string
): Promise<RequestCodeResult> {
  const p = String(phone || "").trim();
  if (!PHONE_RE.test(p)) return { ok: false, error: "INVALID_PHONE" };

  if (!(await canSend(p))) {
    return { ok: false, error: "COOLDOWN", cooldown: await cooldownRemaining(p) };
  }

  const code = generateCode();
  await saveCode(p, code);

  const sms = getSms();
  await sms.sendCode(p, code);

  return { ok: true, devCode: sms.isDev ? code : undefined };
}

export type PhoneAuthState = {
  error?: "BADCODE";
};

// 手机验证码登录 / 注册（首次自动建号）。成功抛出重定向。
export async function phoneLoginAction(
  _prev: PhoneAuthState,
  formData: FormData
): Promise<PhoneAuthState> {
  const phone = String(formData.get("phone") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  try {
    await signIn("phone", { phone, code, redirectTo: "/profile" });
    return {};
  } catch (e) {
    if (e instanceof AuthError) return { error: "BADCODE" };
    throw e; // 重定向等非认证错误继续抛出
  }
}
