"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useTier } from "@/hooks/use-tier";
import { applyFreeLimit } from "@/lib/entitlements";
import { notFound, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTestById } from "@/lib/tests";
import { MAT_QUESTIONS } from "@/lib/tests/questions/mat";
import { STEP_QUESTIONS } from "@/lib/tests/questions/step";
import { ESAT_QUESTIONS } from "@/lib/tests/questions/esat";
import { TMUA_QUESTIONS } from "@/lib/tests/questions/tmua";
import { PAT_QUESTIONS } from "@/lib/tests/questions/pat";
import { LNAT_QUESTIONS } from "@/lib/tests/questions/lnat";
import { TARA_QUESTIONS } from "@/lib/tests/questions/tara";
import { BPHO_QUESTIONS } from "@/lib/tests/questions/bpho";
import { BMO_QUESTIONS } from "@/lib/tests/questions/bmo";
import type { Question, MCQQuestion, LongQuestion } from "@/lib/tests/questions/types";
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
  bpho: BPHO_QUESTIONS,
  bmo: BMO_QUESTIONS,
};
const EMPTY_QUESTIONS: Question[] = [];

type PracticeMode = "topic" | "mixed";
type PracticeFormat = "all" | "mcq" | "short-proof" | "long";
type SessionState = "select" | "practicing" | "complete";

function matchesFormat(question: Question, format: PracticeFormat): boolean {
  if (format === "all") return true;
  if (format === "mcq") return question.type === "mcq";
  const isShortProof = question.type === "long" && question.id.startsWith("bmo-sp-");
  return format === "short-proof" ? isShortProof : question.type === "long" && !isShortProof;
}

interface SessionResult {
  questionId: string;
  type: "mcq" | "long";
  correct?: boolean;
  earned?: number;
  max?: number;
  // 回看所需：MCQ 所选项 / 大题作答文本 / AI 分步反馈
  selected?: string;
  work?: Record<string, string>;
  feedback?: unknown;
}

