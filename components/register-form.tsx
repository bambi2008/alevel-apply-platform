"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { registerAction, type AuthState } from "@/lib/auth/actions";
import { SceneGrowth } from "@/components/illustrations";
import { Photo } from "@/components/photo";
import type { RegistrationMode } from "@/lib/auth/registration-mode";

export function RegisterForm({ mode }: { mode: RegistrationMode }) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const english = locale === "en";
  const [state, formAction, pending] = useActionState<AuthState, FormData>(registerAction, {});

  return (
    <div className="auth-registration mx-auto max-w-7xl px-5 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      {/* 左：品牌 + 插画 */}
      <div className="hidden lg:block">
        <span className="ucas-accent-bar" />
        <p className="ucas-title" style={{ fontSize: "clamp(2rem,3vw,2.8rem)" }}>
          {english ? <>Build your<br />study profile</> : <>建立你的<br />训练档案</>}
        </p>
        <p className="mt-4 text-lg text-[var(--ink-soft)] max-w-md">
          {english ? "A Level, competitions, university admissions tests, interviews and personal statements." : "A Level、竞赛、大学入学考试、面试与文书。"}
        </p>
        <Photo
          src="/images/hero.jpg"
          alt={english ? "Start your learning" : "开始训练"}
          className="mt-8 w-full max-w-md"
          imgClassName="h-auto w-full rounded-2xl object-cover aspect-[4/3]"
          fallback={<SceneGrowth className="w-full h-auto doodle-idle" />}
        />
      </div>

      {/* 右：注册表单 */}
      <div className="w-full max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-[var(--ink)] mb-6">{t("registerTitle")}</h1>
        <p className="mb-5 text-sm text-[var(--ink-soft)]">{mode === "invite" ? t("inviteRegistrationHint") : t("registrationHint")}</p>
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="locale" value={locale} />
          {mode === "invite" && <label className="block text-sm text-[var(--ink-soft)]">
            <span>{t("inviteCode")}</span>
            <input name="inviteCode" type="text" autoComplete="off" required maxLength={64} className="input mt-1" />
          </label>}
          <label className="block text-sm text-[var(--ink-soft)]">
            <span>{t("email")}</span>
            <input name="email" type="email" autoComplete="email" required placeholder={t("email")} className="input mt-1" />
          </label>
          <label className="block text-sm text-[var(--ink-soft)]">
            <span>{english ? "Intended universities" : "意向院校"}</span>
            <input
              name="intendedUniversities"
              type="text"
              required
              maxLength={1000}
              placeholder={english ? "e.g. University of Cambridge, Imperial College London" : "例如：University of Cambridge，Imperial College London"}
              className="input mt-1"
            />
            <span className="mt-1 block text-xs text-[var(--ink-faint)]">{english ? "Separate multiple universities with commas." : "可填写多所院校，请用逗号分隔。"}</span>
          </label>
          <label className="block text-sm text-[var(--ink-soft)]">
            <span>{english ? "Intended subjects" : "意向专业"}</span>
            <input
              name="intendedMajors"
              type="text"
              required
              maxLength={1000}
              placeholder={english ? "e.g. Aerospace Engineering, Mechanical Engineering" : "例如：Aerospace Engineering，Mechanical Engineering"}
              className="input mt-1"
            />
            <span className="mt-1 block text-xs text-[var(--ink-faint)]">{english ? "Separate multiple subjects with commas." : "可填写多个专业方向，请用逗号分隔。"}</span>
          </label>
          <label className="block text-sm text-[var(--ink-soft)]">
            <span>{t("password")}</span>
            <input name="password" type="password" autoComplete="new-password" required minLength={10} maxLength={128} placeholder={t("password")} className="input mt-1" />
          </label>
          <label className="flex items-start gap-2 text-sm text-[var(--ink-soft)]">
            <input name="privacyConsent" type="checkbox" required className="mt-1 accent-[var(--indigo)]" />
            <span>
              {english ? "I have read and accept the " : "我已阅读并同意"}
              <Link href="/privacy" className="link-blue">{english ? "Privacy Policy" : "《隐私政策》"}</Link>
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm text-[var(--ink-soft)]">
            <input name="termsConsent" type="checkbox" required className="mt-1 accent-[var(--indigo)]" />
            <span>
              {english ? "I have read and accept the " : "我已阅读并同意"}
              <Link href="/terms" className="link-blue">{english ? "Terms of Service" : "《服务条款》"}</Link>
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm text-[var(--ink-soft)]">
            <input name="guardian" type="checkbox" className="mt-1 accent-[var(--indigo)]" />
            <span>{t("guardian")}</span>
          </label>
          <label className="flex items-start gap-2 text-sm text-[var(--ink-soft)]">
            <input name="crossBorderConsent" type="checkbox" className="mt-1 accent-[var(--indigo)]" />
            <span>{english ? "I separately consent to sending work I submit for AI feedback to DeepSeek, as described in the Privacy Policy. I can withdraw this consent later." : "我单独同意：使用 AI 点评时，将我主动提交的作答发送给 DeepSeek 处理（可稍后撤回）。"}</span>
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
