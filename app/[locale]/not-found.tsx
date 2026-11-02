"use client";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
export default function LocaleNotFound() {
  const english = useLocale() === "en";
  return <section className="mx-auto max-w-3xl px-5 py-20">
    <p className="text-sm text-black/65">404</p><h1 className="mt-3 text-3xl font-semibold">{english ? "Page not found" : "页面未找到"}</h1>
    <p className="mt-4 text-black/70">{english ? "This page or question is no longer available." : "此页面或题目暂不可用。"}</p>
    <Link href="/" className="mt-5 inline-flex min-h-11 items-center underline">{english ? "Return home" : "返回首页"}</Link>
  </section>;
}