export default function PracticePage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params);
  const searchParams = useSearchParams();
  const test = getTestById(testId);
  if (!test || !test.hasQuestionBank) notFound();

  const allQuestions = QUESTION_BANKS[testId] ?? EMPTY_QUESTIONS;

  const initialTopic = searchParams.get("topic") ?? "all";
  const [mode, setMode] = useState<PracticeMode>(initialTopic !== "all" ? "topic" : "mixed");
  const [topicId, setTopicId] = useState<string>(initialTopic);
  const [format, setFormat] = useState<PracticeFormat>("all");
  const [questionCount, setQuestionCount] = useState(10);
  const [sessionState, setSessionState] = useState<SessionState>("select");
  const [queue, setQueue] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState<SessionResult[]>([]);
  const tier = useTier();
  const availableQuestionCount = allQuestions.filter((question) =>
    (mode !== "topic" || topicId === "all" || question.topicId === topicId) && matchesFormat(question, format)
  ).length;
  const effectiveQuestionCount = Math.min(questionCount, 30, availableQuestionCount);

  const startSession = useCallback(() => {
    let pool = allQuestions;
    if (mode === "topic" && topicId !== "all") {
      pool = allQuestions.filter((q) => q.topicId === topicId);
    }
    pool = pool.filter((question) => matchesFormat(question, format));
    // 免费额度门控：付费墙关闭 / 会员时原样返回，绝不改变现有行为。
    pool = applyFreeLimit(pool, testId, tier);
    // Weighted selection: difficulty 3 → 3×, difficulty 2 → 2×, difficulty 1 → 1×
    const diffWeight = (d: number) => (d === 3 ? 3 : d === 2 ? 2 : 1);
    const shuffled = [...pool]
      .map((q) => ({ q, score: Math.random() * diffWeight(q.difficulty) }))
      .sort((a, b) => b.score - a.score)
      .map((w) => w.q)
      .slice(0, effectiveQuestionCount);
    setQueue(shuffled);
    setCurrentIdx(0);
    setResults([]);
    setSessionState("practicing");
  }, [allQuestions, format, mode, topicId, effectiveQuestionCount, tier, testId]);

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
        format={format}
        questionCount={effectiveQuestionCount}
        onModeChange={setMode}
        onTopicChange={setTopicId}
        onFormatChange={(nextFormat) => {
          setFormat(nextFormat);
          setQuestionCount(10);
          if (nextFormat === "short-proof" && !["bmo-number", "bmo-geometry", "all"].includes(topicId)) {
            setTopicId("all");
          }
        }}
        onCountChange={setQuestionCount}
        onStart={startSession}
      />
    );
  }

  if (sessionState === "complete") {
    return (
      <SessionSummary
        testId={testId}
        results={results}
        queue={queue}
        onRestart={() => setSessionState("select")}
      />
    );
  }

  const currentQ = queue[currentIdx];
  if (!currentQ) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link href={`/tests/${testId}`} className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
          ← {test.abbr} 备考详情
        </Link>
        <span className="text-sm text-[var(--ink-soft)]">
          {currentIdx + 1} / {queue.length}
        </span>
      </div>

      <div className="mb-4 h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--indigo)] rounded-full transition-all"
          style={{ width: `${(currentIdx / queue.length) * 100}%` }}
        />
      </div>

      {currentQ.type === "mcq" ? (
        <MCQCard
          key={currentQ.id}
          question={currentQ as MCQQuestion}
          onAnswer={(correct, selected) =>
            recordResult({ questionId: currentQ.id, type: "mcq", correct, selected })
          }
        />
      ) : (
        <LongAnswerCard
          key={currentQ.id}
          question={currentQ as LongQuestion}
          onSubmit={(earned, max, work, feedback) =>
            recordResult({ questionId: currentQ.id, type: "long", earned, max, work, feedback })
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
  format,
  questionCount,
  onModeChange,
  onTopicChange,
  onFormatChange,
  onCountChange,
  onStart,
}: {
  test: ReturnType<typeof getTestById>;
  allQuestions: Question[];
  mode: PracticeMode;
  topicId: string;
  format: PracticeFormat;
  questionCount: number;
  onModeChange: (m: PracticeMode) => void;
  onTopicChange: (t: string) => void;
  onFormatChange: (format: PracticeFormat) => void;
  onCountChange: (n: number) => void;
  onStart: () => void;
}) {
  if (!test) return null;
  const mcqCount = allQuestions.filter((q) => q.type === "mcq").length;
  const shortProofCount = allQuestions.filter((q) => q.type === "long" && q.id.startsWith("bmo-sp-")).length;
  const longCount = allQuestions.filter((q) => q.type === "long" && !q.id.startsWith("bmo-sp-")).length;
  const formatOptions: { id: PracticeFormat; label: string }[] = [
    { id: "all", label: "全部" },
    { id: "mcq", label: "选择题" },
    ...(shortProofCount > 0 ? [{ id: "short-proof" as const, label: "短证明" }] : []),
    ...(longCount > 0 ? [{ id: "long" as const, label: "完整大题" }] : []),
  ];
  const inventory = [
    mcqCount > 0 ? `选择题 ${mcqCount} 题` : null,
    shortProofCount > 0 ? `短证明 ${shortProofCount} 题` : null,
    longCount > 0 ? `完整大题 ${longCount} 题` : null,
  ].filter(Boolean).join(" · ");
  const topicOptions = format === "short-proof"
    ? test.topics.filter((topic) => ["bmo-number", "bmo-geometry"].includes(topic.id))
    : test.topics;
  const availableCount = allQuestions.filter((question) =>
    (mode !== "topic" || topicId === "all" || question.topicId === topicId) && matchesFormat(question, format)
  ).length;
  const maxQuestionCount = Math.min(30, availableCount);
  const minQuestionCount = Math.min(5, maxQuestionCount);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href={`/tests/${test.id}`} className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] mb-6 inline-block">
        ← {test.abbr} 备考详情
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-1">{test.abbr} 专项练习</h1>
      <p className="text-[var(--ink-soft)] text-sm mb-8">
        题库共 {allQuestions.length} 题（{inventory}）
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[var(--ink)] mb-2">练习模式</label>
          <div className="flex gap-3">
            {(["mixed", "topic"] as PracticeMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onModeChange(m)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                  mode === m
                    ? "bg-[var(--indigo)] text-white border-[var(--indigo)]"
                    : "bg-white text-[var(--ink-soft)] border-[var(--border)] hover:bg-[var(--surface)]"
                }`}
              >
                {m === "mixed" ? "综合练习（随机）" : "知识点专项"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--ink)] mb-2">题型</label>
          <div className="flex flex-wrap gap-2">
            {formatOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onFormatChange(option.id)}
                className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                  format === option.id
                    ? "border-[var(--indigo)] bg-[var(--indigo)] text-white"
                    : "border-[var(--border)] bg-white text-[var(--ink-soft)] hover:bg-[var(--surface)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {mode === "topic" && (
          <div>
            <label className="block text-sm font-medium text-[var(--ink)] mb-2">选择知识点</label>
            <select
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
              value={topicId}
              onChange={(e) => onTopicChange(e.target.value)}
            >
              <option value="all">全部知识点</option>
              {topicOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} · {t.titleEn}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--ink)] mb-2">
            题目数量：{questionCount} 题
          </label>
          <input
            type="range"
            min={minQuestionCount}
            max={maxQuestionCount}
            step={5}
            value={questionCount}
            onChange={(e) => onCountChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--ink-faint)] mt-1">
            <span>{minQuestionCount} 题</span>
            <span>{maxQuestionCount} 题可选</span>
          </div>
        </div>

        {(shortProofCount > 0 || longCount > 0) && (
          <div className="rounded-xl bg-[var(--info-bg)] border border-[color:var(--indigo)]/15 p-4 text-sm text-[var(--indigo)]">
            <p className="font-medium mb-1">关于大题（长答案）评分</p>
            <p className="text-xs leading-relaxed">
              大题由 AI 分步评分：系统分析你的解题过程，按关键步骤给部分分。
              评分后可查看模型解答对比学习。约需 5–10 秒。
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onStart}
          disabled={availableCount === 0}
          className="w-full py-3 rounded-xl bg-[var(--indigo)] text-white font-medium hover:bg-[var(--indigo-hover)] transition disabled:cursor-not-allowed disabled:opacity-40"
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
  onAnswer: (correct: boolean, selected: string) => void;
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
      <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
        <div className="flex items-center gap-2 mb-4 text-xs text-[var(--ink-faint)]">
          <span className={`px-2 py-0.5 rounded-full ${
            q.difficulty === 1 ? "bg-[var(--success-bg)] text-[var(--success)]" :
            q.difficulty === 2 ? "bg-[var(--warning-bg)] text-[var(--warning)]" :
            "bg-[var(--danger-bg)] text-[var(--danger)]"
          }`}>
            {q.difficulty === 1 ? "基础" : q.difficulty === 2 ? "中等" : "挑战"}
          </span>
          <span>{q.marks} 分</span>
          <span>·</span>
          <span>选择题</span>
        </div>

        <MathRenderer text={q.question} className="text-[var(--ink)] leading-relaxed" block />

        <div className="mt-5 space-y-2">
          {q.options.map((opt) => {
            let bg = "border-[var(--border)] bg-white hover:bg-[var(--surface)]";
            if (selected) {
              if (opt.key === q.answer) bg = "border-[var(--success)] bg-[var(--success-bg)]";
              else if (opt.key === selected) bg = "border-[color:var(--danger)]/50 bg-[var(--danger-bg)]";
              else bg = "border-[var(--border-soft)] bg-[var(--surface)] opacity-60";
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
        <div className={`rounded-2xl border p-5 ${isCorrect ? "border-[color:var(--success)]/25 bg-[var(--success-bg)]" : "border-[color:var(--danger)]/25 bg-[var(--danger-bg)]"}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-lg ${isCorrect ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
              {isCorrect ? "✓" : "✗"}
            </span>
            <span className={`font-semibold ${isCorrect ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
              {isCorrect ? "答案正确！" : `答案有误。正确答案：${q.answer}`}
            </span>
          </div>
          {q.hint && (
            <div className="mb-3 text-xs text-[var(--ink-soft)] bg-white/60 rounded-lg px-3 py-2">
              <span className="font-medium">提示：</span>
              <MathRenderer text={q.hint} />
            </div>
          )}
          <div className="text-sm">
            <span className="font-medium text-[var(--ink)]">解题过程：</span>
            <MathRenderer text={q.solution} className="mt-1 text-[var(--ink)] leading-relaxed" block />
          </div>
          <button
            type="button"
            onClick={() => onAnswer(isCorrect, selected ?? "")}
            className="mt-4 px-5 py-2 rounded-lg bg-[var(--indigo)] text-white text-sm font-medium hover:bg-[var(--indigo-hover)]"
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
  onSubmit: (
    earned: number,
    max: number,
    work?: Record<string, string>,
    feedback?: unknown
  ) => void;
}) {
  const [works, setWorks] = useState<Record<string, string>>({});
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState<GradeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);

  const isEssay = q.responseKind === "essay";
  const selectedPrompt = q.essayPrompts?.find((prompt) => prompt.id === selectedPromptId);
  const essayText = works[q.parts[0]?.label ?? "Essay"] ?? "";
  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const canSubmit = Object.values(works).some((w) => w.trim().length > 0)
    && (!isEssay || (!!selectedPrompt && wordCount <= (q.maxWords ?? Infinity)));

  const handleGrade = async () => {
    setGrading(true);
    setError(null);
    try {
      const payload: GradeRequest = {
        questionId: q.id,
        testId: q.testId,
        questionContext: [q.context, selectedPrompt ? `Selected prompt: ${selectedPrompt.title}` : undefined]
          .filter(Boolean)
          .join("\n\n"),
        parts: q.parts.map((p) => ({
          label: p.label,
          question: selectedPrompt ? `${p.question}\nSelected prompt: ${selectedPrompt.title}` : p.question,
          marks: p.marks,
          solutionOutline: p.solutionOutline,
          studentWork: works[p.label] ?? "",
        })),
        fullSolution: q.fullSolution,
        responseKind: q.responseKind,
        rubricDimensions: q.rubricDimensions,
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
      <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
        <div className="flex items-center gap-2 mb-4 text-xs text-[var(--ink-faint)]">
          <span className={`px-2 py-0.5 rounded-full ${
            q.difficulty === 3 ? "bg-[var(--danger-bg)] text-[var(--danger)]" : "bg-[var(--warning-bg)] text-[var(--warning)]"
          }`}>
            {q.difficulty === 3 ? "挑战" : "中等"}
          </span>
          <span>{q.totalMarks} 分</span>
          <span>·</span>
          <span>{isEssay ? "写作题" : "大题"}</span>
        </div>

        {q.context && (
          <div className="mb-4 p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
            <MathRenderer text={q.context} className="text-sm text-[var(--ink)]" block />
          </div>
        )}

        {isEssay && q.essayPrompts && (
          <fieldset className="mb-5">
            <legend className="text-sm font-semibold text-[var(--ink)]">选择一个题目</legend>
            <div className="mt-3 space-y-2">
              {q.essayPrompts.map((prompt) => (
                <button
                  key={prompt.id}
                  type="button"
                  onClick={() => setSelectedPromptId(prompt.id)}
                  disabled={!!result}
                  className={`flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left text-sm transition ${selectedPromptId === prompt.id ? "border-[var(--indigo)] bg-[var(--info-bg)]" : "border-[var(--border)] hover:border-[color:var(--indigo)]/40"}`}
                >
                  <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${selectedPromptId === prompt.id ? "border-[var(--indigo)] bg-[var(--indigo)] text-white" : "border-[var(--border)] text-[var(--ink-faint)]"}`}>{prompt.id}</span>
                  <span>{prompt.title}</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div className="space-y-5">
          {q.parts.map((part) => (
            <div key={part.label} className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-[var(--ink)]">{part.label}</span>
                <span className="text-xs text-[var(--ink-faint)]">[{part.marks} 分]</span>
              </div>
              <MathRenderer text={part.question} className="text-[var(--ink)] leading-relaxed text-sm" block />
              {part.hint && (
                <div className="text-xs text-[var(--indigo)] bg-[var(--info-bg)] rounded px-2 py-1">
                  提示：<MathRenderer text={part.hint} />
                </div>
              )}
              <textarea
                className={`w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[color:var(--indigo)]/30 ${isEssay ? "leading-7" : "font-mono"}`}
                rows={isEssay ? 20 : 4}
                placeholder={isEssay ? "在此输入英文作文……" : `在此输入 ${part.label} 的解答（支持文字和数学符号，如 x^2 + 3x = 0）`}
                value={works[part.label] ?? ""}
                onChange={(e) => setWorks((prev) => ({ ...prev, [part.label]: e.target.value }))}
                disabled={!!result}
              />
              {isEssay && (
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[var(--ink-faint)]">建议 {q.recommendedWords?.[0]}–{q.recommendedWords?.[1]} 词 · 上限 {q.maxWords} 词</span>
                  <span className={wordCount > (q.maxWords ?? Infinity) ? "font-semibold text-[var(--danger)]" : "font-semibold text-[var(--ink-soft)]"}>{wordCount} 词</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {!result && (
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={handleGrade}
              disabled={!canSubmit || grading}
              className="px-5 py-2.5 rounded-lg bg-[var(--indigo)] text-white text-sm font-medium hover:bg-[var(--indigo-hover)] disabled:opacity-50 transition"
            >
              {grading ? "AI 评分中…" : isEssay ? "提交写作反馈 (AI)" : "提交评分 (AI)"}
            </button>
            <button
              type="button"
              onClick={() => setShowSolution(true)}
              className="px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm text-[var(--ink-soft)] hover:bg-[var(--surface)]"
            >
              查看答案
            </button>
          </div>
        )}

        {error && (
          <div className="mt-3 text-sm text-[var(--danger)] bg-[var(--danger-bg)] rounded-lg px-3 py-2">
            {error}
          </div>
        )}
      </div>

      {/* Grading result */}
      {result && (
        <div className="rounded-2xl border border-[color:var(--indigo)]/25 bg-[var(--info-bg)] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[var(--indigo)]">{isEssay ? "AI 写作反馈" : "AI 评分结果"}</h3>
            <span className="text-lg font-bold text-[var(--indigo)]">
              {result.totalEarned} / {result.totalMax} 分
            </span>
          </div>

          {result.dimensions && result.dimensions.length > 0 && (
            <div className="divide-y divide-[var(--border)] border-y border-[var(--border)] bg-white px-4">
              {result.dimensions.map((dimension) => (
                <div key={dimension.id} className="py-3">
                  <div className="flex justify-between text-sm font-semibold"><span>{dimension.label}</span><span>{dimension.earned}/{dimension.max}</span></div>
                  <p className="mt-1 text-sm text-[var(--ink-soft)]">{dimension.feedback}</p>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {result.perPart.map((p) => (
              <div key={p.label} className="bg-white rounded-xl p-4 border border-[color:var(--indigo)]/15">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{p.label}</span>
                  <span className={`text-sm font-bold ${p.earned === p.max ? "text-[var(--success)]" : "text-[var(--warning)]"}`}>
                    {p.earned}/{p.max} 分
                  </span>
                </div>
                <p className="text-sm text-[var(--ink)] leading-relaxed">{p.feedback}</p>
                {p.keyStepsFound.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-[var(--success)] font-medium">已完成步骤：</p>
                    <ul className="mt-1 space-y-0.5">
                      {p.keyStepsFound.map((s, i) => (
                        <li key={i} className="text-xs text-[var(--success)] flex gap-1">
                          <span>✓</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {p.keyStepsMissing.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-[var(--danger)] font-medium">缺少步骤：</p>
                    <ul className="mt-1 space-y-0.5">
                      {p.keyStepsMissing.map((s, i) => (
                        <li key={i} className="text-xs text-[var(--danger)] flex gap-1">
                          <span>✗</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-4 border border-[color:var(--indigo)]/15">
            <p className="text-sm font-medium text-[var(--ink)] mb-1">总体评价</p>
            <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{result.overallFeedback}</p>
          </div>

          <button
            type="button"
            onClick={() => setShowSolution((v) => !v)}
            className="text-sm text-[var(--indigo)] hover:underline"
          >
            {showSolution ? "收起" : "查看"} {isEssay ? "评分标准说明" : "标准答案"}
          </button>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => onSubmit(result.totalEarned, result.totalMax, works, result.perPart)}
              className="px-5 py-2.5 rounded-lg bg-[var(--indigo)] text-white text-sm font-medium hover:bg-[var(--indigo-hover)]"
            >
              下一题 →
            </button>
          </div>
        </div>
      )}

      {/* Model solution */}
      {(showSolution || (result && showSolution)) && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h3 className="font-semibold text-[var(--ink)] mb-3">{isEssay ? "评分标准说明" : "标准答案 Model Solution"}</h3>
          <MathRenderer text={q.fullSolution} className="text-sm text-[var(--ink)] leading-relaxed" block />
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
          selected: r.type === "mcq" ? r.selected ?? undefined : undefined,
          work: r.type === "long" ? r.work ?? undefined : undefined,
          earned: r.earned ?? (r.correct ? 1 : 0),
          max: r.max ?? 1,
          feedback: r.feedback ?? undefined,
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
          <div className="rounded-2xl border border-[var(--border)] p-5">
            <div className="text-3xl font-bold text-[var(--indigo)]">{mcqCorrect}/{mcqResults.length}</div>
            <div className="text-sm text-[var(--ink-soft)] mt-1">选择题正确率</div>
            <div className="text-xs text-[var(--ink-faint)]">
              {Math.round((mcqCorrect / mcqResults.length) * 100)}%
            </div>
          </div>
        )}
        {longResults.length > 0 && (
          <div className="rounded-2xl border border-[var(--border)] p-5">
            <div className="text-3xl font-bold text-[var(--indigo)]">{longEarned}/{longMax}</div>
            <div className="text-sm text-[var(--ink-soft)] mt-1">大题得分</div>
            <div className="text-xs text-[var(--ink-faint)]">
              {longMax > 0 ? Math.round((longEarned / longMax) * 100) : 0}%
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center">
        <button
          type="button"
          onClick={onRestart}
          className="px-6 py-3 rounded-xl bg-[var(--indigo)] text-white font-medium hover:bg-[var(--indigo-hover)]"
        >
          再练一轮
        </button>
        <Link
          href={`/tests/${testId}`}
          className="px-6 py-3 rounded-xl border border-[var(--border)] font-medium hover:bg-[var(--surface)]"
        >
          返回备考详情
        </Link>
      </div>
    </div>
  );
}
