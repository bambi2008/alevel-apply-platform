"use client";

import { useState, useEffect, useCallback, useMemo, useRef, use } from "react";
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
import { UCAT_QUESTIONS } from "@/lib/tests/questions/ucat";
import { IELTS_QUESTIONS } from "@/lib/tests/questions/ielts";
import { CSAT_QUESTIONS } from "@/lib/tests/questions/csat";
import { CAIE9709_QUESTIONS } from "@/lib/tests/questions/caie9709";
import type { Question, MCQQuestion, LongQuestion } from "@/lib/tests/questions/types";
import { MathRenderer } from "@/components/math-renderer";
import type { GradeRequest, GradeResponse } from "@/app/api/grade-answer/route";
import { scoreObjectiveAnswer } from "@/lib/tests/objective-scoring";
import { buildSessionDiagnosis } from "@/lib/tests/diagnosis";
import { DiagnosisSummary, QuestionDiagnosis } from "@/components/exam-diagnosis";
import { persistExamSession } from "@/lib/tests/persist-session";
import { GradingTrustPanel } from "@/components/grading-trust-panel";
import { forceFullNavigation } from "@/lib/navigation";

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
  ucat: UCAT_QUESTIONS,
  ielts: IELTS_QUESTIONS,
  csat: CSAT_QUESTIONS,
  caie9709: CAIE9709_QUESTIONS,
};
const EMPTY_QUESTIONS: Question[] = [];

type PracticeMode = "topic" | "mixed" | "adaptive";
type PracticeFormat = "all" | "mcq" | "short-proof" | "long";
type SessionState = "select" | "practicing" | "complete";
type SessionPurpose = "diagnostic" | "practice";

interface PracticeSnapshot {
  version: 1;
  testId: string;
  queueIds: string[];
  results: SessionResult[];
  sessionStartedAt: number;
  strategy: PracticeMode;
  purpose: SessionPurpose;
  savedAt: number;
}

function practiceSnapshotKey(testId: string) {
  return `qiaoshen:practice-session:${testId}`;
}

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
  timeSpentSec?: number;
  answerChanges?: number;
  visits?: number;
  firstSelected?: string;
}

