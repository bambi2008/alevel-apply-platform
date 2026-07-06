import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type AppLocale } from "@/i18n/routing";
import { SiteNav } from "@/components/site-nav";
import { TopBar } from "@/components/top-bar";
import { auth } from "@/auth";
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
    <footer className="border-t border-neutral-200 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-500 flex flex-col sm:flex-row justify-between gap-2">
        <span>© {new Date().getFullYear()} {t("rights")}</span>
        <span>{t("disclaimer")}</span>
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
    <html lang={locale} className={`h-full antialiased ${inter.variable}`}>
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        <NextIntlClientProvider messages={messages}>
          <SiteNav
            userEmail={user?.email ?? null}
            isAdmin={user?.role === "ADMIN"}
            isLoggedIn={isLoggedIn}
          />
          {/* 登录后有左侧栏，内容右移；未登录（落地页）满屏不偏移 */}
          <div className={isLoggedIn ? "lg:pl-60" : ""}>
            {isLoggedIn && <TopBar userEmail={user?.email ?? null} />}
            <main className="flex-1">{children}</main>
            {await Footer()}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
