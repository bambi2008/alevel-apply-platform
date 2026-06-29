"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTestById, type AdmissionsTest } from "@/lib/tests";
import { getKnowledgeByTopicId } from "@/lib/tests/knowledge";
import { ExamTimer, getTimerPresets } from "@/components/exam-timer";
import { getMockPapersForTest } from "@/lib/tests/mock-papers";

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

type TabId = "overview" | "topics" | "plan" | "practice" | "history" | "analysis";

function TestDetailContent({ test }: { test: AdmissionsTest }) {
  const [tab, setTab] = useState<TabId>("overview");

  const tabs: { id: TabId; label: string; labelEn: string }[] = [
    { id: "overview", label: "考试结构", labelEn: "Structure" },
    { id: "topics", label: "知识点模块", labelEn: "Topics" },
    { id: "plan", label: "备考计划", labelEn: "Study Plan" },
    { id: "practice", label: "练习 / 模拟", labelEn: "Practice" },
    ...(test.hasQuestionBank ? [{ id: "history" as TabId, label: "历史记录", labelEn: "History" }] : []),
    ...(test.hasQuestionBank ? [{ id: "analysis" as TabId, label: "学情分析", labelEn: "Analysis" }] : []),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Back */}
      <Link href="/tests" className="text-sm text-neutral-500 hover:text-neutral-800 mb-6 inline-flex items-center gap-1">
        ← 返回考试列表
      </Link>

      {/* Header */}
      <div className="mt-4 mb-8">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-mono text-blue-600 font-bold">{test.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{test.abbr}</h1>
              <p className="text-neutral-500 text-sm">{test.name}</p>
              <p className="text-neutral-400 text-sm">{test.nameZh}</p>
            </div>
          </div>
          {test.hasQuestionBank && (
            <span className="mt-1 text-xs px-3 py-1.5 rounded-full bg-green-100 text-green-700 font-medium">
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
            <div key={f.label} className="rounded-xl bg-neutral-50 border border-neutral-100 p-3 text-center">
              <div className="font-semibold text-sm text-neutral-900">{f.value}</div>
              <div className="text-xs text-neutral-400 mt-0.5">{f.label}</div>
            </div>
          ))}
        </div>

        {/* Universities */}
        <div className="mt-4 flex flex-wrap gap-2">
          {test.universities.map((u) => (
            <span key={u} className="text-xs bg-blue-50 text-blue-700 rounded-full px-2.5 py-0.5">
              {u}
            </span>
          ))}
        </div>

        {/* Programs */}
        <div className="mt-2 flex flex-wrap gap-2">
          {test.programs.map((p, i) => (
            <span key={i} className="text-xs bg-neutral-100 text-neutral-600 rounded-full px-2.5 py-0.5">
              {p}
              <span className="ml-1 text-neutral-400">· {test.programsEn[i]}</span>
            </span>
          ))}
        </div>

        {/* Status note */}
        {test.statusNote && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 leading-relaxed">
            {test.statusNote}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-200 mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              tab === t.id
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {t.label}
            <span className="ml-1 text-xs opacity-60">{t.labelEn}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && <OverviewTab test={test} />}
      {tab === "topics" && <TopicsTab test={test} />}
      {tab === "plan" && <PlanTab test={test} />}
      {tab === "practice" && <PracticeTab test={test} />}
      {tab === "history" && <HistoryTab test={test} />}
      {tab === "analysis" && <AnalysisTab test={test} />}
    </div>
  );
}

