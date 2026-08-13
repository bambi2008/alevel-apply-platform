"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { NavIcon } from "@/components/nav-icons";
import { logoutAction } from "@/lib/auth/actions";

type NavItem = { href: string; label: string; en: string; icon: string };

/** 桥弧标志：一段发光弧线 + 三个桥墩，呼应“桥”的品牌意象。 */
function BridgeMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id="brandArc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset="0.6" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path d="M3 20 A 11 11 0 0 1 25 20" stroke="url(#brandArc)" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <line x1="6.5" y1="20" x2="6.5" y2="24.5" stroke="url(#brandArc)" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="14" y1="15" x2="14" y2="24.5" stroke="url(#brandArc)" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="21.5" y1="20" x2="21.5" y2="24.5" stroke="url(#brandArc)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <BridgeMark />
      <span className="flex items-baseline">
        <span className="font-extrabold text-lg tracking-tight text-[var(--ink)]">桥申</span>
      </span>
    </Link>
  );
}

export function SiteNav({
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  const groups: { title: string; items: NavItem[] }[] = [
    {
      title: t("groupApply"),
      items: [
        { href: "/", label: t("home"), en: "Home", icon: "home" },
        { href: "/match", label: t("match"), en: "Match", icon: "target" },
        { href: "/universities", label: t("universities"), en: "Universities", icon: "building" },
        { href: "/profile", label: t("profile"), en: "Profile", icon: "user" },
        { href: "/applications", label: t("applications"), en: "Applications", icon: "clipboard" },
        { href: "/timeline", label: t("timeline"), en: "Timeline", icon: "calendar" },
        { href: "/apply-guide", label: t("applyGuide"), en: "UCAS Guide", icon: "file" },
      ],
    },
    {
      title: t("groupPrep"),
      items: [
        { href: "/tests", label: t("tests"), en: "Test Prep", icon: "compass" },
        { href: "/english", label: "英语要求", en: "English", icon: "language" },
        { href: "/interview", label: "面试准备", en: "Interview", icon: "mic" },
        { href: "/background", label: t("background"), en: "Background", icon: "star" },
        { href: "/statements", label: t("statements"), en: "Statement", icon: "pen" },
        { href: "/apply-prep", label: "填表助手", en: "Application", icon: "listChecks" },
      ],
    },
    {
      title: t("groupTools"),
      items: [
        { href: "/tasks", label: t("tasks"), en: "To-Do", icon: "check" },
        { href: "/documents", label: t("documents"), en: "Documents", icon: "folder" },
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
  useEffect(() => {
    setDrawerOpen(false);
    setUserOpen(false);
  }, [pathname]);

  const NavRow = ({ l, onNavigate }: { l: NavItem; onNavigate?: () => void }) => {
    const active = isActive(l.href);
    return (
      <Link
        href={l.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] transition-colors ${
          active
            ? "bg-[var(--info-bg)] text-[var(--indigo)] font-semibold"
            : "text-[var(--ink-soft)] font-medium hover:bg-[var(--surface)] hover:text-[var(--ink)]"
        }`}
      >
        {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[var(--indigo)]" />}
        <NavIcon
          name={l.icon}
          className={active ? "text-[var(--indigo)]" : "text-[var(--ink-faint)] group-hover:text-[var(--ink-soft)]"}
        />
        <span className="truncate">{l.label}</span>
      </Link>
    );
  };

  // 侧边栏内部内容（桌面与抽屉共用）
  const NavBody = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
      {groups.map((g) => (
        <div key={g.title}>
          <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--ink-faint)]">
            {g.title}
          </p>
          <div className="space-y-0.5">
            {g.items.map((l) => (
              <NavRow key={l.href} l={l} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  const Bottom = () => (
    <div className="border-t border-[var(--border)] p-3 space-y-1">
      <div className="flex items-center justify-between px-1">
        <LocaleSwitcher />
        {isAdmin && (
          <Link
            href="/admin"
            className="px-2.5 py-1.5 rounded-lg text-xs text-[var(--violet)] bg-[var(--surface)] hover:bg-[#efeaff] transition-colors"
          >
            {t("adminConsole")}
          </Link>
        )}
      </div>
      {isLoggedIn ? (
        <div className="relative" ref={userRef}>
          <button
            type="button"
            onClick={() => setUserOpen((v) => !v)}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-[var(--surface)] transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-semibold shrink-0">
              {(userEmail || "U").charAt(0).toUpperCase()}
            </span>
            <span className="text-xs text-[var(--ink-soft)] truncate flex-1 text-left">{userEmail}</span>
          </button>
          {userOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1 rounded-xl border border-[var(--border)] bg-white shadow-lg p-1.5 z-40">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--ink-soft)] hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                >
                  {ta("logout")}
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="block px-3 py-2 rounded-xl text-sm text-[var(--ink-soft)] hover:bg-[var(--surface)]"
        >
          {ta("login")}
        </Link>
      )}
    </div>
  );

  // 未登录（落地页）：顶部简洁导航条，不显示侧边栏
  if (!isLoggedIn) {
    return (
      <header className="glass sticky top-0 z-30 border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-3">
          <Brand />
          <div className="ml-auto flex items-center gap-2">
            <LocaleSwitcher />
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg text-sm text-[var(--ink-soft)] hover:bg-[var(--surface)] transition-colors"
            >
              {ta("login")}
            </Link>
            <Link
              href="/match"
              className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-sm shadow-indigo-500/20"
            >
              {t("freeMatch")}
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* 桌面固定侧边栏 */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-60 flex-col border-r border-[var(--border)] bg-white z-30">
        <div className="px-4 h-16 flex items-center border-b border-[var(--border)]">
          <Brand />
        </div>
        <div className="px-3 pt-3">
          <Link
            href="/match"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--indigo)] text-white text-[13.5px] font-semibold hover:bg-[var(--indigo-hover)] transition-colors"
          >
            <NavIcon name="sparkle" width={16} height={16} /> {t("freeMatch")}
          </Link>
        </div>
        <NavBody />
        <Bottom />
      </aside>

      {/* 移动端顶栏 */}
      <div className="lg:hidden sticky top-0 z-30 glass border-b border-[var(--border)] h-14 flex items-center gap-2 px-4">
        <button
          type="button"
          aria-label="菜单"
          onClick={() => setDrawerOpen(true)}
          className="p-2 -ml-2 rounded-lg text-[var(--ink-soft)] hover:bg-[var(--surface)]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <Brand />
        <Link
          href="/match"
          className="ml-auto px-3 py-1.5 rounded-lg bg-brand text-white text-sm font-medium"
        >
          {t("freeMatch")}
        </Link>
      </div>

      {/* 移动端抽屉 */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80vw] bg-white flex flex-col shadow-xl">
            <div className="px-4 h-14 flex items-center justify-between border-b border-[var(--border)]">
              <Brand />
              <button
                type="button"
                aria-label="关闭"
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-lg text-[var(--ink-soft)] hover:bg-[var(--surface)]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </svg>
              </button>
            </div>
            <NavBody onNavigate={() => setDrawerOpen(false)} />
            <Bottom />
          </div>
        </div>
      )}
    </>
  );
}
