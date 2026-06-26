"use client";

import { useState, useEffect, useCallback } from "react";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTestById } from "@/lib/tests";
import { MAT_QUESTIONS } from "@/lib/tests/questions/mat";
import { STEP_QUESTIONS } from "@/lib/tests/questions/step";
import { ENGAA_QUESTIONS } from "@/lib/tests/questions/engaa";
import type { Question, MCQQuestion, LongQuestion, GradingResult } from "@/lib/tests/questions/types";
import { MathRenderer } from "@/components/math-renderer";
import type { GradeRequest, GradeResponse } from "@/app/api/grade-answer/route";

const QUESTION_BANKS: Record<string, Question[]> = {
  mat: MAT_QUESTIONS,
  step: STEP_QUESTIONS,
  engaa: ENGAA_QUESTIONS,
};

type PracticeMode = "topic" | "mixed";
type SessionState = "select" | "practicing" | "complete";

interface SessionResult {
  questionId: string;
  type: "mcq" | "long";
  correct?: boolean;
  earned?: number;
  max?: number;
}

export default function PracticePage({ params }: { params: { testId: string } }) {
  const test = getTestById(params.testId);
  if (!test || !test.hasQuestionBank) notFound();

  const allQuestions = QUESTION_BANKS[params.testId] ?? [];

  const [mode, setMode] = useState<PracticeMode>("mixed");
  const [topicId, setTopicId] = useState<string>("all");
  const [questionCount, setQuestionCount] = useState(10);
  const [sessionState, setSessionState] = useState<SessionState>("select");
  const [queue, setQueue] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState<SessionResult[]>([]);

  const startSession = useCallback(() => {
    let pool = allQuestions;
    if (topicId !== "all") {
      pool = allQuestions.filter((q) => q.topicId === topicId);
    }
    // Shuffle and take N
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, questionCount);
    setQueue(shuffled);
    setCurrentIdx(0);
    setResults([]);
    setSessionState("practicing");
  }, [allQuestions, topicId, questionCount]);

  const recordResult = useCallback((result: SessionResult) => {
    setResults((prev) => [...prev, result]);
    setCurrentIdx((i) => {
      if (i + 1 >= queue.length) {
        setSessionState("complete");
      }
      return i + 1;
    });
  }, [queue.length]);

  if (sessionState === "select") {
    return (
      <SessionSetup
        test={test}
        allQuestions={allQuestions}
        mode={mode}
        topicId={topicId}
        questionCount={questionCount}
        onModeChange={setMode}
        onTopicChange={setTopicId}
        onCountChange={setQuestionCount}
        onStart={startSession}
      />
    );
  }

  if (sessionState === "complete") {
    return (
      <SessionSummary
        testId={params.testId}
        results={results}
        queue={queue}
        onRestart={() => setSessionState("select")}
      />
    );
  }

  const currentQ = queue[currentIdx];
  if (!currentQ) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link href={`/tests/${params.testId}`} className="text-sm text-neutral-500 hover:text-neutral-800">
          ← {test.abbr} 备考详情
        </Link>
        <span className="text-sm text-neutral-500">
          {currentIdx + 1} / {queue.length}
        </span>
      </div>

      <div className="mb-4 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all"
          style={{ width: `${(currentIdx / queue.length) * 100}%` }}
        />
      </div>

      {currentQ.type === "mcq" ? (
        <MCQCard
          question={currentQ as MCQQuestion}
          onAnswer={(correct) =>
            recordResult({ questionId: currentQ.id, type: "mcq", correct })
          }
        />
      ) : (
        <LongAnswerCard
          question={currentQ as LongQuestion}
          onSubmit={(earned, max) =>
            recordResult({ questionId: currentQ.id, type: "long", earned, max })
          }
        />
      )}
    </div>
  );
}

