"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { loadProfile, type UserProfile } from "@/lib/profile/store";
import { listApplications } from "@/lib/applications/store";
import { buildTimeline, type Milestone } from "@/lib/timeline";
import { ProcessOverview } from "@/components/process-overview";
import { RoadmapTree } from "@/components/roadmap-tree";
import { DashboardHub } from "@/components/dashboard-hub";
import { StudyTodayPreview } from "@/components/study-today-preview";

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
    return <div className="mx-auto max-w-2xl px-4 py-20 text-center text-[var(--ink-faint)]">…</div>;
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-[var(--ink-soft)] mb-4">{t("dashboard.noProfile")}</p>
        <Link href="/profile" className="btn btn-primary">
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
      {/* UCAS Hub 式结构：头部横幅（我是谁/总进度/继续）+ 关键日期 + 科技树 + 模块磁贴 */}
      <DashboardHub
        name={profile.fullName || email || t("dashboard.student")}
        chips={[
          t("dashboard.intakeYear", { year: intakeYear }),
          ...regions.map((r) => t(`common.${r.toLowerCase()}` as never) as string),
          ...majors.slice(0, 3),
        ]}
        milestones={upcomingMs.map((m) => ({
          m,
          title: t(m.titleKey as never) as string,
          statusLabel: t(`timeline.status.${m.status}` as never) as string,
        }))}
        appCount={appCount}
        msLabels={{ keyDates: "关键日期", fullTimeline: t("dashboard.fullTimeline") as string }}
      >
        <StudyTodayPreview />
        <RoadmapTree />
      </DashboardHub>

      {/* Full process overview */}
      <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setGuideOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-left"
        >
          <div>
            <span className="font-semibold text-[var(--ink)]">申请全流程说明</span>
            <span className="ml-2 text-xs text-[var(--ink-faint)]">UK & HK Application Guide</span>
          </div>
          <span className="text-xs text-[var(--ink-faint)]">{guideOpen ? "收起 ▲" : "展开 ▼"}</span>
        </button>
        {guideOpen && (
          <div className="px-5 pb-6 pt-2 border-t border-[var(--border-soft)]">
            <ProcessOverview forceExpand />
          </div>
        )}
      </div>

      {/* Profile completeness hint */}
      {(!profile.ielts || profile.subjects.length === 0) && (
        <div className="rounded-xl border border-[color:var(--warning)]/25 bg-[var(--warning-bg)] px-4 py-3 text-sm text-[var(--warning)] flex items-center justify-between gap-4">
          <span>{t("dashboard.profileIncomplete")}</span>
          <Link href="/profile" className="shrink-0 text-xs font-medium underline">
            {t("dashboard.completeProfile")}
          </Link>
        </div>
      )}
    </div>
  );
}
