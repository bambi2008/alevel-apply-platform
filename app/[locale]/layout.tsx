import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type AppLocale } from "@/i18n/routing";
import { CoreTopNav } from "@/components/core-top-nav";
import { CoreRouteFrame } from "@/components/core-route-frame";
import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import "../globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("title"), description: t("description") };
}

async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="mt-20 bg-[#101817] text-white/65">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-white/15 pb-5">
          <span className="text-xl font-semibold tracking-[-0.06em] text-white">桥申</span>
          <span className="text-[0.65rem] font-semibold tracking-[0.2em] text-white/35">CORE FOUR</span>
        </div>
        <div className="flex flex-col justify-between gap-3 text-sm sm:flex-row">
          <span>© {new Date().getFullYear()} {t("rights")}</span>
          <span className="text-white/50">{t("disclaimer")}</span>
        </div>
        <nav aria-label="法律与账号" className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link href="/privacy" className="hover:text-white">隐私政策</Link>
          <Link href="/terms" className="hover:text-white">服务条款</Link>
          <Link href="/account" className="hover:text-white">账号与隐私</Link>
          <a
            href="mailto:mao8teen@gmail.com?subject=%E6%A1%A5%E7%94%B3%20Beta%20%E4%BD%BF%E7%94%A8%E5%8F%8D%E9%A6%88"
            className="hover:text-white"
          >
            {t("feedback")}：mao8teen@gmail.com
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
  const messages = await getMessages();

  const session = await auth();
  const user = session?.user as { role?: string; email?: string } | undefined;
  const isLoggedIn = !!session?.user;

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--background)] text-neutral-900">
        <NextIntlClientProvider messages={messages}>
          <CoreTopNav
            userEmail={user?.email ?? null}
            isAdmin={user?.role === "ADMIN"}
            isLoggedIn={isLoggedIn}
          />
          <div className="min-h-screen bg-[var(--background)]">
            <main className="flex-1"><CoreRouteFrame>{children}</CoreRouteFrame></main>
            {await Footer()}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
