"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

interface NavLink {
  href: string;
  label: string;
  en: string;
}

/**
 * 移动端 / 窄屏导航。顶部主导航在 <768px 时隐藏，这里用汉堡菜单补上，
 * 让手机和窄窗口用户也能进入各页面。仅在 md 以下显示。
 */
export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden relative flex items-center">
      <button
        type="button"
        aria-label="菜单"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-md text-neutral-600 hover:bg-neutral-100"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? (
            <>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <>
          {/* 点击空白处关闭 */}
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-neutral-200 bg-white shadow-lg z-30 py-1 max-h-[80vh] overflow-y-auto">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                <span>{l.label}</span>
                <span className="text-[10px] text-neutral-400 ml-2">{l.en}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
