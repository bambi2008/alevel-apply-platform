import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { auth } from "@/auth";
import { logoutAction } from "@/lib/auth/actions";
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
  const t = await getTranslations("nav");
  const ta = await getTranslations("auth");
  const session = await auth();
  const links = [
    { href: "/", label: t("home"), en: "Home" },
    { href: "/match", label: t("match"), en: "Match" },
    { href: "/universities", label: t("universities"), en: "Universities" },
    { href: "/profile", label: t("profile"), en: "Profile" },
    { href: "/applications", label: t("applications"), en: "Applications" },
    { href: "/statements", label: t("statements"), en: "Statement" },
    { href: "/timeline", label: t("timeline"), en: "Timeline" },
    { href: "/tasks", label: t("tasks"), en: "To-Do" },
    { href: "/apply-guide", label: t("applyGuide"), en: "UCAS Guide" },
    { href: "/documents", label: t("documents"), en: "Documents" },
    { href: "/tests", label: t("tests"), en: "Test Prep" },
  ];
  return (
    <header className="border-b border-neutral-200 bg-white/90 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight whitespace-nowrap">
          桥申<span className="text-blue-600">·</span>
          <span className="text-sm font-normal text-neutral-500 ml-1 hidden sm:inline">
            {t("brandSuffix")}
          </span>
        </Link>
        <nav className="flex items-center gap-0.5 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-2.5 py-1.5 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 hidden md:flex flex-col items-center leading-tight"
            >
              <span className="text-sm">{l.label}</span>
              <span className="text-[10px] text-neutral-400">{l.en}</span>
            </Link>
          ))}
          <LocaleSwitcher />
          <MobileNav links={links} />
          {(session?.user as { role?: string } | undefined)?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="ml-1 px-2.5 py-1.5 rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100 text-sm whitespace-nowrap"
            >
              管理后台
            </Link>
          )}
          {session?.user ? (
            <form action={logoutAction} className="flex items-center gap-1 ml-1">
              <span className="text-xs text-neutral-500 hidden lg:inline max-w-[140px] truncate">
                {session.user.email}
              </span>
              <button
                type="submit"
                className="px-2.5 py-1.5 rounded-md text-neutral-600 hover:bg-neutral-100"
              >
                {ta("logout")}
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="ml-1 px-2.5 py-1.5 rounded-md text-neutral-600 hover:bg-neutral-100"
            >
              {ta("login")}
            </Link>
          )}
          <Link
            href="/match"
            className="ml-1 px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            {t("freeMatch")}
          </Link>
        </nav>
      </div>
    </header>
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
          <main className="flex-1">{children}</main>
          {await Footer()}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
