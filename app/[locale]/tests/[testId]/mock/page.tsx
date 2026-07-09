"use client";

import { useState, useEffect, useCallback, useRef, use } from "react";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTestById } from "@/lib/tests";
import { MAT_QUESTIONS } from "@/lib/tests/questions/mat";
import { STEP_QUESTIONS } from "@/lib/tests/questions/step";
import { ESAT_QUESTIONS } from "@/lib/tests/questions/esat";
import { TMUA_QUESTIONS } from "@/lib/tests/questions/tmua";
import { PAT_QUESTIONS } from "@/lib/tests/questions/pat";
import { LNAT_QUESTIONS } from "@/lib/tests/questions/lnat";
import { TARA_QUESTIONS } from "@/lib/tests/questions/tara";
import type { Question, MCQQuestion, LongQuestion, GradingResult } from "@/lib/tests/questions/types";
import { MathRenderer } from "@/components/math-renderer";
import type { GradeRequest, GradeResponse } from "@/app/api/grade-answer/route";

const QUESTION_BANKS: Record<string, Question[]> = {
  mat: MAT_QUESTIONS,
  step: STEP_QUESTIONS,
  esat: ESAT_QUESTIONS,
  tmua: TMUA_QUESTIONS,
  pat: PAT_QUESTIONS,
  lnat: LNAT_QUESTIONS,
  tara: TARA_QUESTIONS,
};

type ExamState = "briefing" | "running" | "grading" | "results";

interface MCQAnswer {
  questionId: string;
  type: "mcq";
  selected: string | null;
}

interface LongAnswer {
  questionId: string;
  type: "long";
  works: Record<string, string>;
}

type Answer = MCQAnswer | LongAnswer;

interface GradedResult {
  questionId: string;
  type: "mcq" | "long";
  correct?: boolean;
  earned?: number;
  max?: number;
  grading?: GradeResponse;
}

