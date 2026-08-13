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
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="phone" value={phone} />
      <input type="hidden" name="code" value={code} />

      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        required
        placeholder="手机号（中国大陆）"
        value={phone}
        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
        className="w-full rounded-md border border-neutral-300 px-3 py-2"
      />

      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          required
          placeholder="6 位验证码"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="flex-1 rounded-md border border-neutral-300 px-3 py-2"
        />
        <button
          type="button"
          onClick={onGetCode}
          disabled={sending || cooldown > 0 || !validPhone}
          className="whitespace-nowrap rounded-md border border-blue-600 text-blue-600 px-3 py-2 text-sm hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {cooldown > 0 ? `${cooldown}s` : sending ? "发送中…" : "获取验证码"}
        </button>
      </div>

      {notice && (
        <p className="text-sm text-green-700 bg-green-50 rounded px-3 py-2">
          {notice}
        </p>
      )}
      {reqError && <p className="text-sm text-red-600">{reqError}</p>}
      {state.error && (
        <p className="text-sm text-red-600">验证码错误或已过期，请重新获取</p>
      )}

      <label className="flex items-start gap-2 text-xs leading-5 text-neutral-600">
        <input name="privacyConsent" type="checkbox" required className="mt-1 accent-blue-600" />
        <span>我已阅读并同意 <Link href="/privacy" className="text-blue-700 hover:underline">隐私政策</Link></span>
      </label>
      <label className="flex items-start gap-2 text-xs leading-5 text-neutral-600">
        <input name="termsConsent" type="checkbox" required className="mt-1 accent-blue-600" />
        <span>我已阅读并同意 <Link href="/terms" className="text-blue-700 hover:underline">用户条款</Link></span>
      </label>

      <button
        type="submit"
        disabled={pending || !validPhone || code.length !== 6}
        className="w-full rounded-lg bg-blue-600 text-white py-2.5 font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "登录中…" : "登录 / 注册"}
      </button>
      <p className="text-xs text-neutral-400">
        未注册的手机号将自动创建账号。
      </p>
    </form>
  );
}
