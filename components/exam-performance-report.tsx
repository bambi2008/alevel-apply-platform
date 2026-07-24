"use client";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Clock3,
  Gauge,
  Printer,
  RotateCcw,
  Target,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { DiagnosisSummary } from "@/components/exam-diagnosis";
import type { ExamPerformanceReport } from "@/lib/tests/report";

const confidenceLabel = { low: "初步", medium: "中等", high: "较高" };
const timeStatusLabel = { unknown: "数据不足", comfortable: "时间充足", balanced: "节奏合理", pressured: "时间承压" };

function minutes(seconds: number | null) {
  return seconds === null ? "—" : `${Math.round(seconds / 60)} 分钟`;
}

function TrendIcon({ direction }: { direction: ExamPerformanceReport["trend"]["direction"] }) {
  if (direction === "up") return <ArrowUpRight className="size-4 text-emerald-600" />;
  if (direction === "down") return <ArrowDownRight className="size-4 text-red-600" />;
  return <ArrowRight className="size-4 text-neutral-500" />;
}

function TrendChart({ report }: { report: ExamPerformanceReport }) {
  const points = report.trend.points;
  if (points.length < 2) {
    return <p className="py-8 text-center text-sm text-neutral-500">完成第二次可比练习后显示趋势。</p>;
  }
  const coordinates = points.map((point, index) => ({
    ...point,
    x: points.length === 1 ? 300 : 30 + (index / (points.length - 1)) * 540,
    y: 145 - point.percent * 1.25,
  }));
  return (
    <div>
      <svg viewBox="0 0 600 160" className="h-44 w-full" role="img" aria-label="历次可比练习得分率趋势">
        {[25, 50, 75].map((value) => <line key={value} x1="30" x2="570" y1={145 - value * 1.25} y2={145 - value * 1.25} stroke="#e5e5e5" strokeWidth="1" />)}
        <polyline points={coordinates.map((point) => `${point.x},${point.y}`).join(" ")} fill="none" stroke="#2563eb" strokeWidth="3" />
        {coordinates.map((point) => <circle key={point.id} cx={point.x} cy={point.y} r={point.current ? 7 : 5} fill={point.current ? "#1d4ed8" : "#ffffff"} stroke="#2563eb" strokeWidth="2" />)}
      </svg>
      <div className="flex justify-between text-[11px] text-neutral-400">
        <span>{new Date(points[0].date).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" })}</span>
        <span>{new Date(points.at(-1)!.date).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" })}</span>
      </div>
    </div>
  );
}

export function ExamPerformanceReportView({ report }: { report: ExamPerformanceReport }) {
  const trendText = report.trend.delta === null
    ? "首份可比报告"
    : `${report.trend.delta > 0 ? "+" : ""}${report.trend.delta} 个百分点`;
  const dataCoverage = report.dataQuality.totalQuestions
    ? Math.round((report.dataQuality.matchedQuestions / report.dataQuality.totalQuestions) * 100)
    : 0;

  return (
    <div className="space-y-10 print:space-y-7">
      <header className="border-b border-neutral-200 pb-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-blue-700">Performance report</p>
            <h1 className="mt-2 text-2xl font-bold text-neutral-950">模考成绩报告与能力画像</h1>
            <p className="mt-1 text-sm text-neutral-500">证据来自本次得分、逐题行为和可比历史记录</p>
          </div>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-50 print:hidden">
            <Printer className="size-4" />打印报告
          </button>
        </div>

        <div className="mt-7 grid gap-px overflow-hidden rounded-md border border-neutral-200 bg-neutral-200 sm:grid-cols-4">
          <div className="bg-white p-4">
            <strong className="block text-3xl text-blue-700">{report.score.percent}%</strong>
            <span className="text-xs text-neutral-500">{report.score.earned}/{report.score.max} 分</span>
          </div>
          <div className="bg-white p-4">
            <strong className="block text-2xl">{report.score.completionPercent}%</strong>
            <span className="text-xs text-neutral-500">完成度 · {report.score.completedQuestions}/{report.score.totalQuestions} 题</span>
          </div>
          <div className="bg-white p-4">
            <strong className="block text-2xl">{minutes(report.time.usedSec)}</strong>
            <span className="text-xs text-neutral-500">{timeStatusLabel[report.time.status]}</span>
          </div>
          <div className="bg-white p-4">
            <div className="flex items-center gap-1"><TrendIcon direction={report.trend.direction} /><strong className="text-2xl">{trendText}</strong></div>
            <span className="text-xs text-neutral-500">相对上次可比练习</span>
          </div>
        </div>
      </header>

      <section aria-labelledby="range-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="range-heading" className="text-base font-bold">训练表现区间</h2>
            <p className="mt-1 text-xs text-neutral-500">{report.performanceBand.methodology}</p>
          </div>
          <span className="text-xs font-medium text-neutral-600">{confidenceLabel[report.performanceBand.confidence]}置信度 · {report.performanceBand.comparableAttempts} 次可比记录</span>
        </div>
        <div className="mt-5">
          <div className="relative h-3 rounded-full bg-neutral-100">
            <div className="absolute h-3 rounded-full bg-blue-200" style={{ left: `${report.performanceBand.low}%`, width: `${Math.max(2, report.performanceBand.high - report.performanceBand.low)}%` }} />
            <div className="absolute -top-1 size-5 -translate-x-1/2 rounded-full border-4 border-white bg-blue-700 shadow" style={{ left: `${report.score.percent}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-neutral-500"><span>{report.performanceBand.low}%</span><strong className="text-blue-700">本次 {report.score.percent}%</strong><span>{report.performanceBand.high}%</span></div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section aria-labelledby="trend-heading">
          <div className="flex items-center gap-2"><BarChart3 className="size-4 text-blue-700" /><h2 id="trend-heading" className="text-base font-bold">表现趋势</h2></div>
          <TrendChart report={report} />
          <p className="mt-2 text-xs leading-5 text-neutral-500">{report.trend.comparability}</p>
        </section>

        <section aria-labelledby="time-heading">
          <div className="flex items-center gap-2"><Clock3 className="size-4 text-blue-700" /><h2 id="time-heading" className="text-base font-bold">时间与作答行为</h2></div>
          <p className="mt-4 text-sm leading-6 text-neutral-700">{report.time.message}</p>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-neutral-200 py-4 text-sm">
            <div><dt className="text-xs text-neutral-500">计划时间</dt><dd className="mt-0.5 font-semibold">{minutes(report.time.plannedSec)}</dd></div>
            <div><dt className="text-xs text-neutral-500">逐题计时覆盖</dt><dd className="mt-0.5 font-semibold">{report.time.telemetryCoverage}%</dd></div>
            <div><dt className="text-xs text-neutral-500">改答次数</dt><dd className="mt-0.5 font-semibold">{report.behavior.changedAnswers}</dd></div>
            <div><dt className="text-xs text-neutral-500">多次回看</dt><dd className="mt-0.5 font-semibold">{report.behavior.revisitedQuestions} 题</dd></div>
            <div><dt className="text-xs text-neutral-500">答对但不稳</dt><dd className="mt-0.5 font-semibold">{report.behavior.fragileCorrect} 题</dd></div>
            <div><dt className="text-xs text-neutral-500">明显过快</dt><dd className="mt-0.5 font-semibold">{report.behavior.rushedQuestions} 题</dd></div>
          </dl>
        </section>
      </div>

      {report.modules.length > 0 && (
        <section aria-labelledby="module-heading">
          <h2 id="module-heading" className="text-base font-bold">分模块表现</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {report.modules.map((module) => (
              <div key={module.id} className="rounded-md border border-neutral-200 p-4">
                <div className="flex items-start justify-between gap-3"><p className="text-sm font-semibold">{module.title}</p><strong className="text-lg">{module.percent}%</strong></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-100"><div className="h-full bg-blue-600" style={{ width: `${module.percent}%` }} /></div>
                <p className="mt-2 text-xs text-neutral-500">{module.earned}/{module.max} 分 · 完成 {module.answered}/{module.total} 题</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="topic-heading">
        <div className="flex items-center gap-2"><Target className="size-4 text-blue-700" /><h2 id="topic-heading" className="text-base font-bold">知识点与难度画像</h2></div>
        <div className="mt-4 overflow-x-auto border-y border-neutral-200">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-neutral-50 text-xs text-neutral-500"><tr><th className="px-3 py-2.5">知识点</th><th className="px-3 py-2.5">题数</th><th className="px-3 py-2.5">平均难度</th><th className="px-3 py-2.5">得分</th><th className="px-3 py-2.5">得分率</th><th className="px-3 py-2.5">优先级</th></tr></thead>
            <tbody className="divide-y divide-neutral-100">{report.topics.map((topic) => (
              <tr key={topic.topicId}><td className="px-3 py-3"><span className="font-medium">{topic.title}</span><span className="ml-2 text-xs text-neutral-400">{topic.titleEn}</span></td><td className="px-3 py-3">{topic.questions}</td><td className="px-3 py-3">{topic.averageDifficulty}</td><td className="px-3 py-3">{topic.earned}/{topic.max}</td><td className="px-3 py-3 font-semibold">{topic.percent}%</td><td className="px-3 py-3">{topic.priority >= 60 ? <span className="text-red-700">优先补强</span> : topic.priority >= 35 ? <span className="text-amber-700">需要巩固</span> : <span className="text-emerald-700">保持</span>}</td></tr>
            ))}</tbody>
          </table>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-neutral-200 bg-neutral-200">
          {report.difficulties.map((row) => <div key={row.difficulty} className="bg-white p-3 text-center"><strong className="block text-xl">{row.percent}%</strong><span className="text-xs text-neutral-500">难度 {row.difficulty} · {row.questions} 题</span></div>)}
        </div>
      </section>

      <DiagnosisSummary diagnosis={report.diagnosis} />

      <section className="break-inside-avoid border-y border-neutral-200 py-7" aria-labelledby="plan-heading">
        <div className="flex items-center gap-2"><Gauge className="size-4 text-blue-700" /><h2 id="plan-heading" className="text-base font-bold">下一轮训练处方</h2></div>
        <div className="mt-4 divide-y divide-neutral-100">
          {report.prescriptions.map((item, index) => (
            <div key={item.id} className="flex items-start gap-3 py-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">{index + 1}</span>
              <div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">{item.title}</h3><p className="mt-1 text-xs leading-5 text-neutral-500">{item.detail}</p></div>
              <Link href={item.href} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-700 hover:underline print:hidden">
                {item.kind === "lesson" ? <BookOpen className="size-3.5" /> : <RotateCcw className="size-3.5" />}开始
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-xs leading-5 text-neutral-500">
        <p>数据完整性：题目匹配 {dataCoverage}% · {report.dataQuality.note}</p>
        {report.dataQuality.missingQuestionIds.length > 0 && <p className="mt-1 text-amber-700">有 {report.dataQuality.missingQuestionIds.length} 道历史题已无法从当前题库还原，相关知识点和错因未计入画像。</p>}
      </footer>
    </div>
  );
}
