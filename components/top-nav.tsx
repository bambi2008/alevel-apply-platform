"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { NavIcon } from "@/components/nav-icons";
import { logoutAction } from "@/lib/auth/actions";

type NavItem = { href: string; label: string; icon: string; desc?: string };

function BridgeMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" aria-hidden="true" className="shrink-0">
      <path d="M3 20 A 11 11 0 0 1 25 20" stroke="var(--indigo)" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <line x1="6.5" y1="20" x2="6.5" y2="24.5" stroke="var(--indigo)" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="14" y1="15" x2="14" y2="24.5" stroke="var(--indigo)" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="21.5" y1="20" x2="21.5" y2="24.5" stroke="var(--indigo)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function TopNav({
  userEmail,
  isAdmin,
  isLoggedIn,
}: {
  userEmail?: string | null;
  isAdmin: boolean;
  isLoggedIn: boolean;
}) {
  const t = useTranslations("nav");
  const ta = useTranslations("auth");
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [q, setQ] = useState("");
  const userRef = useRef<HTMLDivElement>(null);

  const groups: { key: string; title: string; items: NavItem[] }[] = [
    {
      key: "apply",
      title: t("groupApply"),
      items: [
        { href: "/match", label: t("match"), icon: "target", desc: "选科能申什么·要考哪些笔试" },
        { href: "/universities", label: t("universities"), icon: "building", desc: "院校信息去哪查（含 Cialfo/UCAS）" },
        { href: "/applications", label: t("applications"), icon: "clipboard", desc: "追踪每一所志愿状态" },
        { href: "/timeline", label: t("timeline"), icon: "calendar", desc: "关键日期与截止提醒" },
      ],
    },
    {
      key: "prep",
      title: t("groupPrep"),
      items: [
        { href: "/tests", label: t("tests"), icon: "compass", desc: "ESAT 等笔试练习与模考" },
        { href: "/background", label: t("background"), icon: "star", desc: "竞赛/科研/夏校规划" },
        { href: "/statements", label: t("statements"), icon: "pen", desc: "UCAS 三题 + 港校 essay" },
        { href: "/interview", label: "面试准备", icon: "mic", desc: "题库 + AI 模拟面试" },
      ],
    },
    {
      key: "tools",
      title: t("groupTools"),
      items: [
        { href: "/profile", label: t("profile"), icon: "user", desc: "成绩、科目与目标" },
        { href: "/apply-guide", label: t("applyGuide"), icon: "file", desc: "UCAS 填表指南（阅读）" },
        { href: "/apply-prep", label: "填表助手", icon: "listChecks", desc: "逐栏填写申请表（动手）" },
        { href: "/tasks", label: t("tasks"), icon: "check", desc: "待办清单" },
        { href: "/documents", label: t("documents"), icon: "folder", desc: "资料与文件" },
      ],
    },
  ];

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    setDrawerOpen(false);
    router.push(term ? `/universities?q=${encodeURIComponent(term)}` : "/universities");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center gap-4">
        {/* Brand */}
        <Link href="/" onClick={() => { setDrawerOpen(false); setUserOpen(false); }} className="flex items-center gap-2 shrink-0">
          <BridgeMark />
          <span className="font-extrabold text-lg tracking-tight text-[var(--ink)]">桥申</span>
        </Link>

        {/* 桌面导航：悬停下拉 */}
        <nav className="hidden lg:flex items-center gap-1 ml-2">
          {groups.map((g) => {
            const groupActive = g.items.some((i) => isActive(i.href));
            return (
              <div
                key={g.key}
                className="group relative"
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[15px] font-semibold transition-colors ${
                    groupActive ? "text-[var(--indigo)]" : "text-[var(--ink)] hover:text-[var(--indigo)]"
                  }`}
                >
                  {g.title}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="invisible pointer-events-none absolute left-0 top-full z-50 w-[340px] translate-y-1 pt-2 opacity-0 transition group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div role="menu" className="rounded-xl border border-[var(--border)] bg-white shadow-[var(--shadow-lg)] p-2">
                    {g.items.map((i) => (
                      <Link
                        key={i.href}
                        href={i.href}
                        role="menuitem"
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--surface)] transition-colors"
                      >
                        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--info-bg)] text-[var(--indigo)] shrink-0">
                          <NavIcon name={i.icon} width={18} height={18} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-[var(--ink)]">{i.label}</span>
                          {i.desc && <span className="block text-xs text-[var(--ink-faint)] mt-0.5">{i.desc}</span>}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* 右侧：搜索 + EN + 登录/头像 + CTA */}
        <div className="ml-auto flex items-center gap-2">
          <form onSubmit={onSearch} className="hidden md:block relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]">
              <NavIcon name="search" width={16} height={16} />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索院校、专业"
              aria-label="搜索"
              className="w-44 xl:w-56 h-9 pl-9 pr-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--indigo)] focus:bg-white focus:ring-2 focus:ring-[rgba(59,91,219,0.14)] transition-colors"
            />
          </form>

          <div className="hidden lg:block"><LocaleSwitcher /></div>

          {isLoggedIn ? (
            <div className="relative" ref={userRef}>
              <button
                type="button"
                onClick={() => setUserOpen((v) => !v)}
                aria-label="账户"
                className="w-9 h-9 rounded-full bg-[var(--indigo)] text-white flex items-center justify-center text-sm font-semibold"
              >
                {(userEmail || "U").charAt(0).toUpperCase()}
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-[var(--border)] bg-white shadow-lg p-1.5 z-50">
                  <p className="px-3 py-2 text-xs text-[var(--ink-faint)] truncate">{userEmail}</p>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setUserOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-[var(--ink-soft)] hover:bg-[var(--surface)]">
                      {t("adminConsole")}
                    </Link>
                  )}
                  <form action={logoutAction}>
                    <button type="submit" className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--ink-soft)] hover:bg-[var(--surface)] hover:text-[var(--ink)]">
                      {ta("logout")}
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden sm:inline-flex text-sm font-semibold text-[var(--ink)] hover:text-[var(--indigo)] px-2 py-2">
              {ta("login")}
            </Link>
          )}

          <Link href="/match" className="hidden sm:inline-flex btn btn-primary text-sm">
            <NavIcon name="sparkle" width={15} height={15} /> {t("freeMatch")}
          </Link>

          {/* 移动端汉堡 */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="菜单"
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--surface)]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>

      {/* 移动端抽屉 */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[80%] max-w-xs bg-white overflow-y-auto">
            <div className="flex items-center justify-between h-16 px-5 border-b border-[var(--border)]">
              <span className="font-extrabold text-lg text-[var(--ink)]">桥申</span>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="关闭" className="w-9 h-9 flex items-center justify-center text-[var(--ink-soft)]">✕</button>
            </div>
            <div className="p-4 space-y-5">
              {groups.map((g) => (
                <div key={g.key}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--ink-faint)] mb-1.5 px-1">{g.title}</p>
                  <div className="space-y-0.5">
                    {g.items.map((i) => (
                      <Link key={i.href} href={i.href} onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-[var(--surface)]">
                        <span className="text-[var(--ink-faint)]"><NavIcon name={i.icon} width={18} height={18} /></span>
                        <span className="text-sm font-medium text-[var(--ink)]">{i.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <div onClick={() => setDrawerOpen(false)}><LocaleSwitcher /></div>
                {isLoggedIn ? (
                  <form action={logoutAction}><button type="submit" className="text-sm text-[var(--ink-soft)]">{ta("logout")}</button></form>
                ) : (
                  <Link href="/login" onClick={() => setDrawerOpen(false)} className="text-sm font-semibold text-[var(--indigo)]">{ta("login")}</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