function SessionSetup({
  test,
  allQuestions,
  mode,
  topicId,
  questionCount,
  onModeChange,
  onTopicChange,
  onCountChange,
  onStart,
}: {
  test: ReturnType<typeof getTestById>;
  allQuestions: Question[];
  mode: PracticeMode;
  topicId: string;
  questionCount: number;
  onModeChange: (m: PracticeMode) => void;
  onTopicChange: (t: string) => void;
  onCountChange: (n: number) => void;
  onStart: () => void;
}) {
  if (!test) return null;
  const mcqCount = allQuestions.filter((q) => q.type === "mcq").length;
  const longCount = allQuestions.filter((q) => q.type === "long").length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href={`/tests/${test.id}`} className="text-sm text-neutral-500 hover:text-neutral-800 mb-6 inline-block">
        ← {test.abbr} 备考详情
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-1">{test.abbr} 专项练习</h1>
      <p className="text-neutral-500 text-sm mb-8">
        题库共 {allQuestions.length} 题（选择题 {mcqCount} 题 · 大题 {longCount} 题）
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">练习模式</label>
          <div className="flex gap-3">
            {(["mixed", "topic"] as PracticeMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onModeChange(m)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                  mode === m
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                {m === "mixed" ? "综合练习（随机）" : "知识点专项"}
              </button>
            ))}
          </div>
        </div>

        {mode === "topic" && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">选择知识点</label>
            <select
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              value={topicId}
              onChange={(e) => onTopicChange(e.target.value)}
            >
              <option value="all">全部知识点</option>
              {test.topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} · {t.titleEn}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            题目数量：{questionCount} 题
          </label>
          <input
            type="range"
            min={5}
            max={Math.min(30, allQuestions.length)}
            step={5}
            value={questionCount}
            onChange={(e) => onCountChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-neutral-400 mt-1">
            <span>5 题</span>
            <span>{Math.min(30, allQuestions.length)} 题</span>
          </div>
        </div>

        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800">
          <p className="font-medium mb-1">关于大题（长答案）评分</p>
          <p className="text-xs leading-relaxed">
            大题由 Claude AI 分步评分：系统分析你的解题过程，按关键步骤给部分分。
            评分后可查看模型解答对比学习。约需 5–10 秒。
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          开始练习 →
        </button>
      </div>
    </div>
  );
}

function MCQCard({
  question: q,
  onAnswer,
}: {
  question: MCQQuestion;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const handleSelect = (key: string) => {
    if (selected) return;
    setSelected(key);
    setShowSolution(true);
  };

  const isCorrect = selected === q.answer;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-4 text-xs text-neutral-400">
          <span className={`px-2 py-0.5 rounded-full ${
            q.difficulty === 1 ? "bg-green-100 text-green-700" :
            q.difficulty === 2 ? "bg-amber-100 text-amber-700" :
            "bg-red-100 text-red-700"
          }`}>
            {q.difficulty === 1 ? "基础" : q.difficulty === 2 ? "中等" : "挑战"}
          </span>
          <span>{q.marks} 分</span>
          <span>·</span>
          <span>选择题</span>
        </div>

        <MathRenderer text={q.question} className="text-neutral-900 leading-relaxed" block />

        <div className="mt-5 space-y-2">
          {q.options.map((opt) => {
            let bg = "border-neutral-200 bg-white hover:bg-neutral-50";
            if (selected) {
              if (opt.key === q.answer) bg = "border-green-500 bg-green-50";
              else if (opt.key === selected) bg = "border-red-400 bg-red-50";
              else bg = "border-neutral-100 bg-neutral-50 opacity-60";
            }
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleSelect(opt.key)}
                disabled={!!selected}
                className={`w-full text-left rounded-xl border-2 px-4 py-3 transition flex items-start gap-3 ${bg}`}
              >
                <span className="font-bold text-sm shrink-0 w-5">{opt.key}.</span>
                <MathRenderer text={opt.text} className="flex-1" />
              </button>
            );
          })}
        </div>
      </div>

      {showSolution && (
        <div className={`rounded-2xl border p-5 ${isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-lg ${isCorrect ? "text-green-600" : "text-red-500"}`}>
              {isCorrect ? "✓" : "✗"}
            </span>
            <span className={`font-semibold ${isCorrect ? "text-green-700" : "text-red-700"}`}>
              {isCorrect ? "答案正确！" : `答案有误。正确答案：${q.answer}`}
            </span>
          </div>
          {q.hint && (
            <div className="mb-3 text-xs text-neutral-600 bg-white/60 rounded-lg px-3 py-2">
              <span className="font-medium">提示：</span>
              <MathRenderer text={q.hint} />
            </div>
          )}
          <div className="text-sm">
            <span className="font-medium text-neutral-700">解题过程：</span>
            <MathRenderer text={q.solution} className="mt-1 text-neutral-700 leading-relaxed" block />
          </div>
          <button
            type="button"
            onClick={() => onAnswer(isCorrect)}
            className="mt-4 px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            下一题 →
          </button>
        </div>
      )}
    </div>
  );
}

