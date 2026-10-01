"use client";

import { useActionState, useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  requestPhoneCodeAction,
  phoneLoginAction,
  type PhoneAuthState,
} from "@/lib/auth/phone-actions";

export function PhoneAuthForm() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [reqError, setReqError] = useState<string | null>(null);

  const [state, formAction, pending] = useActionState<PhoneAuthState, FormData>(
    phoneLoginAction,
    {}
  );

  // 冷却倒计时
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const validPhone = /^1[3-9]\d{9}$/.test(phone);
  const fieldClass = "w-full border-0 border-b border-black/20 bg-transparent px-0 py-3 text-base text-[#101817] outline-none transition-colors placeholder:text-black/30 focus:border-[#101817]";

  const onGetCode = async () => {
    setReqError(null);
    setNotice(null);
    if (!validPhone) {
      setReqError("请输入有效的手机号");
      return;
    }
    setSending(true);
    try {
      const res = await requestPhoneCodeAction(phone);
      if (!res.ok) {
        if (res.error === "COOLDOWN") {
          setCooldown(res.cooldown ?? 60);
          setReqError(`请 ${res.cooldown ?? 60} 秒后再试`);
        } else if (res.error === "UNAVAILABLE") {
          setReqError("手机登录暂未开放，请使用邮箱密码登录");
        } else {
          setReqError("手机号格式不正确");
        }
        return;
      }
      setCooldown(60);
      if (res.devCode) {
        // 开发模式：把验证码直接显示出来，便于测试（生产不会有）
        setNotice(`开发模式验证码：${res.devCode}（也已打印到后台终端）`);
      } else {
        setNotice("验证码已发送，请查收短信");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="phone" value={phone} />
      <input type="hidden" name="code" value={code} />

      <label className="block text-xs font-semibold tracking-[0.12em] text-black/45">
        手机号
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          required
          placeholder="中国大陆手机号"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
          className={fieldClass}
        />
      </label>

      <label className="block text-xs font-semibold tracking-[0.12em] text-black/45">
        验证码
        <div className="flex items-end gap-3">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            placeholder="6 位验证码"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className={`${fieldClass} min-w-0 flex-1`}
          />
        <button
          type="button"
          onClick={onGetCode}
          disabled={sending || cooldown > 0 || !validPhone}
          className="min-h-11 whitespace-nowrap border border-black/20 px-4 text-sm font-semibold text-[#101817] transition-colors hover:border-black/45 hover:bg-white/55 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {cooldown > 0 ? `${cooldown}s` : sending ? "发送中…" : "获取验证码"}
        </button>
        </div>
      </label>

      {notice && (
        <p aria-live="polite" className="border-l-2 border-emerald-700 pl-3 text-sm text-emerald-800">
          {notice}
        </p>
      )}
      {reqError && <p role="alert" className="border-l-2 border-red-700 pl-3 text-sm text-red-800">{reqError}</p>}
      {state.error && (
        <p role="alert" className="border-l-2 border-red-700 pl-3 text-sm text-red-800">验证码错误或已过期，请重新获取</p>
      )}

      <label className="flex items-start gap-2 text-xs leading-5 text-black/55">
        <input name="privacyConsent" type="checkbox" required className="mt-1 accent-[#101817]" />
        <span>我已阅读并同意 <Link href="/privacy" className="font-semibold text-[#101817] underline underline-offset-4">隐私政策</Link></span>
      </label>
      <label className="flex items-start gap-2 text-xs leading-5 text-black/55">
        <input name="termsConsent" type="checkbox" required className="mt-1 accent-[#101817]" />
        <span>我已阅读并同意 <Link href="/terms" className="font-semibold text-[#101817] underline underline-offset-4">用户条款</Link></span>
      </label>

      <button
        type="submit"
        disabled={pending || !validPhone || code.length !== 6}
        className="flex min-h-12 w-full items-center justify-between bg-[#101817] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#273331] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101817] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span>{pending ? "登录中…" : "登录 / 注册"}</span>
        <span aria-hidden="true">→</span>
      </button>
      <p className="text-xs text-black/40">
        未注册的手机号将自动创建账号。
      </p>
    </form>
  );
}
