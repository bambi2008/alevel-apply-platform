"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { NotificationBell } from "@/components/notification-bell";
import { logoutAction } from "@/lib/auth/actions";

const NAV_ITEMS = [
  { href: "/tests", index: "01", label: "考试训练" },
  { href: "/background", index: "02", label: "竞赛与专业实践" },
  { href: "/interview", index: "03", label: "面试训练" },
  { href: "/statements", index: "04", label: "文书" },
] as const;

export function CoreTopNav({ userEmail, isAdmin, isLoggedIn }: { userEmail?: string | null; isAdmin: boolean; isLoggedIn: boolean }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (userRef.current && !userRef.current.contains(event.target as Node)) setUserOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const active = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-black/15 bg-[#f4f4f0]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
        <Link href="/" className="shrink-0 text-xl font-semibold tracking-[-0.06em] text-[#101817]" onClick={() => setMenuOpen(false)}>桥申</Link>
        <nav className="ml-5 hidden h-full items-center lg:flex" aria-label="核心功能">
          {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} className={`flex h-full items-center gap-2 border-b-2 px-3 text-sm font-semibold transition-colors ${active(item.href) ? "border-[#101817] text-[#101817]" : "border-transparent text-black/50 hover:text-black"}`}><span className="text-[0.62rem] tracking-[0.14em] text-black/30">{item.index}</span>{item.label}</Link>)}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block"><LocaleSwitcher /></div>
          {isLoggedIn && <NotificationBell />}
          {isLoggedIn ? (
            <div className="relative" ref={userRef}>
              <button type="button" onClick={() => setUserOpen((value) => !value)} aria-label="账户菜单" className="flex size-9 items-center justify-center rounded-full bg-[#101817] text-sm font-semibold text-white">{(userEmail || "U").charAt(0).toUpperCase()}</button>
              {userOpen && <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-[var(--border)] bg-white p-1.5 shadow-lg">
                <p className="truncate px-3 py-2 text-xs text-[var(--ink-faint)]">{userEmail}</p>
                {isAdmin && <Link href="/admin" onClick={() => setUserOpen(false)} className="block rounded px-3 py-2 text-sm hover:bg-[var(--surface)]">管理后台</Link>}
                <Link href="/profile" onClick={() => setUserOpen(false)} className="block rounded px-3 py-2 text-sm hover:bg-[var(--surface)]">账号与学习档案</Link>
                <form action={logoutAction}><button type="submit" className="w-full rounded px-3 py-2 text-left text-sm hover:bg-[var(--surface)]">退出</button></form>
              </div>}
            </div>
          ) : <Link href="/login" className="text-sm font-semibold text-[#101817] hover:underline hover:underline-offset-4">登录</Link>}
          <button type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "关闭菜单" : "打开菜单"} className="flex size-9 items-center justify-center rounded-lg hover:bg-[var(--surface)] lg:hidden">{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
        </div>
      </div>
      {menuOpen && <nav className="border-t border-black/15 bg-[#f4f4f0] px-5 py-3 lg:hidden" aria-label="核心功能移动菜单"><div className="mx-auto grid max-w-6xl grid-cols-2 border-y border-black/15">
        {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={`flex min-h-14 items-center gap-3 border-b border-black/15 px-3 py-3 text-sm font-semibold odd:border-r ${active(item.href) ? "bg-[#101817] text-white" : "text-[#101817] hover:bg-white/55"}`}><span className={active(item.href) ? "text-white/50" : "text-black/30"}>{item.index}</span>{item.label}</Link>)}
      </div></nav>}
    </header>
  );
}
