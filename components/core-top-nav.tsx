"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpenCheck, FilePenLine, FlaskConical, Menu, MessagesSquare, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { NotificationBell } from "@/components/notification-bell";
import { logoutAction } from "@/lib/auth/actions";

const NAV_ITEMS = [
  { href: "/tests", label: "考试训练", icon: BookOpenCheck },
  { href: "/background", label: "竞赛与专业实践", icon: FlaskConical },
  { href: "/interview", label: "面试训练", icon: MessagesSquare },
  { href: "/statements", label: "文书", icon: FilePenLine },
] as const;

function BridgeMark() {
  return <svg width="26" height="26" viewBox="0 0 28 28" aria-hidden="true" className="shrink-0"><path d="M3 20 A 11 11 0 0 1 25 20" stroke="var(--indigo)" strokeWidth="2.6" fill="none" strokeLinecap="round" /><line x1="6.5" y1="20" x2="6.5" y2="24.5" stroke="var(--indigo)" strokeWidth="2.2" strokeLinecap="round" /><line x1="14" y1="15" x2="14" y2="24.5" stroke="var(--indigo)" strokeWidth="2.2" strokeLinecap="round" /><line x1="21.5" y1="20" x2="21.5" y2="24.5" stroke="var(--indigo)" strokeWidth="2.2" strokeLinecap="round" /></svg>;
}

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
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
        <Link href="/" className="flex shrink-0 items-center gap-2" onClick={() => setMenuOpen(false)}><BridgeMark /><span className="text-lg font-extrabold text-[var(--ink)]">桥申</span></Link>
        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="核心功能">
          {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} className={`px-3 py-2 text-sm font-semibold transition ${active(item.href) ? "text-[var(--indigo)]" : "text-[var(--ink-soft)] hover:text-[var(--ink)]"}`}>{item.label}</Link>)}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block"><LocaleSwitcher /></div>
          {isLoggedIn && <NotificationBell />}
          {isLoggedIn ? (
            <div className="relative" ref={userRef}>
              <button type="button" onClick={() => setUserOpen((value) => !value)} aria-label="账户菜单" className="flex size-9 items-center justify-center rounded-full bg-[var(--indigo)] text-sm font-semibold text-white">{(userEmail || "U").charAt(0).toUpperCase()}</button>
              {userOpen && <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-[var(--border)] bg-white p-1.5 shadow-lg">
                <p className="truncate px-3 py-2 text-xs text-[var(--ink-faint)]">{userEmail}</p>
                {isAdmin && <Link href="/admin" onClick={() => setUserOpen(false)} className="block rounded px-3 py-2 text-sm hover:bg-[var(--surface)]">管理后台</Link>}
                <Link href="/profile" onClick={() => setUserOpen(false)} className="block rounded px-3 py-2 text-sm hover:bg-[var(--surface)]">账号与学习档案</Link>
                <form action={logoutAction}><button type="submit" className="w-full rounded px-3 py-2 text-left text-sm hover:bg-[var(--surface)]">退出</button></form>
              </div>}
            </div>
          ) : <Link href="/login" className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--indigo)]">登录</Link>}
          <button type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "关闭菜单" : "打开菜单"} className="flex size-9 items-center justify-center rounded-lg hover:bg-[var(--surface)] lg:hidden">{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
        </div>
      </div>
      {menuOpen && <nav className="border-t border-[var(--border)] bg-white px-5 py-3 lg:hidden" aria-label="核心功能移动菜单"><div className="mx-auto grid max-w-6xl gap-1">
        {NAV_ITEMS.map((item) => { const Icon = item.icon; return <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold ${active(item.href) ? "bg-[var(--info-bg)] text-[var(--indigo)]" : "text-[var(--ink)] hover:bg-[var(--surface)]"}`}><Icon className="size-4" aria-hidden="true" />{item.label}</Link>; })}
      </div></nav>}
    </header>
  );
}
