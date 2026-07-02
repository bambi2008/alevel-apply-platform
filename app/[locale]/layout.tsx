import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type AppLocale } from "@/i18n/routing";
import { SiteNav } from "@/components/site-nav";
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

async function Header() {
  const session = await auth();
  const user = session?.user as { role?: string; email?: string } | undefined;
  return (
    <SiteNav
      userEmail={user?.email ?? null}
      isAdmin={user?.role === "ADMIN"}
      isLoggedIn={!!session?.user}
    />
  );
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

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        <NextIntlClientProvider messages={messages}>
          {await Header()}
          <div className="lg:pl-60">
            <main className="flex-1">{children}</main>
            {await Footer()}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
