import type { Metadata } from "next";
import { headers } from "next/headers";
import { routeMetadata } from "@/lib/public-metadata";
import { notFound } from "next/navigation";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type AppLocale } from "@/i18n/routing";
import { CoreTopNav } from "@/components/core-top-nav";
import { CoreRouteFrame } from "@/components/core-route-frame";
import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { clientMessages } from "@/i18n/client-messages";
import { PUBLIC_CONTACT_EMAIL, PUBLIC_CONTACT_HREF } from "@/lib/site-config";
import { isConfiguredAdmin } from "@/lib/admin/allowlist";
import { MembershipExpiryBanner } from "@/components/membership-expiry-banner";
import { MembershipRequired } from "@/components/membership-required";
import { membershipAccess } from "@/lib/membership/access";
import { seasonPassOffer } from "@/lib/membership/config";
import "../globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return routeMetadata(locale, (await headers()).get("x-qiaoshen-pathname") ?? `/${locale}`);
}

async function Footer() {
  const t = await getTranslations("footer");
  const en = (await getLocale()) === "en";
  return (
    <footer className="mt-20 bg-[#101817] text-white/65">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-white/15 pb-5">
          <span className="text-xl font-semibold tracking-[-0.06em] text-white">{en ? "QiaoShen" : "桥申"}</span>
          <span className="text-[0.65rem] font-semibold tracking-[0.2em] text-white/65">{en ? "LEARN · PRACTISE · APPLY" : "学习 · 训练 · 表达"}</span>
        </div>
        <div className="flex flex-col justify-between gap-3 text-sm sm:flex-row">
          <span>© {new Date().getFullYear()} {t("rights")}</span>
          <span className="text-white/50">{t("disclaimer")}</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed">{en ? "A practice and question-bank tool for high-school students preparing for A Levels and university applications." : "面向高中阶段（A Level）学生的练习与题库工具，支持考试准备与升学申请。"}</p>
        <nav aria-label={en ? "Legal and account" : "法律与账号"} className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm [&>a]:inline-flex [&>a]:min-h-11 [&>a]:items-center">
          <Link href="/privacy" className="hover:text-white">{en ? "Privacy policy" : "隐私政策"}</Link>
          <Link href="/terms" className="hover:text-white">{en ? "Terms of service" : "服务条款"}</Link>
          <Link href="/account" className="hover:text-white">{en ? "Account and privacy" : "账号与隐私"}</Link>
          <Link href="/pricing" className="hover:text-white">{en ? "Plans" : "套餐说明"}</Link>
          <Link href="/updates" className="hover:text-white">{en ? "Bank updates" : "题库更新记录"}</Link>
          <a
            href={PUBLIC_CONTACT_HREF}
            className="hover:text-white"
          >
            {t("feedback")}：{PUBLIC_CONTACT_EMAIL}
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as AppLocale)) notFound();
  setRequestLocale(locale);
  // The same-origin hero frame needs only its scene, not a second account/nav app.
  const pathname = (await headers()).get("x-qiaoshen-pathname")?.replace(/\/$/, "");
  if (pathname === `/${locale}/waterlight`) {
    return <html lang={locale} className="h-full antialiased"><body className="min-h-full"><main aria-label={locale === "en" ? "Interactive water" : "交互水面"}>{children}</main></body></html>;
  }
  const [messages, session] = await Promise.all([getMessages(), auth()]);
  const user = session?.user as { role?: string; email?: string } | undefined;
  const isLoggedIn = !!session?.user;
  const expiredTrial = pathname === `/${locale}` && session?.user.id
    ? (await membershipAccess(session.user.id)).expiredTrial : null;

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--background)] text-neutral-900">
        <NextIntlClientProvider messages={clientMessages(messages)}>
          <CoreTopNav
            userEmail={user?.email ?? null}
            isAdmin={isConfiguredAdmin(user)}
            isLoggedIn={isLoggedIn}
          />
          {session?.user.id && <MembershipExpiryBanner userId={session.user.id} en={locale === "en"} />}
          {expiredTrial && <MembershipRequired expiredTrial offer={seasonPassOffer()}
            overlayKey={`qiaoshen:trial-expired:${session?.user.id}:${expiredTrial.endsAt.toISOString()}`} />}
          <div className="min-h-screen bg-[var(--background)]">
            <main className="flex-1"><CoreRouteFrame>{children}</CoreRouteFrame></main>
            {await Footer()}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
