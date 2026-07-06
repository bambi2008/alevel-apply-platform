"use client";

import { PageHeader } from "@/components/page-header";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { buildTimeline, type Milestone, type PrepLevel } from "@/lib/timeline";
import { loadProfile } from "@/lib/profile/store";
import { Link } from "@/i18n/navigation";

import { StatusBadge, type StatusKind } from "@/components/status-badge";

// 里程碑状态 → 统一状态标签
const STATUS_MAP: Record<string, { kind: StatusKind; key: string }> = {
  done: { kind: "done", key: "status.done" },
  urgent: { kind: "danger", key: "status.urgent" },
  upcoming: { kind: "warning", key: "status.upcoming" },
  future: { kind: "todo", key: "status.future" },
};

// 时间轴节点颜色
const NODE_STYLE: Record<string, string> = {
  done: "border-[var(--success)] bg-[var(--success-bg)]",
  urgent: "border-[var(--danger)] bg-[var(--danger-bg)]",
  upcoming: "border-[var(--warning)] bg-[var(--warning-bg)]",
  future: "border-[var(--border)] bg-white",
};

const PREP_COLOR: Record<PrepLevel, string> = {
  early: "bg-[var(--success-bg)] border-[color:var(--success)]/20 text-[var(--success)]",
  "on-track": "bg-[var(--info-bg)] border-[color:var(--indigo)]/20 text-[var(--indigo)]",
  late: "bg-[var(--danger-bg)] border-[color:var(--danger)]/20 text-[var(--danger)]",
};

function fmt(date: Date, locale: string) {
  return date.toLocaleDateString(locale === "en" ? "en-GB" : "zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TimelinePage() {
  const t = useTranslations("timeline");
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [prepLevel, setPrepLevel] = useState<PrepLevel>("on-track");
  const [intakeYear, setIntakeYear] = useState<number | null>(null);
  const [locale, setLocale] = useState("zh-CN");

  useEffect(() => {
    const loc = document.documentElement.lang || "zh-CN";
    setLocale(loc);
    loadProfile().then((profile) => {
      const year = profile?.intakeYear ?? new Date().getFullYear() + 1;
      const regions = profile?.targetRegions?.length ? profile.targetRegions : (["UK", "HK"] as const);
      setIntakeYear(year);
      const { milestones: ms, prepLevel: pl } = buildTimeline(year, [...regions]);
      setMilestones(ms);
      setPrepLevel(pl);
    });
  }, []);

  if (!intakeYear) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-neutral-500">
        {t("loading")}
      </div>
    );
  }

  const next = milestones.find((m) => m.status === "urgent" || m.status === "upcoming");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Header */}
      <PageHeader
        title={t("title")}
        subtitle={t("intakeNote", { year: intakeYear })}
        icon="🗓️"
      />

      {/* Prep level banner */}
      <div className={`rounded-xl border px-4 py-3 mb-8 text-sm ${PREP_COLOR[prepLevel]}`}>
        <span className="font-semibold">{t(`prep.${prepLevel}.label`)}</span>
        {"  "}
        {t(`prep.${prepLevel}.desc`)}
      </div>

      {/* Next up — 深色强调，最高优先级 */}
      {next && (
        <div className="mb-8 rounded-2xl bg-[var(--ink)] text-white px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">{t("nextUp")}</p>
          <p className="font-bold mt-1">{t(next.titleKey as never)}</p>
          <p className="text-sm text-white/60 mt-0.5">{fmt(next.date, locale)}</p>
        </div>
      )}

      {/* Timeline */}
      <ol className="relative border-l-2 border-[var(--border)] ml-3">
        {milestones.map((m) => {
          const sm = STATUS_MAP[m.status] ?? STATUS_MAP.future;
          const isNext = next && m.id === next.id;
          return (
            <li key={m.id} className="mb-7 ml-6">
              {/* node */}
              <span
                className={`absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full border-2 ${NODE_STYLE[m.status]} ${isNext ? "ring-4 ring-[color:var(--indigo)]/15" : ""}`}
              >
                {m.status === "done" ? (
                  <svg className="w-3 h-3 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      m.status === "urgent" ? "bg-[var(--danger)]" : m.status === "upcoming" ? "bg-[var(--warning)]" : "bg-[var(--ink-faint)]"
                    }`}
                  />
                )}
              </span>

              <div className={`rounded-xl border p-4 transition-colors ${isNext ? "border-[color:var(--indigo)]/30 bg-[var(--info-bg)]" : "border-[var(--border)] bg-white"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className={`font-semibold text-sm ${m.status === "done" ? "text-[var(--ink-faint)] line-through" : "text-[var(--ink)]"}`}>
                      {t(m.titleKey as never)}
                    </h3>
                    <p className="text-xs text-[var(--ink-faint)] mt-0.5">{fmt(m.date, locale)}</p>
                    <p className="text-sm text-[var(--ink-soft)] mt-1.5">{t(m.descKey as never)}</p>
                    {m.tip && (
                      <p className="text-xs mt-2 text-[var(--indigo)] bg-[var(--info-bg)] rounded-lg px-2.5 py-1.5">
                        💡 {t(m.tip as never)}
                      </p>
                    )}
                  </div>
                  <StatusBadge kind={sm.kind} label={t(sm.key as never)} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="text-xs text-[var(--ink-faint)] text-center mt-4">
        {t("disclaimer")}{" "}
        <Link href="/profile" className="underline">
          {t("editProfile")}
        </Link>
      </p>
    </div>
  );
}
