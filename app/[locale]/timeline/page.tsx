"use client";

import { PageHeader } from "@/components/page-header";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { buildTimeline, type Milestone, type PrepLevel } from "@/lib/timeline";
import { loadProfile } from "@/lib/profile/store";
import { Link } from "@/i18n/navigation";

const STATUS_COLOR: Record<string, string> = {
  done: "bg-neutral-200 text-neutral-500",
  urgent: "bg-red-500 text-white",
  upcoming: "bg-amber-400 text-white",
  future: "bg-blue-100 text-blue-700",
};

const STATUS_RING: Record<string, string> = {
  done: "border-neutral-300 bg-neutral-100",
  urgent: "border-red-400 bg-red-50",
  upcoming: "border-amber-400 bg-amber-50",
  future: "border-blue-200 bg-white",
};

const PREP_COLOR: Record<PrepLevel, string> = {
  early: "bg-green-50 border-green-200 text-green-800",
  "on-track": "bg-blue-50 border-blue-200 text-blue-800",
  late: "bg-red-50 border-red-200 text-red-800",
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

      {/* Next up */}
      {next && (
        <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
          <p className="text-xs text-blue-500 font-medium mb-0.5">{t("nextUp")}</p>
          <p className="font-semibold text-blue-900">{t(next.titleKey as never)}</p>
          <p className="text-xs text-blue-600 mt-0.5">{fmt(next.date, locale)}</p>
        </div>
      )}

      {/* Timeline */}
      <ol className="relative border-l border-neutral-200 ml-3">
        {milestones.map((m) => (
          <li key={m.id} className="mb-8 ml-6">
            {/* dot */}
            <span
              className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border-2 ${STATUS_RING[m.status]}`}
            >
              {m.status === "done" && (
                <svg className="w-3 h-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {m.status === "urgent" && <span className="w-2 h-2 rounded-full bg-red-500" />}
              {m.status === "upcoming" && <span className="w-2 h-2 rounded-full bg-amber-400" />}
              {m.status === "future" && <span className="w-2 h-2 rounded-full bg-blue-300" />}
            </span>

            <div className="flex items-start justify-between gap-2">
              <div>
                <h3
                  className={`font-semibold text-sm ${
                    m.status === "done" ? "text-neutral-400 line-through" : "text-neutral-900"
                  }`}
                >
                  {t(m.titleKey as never)}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">{fmt(m.date, locale)}</p>
                <p className="text-sm text-neutral-600 mt-1">{t(m.descKey as never)}</p>
                {m.tip && (
                  <p className="text-xs mt-1.5 text-blue-600 bg-blue-50 rounded px-2 py-1">
                    {t(m.tip as never)}
                  </p>
                )}
              </div>
              <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[m.status]}`}>
                {t(`status.${m.status}`)}
              </span>
            </div>
          </li>
        ))}
      </ol>

      <p className="text-xs text-neutral-400 text-center mt-4">
        {t("disclaimer")}{" "}
        <Link href="/profile" className="underline">
          {t("editProfile")}
        </Link>
      </p>
    </div>
  );
}