export default function MockExamPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params);
  const test = getTestById(testId);
  if (!test || !test.hasQuestionBank) notFound();

  const allQuestions = QUESTION_BANKS[testId] ?? [];

  const [examState, setExamState] = useState<ExamState>("briefing");
  const [queue, setQueue] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [gradedResults, setGradedResults] = useState<GradedResult[]>([]);
  const [gradingProgress, setGradingProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // Parse duration "2h 30min" → seconds
  const parseDuration = useCallback((d: string): number => {
    const h = d.match(/(\d+)h/);
    const m = d.match(/(\d+)\s*min/);
    return (h ? parseInt(h[1]) * 3600 : 0) + (m ? parseInt(m[1]) * 60 : 0);
  }, []);

  const startExam = useCallback(() => {
    // Build a representative mock: up to 20 MCQ + 2 long (or all if fewer)
    const mcqs = allQuestions.filter((q) => q.type === "mcq").sort(() => Math.random() - 0.5).slice(0, 20);
    const longs = allQuestions.filter((q) => q.type === "long").sort(() => Math.random() - 0.5).slice(0, 2);
    const examQ = [...mcqs, ...longs];
    setQueue(examQ);
    setCurrentIdx(0);
    setAnswers(
      examQ.map((q) =>
        q.type === "mcq"
          ? { questionId: q.id, type: "mcq", selected: null }
          : { questionId: q.id, type: "long", works: {} }
      )
    );
    setTimeLeft(parseDuration(test.duration) || 7200);
    setExamState("running");
  }, [allQuestions, test.duration, parseDuration]);

  // Countdown timer
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (examState !== "running") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleSubmitAll();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examState]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
      : `${m}:${String(sec).padStart(2, "0")}`;
  };

  const updateMCQAnswer = (questionId: string, selected: string) => {
    setAnswers((prev) =>
      prev.map((a) => (a.questionId === questionId && a.type === "mcq" ? { ...a, selected } : a))
    );
  };

  const updateLongWork = (questionId: string, label: string, text: string) => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.questionId === questionId && a.type === "long"
          ? { ...a, works: { ...a.works, [label]: text } }
          : a
      )
    );
  };

  const handleSubmitAll = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setExamState("grading");

    const results: GradedResult[] = [];
    let progress = 0;

    for (const q of queue) {
      const ans = answers.find((a) => a.questionId === q.id);
      if (!ans) continue;

      if (q.type === "mcq" && ans.type === "mcq") {
        const mcq = q as MCQQuestion;
        results.push({
          questionId: q.id,
          type: "mcq",
          correct: ans.selected === mcq.answer,
          earned: ans.selected === mcq.answer ? mcq.marks : 0,
          max: mcq.marks,
        });
        progress++;
        setGradingProgress(progress);
      } else if (q.type === "long" && ans.type === "long") {
        const lq = q as LongQuestion;
        try {
          const payload: GradeRequest = {
            questionId: q.id,
            testId: q.testId,
            questionContext: lq.context,
            parts: lq.parts.map((p) => ({
              label: p.label,
              question: p.question,
              marks: p.marks,
              solutionOutline: p.solutionOutline,
              studentWork: ans.works[p.label] ?? "",
            })),
            fullSolution: lq.fullSolution,
          };
          const res = await fetch("/api/grade-answer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            const data: GradeResponse = await res.json();
            results.push({
              questionId: q.id,
              type: "long",
              earned: data.totalEarned,
              max: data.totalMax,
              grading: data,
            });
          } else {
            results.push({ questionId: q.id, type: "long", earned: 0, max: lq.totalMarks });
          }
        } catch {
          results.push({ questionId: q.id, type: "long", earned: 0, max: lq.totalMarks });
        }
        progress++;
        setGradingProgress(progress);
      }
    }

    setGradedResults(results);
    setExamState("results");
  }, [queue, answers]);

  if (examState === "briefing") {
    return <MockBriefing test={test} allQuestions={allQuestions} onStart={startExam} />;
  }

  if (examState === "grading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="text-4xl animate-spin">⏳</div>
        <h2 className="text-xl font-bold text-[var(--ink)]">AI 正在评分…</h2>
        <p className="text-sm text-[var(--ink-soft)]">
          已完成 {gradingProgress} / {queue.length} 题
        </p>
        <div className="w-64 h-2 bg-[var(--surface-2)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--indigo)] rounded-full transition-all"
            style={{ width: `${(gradingProgress / Math.max(queue.length, 1)) * 100}%` }}
          />
        </div>
        <p className="text-xs text-[var(--ink-faint)]">大题由 Claude AI 分步评分，请稍候</p>
      </div>
    );
  }

  if (examState === "results") {
    return (
      <MockResults
        testId={testId}
        queue={queue}
        results={gradedResults}
        answers={answers}
        onRetry={() => setExamState("briefing")}
      />
    );
  }

  // Running exam
  const currentQ = queue[currentIdx];
  const currentAns = answers.find((a) => a.questionId === currentQ?.id);
  const answeredCount = answers.filter(
    (a) => (a.type === "mcq" && a.selected !== null) || (a.type === "long" && Object.values(a.works).some((w) => w.trim()))
  ).length;

  const isUrgent = timeLeft < 300;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className={`sticky top-0 z-20 border-b px-4 py-2 flex items-center gap-4 ${isUrgent ? "bg-[var(--danger-bg)] border-[color:var(--danger)]/25" : "bg-white border-[var(--border)]"}`}>
        <span className="font-bold text-sm text-[var(--ink-soft)]">{test.abbr} 模拟考试</span>
        <div className="flex-1" />
        <span className="text-xs text-[var(--ink-faint)]">{answeredCount}/{queue.length} 已作答</span>
        <span className={`font-mono font-bold text-lg tabular-nums ${isUrgent ? "text-[var(--danger)]" : "text-[var(--ink)]"}`}>
          {formatTime(timeLeft)}
        </span>
        <button
          type="button"
          onClick={handleSubmitAll}
          className="px-3 py-1.5 rounded-lg bg-[var(--indigo)] text-white text-xs font-medium hover:bg-[var(--indigo-hover)]"
        >
          交卷
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Question nav sidebar */}
        <div className="hidden md:flex flex-col gap-1 p-4 border-r border-[var(--border-soft)] w-16 bg-[var(--surface)]">
          {queue.map((q, i) => {
            const ans = answers.find((a) => a.questionId === q.id);
            const done =
              (ans?.type === "mcq" && ans.selected !== null) ||
              (ans?.type === "long" && Object.values((ans as LongAnswer).works).some((w) => w.trim()));
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIdx(i)}
                className={`w-8 h-8 rounded text-xs font-medium mx-auto transition ${
                  i === currentIdx
                    ? "bg-[var(--indigo)] text-white"
                    : done
                    ? "bg-[var(--info-bg)] text-[var(--indigo)]"
                    : "bg-white text-[var(--ink-faint)] border border-[var(--border)]"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* Main question area */}
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="mx-auto max-w-3xl">
            {currentQ && (
              <>
                {currentQ.type === "mcq" ? (
                  <MockMCQ
                    question={currentQ as MCQQuestion}
                    selected={(currentAns as MCQAnswer)?.selected ?? null}
                    onSelect={(key) => updateMCQAnswer(currentQ.id, key)}
                  />
                ) : (
                  <MockLong
                    question={currentQ as LongQuestion}
                    works={(currentAns as LongAnswer)?.works ?? {}}
                    onWork={(label, text) => updateLongWork(currentQ.id, label, text)}
                  />
                )}

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx((i) => i - 1)}
                    className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--ink-soft)] hover:bg-[var(--surface)] disabled:opacity-40"
                  >
                    ← 上一题
                  </button>
                  {currentIdx < queue.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentIdx((i) => i + 1)}
                      className="px-4 py-2 rounded-lg bg-neutral-800 text-white text-sm hover:bg-neutral-700"
                    >
                      下一题 →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitAll}
                      className="px-4 py-2 rounded-lg bg-[var(--indigo)] text-white text-sm font-medium hover:bg-[var(--indigo-hover)]"
                    >
                      完成作答，交卷 →
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MockBriefing({
  test,
  allQuestions,
  onStart,
}: {
  test: ReturnType<typeof getTestById>;
  allQuestions: Question[];
  onStart: () => void;
}) {
  if (!test) return null;
  const mcqCount = Math.min(20, allQuestions.filter((q) => q.type === "mcq").length);
  const longCount = Math.min(2, allQuestions.filter((q) => q.type === "long").length);

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Link href={`/tests/${test.id}`} className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] mb-6 inline-block">
        ← {test.abbr} 备考详情
      </Link>
      <h1 className="text-2xl font-bold mt-4 mb-1">{test.abbr} 计时模拟考试</h1>
      <p className="text-[var(--ink-soft)] text-sm mb-8">模拟真实考试环境，完成后 AI 逐题评分</p>

      <div className="rounded-2xl border border-[var(--border)] p-6 space-y-4 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--ink-soft)]">考试时长</span>
          <span className="font-medium">{test.duration}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--ink-soft)]">选择题数量</span>
          <span className="font-medium">{mcqCount} 题</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--ink-soft)]">大题数量</span>
          <span className="font-medium">{longCount} 题（AI分步评分）</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--ink-soft)]">考试模式</span>
          <span className="font-medium">计时、交卷后显示答案</span>
        </div>
      </div>

      <div className="rounded-xl bg-[var(--warning-bg)] border border-[color:var(--warning)]/25 p-4 text-sm text-[var(--warning)] mb-6 space-y-1">
        <p className="font-medium">开始前请注意</p>
        <ul className="list-disc ml-4 text-xs space-y-0.5">
          <li>考试期间计时不会暂停</li>
          <li>可随时跳题，通过左侧导航栏切换</li>
          <li>大题作答区支持文字和数学符号输入</li>
          <li>交卷后约 30 秒内完成 AI 评分</li>
          <li>AI 评分仅供参考，不代表真实考试成绩</li>
        </ul>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="w-full py-3 rounded-xl bg-[var(--indigo)] text-white font-medium text-sm hover:bg-[var(--indigo-hover)] transition"
      >
        开始计时考试 →
      </button>
    </div>
  );
}

function MockMCQ({
  question: q,
  selected,
  onSelect,
}: {
  question: MCQQuestion;
  selected: string | null;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-xs text-[var(--ink-faint)] mb-2">
        <span>选择题</span>
        <span>·</span>
        <span>{q.marks} 分</span>
        <span className={`ml-1 px-2 py-0.5 rounded-full ${
          q.difficulty === 1 ? "bg-[var(--success-bg)] text-[var(--success)]" :
          q.difficulty === 2 ? "bg-[var(--warning-bg)] text-[var(--warning)]" :
          "bg-[var(--danger-bg)] text-[var(--danger)]"
        }`}>
          {q.difficulty === 1 ? "基础" : q.difficulty === 2 ? "中等" : "挑战"}
        </span>
      </div>

      <MathRenderer text={q.question} className="text-[var(--ink)] leading-relaxed" block />

      <div className="space-y-2">
        {q.options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onSelect(opt.key)}
            className={`w-full text-left rounded-xl border-2 px-4 py-3 transition flex items-start gap-3 ${
              selected === opt.key
                ? "border-[var(--indigo)] bg-[var(--info-bg)]"
                : "border-[var(--border)] bg-white hover:bg-[var(--surface)]"
            }`}
          >
            <span className="font-bold text-sm shrink-0 w-5">{opt.key}.</span>
            <MathRenderer text={opt.text} className="flex-1" />
          </button>
        ))}
      </div>
    </div>
  );
}

function MockLong({
  question: q,
  works,
  onWork,
}: {
  question: LongQuestion;
  works: Record<string, string>;
  onWork: (label: string, text: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-xs text-[var(--ink-faint)] mb-2">
        <span>大题</span>
        <span>·</span>
        <span>共 {q.totalMarks} 分</span>
      </div>

      {q.context && (
        <div className="p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
          <MathRenderer text={q.context} className="text-sm text-[var(--ink)]" block />
        </div>
      )}

      <div className="space-y-5">
        {q.parts.map((part) => (
          <div key={part.label} className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold">{part.label}</span>
              <span className="text-xs text-[var(--ink-faint)]">[{part.marks} 分]</span>
            </div>
            <MathRenderer text={part.question} className="text-sm text-[var(--ink)] leading-relaxed" block />
            <textarea
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[color:var(--indigo)]/30"
              rows={4}
              placeholder={`${part.label} 解答…`}
              value={works[part.label] ?? ""}
              onChange={(e) => onWork(part.label, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function MockResults({
  testId,
  queue,
  results,
  answers,
  onRetry,
}: {
  testId: string;
  queue: Question[];
  results: GradedResult[];
  answers: Answer[];
  onRetry: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalEarned = results.reduce((s, r) => s + (r.earned ?? 0), 0);
  const totalMax = results.reduce((s, r) => s + (r.max ?? 0), 0);
  const mcqCorrect = results.filter((r) => r.type === "mcq" && r.correct).length;
  const mcqTotal = results.filter((r) => r.type === "mcq").length;
  const pct = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;

  // Save to DB silently on mount (best-effort)
  useEffect(() => {
    const payload = {
      testId,
      mode: "mock",
      totalEarned,
      totalMax,
      answers: results.map((r) => {
        const ans = answers.find((a) => a.questionId === r.questionId);
        return {
          questionId: r.questionId,
          type: r.type,
          selected: ans?.type === "mcq" ? ans.selected ?? undefined : undefined,
          work: ans?.type === "long" ? ans.works : undefined,
          earned: r.earned ?? 0,
          max: r.max ?? 0,
          feedback: r.grading?.perPart ?? undefined,
        };
      }),
    };
    fetch("/api/exam-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {/* ignore */});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">
          {pct >= 80 ? "🏆" : pct >= 60 ? "🎯" : "📚"}
        </div>
        <h1 className="text-2xl font-bold mb-2">考试完成！</h1>
        <div className="text-5xl font-bold text-[var(--indigo)] mt-4">{totalEarned}<span className="text-2xl text-[var(--ink-faint)]">/{totalMax}</span></div>
        <div className="text-[var(--ink-soft)] text-sm mt-1">{pct}%</div>
        <div className="mt-3 text-sm text-[var(--ink-soft)]">
          选择题 {mcqCorrect}/{mcqTotal} 正确
        </div>
      </div>

      <h2 className="font-bold text-[var(--ink)] mb-4">逐题详情</h2>
      <div className="space-y-3">
        {queue.map((q, i) => {
          const result = results.find((r) => r.questionId === q.id);
          const isExpanded = expandedId === q.id;
          const mcqQ = q.type === "mcq" ? (q as MCQQuestion) : null;
          const longQ = q.type === "long" ? (q as LongQuestion) : null;
          const ans = answers.find((a) => a.questionId === q.id);

          return (
            <div key={q.id} className="rounded-xl border border-[var(--border)] overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--surface)]"
              >
                <span className="text-xs text-[var(--ink-faint)] w-5 shrink-0">Q{i + 1}</span>
                <span className="text-xs text-[var(--ink-soft)] shrink-0">
                  {q.type === "mcq" ? "选择" : "大题"}
                </span>
                <span className={`ml-auto text-sm font-bold ${
                  result?.type === "mcq"
                    ? result.correct ? "text-[var(--success)]" : "text-[var(--danger)]"
                    : (result?.earned ?? 0) >= (result?.max ?? 1) * 0.6 ? "text-[var(--success)]" : "text-[var(--warning)]"
                }`}>
                  {result?.earned ?? 0}/{result?.max ?? 0}
                </span>
                <span className="text-[var(--ink-faint)] text-xs ml-2">{isExpanded ? "▲" : "▼"}</span>
              </button>

              {isExpanded && (
                <div className="border-t border-[var(--border-soft)] p-4 bg-[var(--surface)] space-y-4">
                  {mcqQ && (
                    <>
                      <MathRenderer text={mcqQ.question} className="text-sm text-[var(--ink)]" block />
                      <div className="space-y-1">
                        {mcqQ.options.map((opt) => {
                          const myAns = (ans as MCQAnswer)?.selected;
                          let cls = "border-[var(--border)] text-[var(--ink-soft)]";
                          if (opt.key === mcqQ.answer) cls = "border-[color:var(--success)]/50 bg-[var(--success-bg)] text-[var(--success)]";
                          else if (opt.key === myAns) cls = "border-[color:var(--danger)]/40 bg-[var(--danger-bg)] text-[var(--danger)]";
                          return (
                            <div key={opt.key} className={`flex gap-2 text-xs rounded-lg border px-3 py-1.5 ${cls}`}>
                              <span className="font-bold">{opt.key}.</span>
                              <MathRenderer text={opt.text} />
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-xs text-[var(--ink-soft)] bg-white rounded-lg p-3 border border-[var(--border)]">
                        <span className="font-medium">解题过程：</span>
                        <MathRenderer text={mcqQ.solution} className="mt-1" block />
                      </div>
                    </>
                  )}

                  {longQ && result?.grading && (
                    <div className="space-y-3">
                      {result.grading.perPart.map((p) => (
                        <div key={p.label} className="bg-white rounded-lg border border-[var(--border)] p-3">
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span>{p.label}</span>
                            <span className={p.earned === p.max ? "text-[var(--success)]" : "text-[var(--warning)]"}>
                              {p.earned}/{p.max}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--ink-soft)]">{p.feedback}</p>
                        </div>
                      ))}
                      <div className="bg-white rounded-lg border border-[var(--border)] p-3">
                        <p className="text-xs font-medium text-[var(--ink)] mb-1">总评</p>
                        <p className="text-xs text-[var(--ink-soft)]">{result.grading.overallFeedback}</p>
                      </div>
                      <details>
                        <summary className="text-xs text-[var(--indigo)] cursor-pointer">查看标准答案</summary>
                        <div className="mt-2 text-xs bg-white rounded-lg border border-[var(--border)] p-3">
                          <MathRenderer text={longQ.fullSolution} block />
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 mt-8 justify-center">
        <button type="button" onClick={onRetry} className="px-6 py-3 rounded-xl bg-[var(--indigo)] text-white font-medium hover:bg-[var(--indigo-hover)]">
          再考一次
        </button>
        <Link
          href={`/tests/${testId}/practice`}
          className="px-6 py-3 rounded-xl border border-[var(--border)] font-medium hover:bg-[var(--surface)] text-center"
        >
          专项练习
        </Link>
        <Link
          href={`/tests/${testId}`}
          className="px-6 py-3 rounded-xl border border-[var(--border)] font-medium hover:bg-[var(--surface)] text-center"
        >
          返回详情
        </Link>
      </div>
    </div>
  );
}
