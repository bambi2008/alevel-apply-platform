"use client";

import { useActionState } from "react";
import { useLocale } from "next-intl";
import {
  changePasswordAction,
  deleteAccountAction,
  updateAiConsentAction,
  type AccountActionState,
} from "@/lib/auth/account-actions";

function Feedback({ state }: { state: AccountActionState }) {
  const en = useLocale() === "en";
  if (state.status === "password-changed") return <p className="text-sm text-[var(--success)]">{en ? "Password updated. Previous reset links have expired." : "密码已更新，其他重置链接均已失效。"}</p>;
  if (state.status === "ai-consent-updated") return <p className="text-sm text-[var(--success)]">{en ? "AI processing preference saved." : "AI 数据处理偏好已更新。"}</p>;
  if (state.error === "WRONG_PASSWORD") return <p className="text-sm text-[var(--danger)]">{en ? "The current password is incorrect." : "当前密码不正确。"}</p>;
  if (state.error === "RATE_LIMITED") return <p className="text-sm text-[var(--danger)]">{en ? "Too many requests. Please try again later." : "操作过于频繁，请稍后再试。"}</p>;
  if (state.error) return <p className="text-sm text-[var(--danger)]">{en ? "Check the fields and try again." : "请检查填写内容后重试。"}</p>;
  return null;
}

export function AiConsentForm({ granted }: { granted: boolean }) {
  const en = useLocale() === "en";
  const [state, action, pending] = useActionState<AccountActionState, FormData>(
    updateAiConsentAction,
    {},
  );
  return (
    <form action={action} className="mt-4 space-y-3">
      <label className="flex items-start gap-2 text-sm leading-6 text-[var(--ink-soft)]">
        <input name="granted" type="checkbox" defaultChecked={granted} className="mt-1 accent-[var(--indigo)]" />
        <span>{en ? "I consent to sending my submitted content to the AI provider named in the Privacy Policy when I request AI feedback. I can withdraw consent here at any time." : "同意在我主动使用 AI 点评时，将本次提交内容发送给隐私政策列明的 AI 服务商处理。我可以随时取消。"}</span>
      </label>
      <Feedback state={state} />
      <button type="submit" disabled={pending} className="btn btn-secondary">
        {pending ? (en ? "Saving…" : "正在保存…") : en ? "Save AI processing preference" : "保存 AI 数据处理偏好"}
      </button>
    </form>
  );
}

export function ChangePasswordForm() {
  const en = useLocale() === "en";
  const [state, action, pending] = useActionState<AccountActionState, FormData>(
    changePasswordAction,
    {},
  );
  return (
    <form action={action} className="mt-4 grid gap-3 sm:max-w-md">
      <input name="currentPassword" type="password" required autoComplete="current-password" aria-label={en ? "Current password" : "当前密码"} placeholder={en ? "Current password" : "当前密码"} className="input" />
      <input name="password" type="password" required minLength={10} maxLength={128} autoComplete="new-password" aria-label={en ? "New password" : "新密码"} placeholder={en ? "New password (10–128 characters)" : "新密码（10–128 位）"} className="input" />
      <input name="confirmPassword" type="password" required minLength={10} maxLength={128} autoComplete="new-password" aria-label={en ? "Confirm new password" : "再次输入新密码"} placeholder={en ? "Confirm new password" : "再次输入新密码"} className="input" />
      <Feedback state={state} />
      <button type="submit" disabled={pending} className="btn btn-primary justify-self-start">
        {pending ? (en ? "Updating…" : "正在更新…") : en ? "Update password" : "更新密码"}
      </button>
    </form>
  );
}

export function DeleteAccountForm({ hasPassword }: { hasPassword: boolean }) {
  const en = useLocale() === "en";
  const [state, action, pending] = useActionState<AccountActionState, FormData>(
    deleteAccountAction,
    {},
  );
  return (
    <form action={action} className="mt-4 grid gap-3 sm:max-w-md">
      {hasPassword && <input name="currentPassword" type="password" required autoComplete="current-password" aria-label={en ? "Current password" : "当前密码"} placeholder={en ? "Current password" : "当前密码"} className="input" />}
      <label className="text-sm text-[var(--ink-soft)]">
        {en ? "Enter " : "输入 "}<strong className="text-[var(--ink)]">DELETE</strong>{en ? " to confirm permanent deletion" : " 确认永久注销"}
        <input name="confirmation" required autoComplete="off" className="input mt-1" />
      </label>
      <Feedback state={state} />
      <button type="submit" disabled={pending} className="btn justify-self-start bg-[var(--danger)] text-white">
        {pending ? (en ? "Deleting…" : "正在注销…") : en ? "Delete account permanently" : "永久注销账号"}
      </button>
    </form>
  );
}
