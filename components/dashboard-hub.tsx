"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { getRoadmapProgress, type RoadmapProgress } from "@/lib/roadmap/actions";
import { NavIcon } from "@/components/nav-icons";
import { StatusBadge, type StatusKind } from "@/components/status-badge";
import { HeroBridge } from "@/components/illustrations";
import { Photo } from "@/components/photo";
import type { Milestone } from "@/lib/timeline";

/* ============ UCAS 白底风仪表盘 ============ */

const STEPS: { id: string; label: string; href: string }[] = [
  { id: "profile", label: "完善档案", href: "/profile" },
  { id: "match", label: "选校匹配", href: "/match" },
  { id: "background", label: "背景提升", href: "/background" },
  { id: "tests", label: "考试备考", href: "/tests" },
  { id: "statements", label: "文书写作", href: "/statements" },
  { id: "prep", label: "填表准备", href: "/apply-prep" },
  { id: "submit", label: "申请提交", href: "/applications" },
];

const TINTS = ["tile-blue","tile-green","tile-yellow","tile-pink","tile-purple","tile-orange","tile-red","tile-brown","tile-gray"];

const TILES: { id?: string; label: string; href: string; icon: string }[] = [
  { id: "profile", label: "我的档案", href: "/profile", icon: "user" },
  { id: "match", label: "选校匹配", href: "/match", icon: "target" },
  { label: "院校库", href: "/universities", icon: "building" },
  { id: "background", label: "背景提升", href: "/background", icon: "star" },
  { id: "tests", label: "入学笔试", href: "/tests", icon: "compass" },
  { label: "面试准备", href: "/interview", icon: "mic" },
  { id: "statements", label: "文书写作", href: "/statements", icon: "pen" },
  { id: "prep", label: "填表助手", href: "/apply-prep", icon: "listChecks" },
  { id: "submit", label: "申请追踪", href: "/applications", icon: "clipboard" },
];

function Ring({ pct, size = 120 }: { pct: number; size?: number }) {
  const r = (size - 14) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth="9" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="var(--indigo)" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.2,0.7,0.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold tabular-nums leading-none text-[var(--ink)]">{pct}%</span>
        <span className="text-[11px] text-[var(--ink-faint)] mt-1">总进度</span>
      </div>
    </div>
  );
}

const MS_STATUS: Record<string, StatusKind> = {
  urgent: "danger", upcoming: "warning", future: "todo", done: "done",
};

export function DashboardHub({
  name, chips, milestones, appCount, msLabels, children,
}: {
  name: string;
  chips: string[];
  milestones: { m: Milestone; title: string; statusLabel: string }[];
  appCount: number;
  msLabels: { keyDates: string; fullTimeline: string };
  children?: React.ReactNode;
}) {
  const [data, setData] = useState<RoadmapProgress | null>(null);
  useEffect(() => { getRoadmapProgress().then(setData); }, []);

  const nodes = data?.nodes ?? {};
  const overall = data
    ? Math.round(STEPS.reduce((a, s) => a + (nodes[s.id]?.pct ?? 0), 0) / STEPS.length)
    : 0;
  const next = STEPS.find((s) => (nodes[s.id]?.pct ?? 0) < 100);

  return (
    <>
      {/* 页头：超大黑标题 + 蓝横线 + 右侧剪影插画 */}
      <header className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
        <div>
          <span className="ucas-accent-bar" />
          <h1 className="ucas-title">你好，{name}</h1>
          <p className="mt-3 text-lg text-[var(--ink-soft)]">这是你的专属申请工作台。</p>
          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {chips.map((c) => (
                <span key={c} className="text-sm bg-[var(--surface)] text-[var(--ink-soft)] rounded-full px-3 py-1 border border-[var(--border)]">
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="hidden lg:block tile tile-blue notion-zoom rounded-2xl"><Photo
          src="/images/hero-student.jpg"
          alt="欢迎"
          className="w-[300px]"
          imgClassName="h-auto w-full rounded-xl object-cover aspect-[4/3]"
          fallback={<HeroBridge className="w-full h-auto doodle-idle" />}
        /></div>
      </header>

      {/* 进度卡 */}
      <section className="card p-6 sm:p-7 flex items-center gap-6 flex-wrap sm:flex-nowrap">
        <Ring pct={overall} />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-[var(--ink)]">申请总进度</h2>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            {next ? <>下一步建议：<span className="font-semibold text-[var(--ink)]">{next.label}</span></> : "全部推进完毕，保持关注截止日期。"}
          </p>
        </div>
        {next && (
          <Link href={next.href} className="btn btn-primary shrink-0">
            继续：{next.label} <span aria-hidden>→</span>
          </Link>
        )}
      </section>

      {/* 关键日期 */}
      {milestones.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-extrabold tracking-tight text-[var(--ink)]">{msLabels.keyDates}</h2>
            <Link href="/timeline" className="link-blue text-sm">{msLabels.fullTimeline} →</Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {milestones.map(({ m, title, statusLabel }) => (
              <Link key={m.id} href="/timeline" className="media-card notion-lift p-4 block">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[var(--ink)] tabular-nums">
                    {m.date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}
                  </span>
                  <StatusBadge kind={MS_STATUS[m.status] ?? "todo"} label={statusLabel} />
                </div>
                <p className="mt-2 text-sm text-[var(--ink-soft)] leading-snug">{title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {children}

      {/* 模块磁贴 */}
      <section>
        <h2 className="text-xl font-extrabold tracking-tight text-[var(--ink)] mb-3">全部模块</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {TILES.map((tile, i) => {
            const tint = TINTS[i % TINTS.length];
            const pct = tile.id ? nodes[tile.id]?.pct : undefined;
            const meta = tile.href === "/applications" && appCount > 0 ? `${appCount} 个志愿` : undefined;
            return (
              <Link key={tile.href} href={tile.href} className={`group ${tint} notion-lift rounded-xl p-5 flex flex-col border border-black/5`}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/70 text-[var(--ink)] transition-transform group-hover:scale-105">
                    <NavIcon name={tile.icon} />
                  </span>
                  {typeof pct === "number" && (
                    <span className="text-sm font-bold tabular-nums text-[var(--ink-faint)]">{pct}%</span>
                  )}
                </div>
                <p className="mt-4 font-semibold text-[var(--ink)]">{tile.label}</p>
                {meta && <p className="text-xs text-[var(--indigo)] mt-0.5">{meta}</p>}
                {typeof pct === "number" && (
                  <div className="mt-3 h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                    <div className="h-full bg-[var(--indigo)] transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