function LongAnswerCard({
  question: q,
  onSubmit,
}: {
  question: LongQuestion;
  onSubmit: (earned: number, max: number) => void;
}) {
  const [works, setWorks] = useState<Record<string, string>>({});
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState<GradeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const canSubmit = Object.values(works).some((w) => w.trim().length > 0);

  const handleGrade = async () => {
    setGrading(true);
    setError(null);
    try {
      const payload: GradeRequest = {
        questionId: q.id,
        testId: q.testId,
        questionContext: q.context,
        parts: q.parts.map((p) => ({
          label: p.label,
          question: p.question,
          marks: p.marks,
          solutionOutline: p.solutionOutline,
          studentWork: works[p.label] ?? "",
        })),
        fullSolution: q.fullSolution,
      };

      const res = await fetch("/api/grade-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());
      const data: GradeResponse = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "评分失败，请重试");
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-4 text-xs text-neutral-400">
          <span className={`px-2 py-0.5 rounded-full ${
            q.difficulty === 3 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
          }`}>
            {q.difficulty === 3 ? "挑战" : "中等"}
          </span>
          <span>{q.totalMarks} 分</span>
          <span>·</span>
          <span>大题</span>
        </div>

        {q.context && (
          <div className="mb-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <MathRenderer text={q.context} className="text-sm text-neutral-700" block />
          </div>
        )}

        <div className="space-y-5">
          {q.parts.map((part) => (
            <div key={part.label} className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-neutral-800">{part.label}</span>
                <span className="text-xs text-neutral-400">[{part.marks} 分]</span>
              </div>
              <MathRenderer text={part.question} className="text-neutral-700 leading-relaxed text-sm" block />
              {part.hint && (
                <div className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1">
                  提示：<MathRenderer text={part.hint} />
                </div>
              )}
              <textarea
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                rows={4}
                placeholder={`在此输入 ${part.label} 的解答（支持文字和数学符号，如 x^2 + 3x = 0）`}
                value={works[part.label] ?? ""}
                onChange={(e) => setWorks((prev) => ({ ...prev, [part.label]: e.target.value }))}
                disabled={!!result}
              />
            </div>
          ))}
        </div>

        {!result && (
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={handleGrade}
              disabled={!canSubmit || grading}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {grading ? "AI 评分中…" : "提交评分 (AI)"}
            </button>
            <button
              type="button"
              onClick={() => setShowSolution(true)}
              className="px-4 py-2.5 rounded-lg border border-neutral-300 text-sm text-neutral-600 hover:bg-neutral-50"
            >
              查看答案
            </button>
          </div>
        )}

        {error && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
      </div>

      {/* Grading result */}
      {result && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-blue-800">AI 评分结果</h3>
            <span className="text-lg font-bold text-blue-700">
              {result.totalEarned} / {result.totalMax} 分
            </span>
          </div>

          <div className="space-y-4">
            {result.perPart.map((p) => (
              <div key={p.label} className="bg-white rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{p.label}</span>
                  <span className={`text-sm font-bold ${p.earned === p.max ? "text-green-600" : "text-amber-600"}`}>
                    {p.earned}/{p.max} 分
                  </span>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed">{p.feedback}</p>
                {p.keyStepsFound.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-green-700 font-medium">已完成步骤：</p>
                    <ul className="mt-1 space-y-0.5">
                      {p.keyStepsFound.map((s, i) => (
                        <li key={i} className="text-xs text-green-600 flex gap-1">
                          <span>✓</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {p.keyStepsMissing.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-red-600 font-medium">缺少步骤：</p>
                    <ul className="mt-1 space-y-0.5">
                      {p.keyStepsMissing.map((s, i) => (
                        <li key={i} className="text-xs text-red-500 flex gap-1">
                          <span>✗</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-4 border border-blue-100">
            <p className="text-sm font-medium text-neutral-700 mb-1">总体评价</p>
            <p className="text-sm text-neutral-600 leading-relaxed">{result.overallFeedback}</p>
          </div>

          <button
            type="button"
            onClick={() => setShowSolution((v) => !v)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showSolution ? "收起" : "查看"} 标准答案
          </button>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => onSubmit(result.totalEarned, result.totalMax)}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              下一题 →
            </button>
          </div>
        </div>
      )}

      {/* Model solution */}
      {(showSolution || (result && showSolution)) && (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <h3 className="font-semibold text-neutral-800 mb-3">标准答案 Model Solution</h3>
          <MathRenderer text={q.fullSolution} className="text-sm text-neutral-700 leading-relaxed" block />
        </div>
      )}
    </div>
  );
}

function SessionSummary({
  testId,
  results,
  queue,
  onRestart,
}: {
  testId: string;
  results: SessionResult[];
  queue: Question[];
  onRestart: () => void;
}) {
  const mcqResults = results.filter((r) => r.type === "mcq");
  const longResults = results.filter((r) => r.type === "long");

  const mcqCorrect = mcqResults.filter((r) => r.correct).length;
  const longEarned = longResults.reduce((s, r) => s + (r.earned ?? 0), 0);
  const longMax = longResults.reduce((s, r) => s + (r.max ?? 0), 0);
  const totalEarned = mcqResults.reduce((s, r) => s + (r.correct ? (queue.find((q) => q.id === r.questionId) as MCQQuestion | undefined)?.marks ?? 0 : 0), 0) + longEarned;
  const totalMax = results.reduce((s, r) => s + (r.max ?? 0), 0);

  // Save to DB silently (best-effort, non-blocking)
  useEffect(() => {
    fetch("/api/exam-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testId,
        mode: "practice",
        totalEarned,
        totalMax,
        answers: results.map((r) => ({
          questionId: r.questionId,
          type: r.type,
          earned: r.earned ?? (r.correct ? 1 : 0),
          max: r.max ?? 1,
        })),
      }),
    }).catch(() => {/* ignore auth/network errors */});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-center">
      <div className="text-5xl mb-4">🎯</div>
      <h1 className="text-2xl font-bold mb-2">练习完成！</h1>

      <div className="grid grid-cols-2 gap-4 mt-8 mb-8">
        {mcqResults.length > 0 && (
          <div className="rounded-2xl border border-neutral-200 p-5">
            <div className="text-3xl font-bold text-blue-600">{mcqCorrect}/{mcqResults.length}</div>
            <div className="text-sm text-neutral-500 mt-1">选择题正确率</div>
            <div className="text-xs text-neutral-400">
              {Math.round((mcqCorrect / mcqResults.length) * 100)}%
            </div>
          </div>
        )}
        {longResults.length > 0 && (
          <div className="rounded-2xl border border-neutral-200 p-5">
            <div className="text-3xl font-bold text-blue-600">{longEarned}/{longMax}</div>
            <div className="text-sm text-neutral-500 mt-1">大题得分</div>
            <div className="text-xs text-neutral-400">
              {longMax > 0 ? Math.round((longEarned / longMax) * 100) : 0}%
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center">
        <button
          type="button"
          onClick={onRestart}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
        >
          再练一轮
        </button>
        <Link
          href={`/tests/${testId}`}
          className="px-6 py-3 rounded-xl border border-neutral-300 font-medium hover:bg-neutral-50"
        >
          返回备考详情
        </Link>
      </div>
    </div>
  );
}
