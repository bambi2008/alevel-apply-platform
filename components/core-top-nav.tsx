"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { NotificationBell } from "@/components/notification-bell";
import { logoutAction } from "@/lib/auth/actions";
import { CORE_AREAS, coreAreaForPath, coreAreaTitle } from "@/lib/core-navigation";

const NAV_ITEMS = CORE_AREAS;

export function CoreTopNav({ userEmail, isAdmin, isLoggedIn }: { userEmail?: string | null; isAdmin: boolean; isLoggedIn: boolean }) {
  const authText = useTranslations("auth");
  const locale = useLocale();
  const en = locale === "en";
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (userRef.current && !userRef.current.contains(event.target as Node)) setUserOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const active = (href: string) => coreAreaForPath(pathname)?.href === href;

  return (
    <header className="sticky top-0 z-40 border-b border-black/15 bg-[#f4f4f0]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
        <Link href="/" className="shrink-0 text-xl font-semibold tracking-[-0.06em] text-[#101817]" onClick={() => setMenuOpen(false)}>{en ? "QiaoShen" : "桥申"}</Link>
        <nav className="ml-2 hidden h-full items-center xl:flex" aria-label={en ? "Core areas" : "核心功能"}>
          {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined} className={`flex h-full items-center gap-2 border-b-2 px-2 text-sm font-semibold transition-colors ${active(item.href) ? "border-[#101817] text-[#101817]" : "border-transparent text-black/60 hover:text-black"}`}><span className="text-[0.62rem] tracking-[0.14em] text-black/60">{item.index}</span>{coreAreaTitle(item, locale)}</Link>)}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block"><LocaleSwitcher /></div>
          {isLoggedIn && <NotificationBell />}
          {isLoggedIn ? (
            <div className="relative" ref={userRef}>
              <button type="button" onClick={() => setUserOpen((value) => !value)} aria-label={en ? "Account menu" : "账户菜单"} aria-expanded={userOpen} className="flex size-11 items-center justify-center rounded-full bg-[#101817] text-sm font-semibold text-white">{(userEmail || "U").charAt(0).toUpperCase()}</button>
              {userOpen && <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-[var(--border)] bg-white p-1.5 shadow-lg">
                <p className="truncate px-3 py-2 text-xs text-[var(--ink-faint)]">{userEmail}</p>
                {isAdmin && <Link href="/admin" onClick={() => setUserOpen(false)} className="block min-h-11 rounded px-3 py-3 text-sm hover:bg-[var(--surface)]">{en ? "Administration" : "管理后台"}</Link>}
                <Link href="/profile" onClick={() => setUserOpen(false)} className="block min-h-11 rounded px-3 py-3 text-sm hover:bg-[var(--surface)]">{en ? "Account and study profile" : "账号与学习档案"}</Link>
                <form action={logoutAction}><button type="submit" className="min-h-11 w-full rounded px-3 py-3 text-left text-sm hover:bg-[var(--surface)]">{en ? "Sign out" : "退出"}</button></form>
              </div>}
            </div>
          ) : <>
            <Link href="/login" className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm font-semibold text-[#101817] hover:underline hover:underline-offset-4">{authText("login")}</Link>
            <Link href="/register" className="inline-flex min-h-11 items-center justify-center border border-black/20 px-3 text-sm font-semibold text-[#101817] hover:bg-white">{authText("registerTitle")}</Link>
          </>}
          <button type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label={menuOpen ? (en ? "Close menu" : "关闭菜单") : (en ? "Open menu" : "打开菜单")} className="flex size-11 items-center justify-center rounded-lg hover:bg-[var(--surface)] xl:hidden">{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
        </div>
      </div>
      {menuOpen && <nav className="border-t border-black/15 bg-[#f4f4f0] px-5 py-3 xl:hidden" aria-label={en ? "Core areas mobile menu" : "核心功能移动菜单"}><div className="mx-auto grid max-w-6xl grid-cols-2 border-y border-black/15">
        {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined} onClick={() => setMenuOpen(false)} className={`flex min-h-14 items-center gap-3 border-b border-black/15 px-3 py-3 text-sm font-semibold odd:border-r ${active(item.href) ? "bg-[#101817] text-white" : "text-[#101817] hover:bg-white/55"}`}><span className={active(item.href) ? "text-white/70" : "text-black/60"}>{item.index}</span>{coreAreaTitle(item, locale)}</Link>)}
      </div><div className="mt-2 sm:hidden"><LocaleSwitcher /></div></nav>}
    </header>
  );
}
