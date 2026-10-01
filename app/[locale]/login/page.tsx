"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { loginAction, type AuthState } from "@/lib/auth/actions";
import { PhoneAuthForm } from "@/components/phone-auth-form";

const CORE_PATHS = [
  { index: "01", title: "考试训练" },
  { index: "02", title: "竞赛与专业实践" },
  { index: "03", title: "面试训练" },
  { index: "04", title: "文书" },
] as const;

export default function LoginPage() {
  const t = useTranslations("auth");
  const phoneEnabled = process.env.NEXT_PUBLIC_PHONE_AUTH_ENABLED === "true";
  const [tab, setTab] = useState<"phone" | "email">(phoneEnabled ? "phone" : "email");
  const [state, formAction, pending] = useActionState<AuthState, FormData>(loginAction, {});

  const fieldClass = "w-full border-0 border-b border-black/20 bg-transparent px-0 py-3 text-base text-[#101817] outline-none transition-colors placeholder:text-black/30 focus:border-[#101817]";

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[#f4f4f0] text-[#101817]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="grid overflow-hidden border-y border-black/15 lg:min-h-[560px] lg:grid-cols-[1.15fr_0.85fr]">
          <section className="flex flex-col justify-between py-7 sm:py-10 lg:border-r lg:border-black/15 lg:px-8 lg:py-12" aria-labelledby="login-heading">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-black/40">ACCOUNT · CORE FOUR</p>
              <h1 id="login-heading" className="mt-4 text-[clamp(3.25rem,8vw,6.75rem)] font-semibold leading-[0.88] tracking-[-0.075em]">
                {t("loginTitle")}
              </h1>
              <p className="mt-3 max-w-md text-base leading-6 text-black/55 sm:mt-5 sm:text-lg sm:leading-7">{t("loginLead")}</p>
            </div>

            <div className="mt-12 hidden grid-cols-2 border-t border-black/15 sm:grid lg:mt-16" aria-label="四个核心入口">
              {CORE_PATHS.map((path) => (
                <div key={path.index} className="min-h-20 border-b border-black/15 py-4 odd:border-r odd:pr-4 even:pl-4">
                  <span className="text-[0.65rem] font-semibold tracking-[0.18em] text-black/30">{path.index}</span>
                  <p className="mt-2 text-sm font-semibold tracking-[-0.015em]">{path.title}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex items-center border-t border-black/15 py-8 sm:py-10 lg:border-l-0 lg:border-t-0 lg:px-10 lg:py-12" aria-labelledby="login-form-heading">
            <div className="mx-auto w-full max-w-sm">
              <p className="text-xs font-semibold tracking-[0.2em] text-black/35">01 / SIGN IN</p>
              <h2 id="login-form-heading" className="mt-3 text-2xl font-semibold tracking-[-0.035em]">{t("loginFormTitle")}</h2>
              <p className="mt-2 text-sm leading-6 text-black/50">{t("loginHint")}</p>

              {phoneEnabled ? (
                <div className="mt-8 grid grid-cols-2 border-y border-black/15 text-sm" aria-label="登录方式">
                  <button
                    type="button"
                    onClick={() => setTab("phone")}
                    aria-pressed={tab === "phone"}
                    className={`min-h-11 border-r border-black/15 px-3 transition-colors ${tab === "phone" ? "bg-[#101817] font-semibold text-white" : "text-black/45 hover:bg-white/55 hover:text-black"}`}
                  >
                    {t("phoneTab")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("email")}
                    aria-pressed={tab === "email"}
                    className={`min-h-11 px-3 transition-colors ${tab === "email" ? "bg-[#101817] font-semibold text-white" : "text-black/45 hover:bg-white/55 hover:text-black"}`}
                  >
                    {t("emailTab")}
                  </button>
                </div>
              ) : null}

              <div className={phoneEnabled ? "mt-7" : "mt-8"}>
                {tab === "phone" ? (
                  <PhoneAuthForm />
                ) : (
                  <form action={formAction} className="space-y-6">
                    <label className="block text-xs font-semibold tracking-[0.12em] text-black/45">
                      {t("email")}
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="name@example.com"
                        className={fieldClass}
                      />
                    </label>
                    <label className="block text-xs font-semibold tracking-[0.12em] text-black/45">
                      {t("password")}
                      <input
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        placeholder="••••••••••"
                        className={fieldClass}
                      />
                    </label>
                    {state.error ? (
                      <p role="alert" className="border-l-2 border-red-700 pl-3 text-sm text-red-800">{t(`errors.${state.error}`)}</p>
                    ) : null}
                    <div className="flex items-center justify-end">
                      <Link href="/forgot-password" className="text-sm text-black/55 underline decoration-black/25 underline-offset-4 hover:text-black">
                        {t("forgotPassword")}
                      </Link>
                    </div>
                    <button
                      type="submit"
                      disabled={pending}
                      className="flex min-h-12 w-full items-center justify-between bg-[#101817] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#273331] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101817] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-50"
                    >
                      <span>{pending ? t("loginPending") : t("loginBtn")}</span>
                      <span aria-hidden="true">→</span>
                    </button>
                  </form>
                )}
              </div>

              <p className="mt-7 border-t border-black/15 pt-5 text-sm text-black/50">
                <Link href="/register" className="font-semibold text-[#101817] underline decoration-black/25 underline-offset-4 hover:decoration-black">
                  {t("toRegister")}
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
