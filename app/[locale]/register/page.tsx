"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { registerAction, type AuthState } from "@/lib/auth/actions";
import { SceneGrowth } from "@/components/illustrations";
import { Photo } from "@/components/photo";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const [state, formAction, pending] = useActionState<AuthState, FormData>(registerAction, {});

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      {/* 左：品牌 + 插画 */}
      <div className="hidden lg:block">
        <span className="ucas-accent-bar" />
        <h1 className="ucas-title" style={{ fontSize: "clamp(2rem,3vw,2.8rem)" }}>
          建立你的<br />训练档案
        </h1>
        <p className="mt-4 text-lg text-[var(--ink-soft)] max-w-md">
          注册后进入四个核心功能：入学考试、竞赛与专业实践、面试和文书。
        </p>
        <Photo
          src="/images/hero.jpg"
          alt="开始四核心训练"
          className="mt-8 w-full max-w-md"
          imgClassName="h-auto w-full rounded-2xl object-cover aspect-[4/3]"
          fallback={<SceneGrowth className="w-full h-auto doodle-idle" />}
        />
      </div>

      {/* 右：注册表单 */}
      <div className="w-full max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-[var(--ink)] mb-6">{t("registerTitle")}</h2>
        <form action={formAction} className="space-y-3">
          <input name="email" type="email" required placeholder={t("email")} className="input" />
          <label className="block text-sm text-[var(--ink-soft)]">
            <span>意向院校</span>
            <input
              name="intendedUniversities"
              type="text"
              required
              maxLength={1000}
              placeholder="例如：University of Cambridge，Imperial College London"
              className="input mt-1"
            />
            <span className="mt-1 block text-xs text-[var(--ink-faint)]">可填写多所院校，请用逗号分隔。</span>
          </label>
          <label className="block text-sm text-[var(--ink-soft)]">
            <span>意向专业</span>
            <input
              name="intendedMajors"
              type="text"
              required
              maxLength={1000}
              placeholder="例如：Aerospace Engineering，Mechanical Engineering"
              className="input mt-1"
            />
            <span className="mt-1 block text-xs text-[var(--ink-faint)]">可填写多个专业方向，请用逗号分隔。</span>
          </label>
          <input
            name="inviteCode"
            type="text"
            required
            autoComplete="one-time-code"
            placeholder={t("inviteCode")}
            className="input font-mono uppercase"
          />
          <p className="text-xs text-[var(--ink-soft)]">{t("inviteHint")}</p>
          <input name="password" type="password" required minLength={10} maxLength={128} placeholder={t("password")} className="input" />
          <label className="flex items-start gap-2 text-sm text-[var(--ink-soft)]">
            <input name="privacyConsent" type="checkbox" required className="mt-1 accent-[var(--indigo)]" />
            <span>
              我已阅读并同意
              <Link href="/privacy" className="link-blue">《隐私政策》</Link>
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm text-[var(--ink-soft)]">
            <input name="termsConsent" type="checkbox" required className="mt-1 accent-[var(--indigo)]" />
            <span>
              我已阅读并同意
              <Link href="/terms" className="link-blue">《服务条款》</Link>
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm text-[var(--ink-soft)]">
            <input name="guardian" type="checkbox" className="mt-1 accent-[var(--indigo)]" />
            <span>{t("guardian")}</span>
          </label>
          <label className="flex items-start gap-2 text-sm text-[var(--ink-soft)]">
            <input name="crossBorderConsent" type="checkbox" className="mt-1 accent-[var(--indigo)]" />
            <span>我单独同意：使用 AI 点评时，将我主动提交的作答发送给隐私政策列明的 AI 服务商处理（可稍后撤回）</span>
          </label>
          {state.error && <p className="text-sm text-[var(--danger)]">{t(`errors.${state.error}`)}</p>}
          <button type="submit" disabled={pending} className="w-full btn btn-primary disabled:opacity-50">
            {t("registerBtn")}
          </button>
        </form>
        <p className="mt-4 text-sm text-[var(--ink-soft)]">
          <Link href="/login" className="link-blue">{t("toLogin")}</Link>
        </p>
      </div>
    </div>
  );
}
