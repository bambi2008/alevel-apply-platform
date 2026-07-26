import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type AppLocale } from "@/i18n/routing";
import { TopNav } from "@/components/top-nav";
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
    <footer className="mt-20 bg-[var(--ink-950)] text-white/70">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center gap-2 mb-5">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M4 15 A 8 8 0 0 1 20 15" />
            </svg>
          </span>
          <span className="font-extrabold text-white tracking-tight">桥申</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-3 text-sm">
          <span>© {new Date().getFullYear()} {t("rights")}</span>
          <span className="text-white/50">{t("disclaimer")}</span>
        </div>
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
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        <NextIntlClientProvider messages={messages}>
          <TopNav
            userEmail={user?.email ?? null}
            isAdmin={user?.role === "ADMIN"}
            isLoggedIn={isLoggedIn}
          />
          <div className="bg-white min-h-screen">
            <main className="flex-1">{children}</main>
            {await Footer()}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
