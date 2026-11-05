"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import type { PrioritySnapshot } from "@/lib/tests/content-priority";

export default function ContentPrioritiesPage() {
  const locale = useLocale(), english = locale === "en";
  const [snapshot, setSnapshot] = useState<PrioritySnapshot | null>(null);
  const [error, setError] = useState(false);
  const [testId, setTestId] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/content-priorities", { cache: "no-store", signal: controller.signal })
      .then(response => { if (!response.ok) throw Error("unavailable"); return response.json() as Promise<PrioritySnapshot>; })
      .then(value => { if (!controller.signal.aborted) setSnapshot(value); })
      .catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, []);
  const rows = snapshot?.rows.filter(row => !testId || row.testId === testId) ?? [];
  const date = (value: string) => new Date(value).toLocaleString(english ? "en-GB" : "zh-CN", { timeZone: "Asia/Shanghai" });
  return <section>
    <h1 className="text-2xl font-semibold">{english ? "Question-bank priorities" : "补题优先级"}</h1>
    <p className="mt-2 text-sm text-black/70">{english ? "Last 28 days · Compare topics within the same exam only. Fewer than 5 students: no score." : "最近28天 · 只比较同一门考试的考点；作答人数不足5人，不打分。"}</p>
    {error ? <p role="alert" className="mt-6 text-red-800">{english ? "Data unavailable. Refresh to retry; no zero values have been substituted." : "暂时无法读取数据，请刷新重试；未将读取失败当作零数据。"}</p> : !snapshot ? <p role="status" className="py-8">{english ? "Loading…" : "读取中…"}</p> : <>
      <div className="my-6 flex flex-wrap items-end gap-4">
        <label className="text-sm">{english ? "Exam" : "考试"}<select aria-label={english ? "Exam" : "考试"} value={testId} onChange={event => setTestId(event.target.value)} className="ml-2 min-h-11 rounded border border-black/30 bg-white px-3">
          <option value="">{english ? "All exams" : "全部考试"}</option>
          {[...new Set(snapshot.rows.map(row => row.testId))].map(id => <option value={id} key={id}>{id.toUpperCase()}</option>)}
        </select></label>
        <a href={`/api/admin/content-priorities?format=csv&locale=${locale}${testId ? `&testId=${encodeURIComponent(testId)}` : ""}`} className="inline-flex min-h-11 items-center rounded border border-black/30 px-4 text-sm hover:bg-white" download>{english ? "Export spreadsheet (CSV)" : "一键导出表格（CSV）"}</a>
        <p className="text-xs text-black/65">{date(snapshot.windowStart)} — {date(snapshot.windowEnd)} (Asia/Shanghai)</p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-black/20">
        <table className="w-full whitespace-nowrap text-left text-sm">
          <caption className="sr-only">{english ? "Aggregate topic-priority measurements; no individual student records" : "考点汇总数据，不含学生个人记录"}</caption>
          <thead className="bg-black/5"><tr>{(english ? ["Exam", "Topic", "Questions", "Students", "Attempts", "Error rate", "Feedback", "Priority"] : ["考试", "考点", "题量", "作答人数", "作答次数", "错误率", "反馈数", "优先级分"]).map(label => <th key={label} scope="col" className="p-3 font-semibold">{label}</th>)}</tr></thead>
          <tbody>{rows.map(row => <tr key={`${row.testId}:${row.topicId}`} className="border-t border-black/15">
            <td className="p-3">{row.testId.toUpperCase()}</td><th scope="row" className="p-3 font-medium">{english ? row.titleEn : row.title}</th><td className="p-3">{row.questionCount}</td>
            {row.status === "insufficient_sample" ? <td colSpan={5} className="p-3 text-black/65">{english ? "Insufficient sample" : "样本不足"}</td> : <>
              <td className="p-3">{row.students}</td><td className="p-3">{row.attempts}</td><td className="p-3">{row.errorRate === null ? "—" : `${(row.errorRate * 100).toFixed(1)}%`}</td><td className="p-3">{row.feedbackCount}</td><td className="p-3 font-semibold">{row.score === null ? english ? "Awaiting scores" : "评分不足" : row.score.toFixed(1)}</td>
            </>}
          </tr>)}</tbody>
        </table>
      </div>
      {rows.length === 0 && <p className="py-5 text-sm">{english ? "No topics in this view." : "当前筛选下没有考点。"}</p>}
      <details className="mt-6 text-sm text-black/70"><summary className="inline-flex min-h-11 cursor-pointer items-center underline">{english ? "How the score works" : "评分口径"}</summary>
        <p className="mt-2 leading-7">{english ? "40% distinct students + 25% error rate + 20% feedback + 15% question scarcity. Components are normalised within each exam. The attempts column includes repeat answers. Error rate uses each student's first answer to each question and excludes unscored or uncertain written work. Session feedback counts once per kind for the selected question's topic or each topic in the set. Historical feedback is kept. CSV includes topic totals and masks small samples." : "40%作答人数 + 25%错误率 + 20%反馈数 + 15%题量稀缺度。各项在同考试内归一化。作答次数含重复作答。错误率按每名学生对每道题的首次作答计算，排除未评分或评分存疑的书面作答。整套反馈每种计一次，归入所选题的考点，或归入本套题涉及的各考点。旧反馈继续统计。CSV 只含考点汇总，并隐藏小样本数据。"}</p>
      </details>
    </>}
  </section>;
}
