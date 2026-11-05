"use client";
import { fetchAiFeedback } from "@/components/ai-remaining";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, RotateCcw } from "lucide-react";
import type { InterviewQuestion } from "@/lib/interview/questions";
import {
  CAMBRIDGE_ASSESSMENT_FLOWS,
  type TimedAssessmentFlow,
} from "@/lib/interview/cambridge-assessment-flows";
import { InterviewThinkingChecklist } from "./interview-thinking-checklist";
import { clearRemoteProgress, loadLearningRecords, saveLearningRecord, saveRemoteProgress } from "@/lib/learning/client";
import { useLocale } from "next-intl";
import { uiCopy } from "@/lib/ui-copy";
import flowLabels from "@/data/ui-copy/interview-flows-en.json";

type Phase = "intro" | "preparation" | "response" | "result";

interface TaskResponse {
  questionId: string;
  notes: string;
  answer: string;
}

interface AssessmentAttempt {
  id: string;
  completedAt: string;
  responses: TaskResponse[];
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function readAttempts(key: string): AssessmentAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as AssessmentAttempt[];
  } catch {
    return [];
  }
}

export function TimedAssessmentSimulator({
  flow,
  subjectName,
  questions,
  showThinkingChecklist = false,
}: {
  flow: TimedAssessmentFlow;
  subjectName: string;
  questions: InterviewQuestion[];
  showThinkingChecklist?: boolean;
}) {
  const locale = useLocale();
  const t = (source: string, ...values: Array<string | number>) => uiCopy(locale, source, ...values);
  // Translate only owned flow metadata, never saved responses or generated feedback.
  const flowText = (text: string) => locale === "en" ? (flowLabels as Record<string, string>)[text] ?? text : text;
  const flowTitle = flowText(flow.title);
  const subjectId = flow.subjectId;
  const storageKey = `alevel:timed-assessment:${subjectId}:v1`;
  const [phase, setPhase] = useState<Phase>("intro");
  const [taskIndex, setTaskIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [notes, setNotes] = useState("");
  const [answer, setAnswer] = useState("");
  const [responses, setResponses] = useState<TaskResponse[]>([]);
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const tasks = useMemo(() => {
    if (!flow) return [];
    return flow.tasks.map((task) => ({
      ...task,
      question: questions.find((question) => question.id === task.questionId),
    })).filter((task): task is typeof task & { question: InterviewQuestion } => !!task.question);
  }, [flow, questions]);
  const current = tasks[taskIndex];
  const totalMinutes = Math.round(
    tasks.reduce((sum, task) => sum + task.preparationSec + task.responseSec, 0) / 60,
  );
  const totalWords = responses.reduce((sum, response) => sum + countWords(response.answer), 0);

  useEffect(() => {
    const local = readAttempts(storageKey);
    setAttempts(local);
    void loadLearningRecords<{
      attemptKey: string;
      completedAt: string;
      payload?: { responses?: TaskResponse[] } | null;
    }>("CAMBRIDGE_ASSESSMENT", subjectName).then((records) => {
      const remote = records.map((record): AssessmentAttempt => ({
        id: record.attemptKey,
        completedAt: record.completedAt,
        responses: record.payload?.responses ?? [],
      }));
      const merged = [...remote, ...local].filter((attempt, index, all) => all.findIndex((item) => item.id === attempt.id) === index).slice(0, 5);
      setAttempts(merged);
      window.localStorage.setItem(storageKey, JSON.stringify(merged));
    });
  }, [storageKey, subjectName]);

  useEffect(() => {
    if ((phase !== "preparation" && phase !== "response") || secondsLeft <= 0) return;
    const timer = window.setInterval(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [phase, secondsLeft]);

  useEffect(() => {
    if (phase === "preparation" && secondsLeft === 0 && current) {
      setPhase("response");
      setSecondsLeft(current.responseSec);
    }
  }, [current, phase, secondsLeft]);

  if (tasks.length === 0) return null;

  function begin() {
    setTaskIndex(0);
    setNotes("");
    setAnswer("");
    setResponses([]);
    setFeedback("");
    setPhase("preparation");
    setSecondsLeft(tasks[0].preparationSec);
    void saveRemoteProgress({
      kind: "CAMBRIDGE_ASSESSMENT",
      resourceId: subjectId,
      payload: { subjectName, phase: "preparation", taskIndex: 0 },
      startedAt: new Date().toISOString(),
      mode: "interview",
    });
  }

  function beginResponse() {
    setPhase("response");
    setSecondsLeft(current.responseSec);
  }

  function submitTask() {
    const nextResponses = [
      ...responses,
      { questionId: current.question.id, notes: notes.trim(), answer: answer.trim() },
    ];
    setResponses(nextResponses);
    setNotes("");
    setAnswer("");

    if (taskIndex === tasks.length - 1) {
      const attempt: AssessmentAttempt = {
        id: `${subjectId}-${Date.now()}`,
        completedAt: new Date().toISOString(),
        responses: nextResponses,
      };
      const nextAttempts = [attempt, ...attempts].slice(0, 5);
      setAttempts(nextAttempts);
      window.localStorage.setItem(storageKey, JSON.stringify(nextAttempts));
      void clearRemoteProgress("CAMBRIDGE_ASSESSMENT", subjectId);
      void saveLearningRecord({
        kind: "CAMBRIDGE_ASSESSMENT",
        resourceId: subjectId,
        subject: subjectName,
        attemptKey: attempt.id,
        completedAt: attempt.completedAt,
        payload: { responses: nextResponses },
      });
      setPhase("result");
      setSecondsLeft(0);
      return;
    }

    const nextIndex = taskIndex + 1;
    setTaskIndex(nextIndex);
    setPhase("preparation");
    setSecondsLeft(tasks[nextIndex].preparationSec);
  }

  async function requestFeedback() {
    if (feedbackLoading) return;
    setFeedbackLoading(true);
    try {
      const history = responses.flatMap((response) => {
        const question = questions.find((item) => item.id === response.questionId);
        return [
          { role: "interviewer" as const, content: question?.prompt ?? response.questionId },
          { role: "student" as const, content: response.answer || "(no response)" },
        ];
      });
      const response = await fetchAiFeedback("/api/interview-mock", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-qiaoshen-locale": document.documentElement.lang },
        body: JSON.stringify({ mode: "feedback", subject: subjectName, subjectId, history }),
      });
      const data = await response.json();
      setFeedback(response.ok ? data.feedback : data.error || t("暂时无法生成反馈。"));
    } catch {
      setFeedback(t("网络连接失败，作答记录已保存在本机。"));
    } finally {
      setFeedbackLoading(false);
    }
  }

  if (phase === "intro") {
    return (
      <div className="border border-[var(--border)] bg-white p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase text-[var(--indigo)]">{t("固定评估流程")}</p>
        <h3 className="mt-1 text-lg font-bold text-[var(--ink)]">{flowTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{flowText(flow.note)}</p>
        <div className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {tasks.map((task, index) => (
            <div key={task.questionId} className="grid gap-2 py-3 sm:grid-cols-[72px_1fr_auto] sm:items-center">
              <strong className="text-sm text-[var(--ink)]">{t("任务 {0}", index + 1)}</strong>
              <span className="text-sm text-[var(--ink-soft)]">{task.question.format ?? task.question.prompt}</span>
              <span className="text-xs text-[var(--ink-faint)]">
                {t("准备 {0} 分钟 · 作答 {1} 分钟", Math.round(task.preparationSec / 60), Math.round(task.responseSec / 60))}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={begin} className="btn btn-primary">
            {t("开始固定流程")}
            <ArrowRight className="size-4" />
          </button>
          <span className="text-xs text-[var(--ink-faint)]">{t("{0} 项任务 · 约 {1} 分钟", tasks.length, totalMinutes)}</span>
        </div>
        {attempts.length > 0 && (
          <div className="mt-5 border-t border-[var(--border)] pt-4">
            <p className="text-xs font-semibold uppercase text-[var(--ink-faint)]">{t("最近完成")}</p>
            {attempts.slice(0, 3).map((attempt) => (
              <div key={attempt.id} className="flex justify-between gap-3 py-2 text-xs">
                <span>{new Date(attempt.completedAt).toLocaleDateString(locale === "en" ? "en-GB" : "zh-CN")}</span>
                <span className="text-[var(--ink-faint)]">{t("{0}/{1} 项已作答", attempt.responses.filter((item) => item.answer).length, tasks.length)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="space-y-5">
        <section className="border-l-4 border-[var(--success)] bg-[var(--success-bg)] p-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-[var(--success)]" />
            <h3 className="font-bold text-[var(--ink)]">{t("{0}已完成", flowTitle)}</h3>
          </div>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            {t("已作答 {0}/{1} 项 · 共 {2} 词", responses.filter((item) => item.answer).length, tasks.length, totalWords)}
          </p>
        </section>
        <section className="border-y border-[var(--border)] py-5">
          <h3 className="font-bold text-[var(--ink)]">{t("整场复盘")}</h3>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">{t("反馈只用于训练，不代表学院评分或面试结论。")}</p>
          {!feedback ? (
            <button type="button" onClick={requestFeedback} disabled={feedbackLoading} className="btn btn-primary mt-4">
              {feedbackLoading ? t("正在分析…") : t("生成整场复盘")}
            </button>
          ) : (
            <div className="mt-4 whitespace-pre-wrap bg-[var(--surface)] p-4 text-sm leading-relaxed">{feedback}</div>
          )}
        </section>
        <div className="space-y-2">
          {responses.map((response, index) => {
            const question = questions.find((item) => item.id === response.questionId);
            return (
              <details key={response.questionId} className="border border-[var(--border)] bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold">{t("任务 {0} 思路对照", index + 1)}</summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">{question?.approach}</p>
              </details>
            );
          })}
        </div>
        <button type="button" onClick={() => setPhase("intro")} className="btn btn-secondary">
          <RotateCcw className="size-4" />
          {t("返回流程首页")}
        </button>
      </div>
    );
  }

  return (
    <div className="border border-[var(--border)] bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] p-4">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--indigo)]">{flowTitle}</p>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            {t("任务 {0}/{1}", taskIndex + 1, tasks.length)} · {phase === "preparation" ? t("独立准备") : t("正式作答")}
          </p>
        </div>
        <div className={`flex items-center gap-2 font-mono text-lg font-bold ${secondsLeft === 0 ? "text-[var(--danger)]" : ""}`}>
          <Clock3 className="size-4" />
          {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
        </div>
      </header>
      <div className="p-4 sm:p-6">
        {showThinkingChecklist && <InterviewThinkingChecklist emphasis={["model", "method", "calculation", "check", "adapt"]} />}
        <p className="text-lg font-semibold leading-relaxed text-[var(--ink)]">{current.question.prompt}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {current.question.assessedSkills?.map((skill) => <span key={skill} className="badge badge-neutral">{skill}</span>)}
        </div>
        {phase === "preparation" ? (
          <div className="mt-5">
            <textarea
              aria-label={t("准备笔记")}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="input min-h-40 w-full resize-y"
              placeholder={t("记录观察、假设、证据和准备验证的点。")}
            />
            <button type="button" onClick={beginResponse} className="btn btn-primary mt-3">{t("提前结束准备")}</button>
          </div>
        ) : (
          <div className="mt-5">
            {notes && <div className="mb-3 bg-[var(--surface)] p-3 text-xs text-[var(--ink-soft)]">{t("准备笔记")}：{notes}</div>}
            <textarea
              aria-label={t("作答内容")}
              autoFocus
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              className="input min-h-52 w-full resize-y"
              placeholder={t("写出完整推理。区分观察、解释和结论，并说明不确定性。")}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[var(--ink-faint)]">{t("当前 {0} 词", countWords(answer))}</span>
              <button type="button" onClick={submitTask} className="btn btn-primary">
                {taskIndex === tasks.length - 1 ? t("完成整场") : t("提交并进入下一任务")}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CambridgeAssessmentSimulator({
  subjectId,
  subjectName,
  questions,
}: {
  subjectId: string;
  subjectName: string;
  questions: InterviewQuestion[];
}) {
  const flow = CAMBRIDGE_ASSESSMENT_FLOWS.find((item) => item.subjectId === subjectId);
  if (!flow) return null;
  return <TimedAssessmentSimulator flow={flow} subjectName={subjectName} questions={questions} showThinkingChecklist={subjectId === "cambridge-source"} />;
}
