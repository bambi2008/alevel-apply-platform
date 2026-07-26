"use client";

import { useActionState } from "react";
import { Link } from "@/i18n/navigation";
import {
  requestPasswordResetAction,
  resetPasswordAction,
  type RecoveryState,
} from "@/lib/auth/recovery-actions";

function Message({ state }: { state: RecoveryState }) {
  if (state.error === "INVALID") return <p className="text-sm text-[var(--danger)]">请检查填写内容，密码需为 10–128 位且两次输入一致。</p>;
  if (state.error === "EXPIRED") return <p className="text-sm text-[var(--danger)]">链接无效或已过期，请重新申请。</p>;
  if (state.error === "RATE_LIMITED") return <p className="text-sm text-[var(--danger)]">操作过于频繁，请稍后再试。</p>;
  return null;
}

export function ForgotPasswordForm({ locale }: { locale: string }) {
  const [state, action, pending] = useActionState<RecoveryState, FormData>(
    requestPasswordResetAction,
    {},
  );
  if (state.status === "sent") {
    return (
      <div className="callout callout-green block">
        <p className="font-semibold text-[var(--success)]">请求已受理</p>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">如果该邮箱已注册，你会收到一封 30 分钟内有效的重置邮件。</p>
        {state.devUrl && <a className="link-blue mt-3 block break-all text-xs" href={state.devUrl}>开发模式重置链接</a>}
      </div>
    );
  }
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <label className="block text-sm font-medium">
        注册邮箱
        <input name="email" type="email" required autoComplete="email" className="input mt-1" />
      </label>
      <Message state={state} />
      <button disabled={pending} className="btn btn-primary w-full" type="submit">
        {pending ? "正在处理…" : "发送重置邮件"}
      </button>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<RecoveryState, FormData>(
    resetPasswordAction,
    {},
  );
  if (state.status === "reset") {
    return (
      <div className="callout callout-green block">
        <p className="font-semibold text-[var(--success)]">密码已更新</p>
        <Link href="/login" className="link-blue mt-2 inline-block">返回登录</Link>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <label className="block text-sm font-medium">
        新密码
        <input name="password" type="password" required minLength={10} maxLength={128} autoComplete="new-password" className="input mt-1" />
      </label>
      <label className="block text-sm font-medium">
        再次输入新密码
        <input name="confirmPassword" type="password" required minLength={10} maxLength={128} autoComplete="new-password" className="input mt-1" />
      </label>
      <Message state={state} />
      <button disabled={pending || !token} className="btn btn-primary w-full" type="submit">
        {pending ? "正在更新…" : "更新密码"}
      </button>
    </form>
  );
}
