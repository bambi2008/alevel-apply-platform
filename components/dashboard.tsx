"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { loadProfile, type UserProfile } from "@/lib/profile/store";
import { listApplications } from "@/lib/applications/store";
import { buildTimeline, type Milestone } from "@/lib/timeline";
import { ProcessOverview } from "@/components/process-overview";
import { RoadmapTree } from "@/components/roadmap-tree";

function fmt(date: Date) {
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

const STATUS_CHIP: Record<string, string> = {
  done: "bg-neutral-100 text-neutral-400",
  urgent: "bg-red-100 text-red-600",
  upcoming: "bg-amber-100 text-amber-700",
  future: "bg-blue-50 text-blue-600",
};

function GoalTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs bg-blue-50 text-blue-700 rounded-full px-2.5 py-0.5 font-medium">
      {children}
    </span>
  );
}

function MilestoneRow({ m, t }: { m: Milestone; t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-neutral-100 last:border-0">
      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 ${STATUS_CHIP[m.status]}`}>
        {t(`timeline.status.${m.status}`)}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate">{t(m.titleKey as never)}</p>
        <p className="text-xs text-neutral-400">{fmt(m.date)}</p>
      </div>
    </div>
  );
}

export function Dashboard({ email }: { email?: string | null }) {
  const t = useTranslations();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [upcomingMs, setUpcomingMs] = useState<Milestone[]>([]);
  const [appCount, setAppCount] = useState(0);
  const [guideOpen, setGuideOpen] = useState(true);

  useEffect(() => {
    loadProfile().then((p) => {
      setProfile(p);
      if (p) {
        const year = p.intakeYear ?? new Date().getFullYear() + 1;
        const regions = p.targetRegions?.length ? p.targetRegions : (["UK", "HK"] as const);
        const { milestones } = buildTimeline(year, [...regions]);
        setUpcomingMs(milestones.filter((m) => m.status !== "done").slice(0, 3));
      }
      setLoaded(true);
    });
    listApplications().then((apps) => setAppCount(apps.length));
  }, []);

  if (!loaded) {
    return <div className="mx-auto max-w-2xl px-4 py-20 text-center text-neutral-400">…</div>;
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-neutral-500 mb-4">{t("dashboard.noProfile")}</p>
        <Link href="/profile" className="inline-block px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
          {t("dashboard.buildProfile")}
        </Link>
      </div>
    );
  }

  const intakeYear = profile.intakeYear ?? new Date().getFullYear() + 1;
  const regions = profile.targetRegions ?? [];
  const majors = profile.intendedMajors ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 space-y-6">
      {/* 申请路线图（科技树）——一进来就看到全局 + 我在哪 + 下一步 */}
      <RoadmapTree />

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-brand-soft border border-[var(--border)] px-6 py-8 sm:px-9 sm:py-10">
        <svg
          className="absolute -right-8 -top-10 w-80 h-80 opacity-20 pointer-events-none"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="heroArc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#4f46e5" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <path d="M8 150 A 92 92 0 0 1 192 150" stroke="url(#heroArc)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <line x1="45" y1="150" x2="45" y2="182" stroke="url(#heroArc)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="100" y1="128" x2="100" y2="182" stroke="url(#heroArc)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="155" y1="150" x2="155" y2="182" stroke="url(#heroArc)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative">
          <p className="text-xs font-semibold text-[var(--indigo)] uppercase tracking-[0.2em] mb-2">
            A-Level · 申英港
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
            {t("dashboard.greeting", { name: profile.fullName || email || t("dashboard.student") })}
          </h1>
          <p className="mt-2 text-[var(--ink-soft)]">{t("dashboard.subtitle")}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/match"
              className="px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-sm shadow-indigo-500/20"
            >
              {t("dashboard.startMatch")}
            </Link>
            <Link
              href="/profile"
              className="px-5 py-2.5 rounded-xl bg-white border border-[var(--border)] text-[var(--ink)] text-sm font-medium hover:bg-[var(--surface)] transition-colors"
            >
              {t("dashboard.completeProfile")}
            </Link>
          </div>
        </div>
      </div>

      {/* Full process overview */}
      <div className="rounded-2xl border border-blue-100 bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setGuideOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-left"
        >
          <div>
            <span className="font-semibold text-blue-700">申请全流程说明</span>
            <span className="ml-2 text-xs text-neutral-400">UK & HK Application Guide</span>
          </div>
          <span className="text-xs text-blue-400">{guideOpen ? "收起 ▲" : "展开 ▼"}</span>
        </button>
        {guideOpen && (
          <div className="px-5 pb-6 pt-2 border-t border-blue-50">
            <ProcessOverview forceExpand />
          </div>
        )}
      </div>

      {/* Goal card */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5">
        <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-3">{t("dashboard.yourGoal")}</p>
        <div className="flex flex-wrap gap-2">
          <GoalTag>{t("dashboard.intakeYear", { year: intakeYear })}</GoalTag>
          {regions.map((r) => (
            <GoalTag key={r}>{t(`common.${r.toLowerCase()}`)}</GoalTag>
          ))}
          {majors.slice(0, 4).map((m) => (
            <GoalTag key={m}>{m}</GoalTag>
          ))}
          {majors.length === 0 && (
            <Link href="/profile" className="text-xs text-neutral-400 underline">
              {t("dashboard.addMajors")}
            </Link>
          )}
        </div>
      </div>

      {/* Timeline preview */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold">{t("dashboard.nextSteps")}</p>
          <Link href="/timeline" className="text-xs text-blue-600 hover:underline">
            {t("dashboard.fullTimeline")} →
          </Link>
        </div>
        {upcomingMs.length === 0 ? (
          <p className="text-sm text-neutral-400">{t("dashboard.timelineDone")}</p>
        ) : (
          upcomingMs.map((m) => <MilestoneRow key={m.id} m={m} t={t} />)
        )}
      </div>

      {/* Tools grid */}
      <div>
        <p className="font-semibold mb-3 text-[var(--ink)]">{t("dashboard.tools")}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { href: "/match", emoji: "🎯", labelKey: "dashboard.tool.match", meta: null },
            {
              href: "/applications",
              emoji: "📋",
              labelKey: "dashboard.tool.applications",
              meta: appCount > 0 ? t("dashboard.tool.appCount", { n: appCount }) : null,
            },
            { href: "/statements", emoji: "✍️", labelKey: "dashboard.tool.statements", meta: null },
            { href: "/universities", emoji: "🏛️", labelKey: "dashboard.tool.universities", meta: null },
            { href: "/apply-guide", emoji: "📄", labelKey: "dashboard.tool.applyGuide", meta: null },
            { href: "/documents", emoji: "📁", labelKey: "dashboard.tool.documents", meta: null },
            { href: "/background", emoji: "🌟", labelKey: "dashboard.tool.background", meta: null },
            { href: "/tasks", emoji: "✅", labelKey: "dashboard.tool.tasks", meta: null },
            { href: "/tests", emoji: "📐", labelKey: "dashboard.tool.tests", meta: null },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="card-hover group flex flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white p-4 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 text-center"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-soft text-2xl group-hover:scale-105 transition-transform">
                {tool.emoji}
              </span>
              <span className="text-sm font-medium text-[var(--ink)]">{t(tool.labelKey as never)}</span>
              {tool.meta && <span className="text-xs text-[var(--indigo)]">{tool.meta}</span>}
            </Link>
          ))}
        </div>
      </div>

      {/* Profile completeness hint */}
      {(!profile.ielts || profile.subjects.length === 0) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-center justify-between gap-4">
          <span>{t("dashboard.profileIncomplete")}</span>
          <Link href="/profile" className="shrink-0 text-xs font-medium underline">
            {t("dashboard.completeProfile")}
          </Link>
        </div>
      )}
    </div>
  );
}
