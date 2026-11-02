"use client";
import { useUiCopy } from "@/components/use-ui-copy";
import { useLocale } from "next-intl";
import type { RegInfo } from "@/lib/tests/registration";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { forceFullNavigation } from "@/lib/navigation";
import { getTestPurpose, type AdmissionsTest } from "@/lib/tests";
import { ArrowRight, BookOpenCheck, ChartNoAxesColumnIncreasing, History, LayoutList, LibraryBig, Timer } from "lucide-react";
import { AdaptiveLearningPanel } from "@/components/adaptive-learning-panel";
import { ExamReadinessPanel } from "@/components/exam-readiness-panel";
import { ExamScopeNote } from "@/components/exam-scope-note";
import { LatestBankUpdates } from "@/components/latest-bank-updates";

type TabId = "overview" | "topics" | "history" | "analysis";

const MODULES = [
  { id: "overview", label: "考试结构", labelEn: "Structure", description: "题型、评分与报名", icon: LayoutList },
  { id: "topics", label: "知识点", labelEn: "Topics", description: "范围与学习讲解", icon: LibraryBig },
  { id: "history", label: "历史记录", labelEn: "History", description: "作答与复盘", icon: History },
  { id: "analysis", label: "学前分析", labelEn: "Analysis", description: "诊断与训练计划", icon: ChartNoAxesColumnIncreasing },
] as const;