function OverviewTab({ test }: { test: AdmissionsTest }) {
  return (
    <div className="space-y-6">
      <Section title="考试简介" titleEn="Overview">
        <p className="text-sm text-neutral-700 leading-relaxed">{test.overview}</p>
      </Section>

      <Section title="考试格式" titleEn="Format">
        <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-4 space-y-3">
          <div>
            <div className="text-xs text-neutral-400 mb-1">官方格式（英文）</div>
            <p className="text-sm font-mono text-neutral-700">{test.format}</p>
          </div>
          <div>
            <div className="text-xs text-neutral-400 mb-1">格式说明（中文）</div>
            <p className="text-sm text-neutral-700 leading-relaxed">{test.formatZh}</p>
          </div>
        </div>
      </Section>

      <Section title="结构详解" titleEn="Structure Details">
        <p className="text-sm text-neutral-700 leading-relaxed">{test.structureDetails}</p>
      </Section>

      <Section title="评分说明" titleEn="Scoring">
        <p className="text-sm text-neutral-700 leading-relaxed">{test.scoringNote}</p>
      </Section>

      <Section title="备考关键建议" titleEn="Key Tips">
        <ul className="space-y-2">
          {test.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
              <span className="text-blue-500 shrink-0 mt-0.5">▸</span>
              {tip}
            </li>
          ))}
        </ul>
      </Section>

      <div className="flex gap-3">
        <a
          href={test.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          报名官网 ↗
        </a>
        <a
          href={test.officialSampleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg border border-neutral-300 text-sm font-medium hover:bg-neutral-50"
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
      <p className="text-sm text-neutral-500 mb-4">
        以下知识点模块是 {test.abbr} 考试范围的核心分类。点击「学习讲解」查看知识点阐述与例题精讲。
      </p>
      {test.topics.map((topic, i) => {
        const hasLearn = !!getKnowledgeByTopicId(topic.id);
        return (
          <div key={topic.id} className="rounded-xl border border-neutral-200 p-4 flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 text-sm font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-neutral-900">{topic.title}</span>
                  <span className="text-xs text-neutral-400">{topic.titleEn}</span>
                </div>
                {hasLearn && (
                  <Link
                    href={`/tests/${test.id}/learn/${topic.id}`}
                    className="shrink-0 text-xs px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition font-medium"
                  >
                    学习讲解 →
                  </Link>
                )}
              </div>
              <p className="text-sm text-neutral-600 mt-1 leading-relaxed">{topic.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PlanTab({ test }: { test: AdmissionsTest }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-500">
        以下是针对 {test.abbr} 的系统备考计划，可根据自己距考试的时间弹性调整。
        考试通常在 10–11 月，Year 13 开学（9 月）应开始密集备考。
      </p>
      {test.studyPlan.map((phase, i) => (
        <div key={i} className="rounded-xl border border-neutral-200 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 border-b border-neutral-200">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </div>
            <div>
              <span className="font-semibold text-sm">{phase.week}</span>
              <span className="ml-2 text-sm text-neutral-600">· {phase.focus}</span>
            </div>
          </div>
          <ul className="px-4 py-3 space-y-1.5">
            {phase.tasks.map((task, j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-neutral-700">
                <span className="text-neutral-300 shrink-0 mt-0.5">○</span>
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
  if (!test.hasQuestionBank) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">{test.icon}</div>
        <h3 className="font-semibold text-neutral-700 mb-2">{test.abbr} 练习材料</h3>
        <p className="text-sm text-neutral-500 mb-6 max-w-md mx-auto">
          {test.abbr} 目前以官方资料 + 备考计划为主要备考方式。
          AI 题库正在规划中，将覆盖 {test.topics.slice(0, 3).map((t) => t.title).join("、")} 等知识点。
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href={test.officialSampleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            前往官方样题 ↗
          </a>
        </div>
        <div className="mt-8 rounded-xl border border-neutral-200 p-5 text-left max-w-md mx-auto">
          <h4 className="font-semibold text-sm mb-3 text-neutral-700">推荐备考资源</h4>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li className="flex gap-2">
              <span className="text-blue-500">→</span>
              历年真题（官网免费下载）
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500">→</span>
              官方备考指南（Specification）
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500">→</span>
              本站备考计划（见「备考计划」标签）
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-4">
        <h3 className="font-semibold text-green-800 mb-1">✦ {test.abbr} AI 题库</h3>
        <p className="text-sm text-green-700">
          题库由 Claude AI 生成初稿，经多 AI 组合审核。数学大题支持分步评分（按解题步骤给部分分）。
        </p>
      </div>

      {/* Topic practice — full list, each row is a direct link */}
      <div className="rounded-xl border border-neutral-200 p-5">
        <div className="flex items-baseline justify-between mb-3">
          <h4 className="font-semibold">知识点专项练习</h4>
          <Link
            href={`/tests/${test.id}/practice`}
            className="text-xs text-blue-600 hover:underline"
          >
            随机混合练习 →
          </Link>
        </div>
        <p className="text-sm text-neutral-500 mb-3">点击任意模块直接开始该知识点练习</p>
        <div className="space-y-1.5">
          {test.topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/tests/${test.id}/practice?topic=${topic.id}`}
              className="flex items-center justify-between text-sm rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2.5 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition group"
            >
              <span className="font-medium">{topic.title}</span>
              <span className="text-xs text-neutral-400 group-hover:text-blue-500">{topic.titleEn} →</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mock exam */}
      <div className="rounded-xl border border-neutral-200 p-5">
        <h4 className="font-semibold mb-2">计时模拟考试</h4>
        <p className="text-sm text-neutral-500 mb-4">
          模拟真实考试环境：计时、题目随机组合、结束后详细分析。
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-neutral-600">
            <span>模拟时长</span>
            <span className="font-medium">{test.duration}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>题目数量</span>
            <span className="font-medium">按真实考试题量</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>评分方式</span>
            <span className="font-medium">AI 分步评分</span>
          </div>
        </div>
        <Link
          href={`/tests/${test.id}/mock`}
          className="mt-4 block w-full py-2.5 rounded-lg border border-blue-600 text-blue-600 text-sm font-medium hover:bg-blue-50 transition text-center"
        >
          开始模拟考试 →
        </Link>
      </div>

      {/* 完整模拟卷 */}
      {getMockPapersForTest(test.id).length > 0 && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-4">
          <h4 className="font-semibold text-indigo-900 text-sm mb-1">📝 完整模拟卷（计时考试）</h4>
          <p className="text-xs text-indigo-700 mb-3">
            按真实考试结构组卷、分模块独立计时、全新原创题（未在练习中出现），模拟真实考场。
          </p>
          <div className="space-y-2">
            {getMockPapersForTest(test.id).map((paper) => (
              <Link
                key={paper.id}
                href={`/tests/${test.id}/paper/${paper.id}`}
                className="flex items-center justify-between rounded-lg border border-indigo-200 bg-white px-3 py-2.5 hover:bg-indigo-50 transition group"
              >
                <div>
                  <span className="text-sm font-medium text-indigo-900">{paper.title}</span>
                  <p className="text-xs text-indigo-500 mt-0.5">
                    {paper.modules.map((m) => `${m.title} ${Math.round(m.durationSec / 60)}分钟`).join(" · ")}
                  </p>
                </div>
                <span className="text-indigo-400 text-sm group-hover:text-indigo-700">开始 →</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Past papers */}
      <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-4">
        <h4 className="font-semibold text-amber-900 text-sm mb-2">
          {test.pastPaperLinks ? "历年真题 — 模拟考试材料" : "官方历年真题"}
        </h4>
        <p className="text-xs text-amber-700 mb-3">
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
                className="flex items-center justify-between rounded-lg border border-amber-200 bg-white px-3 py-2 hover:bg-amber-50 transition group"
              >
                <div>
                  <span className="text-xs font-medium text-amber-900">{link.label}</span>
                  {link.note && (
                    <p className="text-xs text-amber-600 mt-0.5">{link.note}</p>
                  )}
                </div>
                <span className="text-amber-400 text-xs group-hover:text-amber-700">↗</span>
              </a>
            ))}
          </div>
        ) : (
          <a
            href={test.officialSampleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-700 text-white text-xs font-medium hover:bg-amber-800 transition"
          >
            前往官方真题页面 ↗
          </a>
        )}
      </div>

      {/* 独立计时器：对照官方真题 PDF 限时作答 */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/40 px-4 py-4">
        <h4 className="font-semibold text-neutral-800 text-sm mb-1">⏱️ 限时计时器</h4>
        <p className="text-xs text-neutral-500 mb-3">
          打开上方官方真题 PDF，选择对应时长开始计时，模拟真实考场节奏（不查资料、一次做完）。
        </p>
        <ExamTimer presets={getTimerPresets(test.id)} />
      </div>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-500">
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
      <div className="text-center py-16 text-neutral-500">
        <p className="text-lg mb-2">⚠️ {error}</p>
        {error.includes("登录") && (
          <Link href="/login" className="mt-3 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-sm">
            前往登录
          </Link>
        )}
      </div>
    );
  }

  if (!sessions) {
    return <div className="text-center py-16 text-neutral-400 text-sm">加载中…</div>;
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 text-neutral-400">
        <p className="text-5xl mb-4">📋</p>
        <p>还没有练习记录</p>
        <div className="flex gap-3 justify-center mt-6">
          <Link href={`/tests/${test.id}/practice`} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm">
            开始练习
          </Link>
          <Link href={`/tests/${test.id}/mock`} className="px-4 py-2 rounded-lg border border-neutral-300 text-sm">
            开始模拟考试
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-500 mb-4">最近 {sessions.length} 次练习记录</p>
      {sessions.map((s) => {
        const pct = s.totalMax > 0 ? Math.round((s.totalEarned / s.totalMax) * 100) : 0;
        return (
          <Link
            key={s.id}
            href={`/tests/${test.id}/history/${s.id}`}
            className="flex items-center gap-4 rounded-xl border border-neutral-200 px-4 py-3 bg-white hover:border-blue-300 hover:bg-blue-50/40 transition"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              pct >= 80 ? "bg-green-100 text-green-700" :
              pct >= 60 ? "bg-amber-100 text-amber-700" :
              "bg-red-100 text-red-600"
            }`}>
              {pct}%
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                  {s.mode === "mock" ? "模拟考试" : "专项练习"}
                </span>
                <span className="text-xs text-neutral-400">{fmt(s.createdAt)}</span>
              </div>
              <div className="text-sm font-medium mt-0.5">
                {s.totalEarned}/{s.totalMax} 分 · {s._count.answers} 题
                {s.timeUsedSec && <span className="text-xs text-neutral-400 ml-2">用时 {fmtTime(s.timeUsedSec)}</span>}
              </div>
            </div>
            <span className="text-neutral-300 shrink-0">›</span>
          </Link>
        );
      })}
    </div>
  );
}

interface TopicStat {
  topicId: string;
  title: string;
  earned: number;
  max: number;
  count: number;
  accuracy: number;
}

function AnalysisTab({ test }: { test: AdmissionsTest }) {
  const [data, setData] = useState<{ topics: TopicStat[]; totalAnswered: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/exam-sessions/stats?testId=${test.id}`)
      .then((r) => {
        if (r.status === 401) throw new Error("请先登录查看学情分析");
        if (!r.ok) throw new Error("加载失败");
        return r.json() as Promise<{ topics: TopicStat[]; totalAnswered: number }>;
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, [test.id]);

  if (error) {
    return (
      <div className="text-center py-16 text-neutral-500">
        <p className="text-lg mb-2">⚠️ {error}</p>
        {error.includes("登录") && (
          <Link href="/login" className="mt-3 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-sm">
            前往登录
          </Link>
        )}
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-16 text-neutral-400 text-sm">加载中…</div>;
  }

  if (data.topics.length === 0) {
    return (
      <div className="text-center py-16 text-neutral-400">
        <p className="text-5xl mb-4">📊</p>
        <p>还没有足够的练习数据</p>
        <p className="text-sm mt-1">完成一些练习或模拟后，这里会按知识点显示你的正确率和薄弱点。</p>
        <Link href={`/tests/${test.id}/practice`} className="mt-6 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-sm">
          开始练习
        </Link>
      </div>
    );
  }

  const weakest = data.topics.filter((t) => t.accuracy < 0.6).slice(0, 3);

  return (
    <div className="space-y-6">
      <p className="text-sm text-neutral-500">
        基于你累计作答的 {data.totalAnswered} 道题，按知识点统计正确率（由低到高排列）。
      </p>

      {weakest.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-semibold text-amber-800 mb-2">🎯 建议优先突破</h3>
          <div className="flex flex-wrap gap-2">
            {weakest.map((t) => (
              <Link
                key={t.topicId}
                href={`/tests/${test.id}/practice?topic=${t.topicId}`}
                className="text-sm px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-800 hover:bg-amber-100"
              >
                {t.title}（{Math.round(t.accuracy * 100)}%）→ 去练习
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {data.topics.map((t) => {
          const pct = Math.round(t.accuracy * 100);
          const barColor = pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500";
          return (
            <div key={t.topicId} className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-neutral-800">{t.title}</span>
                <span className="text-xs text-neutral-500">
                  {t.earned}/{t.max} 分 · {t.count} 题 · <span className="font-semibold">{pct}%</span>
                </span>
              </div>
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-2 text-right">
                <Link
                  href={`/tests/${test.id}/practice?topic=${t.topicId}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  专项练习 →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
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
        <h3 className="font-semibold text-neutral-800">{title}</h3>
        <span className="text-xs text-neutral-400">{titleEn}</span>
      </div>
      {children}
    </div>
  );
}
