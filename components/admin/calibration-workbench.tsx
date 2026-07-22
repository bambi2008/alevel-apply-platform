"use client";

import { useMemo, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import type { DetailedQuestionCalibration } from "@/lib/tests/audit/calibration";
import type { CalibrationDecisionView, QuestionAuditDashboardData } from "@/lib/tests/audit/server";

const statusText = { insufficient: "样本不足", "in-range": "符合标签", "easier-than-label": "实际偏易", "harder-than-label": "实际偏难" };
const flagText: Record<string, string> = { "low-discrimination": "区分度低", "too-fast": "作答过快", "weak-distractors": "干扰项弱", "low-telemetry-coverage": "行为数据不足" };
const pct = (value: number) => `${Math.round(value * 100)}%`;

export function CalibrationWorkbench({ calibration, decisions, dataHealth, message }: {
  calibration: DetailedQuestionCalibration[];
  decisions: CalibrationDecisionView[];
  dataHealth: QuestionAuditDashboardData["dataHealth"];
  message?: string;
}) {
  const [testId, setTestId] = useState("all");
  const [status, setStatus] = useState("actionable");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tests = useMemo(() => [...new Set(calibration.map((item) => item.testId))].sort(), [calibration]);
  const latestDecision = useMemo(() => new Map(decisions.map((decision) => [decision.questionId, decision])), [decisions]);
  const rows = calibration.filter((item) => {
    if (testId !== "all" && item.testId !== testId) return false;
    if (status === "actionable") return item.status === "easier-than-label" || item.status === "harder-than-label" || item.qualityFlags.length > 0;
    return status === "all" || item.status === status;
  });

  async function decide(action: "approve" | "dismiss" | "rollback", id: string) {
    setBusy(id); setError(null);
    const payload = action === "rollback" ? { action, decisionId: id } : { action, questionId: id };
    const response = await fetch("/api/admin/calibration-decisions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) { const body = await response.json().catch(() => ({})); setError(body.error ?? "操作失败"); setBusy(null); return; }
    window.location.reload();
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="text-base font-semibold text-neutral-950">真实难度校准</h2><p className="mt-0.5 text-xs text-neutral-500">每位学生保留最新作答；30 次作答且至少 20 位学生后才允许决策</p></div>
        <div className="flex gap-2">
          <select value={testId} onChange={(event) => setTestId(event.target.value)} className="h-9 rounded border border-neutral-300 bg-white px-2 text-sm"><option value="all">全部考试</option>{tests.map((test) => <option key={test} value={test}>{test.toUpperCase()}</option>)}</select>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-9 rounded border border-neutral-300 bg-white px-2 text-sm"><option value="actionable">需要处理</option><option value="all">全部状态</option><option value="insufficient">样本不足</option><option value="in-range">符合标签</option><option value="easier-than-label">实际偏易</option><option value="harder-than-label">实际偏难</option></select>
        </div>
      </div>
      <p className="mt-3 text-xs text-neutral-500">{dataHealth.answers} 次作答 · {dataHealth.sessions} 个会话 · {dataHealth.uniqueStudents} 位学生 · 覆盖 {dataHealth.coveredTests} 类考试</p>
      {error && <p className="mt-3 border-l-2 border-red-500 pl-3 text-sm text-red-700">{error}</p>}
      {!calibration.length ? <p className="mt-3 border-y border-neutral-200 px-3 py-5 text-sm text-neutral-500">{message ?? "尚无作答数据。"}</p> : (
        <div className="mt-3 overflow-x-auto border-y border-neutral-200">
          <table className="w-full min-w-[1120px] text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500"><tr><th className="px-3 py-2.5">题目</th><th className="px-3 py-2.5">标签建议</th><th className="px-3 py-2.5">样本</th><th className="px-3 py-2.5">得分率 / 95% CI</th><th className="px-3 py-2.5">区分度</th><th className="px-3 py-2.5">耗时</th><th className="px-3 py-2.5">改答 / 标记</th><th className="px-3 py-2.5">质量信号</th><th className="px-3 py-2.5">操作</th></tr></thead>
            <tbody className="divide-y divide-neutral-100">{rows.slice(0, 200).map((item) => {
              const decision = latestDecision.get(item.questionId);
              const actionable = item.status === "easier-than-label" || item.status === "harder-than-label";
              return <tr key={item.questionId} className="text-neutral-700"><td className="px-3 py-3"><span className="block font-mono text-neutral-950">{item.questionId}</span><span>{item.testId.toUpperCase()} · {item.topicId}</span></td><td className="px-3 py-3"><span className="block">{item.labelledDifficulty} → {item.suggestedDifficulty}</span><span className={actionable ? "text-amber-700" : "text-neutral-500"}>{statusText[item.status]}</span></td><td className="px-3 py-3 tabular-nums">{item.attempts} / {item.uniqueStudents}<span className="block text-neutral-400">{item.confidence} confidence</span></td><td className="px-3 py-3 tabular-nums">{pct(item.scoreRate)}<span className="block text-neutral-400">{pct(item.scoreInterval[0])}–{pct(item.scoreInterval[1])}</span></td><td className="px-3 py-3 tabular-nums">{item.discrimination === null ? "-" : item.discrimination.toFixed(2)}</td><td className="px-3 py-3 tabular-nums">{item.medianTimeSec === null ? "-" : `${item.medianTimeSec}s`}<span className="block text-neutral-400">覆盖 {pct(item.telemetryCoverage)}</span></td><td className="px-3 py-3 tabular-nums">{pct(item.changeRate)} / {pct(item.flagRate)}</td><td className="px-3 py-3">{item.qualityFlags.length ? item.qualityFlags.map((flag) => flagText[flag] ?? flag).join("、") : "正常"}{item.ineffectiveDistractors.length ? <span className="block text-amber-700">弱选项 {item.ineffectiveDistractors.join("/")}</span> : null}</td><td className="px-3 py-3">{decision?.status === "APPROVED" ? <button disabled={busy === decision.id} onClick={() => decide("rollback", decision.id)} title="回滚校准" className="inline-flex h-8 items-center gap-1 rounded border border-neutral-300 px-2 hover:bg-neutral-50"><RotateCcw size={14} />回滚</button> : actionable && item.status !== "insufficient" ? <div className="flex gap-1"><button disabled={busy === item.questionId} onClick={() => decide("approve", item.questionId)} title="批准建议" className="inline-flex size-8 items-center justify-center rounded bg-emerald-600 text-white"><Check size={15} /></button><button disabled={busy === item.questionId} onClick={() => decide("dismiss", item.questionId)} title="忽略建议" className="inline-flex size-8 items-center justify-center rounded border border-neutral-300"><X size={15} /></button></div> : <span className="text-neutral-400">{decision ? decision.status : "等待数据"}</span>}</td></tr>;
            })}</tbody>
          </table>
        </div>
      )}
      {calibration.length > 0 && rows.length === 0 && <p className="border-b border-neutral-200 px-3 py-5 text-sm text-neutral-500">当前筛选条件下没有题目。</p>}
    </section>
  );
}
