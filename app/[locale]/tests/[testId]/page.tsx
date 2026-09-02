"use client";

import { useState, useEffect, use } from "react";
import { notFound, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { forceFullNavigation } from "@/lib/navigation";
import { getTestById, type AdmissionsTest } from "@/lib/tests";
import { getKnowledgeByTopicId } from "@/lib/tests/knowledge";
import { REGISTRATION_INFO } from "@/lib/tests/registration";
import { ExamTimer, getTimerPresets } from "@/components/exam-timer";
import { getMockPapersForTest } from "@/lib/tests/mock-papers";
import { ArrowRight, BookOpenCheck, FileText, Timer } from "lucide-react";
import { AdaptiveLearningPanel } from "@/components/adaptive-learning-panel";
import { ExamReadinessPanel } from "@/components/exam-readiness-panel";

export default function TestDetailPage({
  params,
}: {
  params: Promise<{ testId: string; locale: string }>;
}) {
  const { testId } = use(params);
  const test = getTestById(testId);
  if (!test) notFound();

  return <TestDetailContent test={test} />;
}

type TabId = "overview" | "topics" | "history" | "analysis";

function TestDetailContent({ test }: { test: AdmissionsTest }) {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const requestedReturnTo = searchParams.get("returnTo");
  const returnTo = requestedReturnTo && requestedReturnTo.startsWith("/") && !requestedReturnTo.startsWith("//")
    ? requestedReturnTo
    : null;

  const tabs: { id: TabId; label: string; labelEn: string }[] = [
    { id: "overview", label: "考试结构", labelEn: "Structure" },
    { id: "topics", label: "知识点模块", labelEn: "Topics" },
    { id: "history", label: "历史记录", labelEn: "History" },
    { id: "analysis", label: "学前分析", labelEn: "Analysis" },
  ];
  const normalizedTab = requestedTab === "plan" || requestedTab === "readiness"
    ? "analysis"
    : requestedTab === "practice"
      ? "overview"
      : requestedTab;
  const tab = tabs.some((item) => item.id === normalizedTab) ? normalizedTab as TabId : "overview";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Back */}
      <Link href={returnTo ?? "/tests"} onClick={forceFullNavigation} className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] mb-6 inline-flex items-center gap-1">
        ← {returnTo ? "返回本次复盘" : "返回考试列表"}
      </Link>

      {/* Header */}
      <div className="mt-4 mb-8">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-mono text-[var(--indigo)] font-bold">{test.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{test.abbr}</h1>
              <p className="text-[var(--ink-soft)] text-sm">{test.name}</p>
              <p className="text-[var(--ink-faint)] text-sm">{test.nameZh}</p>
            </div>
          </div>
          {test.hasQuestionBank && (
            <span className="mt-1 text-xs px-3 py-1.5 rounded-full bg-[var(--success-bg)] text-[var(--success)] font-medium">
              ✦ AI 题库可用
            </span>
          )}
        </div>

        {/* Key facts strip */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "考试时长", value: test.duration },
            { label: "知识点", value: `${test.topics.length} 个模块` },
            { label: "备考周期", value: `${test.studyPlan.length} 阶段` },
            {
              label: "题库",
              value: test.hasQuestionBank ? "AI 生成 + 人工审核" : "官方资料为主",
            },
          ].map((f) => (
            <div key={f.label} className="rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] p-3 text-center">
              <div className="font-semibold text-sm text-[var(--ink)]">{f.value}</div>
              <div className="text-xs text-[var(--ink-faint)] mt-0.5">{f.label}</div>
            </div>
          ))}
        </div>

        {/* Universities */}
        <div className="mt-4 flex flex-wrap gap-2">
          {test.universities.map((u) => (
            <span key={u} className="text-xs bg-[var(--info-bg)] text-[var(--indigo)] rounded-full px-2.5 py-0.5">
              {u}
            </span>
          ))}
        </div>

        {/* Programs */}
        <div className="mt-2 flex flex-wrap gap-2">
          {test.programs.map((p, i) => (
            <span key={i} className="text-xs bg-[var(--surface-2)] text-[var(--ink-soft)] rounded-full px-2.5 py-0.5">
              {p}
              <span className="ml-1 text-[var(--ink-faint)]">· {test.programsEn[i]}</span>
            </span>
          ))}
        </div>

        {/* Status note */}
        {test.statusNote && (
          <div className="mt-4 rounded-xl border border-[color:var(--warning)]/25 bg-[var(--warning-bg)] px-4 py-3 text-sm text-[var(--warning)] leading-relaxed">
            {test.statusNote}
          </div>
        )}
      </div>

      {test.hasQuestionBank ? (
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          <Link
            href={`/tests/${test.id}/practice`}
            className="flex min-h-16 items-center justify-between rounded-lg border border-[var(--border)] bg-white px-5 py-4 font-semibold text-[var(--ink)] transition hover:border-[color:var(--indigo)]/40 hover:bg-[var(--info-bg)]"
          >
            <span className="flex items-center gap-3"><BookOpenCheck className="size-5 text-[var(--indigo)]" />专项练习</span>
            <ArrowRight className="size-4 text-[var(--indigo)]" />
          </Link>
          <Link
            href={`/tests/${test.id}/mock`}
            className="flex min-h-16 items-center justify-between rounded-lg bg-[var(--indigo)] px-5 py-4 font-semibold text-white transition hover:opacity-90"
          >
            <span className="flex items-center gap-3"><Timer className="size-5" />完整模考</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <a href={test.officialSampleUrl} target="_blank" rel="noopener noreferrer" className="mb-8 inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--indigo)]">
          查看官方练习材料 <ArrowRight className="size-4" />
        </a>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border)] mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/tests/${test.id}?tab=${t.id}`}
            aria-current={tab === t.id ? "page" : undefined}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              tab === t.id
                ? "border-[var(--indigo)] text-[var(--indigo)]"
                : "border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]"
            }`}
          >
            {t.label}
            <span className="ml-1 text-xs opacity-60">{t.labelEn}</span>
          </Link>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && <OverviewTab test={test} />}
      {tab === "topics" && <TopicsTab test={test} />}
      {tab === "history" && <HistoryTab test={test} />}
      {tab === "analysis" && <AnalysisTab test={test} />}
    </div>
  );
}

