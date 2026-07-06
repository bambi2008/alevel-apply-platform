"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { NavIcon } from "@/components/nav-icons";

// 细顶栏（Linear/Stripe 式）：全局搜索 + 通知铃 + 用户头像。
// 仅在登录后、桌面端显示；内容区在 layout 里已留出对应高度。
export function TopBar({ userEmail }: { userEmail?: string | null }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  // 搜索接入院校库（真实可用）
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/universities?q=${encodeURIComponent(term)}` : "/universities");
  };

  return (
    <header className="hidden lg:flex sticky top-0 z-20 h-14 items-center gap-4 border-b border-[var(--border)] bg-white/80 backdrop-blur px-6">
      {/* 全局搜索 */}
      <form onSubmit={onSearch} className="relative flex-1 max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]">
          <NavIcon name="search" width={16} height={16} />
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索院校、专业…"
          aria-label="搜索"
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--indigo)] focus:bg-white focus:ring-2 focus:ring-[rgba(79,70,229,0.12)] transition-colors"
        />
      </form>

      <div className="ml-auto flex items-center gap-1.5">
        {/* 通知铃：接到时间线（临近截止/待办提醒的落点） */}
        <button
          type="button"
          onClick={() => router.push("/timeline")}
          aria-label="提醒与时间线"
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[var(--ink-soft)] hover:bg-[var(--surface)] hover:text-[var(--ink)] transition-colors"
        >
          <NavIcon name="bell" width={19} height={19} />
        </button>

        {/* 用户头像（首字母） */}
        <div
          className="w-8 h-8 rounded-full bg-[var(--indigo)] text-white flex items-center justify-center text-sm font-semibold select-none"
          title={userEmail ?? undefined}
        >
          {(userEmail || "U").charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
