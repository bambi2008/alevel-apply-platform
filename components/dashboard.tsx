"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { loadProfile, type UserProfile } from "@/lib/profile/store";
import { listApplications } from "@/lib/applications/store";
import { buildTimeline, type Milestone } from "@/lib/timeline";
import { ProcessOverview } from "@/components/process-overview";

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
  const [upcomingMs, setUpcomingMs] = useState<Milestone[]>([]);
  const [appCount, setAppCount] = useState(0);
  const [guideOpen, setGuideOpen] = useState(true);

  useEffect(() => {
    const p = loadProfile();
    setProfile(p);
    if (p) {
      const year = p.intakeYear ?? new Date().getFullYear() + 1;
      const regions = p.targetRegions?.length ? p.targetRegions : (["UK", "HK"] as const);
      const { milestones } = buildTimeline(year, [...regions]);
      setUpcomingMs(milestones.filter((m) => m.status !== "done").slice(0, 3));
    }
    setAppCount(listApplications().length);
  }, []);

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
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold mb-1">
          {t("dashboard.greeting", { name: profile.fullName || email || t("dashboard.student") })}
        </h1>
        <p className="text-sm text-neutral-500">{t("dashboard.subtitle")}</p>
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
        <p className="font-semibold mb-3">{t("dashboard.tools")}</p>
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
            { href: "/tests", emoji: "📐", labelKey: "dashboard.tool.tests", meta: null },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm transition text-center"
            >
              <span className="text-2xl">{tool.emoji}</span>
              <span className="text-xs font-medium text-neutral-700">{t(tool.labelKey as never)}</span>
              {tool.meta && <span className="text-xs text-blue-500">{tool.meta}</span>}
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