function OverviewTab({ test }: { test: AdmissionsTest }) {
  return (
    <div className="space-y-6">
      <Section title="考试简介" titleEn="Overview">
        <p className="text-sm text-[var(--ink)] leading-relaxed">{test.overview}</p>
      </Section>

      <Section title="考试格式" titleEn="Format">
        <div className="rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] p-4 space-y-3">
          <div>
            <div className="text-xs text-[var(--ink-faint)] mb-1">官方格式（英文）</div>
            <p className="text-sm font-mono text-[var(--ink)]">{test.format}</p>
          </div>
          <div>
            <div className="text-xs text-[var(--ink-faint)] mb-1">格式说明（中文）</div>
            <p className="text-sm text-[var(--ink)] leading-relaxed">{test.formatZh}</p>
          </div>
        </div>
      </Section>

      <Section title="结构详解" titleEn="Structure Details">
        <p className="text-sm text-[var(--ink)] leading-relaxed">{test.structureDetails}</p>
      </Section>

      <Section title="评分说明" titleEn="Scoring">
        <p className="text-sm text-[var(--ink)] leading-relaxed">{test.scoringNote}</p>
      </Section>

      <Section title="备考关键建议" titleEn="Key Tips">
        <ul className="space-y-2">
          {test.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--ink)]">
              <span className="text-[var(--indigo)] shrink-0 mt-0.5">▸</span>
              {tip}
            </li>
          ))}
        </ul>
      </Section>

      {REGISTRATION_INFO[test.id] && (
        <Section title="报名与出分" titleEn="Registration & Results">
          {(() => {
            const r = REGISTRATION_INFO[test.id];
            const rows: { label: string; value: string }[] = [
              { label: "报名窗口", value: r.registerWindow },
              { label: "如何报名", value: r.registerHow },
              { label: "考试时间", value: r.testDate },
              { label: "出分时间", value: r.resultsWhen },
              { label: "如何查分", value: r.resultsHow },
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
                  >
                    报名官网 ↗
                  </a>
                  {r.resultsUrl && (
                    <a
                      href={r.resultsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[var(--indigo)] hover:underline"
                    >
                      查分/结果页 ↗
                    </a>
                  )}
                </div>
              </div>
            );
          })()}
          <p className="mt-2 text-xs text-[var(--ink-faint)] leading-relaxed">
            ⚠️ 报名与出分日期每年会调整，以上为通行规律，请务必以当年官网为准。
          </p>
        </Section>
      )}

      <div className="flex gap-3">
        <a
          href={test.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-[var(--indigo)] text-white text-sm font-medium hover:bg-[var(--indigo-hover)]"
        >
          报名官网 ↗
        </a>
        <a
          href={test.officialSampleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-[var(--surface)]"
        >
          官方样题 ↗
        </a>
      </div>
    </div>
  );
}

function TopicsTab({ test }: { test: AdmissionsTest }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--ink-soft)] mb-4">
        以下知识点模块是 {test.abbr} 考试范围的核心分类。点击「学习讲解」查看知识点阐述与例题精讲。
      </p>
      {test.topics.map((topic, i) => {
        const hasLearn = !!getKnowledgeByTopicId(topic.id);
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
                  >
                    学习讲解 →
                  </Link>
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

function PlanTab({ test }: { test: AdmissionsTest }) {
  return (
    <div className="space-y-8">
      <AdaptiveLearningPanel testId={test.id} variant="plan" />
      <div className="border-t border-[var(--border)] pt-6">
        <h3 className="font-semibold text-[var(--ink)]">长期阶段参考</h3>
      </div>
      <p className="text-sm text-[var(--ink-soft)]">
        以下是针对 {test.abbr} 的系统备考计划，可根据自己距考试的时间弹性调整。
        考试通常在 10–11 月，Year 13 开学（9 月）应开始密集备考。
      </p>
      {test.studyPlan.map((phase, i) => (
        <div key={i} className="rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 bg-[var(--surface)] border-b border-[var(--border)]">
            <div className="w-6 h-6 rounded-full bg-[var(--indigo)] text-white text-xs font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </div>
            <div>
              <span className="font-semibold text-sm">{phase.week}</span>
              <span className="ml-2 text-sm text-[var(--ink-soft)]">· {phase.focus}</span>
            </div>
          </div>
          <ul className="px-4 py-3 space-y-1.5">
            {phase.tasks.map((task, j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-[var(--ink)]">
                <span className="text-[var(--ink-faint)] shrink-0 mt-0.5">○</span>
                {task}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function PracticeTab({ test }: { test: AdmissionsTest }) {
  const mockPapers = getMockPapersForTest(test.id);
  if (!test.hasQuestionBank) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">{test.icon}</div>
        <h3 className="font-semibold text-[var(--ink)] mb-2">{test.abbr} 练习材料</h3>
        <p className="text-sm text-[var(--ink-soft)] mb-6 max-w-md mx-auto">
          {test.abbr} 目前以官方资料 + 备考计划为主要备考方式。
          AI 题库正在规划中，将覆盖 {test.topics.slice(0, 3).map((t) => t.title).join("、")} 等知识点。
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href={test.officialSampleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg bg-[var(--indigo)] text-white text-sm font-medium hover:bg-[var(--indigo-hover)]"
          >
            前往官方样题 ↗
          </a>
        </div>
        <div className="mt-8 rounded-xl border border-[var(--border)] p-5 text-left max-w-md mx-auto">
          <h4 className="font-semibold text-sm mb-3 text-[var(--ink)]">推荐备考资源</h4>
          <ul className="space-y-2 text-sm text-[var(--ink-soft)]">
            <li className="flex gap-2">
              <span className="text-[var(--indigo)]">→</span>
              历年真题（官网免费下载）
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--indigo)]">→</span>
              官方备考指南（Specification）
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--indigo)]">→</span>
              本站备考计划（见「备考计划」标签）
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[color:var(--success)]/25 bg-[var(--success-bg)] px-4 py-4">
        <h3 className="font-semibold text-[var(--success)] mb-1">✦ {test.abbr} AI 题库</h3>
        <p className="text-sm text-[var(--success)]">
          题库为原创训练内容并经过组合审核。非作文大题可手写后拍照上传，系统按解题步骤给部分分。
        </p>
      </div>

      {/* Topic practice — full list, each row is a direct link */}
      <div className="rounded-xl border border-[var(--border)] p-5">
        <div className="flex items-baseline justify-between mb-3">
          <h4 className="font-semibold">知识点专项练习</h4>
          <Link
            href={`/tests/${test.id}/practice`}
            className="text-xs text-[var(--indigo)] hover:underline"
          >
            随机混合练习 →
          </Link>
        </div>
        <p className="text-sm text-[var(--ink-soft)] mb-3">点击任意模块直接开始该知识点练习</p>
        <div className="space-y-1.5">
          {test.topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/tests/${test.id}/practice?topic=${topic.id}`}
              className="flex items-center justify-between text-sm rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] px-3 py-2.5 hover:bg-[var(--info-bg)] hover:border-[color:var(--indigo)]/25 hover:text-[var(--indigo)] transition group"
            >
              <span className="font-medium">{topic.title}</span>
              <span className="text-xs text-[var(--ink-faint)] group-hover:text-[var(--indigo)]">{topic.titleEn} →</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mock exam */}
      <div className="rounded-xl border border-[var(--border)] p-5">
        <h4 className="font-semibold mb-2">计时模拟考试</h4>
        <p className="text-sm text-[var(--ink-soft)] mb-4">
          模拟真实考试环境：计时、题目随机组合、结束后详细分析。
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-[var(--ink-soft)]">
            <span>模拟时长</span>
            <span className="font-medium">{test.duration}</span>
          </div>
          <div className="flex justify-between text-[var(--ink-soft)]">
            <span>题目数量</span>
            <span className="font-medium">按真实考试题量</span>
          </div>
          <div className="flex justify-between text-[var(--ink-soft)]">
            <span>评分方式</span>
            <span className="font-medium">AI 分步评分</span>
          </div>
        </div>
        <Link
          href={`/tests/${test.id}/mock`}
          className="mt-4 block w-full py-2.5 rounded-lg border border-[var(--indigo)] text-[var(--indigo)] text-sm font-medium hover:bg-[var(--info-bg)] transition text-center"
        >
          开始模拟考试 →
        </Link>
      </div>

      {/* 完整模拟卷 */}
      {mockPapers.length > 0 && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-4">
          <h4 className="flex items-center gap-2 font-semibold text-indigo-900 text-sm mb-1">
            <FileText className="size-4" aria-hidden="true" />
            固定套卷（计时考试）
          </h4>
          <p className="text-xs text-indigo-700 mb-3">
            每套题目与顺序固定，便于限时作答、复盘和比较进步；卷面标签会说明其格式定位。
          </p>
          <div className="space-y-2">
            {mockPapers.map((paper) => (
              <Link
                key={paper.id}
                href={`/tests/${test.id}/paper/${paper.id}`}
                className="flex items-center justify-between rounded-lg border border-indigo-200 bg-white px-3 py-2.5 hover:bg-indigo-50 transition group"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-indigo-900">{paper.title}</span>
                    {paper.formatType && (
                      <span className="rounded border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 text-[11px] leading-none text-indigo-700">
                        {paper.formatType === "current" ? "现行结构" : paper.formatType === "legacy" ? "历史格式" : "能力拓展"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-indigo-500 mt-0.5">
                    {paper.modules.reduce((sum, module) => sum + module.questions.length, 0)} 题 · {paper.modules.map((m) => `${m.title} ${Math.round(m.durationSec / 60)}分钟`).join(" · ")}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-indigo-500 text-sm group-hover:text-indigo-700">
                  开始 <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Past papers */}
      <div className="rounded-xl border border-[color:var(--warning)]/20 bg-[var(--warning-bg)] px-4 py-4">
        <h4 className="font-semibold text-[var(--warning)] text-sm mb-2">
          {test.pastPaperLinks ? "历年真题 — 模拟考试材料" : "官方历年真题"}
        </h4>
        <p className="text-xs text-[var(--warning)] mb-3">
          AI 题库是刷题工具，官方真题是最终检验。建议把历年真题留到备考后期做限时模拟（计时 + 不查资料）。
        </p>
        {test.pastPaperLinks ? (
          <div className="space-y-1.5">
            {test.pastPaperLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-[color:var(--warning)]/25 bg-white px-3 py-2 hover:bg-[var(--warning-bg)] transition group"
              >
                <div>
                  <span className="text-xs font-medium text-[var(--warning)]">{link.label}</span>
                  {link.note && (
                    <p className="text-xs text-[var(--warning)] mt-0.5">{link.note}</p>
                  )}
                </div>
                <span className="text-[var(--warning)] text-xs group-hover:text-[var(--warning)]">↗</span>
              </a>
            ))}
          </div>
        ) : (
          <a
            href={test.officialSampleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--warning)] text-white text-xs font-medium hover:bg-[var(--warning)] transition"
          >
            前往官方真题页面 ↗
          </a>
        )}
      </div>

      {/* 独立计时器：对照官方真题 PDF 限时作答 */}
      <div className="rounded-xl border border-[color:var(--indigo)]/15 bg-[var(--info-bg)]/40 px-4 py-4">
        <h4 className="font-semibold text-[var(--ink)] text-sm mb-1">⏱️ 限时计时器</h4>
        <p className="text-xs text-[var(--ink-soft)] mb-3">
          打开上方官方真题 PDF，选择对应时长开始计时，模拟真实考场节奏（不查资料、一次做完）。
        </p>
        <ExamTimer presets={getTimerPresets(test.id)} />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs text-[var(--ink-soft)]">
        ℹ️ 题库正在建设中。AI 生成的数学题经过多轮审核，如发现题目有误请反馈给我们。
        模拟考试中的数学大题由 DeepSeek AI 进行分步评分，按解题步骤给部分分。
      </div>
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
  const [sessions, setSessions] = useState<HistoryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/exam-sessions?testId=${test.id}`)
      .then((r) => {
        if (r.status === 401) throw new Error("请先登录查看历史记录");
        if (!r.ok) throw new Error("加载失败");
        return r.json() as Promise<HistoryEntry[]>;
      })
      .then(setSessions)
      .catch((e) => setError(e.message));
  }, [test.id]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });

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
        {error.includes("登录") && (
          <Link href="/login" className="mt-3 inline-block px-4 py-2 rounded-lg bg-[var(--indigo)] text-white text-sm">
            前往登录
          </Link>
        )}
      </div>
    );
  }

  if (!sessions) {
    return <div className="text-center py-16 text-[var(--ink-faint)] text-sm">加载中…</div>;
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--ink-faint)]">
        <p className="text-5xl mb-4">📋</p>
        <p>还没有练习记录</p>
        <div className="flex gap-3 justify-center mt-6">
          <Link href={`/tests/${test.id}/practice`} className="px-4 py-2 rounded-lg bg-[var(--indigo)] text-white text-sm">
            开始练习
          </Link>
          <Link href={`/tests/${test.id}/mock`} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm">
            开始模拟考试
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--ink-soft)] mb-4">最近 {sessions.length} 次练习记录</p>
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
                  {s.mode === "mock" ? "模拟考试" : "专项练习"}
                </span>
                <span className="text-xs text-[var(--ink-faint)]">{fmt(s.createdAt)}</span>
              </div>
              <div className="text-sm font-medium mt-0.5">
                {s.totalEarned}/{s.totalMax} 分 · {s._count.answers} 题
                {s.timeUsedSec && <span className="text-xs text-[var(--ink-faint)] ml-2">用时 {fmtTime(s.timeUsedSec)}</span>}
              </div>
            </div>
            <span className="shrink-0 text-xs font-medium text-[var(--indigo)]">查看报告 ›</span>
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