export default function PracticePage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params);
  const searchParams = useSearchParams();
  const test = getTestById(testId);
  if (!test || !test.hasQuestionBank) notFound();

  const staticQuestions = QUESTION_BANKS[testId] ?? EMPTY_QUESTIONS;
  const [publishedQuestions, setPublishedQuestions] = useState<Question[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/question-bank?testId=${encodeURIComponent(testId)}`, { signal: controller.signal })
      .then(async (response) => response.ok ? response.json() as Promise<{ questions?: Question[] }> : { questions: [] })
      .then((body) => setPublishedQuestions(Array.isArray(body.questions) ? body.questions : []))
      .catch((error) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setPublishedQuestions([]);
      });
    return () => controller.abort();
  }, [testId]);
  const allQuestions = useMemo(() => {
    const merged = new Map(staticQuestions.map((question) => [question.id, question]));
    for (const question of publishedQuestions) merged.set(question.id, question);
    return [...merged.values()];
  }, [publishedQuestions, staticQuestions]);

  const initialTopic = searchParams.get("topic") ?? "all";
  const initialCount = Number(searchParams.get("count") ?? 10);
  const [mode, setMode] = useState<PracticeMode>(
    searchParams.get("adaptive") === "1" ? "adaptive" : initialTopic !== "all" ? "topic" : "mixed"
  );
  const [topicId, setTopicId] = useState<string>(initialTopic);
  const [format, setFormat] = useState<PracticeFormat>("all");
  const [questionCount, setQuestionCount] = useState(Number.isFinite(initialCount) ? Math.max(5, Math.min(30, initialCount)) : 10);
  const [sessionState, setSessionState] = useState<SessionState>("select");
  const [startError, setStartError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [queue, setQueue] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState<SessionResult[]>([]);
  const [sessionStartedAt, setSessionStartedAt] = useState(0);
  const [sessionPurpose, setSessionPurpose] = useState<SessionPurpose>("practice");
  const questionStartedAt = useRef(0);
  const restoredRef = useRef(false);
  const tier = useTier();
  const shouldResume = searchParams.get("resume") === "1";
  const availableQuestionCount = allQuestions.filter((question) =>
    (!["topic", "adaptive"].includes(mode) || topicId === "all" || question.topicId === topicId) && matchesFormat(question, format)
  ).length;
  const effectiveQuestionCount = Math.min(questionCount, 30, availableQuestionCount);

  useEffect(() => {
    if (!shouldResume || restoredRef.current || allQuestions.length === 0) return;
    const raw = window.sessionStorage.getItem(practiceSnapshotKey(testId));
    if (!raw) return;
    try {
      const snapshot = JSON.parse(raw) as PracticeSnapshot;
      if (
        snapshot.version !== 1
        || snapshot.testId !== testId
        || !Array.isArray(snapshot.queueIds)
        || !Array.isArray(snapshot.results)
        || snapshot.queueIds.length === 0
      ) return;
      const byId = new Map(allQuestions.map((question) => [question.id, question]));
      const restoredQueue = snapshot.queueIds
        .map((questionId) => byId.get(questionId))
        .filter((question): question is Question => !!question);
      if (restoredQueue.length === 0) return;
      restoredRef.current = true;
      setMode(snapshot.strategy);
      setQueue(restoredQueue);
      setResults(snapshot.results);
      setCurrentIdx(restoredQueue.length);
      setSessionStartedAt(snapshot.sessionStartedAt);
      setSessionPurpose(snapshot.purpose);
      setSessionState("complete");
    } catch {
      // Ignore an invalid browser snapshot and let the user start a new session.
    }
  }, [allQuestions, shouldResume, testId]);

  const startSession = useCallback(async () => {
    window.sessionStorage.removeItem(practiceSnapshotKey(testId));
    setStarting(true);
    setStartError(null);
    let pool = allQuestions;
    if (["topic", "adaptive"].includes(mode) && topicId !== "all") {
      pool = allQuestions.filter((q) => q.topicId === topicId);
    }
    pool = pool.filter((question) => matchesFormat(question, format));
    // 免费额度门控：付费墙关闭 / 会员时原样返回，绝不改变现有行为。
    pool = applyFreeLimit(pool, testId, tier);
    let shuffled: Question[];
    if (mode === "adaptive") {
      try {
        const query = new URLSearchParams({ testId, count: String(effectiveQuestionCount) });
        if (topicId !== "all") query.set("topicId", topicId);
        if (format !== "all") query.set("format", format);
        if (searchParams.get("review") === "1") query.set("review", "1");
        if (searchParams.get("remediation") === "1") query.set("remediation", "1");
        const response = await fetch(`/api/exam-sessions/adaptive?${query}`);
        if (!response.ok) throw new Error("暂时无法生成智能训练，请稍后重试。");
        const data = await response.json() as { authenticated: boolean; stage?: string; recommendedQuestionIds?: string[] };
        if (!data.authenticated) throw new Error("智能训练需要登录，登录后系统才能保存并分析你的进步。");
        const diagnostic = data.stage === "diagnostic"
          && topicId === "all"
          && searchParams.get("review") !== "1"
          && searchParams.get("remediation") !== "1";
        setSessionPurpose(diagnostic ? "diagnostic" : "practice");
        const byId = new Map(pool.map((question) => [question.id, question]));
        shuffled = (data.recommendedQuestionIds ?? []).map((id) => byId.get(id)).filter((question): question is Question => !!question);
        if (shuffled.length === 0) throw new Error("当前没有到期复习题，可以切换为智能训练继续刷新题。");
      } catch (error) {
        setStartError(error instanceof Error ? error.message : "暂时无法生成智能训练。");
        setStarting(false);
        return;
      }
    } else {
      setSessionPurpose("practice");
      // Weighted selection: difficulty 3 → 3×, difficulty 2 → 2×, difficulty 1 → 1×
      const diffWeight = (d: number) => (d === 3 ? 3 : d === 2 ? 2 : 1);
      shuffled = [...pool]
        .map((q) => ({ q, score: Math.random() * diffWeight(q.difficulty) }))
        .sort((a, b) => b.score - a.score)
        .map((w) => w.q)
        .slice(0, effectiveQuestionCount);
    }
    setQueue(shuffled);
    setCurrentIdx(0);
    setResults([]);
    setSessionStartedAt(Date.now());
    questionStartedAt.current = Date.now();
    setSessionState("practicing");
    setStarting(false);
  }, [allQuestions, format, mode, topicId, effectiveQuestionCount, tier, testId, searchParams]);

  const recordResult = useCallback((result: SessionResult) => {
    const enriched = { ...result, timeSpentSec: Math.max(1, Math.round((Date.now() - questionStartedAt.current) / 1000)), visits: 1 };
    setResults((prev) => [...prev, enriched]);
    questionStartedAt.current = Date.now();
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
        starting={starting}
        startError={startError}
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
        queue={queue}
        results={results}
        startedAt={sessionStartedAt}
        strategy={mode}
        purpose={sessionPurpose}
        questionBank={allQuestions}
        onRestart={() => {
          window.sessionStorage.removeItem(practiceSnapshotKey(testId));
          setSessionState("select");
        }}
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
          onAnswer={(correct, selected, earned, max) =>
            recordResult({ questionId: currentQ.id, type: "mcq", correct, selected, earned, max })
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
  starting,
  startError,
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
  starting: boolean;
  startError: string | null;
  onModeChange: (m: PracticeMode) => void;
  onTopicChange: (t: string) => void;
  onFormatChange: (format: PracticeFormat) => void;
  onCountChange: (n: number) => void;
  onStart: () => void | Promise<void>;
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
    (!["topic", "adaptive"].includes(mode) || topicId === "all" || question.topicId === topicId) && matchesFormat(question, format)
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
          <div className="flex flex-wrap gap-3">
            {(["adaptive", "mixed", "topic"] as PracticeMode[]).map((m) => (
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
                {m === "adaptive" ? "智能训练" : m === "mixed" ? "综合练习（随机）" : "知识点专项"}
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

        {mode === "adaptive" && (
          <div className="rounded-lg border border-[color:var(--indigo)]/20 bg-[var(--info-bg)] px-3 py-2 text-xs leading-relaxed text-[var(--indigo)]">
            系统会优先安排到期错题、薄弱知识点和适合你当前掌握度的新题。首次使用会自动生成跨知识点诊断。
          </div>
        )}

        {(mode === "topic" || mode === "adaptive") && (
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
          disabled={availableCount === 0 || starting}
          className="w-full py-3 rounded-xl bg-[var(--indigo)] text-white font-medium hover:bg-[var(--indigo-hover)] transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          {starting ? "正在生成训练…" : mode === "adaptive" ? "开始智能训练 →" : "开始练习 →"}
        </button>
        {startError && <p className="text-sm text-[var(--danger)]">{startError}</p>}
      </div>
    </div>
  );
}

function MCQCard({
  question: q,
  onAnswer,
}: {
  question: MCQQuestion;
  onAnswer: (correct: boolean, selected: string, earned: number, max: number) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const handleSelect = (key: string) => {
    if (selected) return;
    setSelected(key);
    setShowSolution(true);
  };

  const isCorrect = selected === q.answer;
  const score = scoreObjectiveAnswer(q, selected ?? undefined);
  const isPartial = score.earned > 0 && score.earned < score.max;

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
              {isCorrect ? "答案正确！" : isPartial ? `获得部分分（${score.earned}/${score.max}）` : `答案有误。正确答案：${q.answer}`}
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
            onClick={() => onAnswer(isCorrect, selected ?? "", score.earned, score.max)}
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

  const handleGrade = async (reviewMode: GradeRequest["reviewMode"] = "standard") => {
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
        reviewMode,
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
              onClick={() => void handleGrade()}
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

          <GradingTrustPanel assessment={result.assessment} />
          {result.assessment.reviewStatus === "review-recommended" && (
            <button
              type="button"
              onClick={() => void handleGrade("adjudicate")}
              disabled={grading}
              className="rounded-md border border-[var(--warning)] px-3 py-2 text-xs font-semibold text-[var(--warning)] disabled:opacity-50"
            >
              {grading ? "正在重新裁决…" : "重新评分并强制裁决"}
            </button>
          )}

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
                {p.evidence.length > 0 && (
                  <div className="mt-3 border-t border-[var(--border)] pt-2">
                    <p className="text-xs font-medium text-[var(--ink-soft)]">评分证据</p>
                    <ul className="mt-1 space-y-1">
                      {p.evidence.map((item, evidenceIndex) => (
                        <li key={`${item.criterion}-${evidenceIndex}`} className="text-xs text-[var(--ink-soft)]">
                          <span className="font-semibold">{item.marksAwarded} 分 · {item.criterion}</span>
                          {item.quote && <span>：“{item.quote}”</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
              onClick={() => onSubmit(
                result.totalEarned,
                result.totalMax,
                works,
                result.perPart.map((part) => ({ ...part, assessment: result.assessment })),
              )}
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
  queue,
  results,
  startedAt,
  strategy,
  purpose,
  questionBank,
  onRestart,
}: {
  testId: string;
  queue: Question[];
  results: SessionResult[];
  startedAt: number;
  strategy: PracticeMode;
  purpose: SessionPurpose;
  questionBank: Question[];
  onRestart: () => void;
}) {
  const persistedRef = useRef(false);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const mcqResults = results.filter((r) => r.type === "mcq");
  const longResults = results.filter((r) => r.type === "long");

  const mcqCorrect = mcqResults.filter((r) => r.correct).length;
  const longEarned = longResults.reduce((s, r) => s + (r.earned ?? 0), 0);
  const longMax = longResults.reduce((s, r) => s + (r.max ?? 0), 0);
  const totalEarned = mcqResults.reduce((s, r) => s + (r.earned ?? 0), 0) + longEarned;
  const totalMax = results.reduce((s, r) => s + (r.max ?? 0), 0);
  const questionById = new Map(questionBank.map((question) => [question.id, question]));
  const diagnosis = buildSessionDiagnosis(results.flatMap((result) => {
    const question = questionById.get(result.questionId);
    return question ? [{
      question,
      selected: result.selected,
      earned: result.earned ?? (result.correct ? 1 : 0),
      max: result.max ?? 1,
      work: result.work,
      feedback: Array.isArray(result.feedback) ? result.feedback : undefined,
      timeSpentSec: result.timeSpentSec,
      answerChanges: result.answerChanges,
      visits: result.visits,
      firstSelected: result.firstSelected ?? result.selected,
    }] : [];
  }));

  useEffect(() => {
    const snapshot: PracticeSnapshot = {
      version: 1,
      testId,
      queueIds: queue.map((question) => question.id),
      results,
      sessionStartedAt: startedAt,
      strategy,
      purpose,
      savedAt: Date.now(),
    };
    window.sessionStorage.setItem(practiceSnapshotKey(testId), JSON.stringify(snapshot));
  }, [purpose, queue, results, startedAt, strategy, testId]);

  // Save to DB silently (best-effort, non-blocking)
  useEffect(() => {
    if (persistedRef.current) return;
    persistedRef.current = true;
    void persistExamSession({
        testId,
        mode: "practice",
        presetId: purpose === "diagnostic" ? "adaptive-diagnostic" : undefined,
        totalEarned,
        totalMax,
        startedAt: startedAt ? new Date(startedAt).toISOString() : undefined,
        timeUsedSec: startedAt ? Math.max(0, Math.round((Date.now() - startedAt) / 1000)) : undefined,
        clientMeta: { schemaVersion: 1, viewport: `${window.innerWidth}x${window.innerHeight}`, locale: navigator.language, practiceStrategy: strategy, purpose },
        answers: results.map((r) => ({
          questionId: r.questionId,
          type: r.type,
          selected: r.type === "mcq" ? r.selected ?? undefined : undefined,
          work: r.type === "long" ? r.work ?? undefined : undefined,
          earned: r.earned ?? (r.correct ? 1 : 0),
          max: r.max ?? 1,
          feedback: r.feedback ?? undefined,
          timeSpentSec: r.timeSpentSec,
          answerChanges: r.answerChanges ?? 0,
          visits: r.visits ?? 1,
          firstSelected: r.firstSelected ?? r.selected,
        })),
      }).then((id) => setSavedSessionId(id));
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

      <DiagnosisSummary diagnosis={diagnosis} />

      {diagnosis.issues.length > 0 && (
        <section className="mt-8 text-left">
          <h2 className="text-base font-bold">优先复盘</h2>
          <div className="mt-3 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {diagnosis.issues.slice(0, 5).map((item, index) => {
              const question = questionById.get(item.questionId);
              if (!question) return null;
              return (
                <div key={item.questionId} className="py-4">
                  <p className="text-xs font-medium text-[var(--ink-faint)]">第 {index + 1} 题 · {question.topicId}</p>
                  <QuestionDiagnosis diagnosis={item} question={question} compact returnTo={`/tests/${testId}/practice?resume=1`} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        {savedSessionId && (
          <Link
            href={`/tests/${testId}/history/${savedSessionId}?returnTo=${encodeURIComponent(`/tests/${testId}/practice?resume=1`)}`}
            onClick={forceFullNavigation}
            className="px-6 py-3 rounded-xl border border-[var(--indigo)] font-medium text-[var(--indigo)]"
          >
            查看完整报告
          </Link>
        )}
        <button
          type="button"
          onClick={onRestart}
          className="px-6 py-3 rounded-xl bg-[var(--indigo)] text-white font-medium hover:bg-[var(--indigo-hover)]"
        >
          再练一轮
        </button>
        <Link
          href={`/tests/${testId}?tab=analysis&returnTo=${encodeURIComponent(`/tests/${testId}/practice?resume=1`)}`}
          onClick={forceFullNavigation}
          className="px-6 py-3 rounded-xl border border-[var(--border)] font-medium hover:bg-[var(--surface)]"
        >
          查看能力画像
        </Link>
      </div>
    </div>
  );
}