export function TestDetailContent({ test, registration, learnableTopicIds, trainingLabel }: { test: AdmissionsTest; registration?: RegInfo; learnableTopicIds: string[]; trainingLabel: string }) {
  const ui = useUiCopy();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const requestedReturnTo = searchParams.get("returnTo");
  const returnTo = requestedReturnTo && requestedReturnTo.startsWith("/") && !requestedReturnTo.startsWith("//")
    ? requestedReturnTo
    : null;

  const normalizedTab = requestedTab === "plan" || requestedTab === "readiness"
    ? "analysis"
    : requestedTab === "practice"
      ? "overview"
      : requestedTab;
  const tab = MODULES.some((item) => item.id === normalizedTab) ? normalizedTab as TabId : null;

  if (tab) {
    const activeModule = MODULES.find((item) => item.id === tab)!;
    const ActiveIcon = activeModule.icon;
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Link
          href={returnTo ?? `/tests/${test.id}`}
          onClick={forceFullNavigation}
          className="inline-flex items-center gap-1 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]"
        >
          ← {returnTo ? ui("返回本次复盘") : ui("返回 {0}", test.abbr)}
        </Link>

        <header className="mt-10 flex items-end justify-between gap-6 border-b border-black/15 pb-7">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-black/65">{test.abbr}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-[#101817] sm:text-5xl">{locale === "en" ? activeModule.labelEn : activeModule.label}</h1>
            {locale !== "en" && <p className="mt-2 text-sm text-black/60">{activeModule.labelEn}</p>}
          </div>
          <ActiveIcon className="size-8 stroke-[1.5] text-black/65" aria-hidden="true" />
        </header>

        <div className="pt-8">
          {tab === "overview" && <OverviewTab test={test} registration={registration} />}
          {tab === "topics" && <TopicsTab test={test} learnableTopicIds={learnableTopicIds} />}
          {tab === "history" && <HistoryTab test={test} />}
          {tab === "analysis" && <AnalysisTab test={test} />}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/tests" onClick={forceFullNavigation} className="inline-flex items-center gap-1 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">{ui("← 返回考试列表")}</Link>

      <header className="mt-10 border-b border-black/15 pb-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-black/65">{test.nameZh}</p>
            <h1 className="mt-3 text-5xl font-semibold tracking-[-0.055em] text-[#101817] sm:text-6xl">{test.abbr}</h1>
          </div>
          {test.hasQuestionBank && (
            <span className="rounded-full border border-black/10 bg-white/55 px-3 py-1.5 text-xs font-medium text-black/65">{ui("题库可用")}</span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-black/65">
          <span>{test.duration}</span>
          <span>{test.topics.length}{ui("个知识点")}</span>
          <span>{test.studyPlan.length}{ui("个备考阶段")}</span>
        </div>

        {test.statusNote && (
          <div className="mt-5 border-l-2 border-[var(--warning)] pl-3 text-sm leading-6 text-[var(--warning)]">
            {test.statusNote}
          </div>
        )}
      </header>

      {test.hasQuestionBank ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href={`/tests/${test.id}/practice`}
            className="flex min-h-20 items-center justify-between rounded-2xl border border-black/15 bg-white/45 px-5 py-4 font-semibold text-[var(--ink)] transition hover:-translate-y-1 hover:border-black/30 hover:bg-white"
          >
            <span className="flex items-center gap-3"><BookOpenCheck className="size-5" />{ui("专项练习")}</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href={`/tests/${test.id}/mock`}
            className="flex min-h-20 items-center justify-between rounded-2xl bg-[#101817] px-5 py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-black"
          >
            <span className="flex items-center gap-3"><Timer className="size-5" />{trainingLabel}</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <a href={test.officialSampleUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-black/15 bg-white/45 px-5 py-4 text-sm font-semibold text-[#101817]">{ui("查看官方练习材料")}<ArrowRight className="size-4" />
        </a>
      )}

      <ExamScopeNote testId={test.id} locale={locale} />
      {test.hasQuestionBank && <LatestBankUpdates testId={test.id} />}
      <nav aria-label={ui("考试信息")} className="mt-10 grid gap-3 sm:grid-cols-2">
        {MODULES.map((module, index) => {
          const Icon = module.icon;
          return (
          <Link
            key={module.id}
            href={`/tests/${test.id}?tab=${module.id}`}
            className="group flex min-h-36 flex-col rounded-2xl border border-black/15 bg-white/35 p-5 transition hover:-translate-y-1 hover:border-black/30 hover:bg-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101817]"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs font-semibold tracking-[0.16em] text-black/65">{String(index + 1).padStart(2, "0")}</span>
              <ArrowRight className="size-4 text-black/65 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </div>
            <div className="mt-auto flex items-end gap-3 pt-7">
              <Icon className="size-5 stroke-[1.5] text-black/65" aria-hidden="true" />
              <div>
                <h2 className="font-semibold text-[#101817]">{locale === "en" ? module.labelEn : module.label}</h2>
                <p className="mt-1 text-xs text-black/65">{ui(module.description)}</p>
              </div>
            </div>
          </Link>
          );
        })}
      </nav>
    </div>
  );
}

function OverviewTab({ test, registration }: { test: AdmissionsTest; registration?: RegInfo }) {
  const ui = useUiCopy();
  return (
    <div className="space-y-6">
      <Section title={ui("考试简介")} titleEn="Overview">
        <p className="text-sm text-[var(--ink)] leading-relaxed">{test.overview}</p>
      </Section>

      <Section title={ui("考试格式")} titleEn="Format">
        <div className="rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] p-4 space-y-3">
          <div>
            <div className="text-xs text-[var(--ink-faint)] mb-1">{ui("官方格式（英文）")}</div>
            <p className="text-sm font-mono text-[var(--ink)]">{test.format}</p>
          </div>
          <div>
            <div className="text-xs text-[var(--ink-faint)] mb-1">{ui("格式说明（中文）")}</div>
            <p className="text-sm text-[var(--ink)] leading-relaxed">{test.formatZh}</p>
          </div>
        </div>
      </Section>

      <Section title={ui("结构详解")} titleEn="Structure Details">
        <p className="text-sm text-[var(--ink)] leading-relaxed">{test.structureDetails}</p>
      </Section>

      <Section title={ui("评分说明")} titleEn="Scoring">
        <p className="text-sm text-[var(--ink)] leading-relaxed">{test.scoringNote}</p>
      </Section>

      <Section title={ui("备考关键建议")} titleEn="Key Tips">
        <ul className="space-y-2">
          {test.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--ink)]">
              <span className="text-[var(--indigo)] shrink-0 mt-0.5">▸</span>
              {tip}
            </li>
          ))}
        </ul>
      </Section>

      {getTestPurpose(test) === "legacy" ? (
        <Section title={ui("历史训练")} titleEn="Historical practice">
          <p className="text-sm leading-6">{test.id === "mat" ? ui("MAT 已停考，牛津数学与计算机相关专业自 2026 年起改用 TMUA。") : ui("PAT 已停考，牛津物理相关专业现使用 ESAT。")}{ui("本页仅保留历史训练。")}</p>
          <a href={test.registrationUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm underline">{ui("查看牛津官方说明 ↗")}</a>
        </Section>
      ) : registration && (
        <Section title={ui("报名与出分")} titleEn="Registration & Results">
          {(() => {
            const r = registration;
            const rows: { label: string; value: string }[] = [
              { label: ui("报名窗口"), value: r.registerWindow },
              { label: ui("如何报名"), value: r.registerHow },
              { label: ui("考试时间"), value: r.testDate },
              { label: ui("出分时间"), value: r.resultsWhen },
              { label: ui("如何查分"), value: r.resultsHow },
            ];
            return (
              <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                {rows.map((row, i) => (
                  <div
                    key={row.label}
                    className={`grid grid-cols-[92px_1fr] gap-3 px-4 py-3 text-sm ${
                      i % 2 ? "bg-[var(--surface)]" : "bg-white"
                    }`}
                  >
                    <span className="text-[var(--ink-faint)] shrink-0">{row.label}</span>
                    <span className="text-[var(--ink)] leading-relaxed">{row.value}</span>
                  </div>
                ))}
                <div className="flex flex-wrap gap-3 px-4 py-3 bg-white border-t border-[var(--border)]">
                  <a
                    href={test.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[var(--indigo)] hover:underline"
                  >{ui("报名官网 ↗")}</a>
                  {r.resultsUrl && (
                    <a
                      href={r.resultsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[var(--indigo)] hover:underline"
                    >{ui("查分/结果页 ↗")}</a>
                  )}
                </div>
              </div>
            );
          })()}
          <p className="mt-2 text-xs text-[var(--ink-faint)] leading-relaxed">{ui("⚠️ 报名与出分日期每年会调整，以上为通行规律，请务必以当年官网为准。")}</p>
        </Section>
      )}

      <div className="flex gap-3">
        {getTestPurpose(test) !== "legacy" && <a
          href={test.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-[var(--indigo)] text-white text-sm font-medium hover:bg-[var(--indigo-hover)]"
        >{ui("报名官网 ↗")}</a>}
        <a
          href={test.officialSampleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-[var(--surface)]"
        >{ui("官方样题 ↗")}</a>
      </div>
    </div>
  );
}

function TopicsTab({ test, learnableTopicIds }: { test: AdmissionsTest; learnableTopicIds: string[] }) {
  const ui = useUiCopy();
  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--ink-soft)] mb-4">{ui("以下知识点模块是")}{test.id === "caie9709" ? "9709 Pure 3" : test.abbr}{ui("训练范围的分类。点击「学习讲解」查看知识点阐述与例题精讲。")}</p>
      {test.topics.map((topic, i) => {
        const hasLearn = learnableTopicIds.includes(topic.id);
        return (
          <div key={topic.id} className="rounded-xl border border-[var(--border)] p-4 flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--info-bg)] text-[var(--indigo)] text-sm font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-[var(--ink)]">{topic.title}</span>
                  <span className="text-xs text-[var(--ink-faint)]">{topic.titleEn}</span>
                </div>
                {hasLearn && (
                  <Link
                    href={`/tests/${test.id}/learn/${topic.id}`}
                    className="shrink-0 text-xs px-3 py-1 rounded-lg bg-[var(--info-bg)] text-[var(--indigo)] border border-[color:var(--indigo)]/25 hover:bg-[var(--surface-2)] transition font-medium"
                  >{ui("学习讲解 →")}</Link>
                )}
              </div>
              <p className="text-sm text-[var(--ink-soft)] mt-1 leading-relaxed">{topic.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface HistoryEntry {
  id: string;
  testId: string;
  mode: string;
  totalEarned: number;
  totalMax: number;
  timeUsedSec: number | null;
  createdAt: string;
  _count: { answers: number };
}

function HistoryTab({ test }: { test: AdmissionsTest }) {
  const ui = useUiCopy();
  const locale = useLocale();
  const [sessions, setSessions] = useState<HistoryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/exam-sessions?testId=${test.id}`)
      .then((r) => {
        if (active) setNeedsLogin(r.status === 401);
        if (r.status === 401) throw new Error(ui("请先登录查看历史记录"));
        if (!r.ok) throw new Error(ui("加载失败"));
        return r.json() as Promise<HistoryEntry[]>;
      })
      .then((data) => { if (active) { setSessions(data); setError(null); } })
      .catch((e) => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [test.id, ui]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(locale, { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const fmtTime = (s: number | null) => {
    if (!s) return "—";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  if (error) {
    return (
      <div className="text-center py-16 text-[var(--ink-soft)]">
        <p className="text-lg mb-2">⚠️ {error}</p>
        {needsLogin && (
          <Link href="/login" className="mt-3 inline-block px-4 py-2 rounded-lg bg-[var(--indigo)] text-white text-sm">{ui("前往登录")}</Link>
        )}
      </div>
    );
  }

  if (!sessions) {
    return <div className="text-center py-16 text-[var(--ink-faint)] text-sm">{ui("加载中…")}</div>;
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--ink-faint)]">
        <p className="text-5xl mb-4">📋</p>
        <p>{ui("还没有练习记录")}</p>
        <div className="flex gap-3 justify-center mt-6">
          <Link href={`/tests/${test.id}/practice`} className="px-4 py-2 rounded-lg bg-[var(--indigo)] text-white text-sm">{ui("开始练习")}</Link>
          <Link href={`/tests/${test.id}/mock`} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm">{ui("开始模拟考试")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--ink-soft)] mb-4">{ui("最近")}{sessions.length}{ui("次练习记录")}</p>
      {sessions.map((s) => {
        const pct = s.totalMax > 0 ? Math.round((s.totalEarned / s.totalMax) * 100) : 0;
        return (
          <Link
            key={s.id}
            href={`/tests/${test.id}/history/${s.id}`}
            className="flex items-center gap-4 rounded-xl border border-[var(--border)] px-4 py-3 bg-white hover:border-[color:var(--indigo)]/30 hover:bg-[var(--info-bg)]/40 transition"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              pct >= 80 ? "bg-[var(--success-bg)] text-[var(--success)]" :
              pct >= 60 ? "bg-[var(--warning-bg)] text-[var(--warning)]" :
              "bg-[var(--danger-bg)] text-[var(--danger)]"
            }`}>
              {pct}%
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--ink-soft)]">
                  {s.mode === "mock" ? ui("模拟考试") : ui("专项练习")}
                </span>
                <span className="text-xs text-[var(--ink-faint)]">{fmt(s.createdAt)}</span>
              </div>
              <div className="text-sm font-medium mt-0.5">
                {s.totalEarned}/{s.totalMax}{ui("分 ·")}{s._count.answers}{ui("题")}{s.timeUsedSec && <span className="text-xs text-[var(--ink-faint)] ml-2">{ui("用时")}{fmtTime(s.timeUsedSec)}</span>}
              </div>
            </div>
            <span className="shrink-0 text-xs font-medium text-[var(--indigo)]">{ui("查看报告 ›")}</span>
          </Link>
        );
      })}
    </div>
  );
}

function AnalysisTab({ test }: { test: AdmissionsTest }) {
  return (
    <div className="space-y-8">
      <AdaptiveLearningPanel testId={test.id} variant="analysis" />
      <AdaptiveLearningPanel testId={test.id} variant="plan" />
      <ExamReadinessPanel testId={test.id} />
    </div>
  );
}

function Section({
  title,
  titleEn,
  children,
}: {
  title: string;
  titleEn: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="font-semibold text-[var(--ink)]">{title}</h3>
        <span className="text-xs text-[var(--ink-faint)]">{titleEn}</span>
      </div>
      {children}
    </div>
  );
}
