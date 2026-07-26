"use client";

import { useActionState } from "react";
import {
  changePasswordAction,
  deleteAccountAction,
  updateAiConsentAction,
  type AccountActionState,
} from "@/lib/auth/account-actions";

function Feedback({ state }: { state: AccountActionState }) {
  if (state.status === "password-changed") return <p className="text-sm text-[var(--success)]">密码已更新，其他重置链接均已失效。</p>;
  if (state.status === "ai-consent-updated") return <p className="text-sm text-[var(--success)]">AI 数据处理偏好已更新。</p>;
  if (state.error === "WRONG_PASSWORD") return <p className="text-sm text-[var(--danger)]">当前密码不正确。</p>;
  if (state.error === "RATE_LIMITED") return <p className="text-sm text-[var(--danger)]">操作过于频繁，请稍后再试。</p>;
  if (state.error) return <p className="text-sm text-[var(--danger)]">请检查填写内容后重试。</p>;
  return null;
}

export function AiConsentForm({ granted }: { granted: boolean }) {
  const [state, action, pending] = useActionState<AccountActionState, FormData>(
    updateAiConsentAction,
    {},
  );
  return (
    <form action={action} className="mt-4 space-y-3">
      <label className="flex items-start gap-2 text-sm leading-6 text-[var(--ink-soft)]">
        <input name="granted" type="checkbox" defaultChecked={granted} className="mt-1 accent-[var(--indigo)]" />
        <span>同意在我主动使用 AI 点评时，将本次提交内容发送给隐私政策列明的 AI 服务商处理。我可以随时取消；取消后普通题库与非 AI 功能仍可使用。</span>
      </label>
      <Feedback state={state} />
      <button type="submit" disabled={pending} className="btn btn-secondary">
        {pending ? "正在保存…" : "保存 AI 数据处理偏好"}
      </button>
    </form>
  );
}

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState<AccountActionState, FormData>(
    changePasswordAction,
    {},
  );
  return (
    <form action={action} className="mt-4 grid gap-3 sm:max-w-md">
      <input name="currentPassword" type="password" required autoComplete="current-password" placeholder="当前密码" className="input" />
      <input name="password" type="password" required minLength={10} maxLength={128} autoComplete="new-password" placeholder="新密码（10–128 位）" className="input" />
      <input name="confirmPassword" type="password" required minLength={10} maxLength={128} autoComplete="new-password" placeholder="再次输入新密码" className="input" />
      <Feedback state={state} />
      <button type="submit" disabled={pending} className="btn btn-primary justify-self-start">
        {pending ? "正在更新…" : "更新密码"}
      </button>
    </form>
  );
}

export function DeleteAccountForm({ hasPassword }: { hasPassword: boolean }) {
  const [state, action, pending] = useActionState<AccountActionState, FormData>(
    deleteAccountAction,
    {},
  );
  return (
    <form action={action} className="mt-4 grid gap-3 sm:max-w-md">
      {hasPassword && <input name="currentPassword" type="password" required autoComplete="current-password" placeholder="当前密码" className="input" />}
      <label className="text-sm text-[var(--ink-soft)]">
        输入 <strong className="text-[var(--ink)]">DELETE</strong> 确认永久注销
        <input name="confirmation" required autoComplete="off" className="input mt-1" />
      </label>
      <Feedback state={state} />
      <button type="submit" disabled={pending} className="btn justify-self-start bg-[var(--danger)] text-white">
        {pending ? "正在注销…" : "永久注销账号"}
      </button>
    </form>
  );
}
