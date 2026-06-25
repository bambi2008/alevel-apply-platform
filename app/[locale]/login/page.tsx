"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { loginAction, type AuthState } from "@/lib/auth/actions";

export default function LoginPage() {
  const t = useTranslations("auth");
  const [state, formAction, pending] = useActionState<AuthState, FormData>(loginAction, {});

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold mb-6">{t("loginTitle")}</h1>
      <form action={formAction} className="space-y-3">
        <input
          name="email"
          type="email"
          required
          placeholder={t("email")}
          className="w-full rounded-md border border-neutral-300 px-3 py-2"
        />
        <input
          name="password"
          type="password"
          required
          placeholder={t("password")}
          className="w-full rounded-md border border-neutral-300 px-3 py-2"
        />
        {state.error && <p className="text-sm text-red-600">{t(`errors.${state.error}`)}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-blue-600 text-white py-2.5 font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {t("loginBtn")}
        </button>
      </form>
      <p className="mt-4 text-sm text-neutral-500">
        <Link href="/register" className="text-blue-600 hover:underline">{t("toRegister")}</Link>
      </p>
    </div>
  );
}
