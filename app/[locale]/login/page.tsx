"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { loginAction, type AuthState } from "@/lib/auth/actions";
import { PhoneAuthForm } from "@/components/phone-auth-form";
import { HeroBridge } from "@/components/illustrations";
import { Photo } from "@/components/photo";

export default function LoginPage() {
  const t = useTranslations("auth");
  const phoneEnabled = process.env.NEXT_PUBLIC_PHONE_AUTH_ENABLED === "true";
  const [tab, setTab] = useState<"phone" | "email">(phoneEnabled ? "phone" : "email");
  const [state, formAction, pending] = useActionState<AuthState, FormData>(loginAction, {});

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      {/* 左：品牌 + 插画 */}
      <div className="hidden lg:block">
        <span className="ucas-accent-bar" />
        <h1 className="ucas-title" style={{ fontSize: "clamp(2rem,3vw,2.8rem)" }}>
          自己掌控<br />你的留学申请
        </h1>
        <p className="mt-4 text-lg text-[var(--ink-soft)] max-w-md">
          选校匹配、院校数据库、申请追踪、文书工具——透明、流程化、低成本。
        </p>
        <Photo
          src="/images/hero-student.jpg"
          alt="桥申"
          className="mt-8 w-full max-w-md"
          imgClassName="h-auto w-full rounded-2xl object-cover aspect-[4/3]"
          fallback={<HeroBridge className="w-full h-auto doodle-idle" />}
        />
      </div>

      {/* 右：登录表单 */}
      <div className="w-full max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-[var(--ink)] mb-6">{t("loginTitle")}</h2>

        {/* 登录方式切换 */}
        {phoneEnabled && <div className="flex mb-5 rounded-lg bg-[var(--surface-2)] p-1 text-sm">
          <button
            onClick={() => setTab("phone")}
            className={`flex-1 py-1.5 rounded-md transition-colors ${tab === "phone" ? "bg-white shadow-sm font-medium text-[var(--ink)]" : "text-[var(--ink-soft)]"}`}
          >
            手机验证码
          </button>
          <button
            onClick={() => setTab("email")}
            className={`flex-1 py-1.5 rounded-md transition-colors ${tab === "email" ? "bg-white shadow-sm font-medium text-[var(--ink)]" : "text-[var(--ink-soft)]"}`}
          >
            邮箱密码
          </button>
        </div>}

        {tab === "phone" ? (
          <PhoneAuthForm />
        ) : (
          <form action={formAction} className="space-y-3">
            <input
              name="email"
              type="email"
              required
              placeholder={t("email")}
              className="input"
            />
            <input
              name="password"
              type="password"
              required
              placeholder={t("password")}
              className="input"
            />
            {state.error && <p className="text-sm text-[var(--danger)]">{t(`errors.${state.error}`)}</p>}
            <button type="submit" disabled={pending} className="w-full btn btn-primary disabled:opacity-50">
              {t("loginBtn")}
            </button>
            <Link href="/forgot-password" className="link-blue block text-right text-sm">忘记密码？</Link>
          </form>
        )}

        <p className="mt-4 text-sm text-[var(--ink-soft)]">
          <Link href="/register" className="link-blue">{t("toRegister")}</Link>
        </p>
      </div>
    </div>
  );
}
