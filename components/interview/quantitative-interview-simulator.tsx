"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, ChevronRight, Clock3, RotateCcw, Sparkles } from "lucide-react";
import type { QuantitativeInterviewDrill } from "@/lib/interview/quantitative-interview";
import { scoreQuantitativeResponse } from "@/lib/interview/quantitative-interview";
import type { InterviewProcessSkillId } from "@/lib/interview/quantitative-interview-review";
import { InterviewThinkingChecklist } from "./interview-thinking-checklist";
import { clearRemoteProgress, loadLearningRecords, saveLearningRecord, saveRemoteProgress } from "@/lib/learning/client";

type Phase = "intro" | "main" | "follow-up" | "result";
type Attempt = { id: string; drillId: string; completedAt: string; score: number; max: number; weakestSkillId?: InterviewProcessSkillId };

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function readAttempts(key: string): Attempt[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as Attempt[];
  } catch {
    return [];
  }
}

export function QuantitativeInterviewSimulator({
  subjectName,
  drills,
}: {
  subjectName: string;
  drills: QuantitativeInterviewDrill[];
}) {
  const storageKey = `alevel:quantitative-interview:${subjectName}:v1`;
  const [phase, setPhase] = useState<Phase>("intro");
  const [drillIndex, setDrillIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [response, setResponse] = useState("");
  const [followUpResponse, setFollowUpResponse] = useState("");
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [retryFocus, setRetryFocus] = useState<InterviewProcessSkillId | null>(null);

  const drill = drills[drillIndex];
  const score = useMemo(
    () => drill ? scoreQuantitativeResponse(drill, response, followUpResponse) : null,
    [drill, response, followUpResponse],
  );

  useEffect(() => {
    const local = readAttempts(storageKey);
    setAttempts(local);
    void loadLearningRecords<{
      resourceId: string;
      score: number | null;
      maxScore: number | null;
      weakestSkillId?: InterviewProcessSkillId | null;
      attemptKey: string;
      completedAt: string;
    }>("INTERVIEW_DRILL", subjectName).then((records) => {
      const remote = records.map((record): Attempt => ({
        id: record.attemptKey,
        drillId: record.resourceId,
        completedAt: record.completedAt,
        score: record.score ?? 0,
        max: record.maxScore ?? 0,
        weakestSkillId: record.weakestSkillId ?? undefined,
      }));
      const merged = [...remote, ...local].filter((attempt, index, all) => all.findIndex((item) => item.id === attempt.id) === index).slice(0, 8);
      setAttempts(merged);
      window.localStorage.setItem(storageKey, JSON.stringify(merged));
    });
  }, [storageKey, subjectName]);

  useEffect(() => {
    if (phase === "result") window.scrollTo({ top: 0, behavior: "auto" });
  }, [phase]);

  useEffect(() => {
    if ((phase !== "main" && phase !== "follow-up") || secondsLeft <= 0) return;
    const timer = window.setInterval(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [phase, secondsLeft]);

  useEffect(() => {
    if (secondsLeft !== 0 || !drill) return;
    if (phase === "main") {
      setPhase("follow-up");
      setSecondsLeft(drill.followUpSec);
    }
  }, [drill, phase, secondsLeft]);

  if (!drill) return null;

  function start(index = drillIndex, focus: InterviewProcessSkillId | null = null) {
    setDrillIndex(index);
    setResponse("");
    setFollowUpResponse("");
    setFeedback("");
    setRetryFocus(focus);
    setPhase("main");
    setSecondsLeft(drills[index].timeLimitSec);
    void saveRemoteProgress({
      kind: "INTERVIEW_DRILL",
      resourceId: drills[index].id,
      payload: { subjectName, phase: "main", retryFocus: focus },
      startedAt: new Date().toISOString(),
      mode: "interview",
    });
  }

  function submitMain() {
    setPhase("follow-up");
    setSecondsLeft(drill.followUpSec);
  }

  function submitFollowUp() {
    const result = scoreQuantitativeResponse(drill, response, followUpResponse);
    const attempt: Attempt = {
      id: `${drill.id}-${Date.now()}`,
      drillId: drill.id,
      completedAt: new Date().toISOString(),
      score: result.total,
      max: result.max,
      weakestSkillId: result.review.weakest.id,
    };
    const nextAttempts = [attempt, ...attempts].slice(0, 8);
    setAttempts(nextAttempts);
    window.localStorage.setItem(storageKey, JSON.stringify(nextAttempts));
    void clearRemoteProgress("INTERVIEW_DRILL", drill.id);
    void saveLearningRecord({
      kind: "INTERVIEW_DRILL",
      resourceId: drill.id,
      subject: subjectName,
      score: result.total,
      maxScore: result.max,
      weakestSkillId: result.review.weakest.id,
      attemptKey: attempt.id,
      completedAt: attempt.completedAt,
      payload: { response, followUpResponse, retryFocus },
    });
    setPhase("result");
    setSecondsLeft(0);
  }

  async function requestFeedback() {
    if (feedbackLoading || !score) return;
    setFeedbackLoading(true);
    try {
      const result = await fetch("/api/interview-mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "feedback",
          subject: `${subjectName} 高压定量面试：${drill.title}`,
          history: [
            { role: "interviewer", content: drill.prompt },
            { role: "student", content: response || "（未作答）" },
            { role: "interviewer", content: drill.followUp },
            { role: "student", content: followUpResponse || "（未作答）" },
          ],
        }),
      });
      const data = await result.json();
      setFeedback(result.ok ? data.feedback : data.error || "暂时无法生成 AI 复盘。");
    } catch {
      setFeedback("网络连接失败；过程评分和训练记录已经保存在本机。");
    } finally {
      setFeedbackLoading(false);
    }
  }

  if (phase === "intro") {
    return (
      <div className="space-y-5">
        <section className="border border-[var(--border)] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--indigo)]">High-pressure quantitative interview</p>
              <h3 className="mt-1 text-xl font-bold text-[var(--ink)]">高压定量面试训练</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">
                面试官会给陌生问题、限制时间，再追加一个改变假设的追问。训练目标是把估算、公式、单位、量级和不确定性同时说出来，而不是只交一个答案。
              </p>
            </div>
            <Sparkles className="mt-1 hidden size-5 shrink-0 text-[var(--indigo)] sm:block" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["先建模", "变量、假设、简化"],
              ["再计算", "关系式、单位、量级"],
              ["最后防守", "追问、边界、修正"],
            ].map(([title, detail]) => (
              <div key={title} className="border-l-2 border-[var(--indigo)]/30 pl-3"><p className="text-sm font-semibold text-[var(--ink)]">{title}</p><p className="mt-1 text-xs text-[var(--ink-soft)]">{detail}</p></div>
            ))}
          </div>
        </section>

        <section className="border-y border-[var(--border)] py-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><h4 className="font-semibold text-[var(--ink)]">本轮训练题</h4><p className="mt-1 text-xs text-[var(--ink-faint)]">题目会覆盖 {subjectName} 相关的计算与建模迁移。</p></div>
            <span className="text-xs text-[var(--ink-faint)]">已完成 {attempts.length} 次</span>
          </div>
          <div className="mt-3 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {drills.map((item, index) => (
              <button key={item.id} type="button" onClick={() => start(index)} className="flex w-full items-center justify-between gap-3 py-3 text-left hover:bg-[var(--surface)]">
                <span className="min-w-0"><span className="block truncate text-sm font-medium text-[var(--ink)]">{index + 1}. {item.title}</span><span className="mt-0.5 block text-xs text-[var(--ink-faint)]">{item.discipline} · {item.pressure} · {formatTime(item.timeLimitSec)} + 追问</span></span>
                <ChevronRight className="size-4 shrink-0 text-[var(--ink-faint)]" />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => start(Math.floor(Math.random() * drills.length))} className="btn btn-primary mt-4">
            随机开始一题 <ChevronRight className="size-4" />
          </button>
        </section>

        {attempts.length > 0 && (
          <section className="border-t border-[var(--border)] pt-4">
            <h4 className="text-sm font-semibold text-[var(--ink)]">最近训练</h4>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {attempts.slice(0, 4).map((attempt) => {
                const item = drills.find((candidate) => candidate.id === attempt.drillId);
                return <div key={attempt.id} className="flex items-center justify-between gap-3 border border-[var(--border)] px-3 py-2 text-xs"><span className="min-w-0 truncate text-[var(--ink-soft)]">{item?.title ?? attempt.drillId}</span><span className="shrink-0 text-[var(--ink-faint)]">{attempt.weakestSkillId ? `优先重练：${score?.review.skills.find((skill) => skill.id === attempt.weakestSkillId)?.shortLabel ?? attempt.weakestSkillId}` : "旧记录"}</span><strong className="shrink-0 text-[var(--ink)]">{attempt.score}/{attempt.max}</strong></div>;
              })}
            </div>
          </section>
        )}
      </div>
    );
  }

  if (phase === "result" && score) {
    return (
      <div className="space-y-5">
        <section className="border-l-4 border-[var(--success)] bg-[var(--success-bg)] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase text-[var(--success)]">训练评分，不代表院校评分</p><h3 className="mt-1 text-lg font-bold text-[var(--ink)]">{score.band}</h3></div><strong className="text-3xl text-[var(--ink)]">{score.total}<span className="text-base font-normal text-[var(--ink-soft)]">/{score.max}</span></strong></div>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">{drill.title} · 主问题与追问都已记录。下一轮要优先补齐没有通过的过程环节。</p>
        </section>
        <section className="border-y border-[var(--border)] py-4">
          <h4 className="font-semibold text-[var(--ink)]">过程检查</h4>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {score.review.skills.map((skill) => <div key={skill.id} className={`border p-3 ${skill.id === score.review.weakest.id ? "border-[var(--indigo)]/50 bg-[var(--info-bg)]" : "border-[var(--border)]"}`}><div className="flex items-start gap-2"><span className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full ${skill.passed ? "bg-[var(--success-bg)] text-[var(--success)]" : "bg-[var(--surface)] text-[var(--ink-faint)]"}`}>{skill.passed ? <Check className="size-3" /> : <span className="size-1.5 rounded-full bg-current" />}</span><span><strong className="block text-sm text-[var(--ink)]">{skill.label}</strong><span className="mt-0.5 block text-xs text-[var(--ink-soft)]">{skill.evidence.length > 0 ? `识别到证据：${skill.evidence[0]}` : skill.missing}</span></span></div>{!skill.passed && <p className="mt-2 border-t border-[var(--border)] pt-2 text-xs leading-relaxed text-[var(--indigo)]">下一次：{skill.nextAction}</p>}</div>)}
          </div>
        </section>
        <section className="space-y-3">
          <details className="border border-[var(--border)] bg-white p-4"><summary className="cursor-pointer text-sm font-semibold text-[var(--ink)]">查看面试官期待的思路</summary><div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--ink-soft)]"><div><p className="font-semibold text-[var(--ink)]">主问题目标</p><p className="mt-1">{drill.target}</p></div><div><p className="font-semibold text-[var(--ink)]">追问目标</p><p className="mt-1">{drill.followUpTarget}</p></div><div><p className="font-semibold text-[var(--ink)]">推荐思路</p><p className="mt-1">{drill.approach}</p></div></div><p className="mt-3 flex gap-2 text-sm text-[var(--danger)]"><AlertTriangle className="mt-0.5 size-4 shrink-0" />常见失分点：{drill.commonTrap}</p></details>
          {!feedback ? <button type="button" onClick={requestFeedback} disabled={feedbackLoading} className="btn btn-secondary"><Sparkles className="size-4" />{feedbackLoading ? "正在生成 AI 复盘…" : "生成 AI 追问复盘"}</button> : <div className="whitespace-pre-wrap border border-[var(--indigo)]/30 bg-[var(--info-bg)] p-4 text-sm leading-relaxed text-[var(--ink)]">{feedback}</div>}
        </section>
        <div className="flex flex-wrap gap-2"><button type="button" onClick={() => start(drillIndex, score.review.weakest.id)} className="btn btn-primary">重练最弱环节 <RotateCcw className="size-4" /></button><button type="button" onClick={() => start((drillIndex + 1) % drills.length)} className="btn btn-secondary">下一道压力题 <ChevronRight className="size-4" /></button><button type="button" onClick={() => setPhase("intro")} className="btn btn-secondary">返回训练列表</button></div>
      </div>
    );
  }

  const isMain = phase === "main";
  return (
    <div className="border border-[var(--border)] bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] p-4">
        <div><p className="text-xs font-semibold uppercase text-[var(--indigo)]">{drill.discipline} · {drill.pressure}</p><p className="mt-1 text-sm text-[var(--ink-soft)]">{isMain ? "主问题：先把模型和计算说完整" : "追问：改变一个条件，修正你的模型"}</p></div>
        <div className={`flex items-center gap-2 font-mono text-lg font-bold ${secondsLeft <= 30 ? "text-[var(--danger)]" : "text-[var(--ink)]"}`}><Clock3 className="size-4" />{formatTime(secondsLeft)}</div>
      </header>
      <div className="h-1 bg-[var(--surface)]"><div className="h-full bg-[var(--indigo)] transition-all" style={{ width: `${Math.max(0, (secondsLeft / (isMain ? drill.timeLimitSec : drill.followUpSec)) * 100)}%` }} /></div>
      <div className="space-y-5 p-4 sm:p-6">
        <InterviewThinkingChecklist emphasis={isMain ? ["model", "method", "calculation", "check"] : ["adapt"]} />
        {retryFocus && <p className="border-l-2 border-[var(--indigo)] bg-[var(--info-bg)] px-3 py-2 text-sm text-[var(--indigo)]">本轮重练重点：{score?.review.skills.find((skill) => skill.id === retryFocus)?.label ?? retryFocus}。先补这一环，再追求答案速度。</p>}
        <div><p className="text-xs font-semibold text-[var(--ink-faint)]">{drill.title}</p><p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{drill.setup}</p><p className="mt-3 text-lg font-semibold leading-relaxed text-[var(--ink)]">{isMain ? drill.prompt : drill.followUp}</p></div>
        <div className="grid gap-2 sm:grid-cols-4">{["先建模", "计算链", "单位与量纲", "量级复核"].map((label, index) => <div key={label} className={`border-l-2 pl-2 text-xs ${index === 0 && isMain ? "border-[var(--indigo)] text-[var(--ink)]" : "border-[var(--border)] text-[var(--ink-faint)]"}`}>{label}</div>)}</div>
        <label className="block"><span className="mb-2 block text-sm font-medium text-[var(--ink)]">{isMain ? "把你的思路打出来" : "回答追问，并说明哪一个假设被改变"}</span><textarea autoFocus value={isMain ? response : followUpResponse} onChange={(event) => isMain ? setResponse(event.target.value) : setFollowUpResponse(event.target.value)} className="input min-h-56 w-full resize-y" placeholder="写出假设、关系式、单位、估算和检查。面试训练看过程，不只看最后一个数字。" /></label>
        <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-[var(--ink-faint)]">主问题计时结束会自动进入追问；追问阶段请提交，空白提交也会被记录。</span><button type="button" onClick={isMain ? submitMain : submitFollowUp} className="btn btn-primary">{isMain ? "提交主问题，进入追问" : "完成本轮并查看过程评分"}<ChevronRight className="size-4" /></button></div>
      </div>
    </div>
  );
}
