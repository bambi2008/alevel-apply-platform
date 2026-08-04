"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { MathRenderer } from "@/components/math-renderer";
import type { GradeRequest, GradeResponse } from "@/app/api/grade-answer/route";
import type { MockPaper } from "@/lib/tests/mock-papers";
import type { LongQuestion } from "@/lib/tests/questions/types";
import { getCountedResults } from "@/lib/tests/mock-papers/scoring";
import { DiagnosisSummary, QuestionDiagnosis } from "@/components/exam-diagnosis";
import { buildSessionDiagnosis, diagnoseAnswer } from "@/lib/tests/diagnosis";
import { persistExamSession } from "@/lib/tests/persist-session";
import { createAttemptId, examAttemptKey, parseExamAttempt, remainingAttemptSeconds, type ExamAttemptSnapshot } from "@/lib/tests/exam-progress";
import { useExamReliability } from "@/hooks/use-exam-reliability";
import { ExamReliabilityStatus } from "@/components/exam-reliability-status";
import { GradingTrustPanel } from "@/components/grading-trust-panel";
import { clearRemoteProgress, loadRemoteProgress, saveRemoteProgress } from "@/lib/learning/client";

type Phase = "briefing" | "running" | "grading" | "results";
type WrittenWorks = Record<string, Record<string, string>>;
type WrittenAttemptPayload = { currentIndex: number; works: WrittenWorks };

interface WrittenGrade {
  questionId: string;
  grading?: GradeResponse;
  error?: string;
}

function isWrittenAttemptPayload(payload: unknown): payload is WrittenAttemptPayload {
  if (!payload || typeof payload !== "object") return false;
  const value = payload as Partial<WrittenAttemptPayload>;
  return Number.isInteger(value.currentIndex) && Boolean(value.works && typeof value.works === "object");
}

const TOPIC_LABELS: Record<string, string> = {
  "bmo-number": "数论",
  "bmo-algebra": "代数与不等式",
  "bmo-geometry": "几何",
  "bmo-combinatorics": "组合",
  "bpho-mechanics": "力学",
  "bpho-waves": "波动与光学",
  "bpho-em": "电磁学",
  "bpho-thermal": "热学",
  "bpho-modern": "近代物理",
  "mat-poly": "多项式与代数",
  "mat-trig": "三角函数",
  "mat-calc": "微积分",
  "mat-log": "对数与指数",
  "mat-geo": "坐标几何",
  "mat-seq": "数列与级数",
  "mat-logic": "逻辑与证明",
  "pat-mech": "力学",
  "pat-em": "电磁学",
  "pat-wave": "波动与光学",
  "pat-thermo": "热力学",
  "pat-modern": "现代物理",
  "pat-math": "数学工具",
  "step-pure1": "纯数：代数",
  "step-pure2": "纯数：微积分",
  "step-pure3": "纯数：曲线与几何",
  "step-pure4": "纯数：复数",
  "step-pure5": "纯数：线性代数",
  "step-mech": "力学",
  "step-stats": "统计与概率",
  "lnat-essay": "LNAT 议论文写作",
  "tara-writing": "TARA 写作任务",
  "ielts-writing": "IELTS Academic Writing",
};

const TEST_LABELS: Record<string, string> = {
  mat: "MAT",
  pat: "PAT",
  step: "STEP",
  bmo: "BMO",
  bpho: "BPhO",
  lnat: "LNAT",
  tara: "TARA",
  ielts: "IELTS",
};

const ESSAY_PROMPT_KEY = "__selectedPrompt";

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

const DEFAULT_INSTRUCTIONS: Record<string, string[]> = {
  bmo: [
    "每题 10 分，必须写出完整证明过程。",
    "结论必须由清晰、完整的数学论证支持。",
    "题目固定，不随机抽取，适合复盘和阶段比较。",
    "AI 评分失败的题目会标记为待自评，不会按零分计入。",
  ],
  bpho: [
    "Section 1 共 13 题、50 分；Section 2 共 2 题、50 分。",
    "请写出物理原理、关键公式、代入过程和带单位的结论。",
    "题目固定，不随机抽取，适合复盘和阶段比较。",
    "AI 评分失败的题目会标记为待自评，不会按零分计入。",
  ],
};

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

export function WrittenPaperRunner({ paper }: { paper: MockPaper }) {
  const questions = paper.modules.flatMap((module) => module.questions).filter(
    (question): question is LongQuestion => question.type === "long"
  );
  const durationSec = paper.modules.reduce((sum, module) => sum + module.durationSec, 0);
  const totalMarks = paper.bestQuestionCount
    ? [...questions]
        .sort((a, b) => b.totalMarks - a.totalMarks)
        .slice(0, paper.bestQuestionCount)
        .reduce((sum, question) => sum + question.totalMarks, 0)
    : questions.reduce((sum, question) => sum + question.totalMarks, 0);
  const testLabel = TEST_LABELS[paper.testId] ?? paper.testId.toUpperCase();
  const isEssayPaper = questions.some((question) => question.responseKind === "essay");
  const instructions = paper.instructions ?? DEFAULT_INSTRUCTIONS[paper.testId] ?? [
    "每题都应写出关键推导、必要说明和最终结论。",
    "题目固定，不随机抽取，适合复盘和阶段比较。",
    "AI 评分失败的题目会标记为待自评，不会按零分计入。",
  ];
  const [phase, setPhase] = useState<Phase>("briefing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [works, setWorks] = useState<WrittenWorks>({});
  const [timeLeft, setTimeLeft] = useState(durationSec);
  const [grades, setGrades] = useState<WrittenGrade[]>([]);
  const [gradingProgress, setGradingProgress] = useState(0);
  const [timeUsedSec, setTimeUsedSec] = useState(0);
  const [startedAtMs, setStartedAtMs] = useState(0);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [savedAttempt, setSavedAttempt] = useState<ExamAttemptSnapshot<WrittenAttemptPayload> | null>(null);
  const startedAt = useRef(0);
  const deadlineAt = useRef(0);
  const submittingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastRemoteSaveRef = useRef(0);
  const storageKey = examAttemptKey("written", paper.id);
  const { online } = useExamReliability(phase === "running" || phase === "grading");

  useEffect(() => {
    let cancelled = false;
    const local = parseExamAttempt(
      window.localStorage.getItem(storageKey),
      { runner: "written", testId: paper.testId, scopeId: paper.id },
      isWrittenAttemptPayload,
    );
    void loadRemoteProgress<ExamAttemptSnapshot<WrittenAttemptPayload>>("WRITTEN_EXAM", paper.id).then((remoteRaw) => {
      if (cancelled) return;
      const remote = parseExamAttempt(
        remoteRaw ? JSON.stringify(remoteRaw) : null,
        { runner: "written", testId: paper.testId, scopeId: paper.id },
        isWrittenAttemptPayload,
      );
      const restored = !local ? remote : !remote ? local : remote.savedAt > local.savedAt ? remote : local;
      if (restored) setSavedAttempt(restored);
    });
    return () => { cancelled = true; };
  }, [paper.id, paper.testId, storageKey]);

  const begin = () => {
    window.localStorage.removeItem(storageKey);
    void clearRemoteProgress("WRITTEN_EXAM", paper.id);
    setWorks(Object.fromEntries(questions.map((question) => [question.id, {}])));
    setCurrentIndex(0);
    setTimeLeft(durationSec);
    setGrades([]);
    setGradingProgress(0);
    setTimeUsedSec(0);
    setValidationMessage(null);
    submittingRef.current = false;
    startedAt.current = Date.now();
    deadlineAt.current = startedAt.current + durationSec * 1000;
    setStartedAtMs(startedAt.current);
    setSavedAttempt(null);
    setPhase("running");
  };

  const resume = () => {
    if (!savedAttempt) return;
    setWorks(savedAttempt.payload.works);
    setCurrentIndex(Math.min(savedAttempt.payload.currentIndex, questions.length - 1));
    setTimeLeft(remainingAttemptSeconds(savedAttempt.deadlineAt));
    startedAt.current = savedAttempt.startedAt;
    deadlineAt.current = savedAttempt.deadlineAt;
    setStartedAtMs(savedAttempt.startedAt);
    setSavedAttempt(null);
    setPhase("running");
  };

  const updateWork = (questionId: string, label: string, value: string) => {
    setValidationMessage(null);
    setWorks((current) => ({
      ...current,
      [questionId]: { ...current[questionId], [label]: value },
    }));
  };

  const isAnswered = (question: LongQuestion) => question.parts.some(
    (part) => (works[question.id]?.[part.label] ?? "").trim().length > 0
  );

  const submit = async (force = false) => {
    if (submittingRef.current) return;
    if (!force) {
      for (const question of questions.filter((item) => item.responseKind === "essay" && isAnswered(item))) {
        if (!works[question.id]?.[ESSAY_PROMPT_KEY]) {
          setValidationMessage("请先选择一道写作题目，再提交作答。");
          return;
        }
        const overLimit = question.parts.some((part) => countWords(works[question.id]?.[part.label] ?? "") > (question.maxWords ?? Infinity));
        if (overLimit) {
          setValidationMessage(`作答超过 ${question.maxWords} 词上限，请精简后再提交。`);
          return;
        }
      }
    }
    submittingRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    window.localStorage.removeItem(storageKey);
    void clearRemoteProgress("WRITTEN_EXAM", paper.id);
    setTimeUsedSec(Math.min(durationSec, Math.max(0, Math.round((Date.now() - startedAt.current) / 1000))));
    setPhase("grading");
    const nextGrades: WrittenGrade[] = [];

    for (const question of questions) {
      const answered = isAnswered(question);
      if (!answered) {
        nextGrades.push({
          questionId: question.id,
          grading: {
            questionId: question.id,
            totalEarned: 0,
            totalMax: question.totalMarks,
            perPart: question.parts.map((part) => ({
              label: part.label,
              earned: 0,
              max: part.marks,
              feedback: "本小题未作答。",
              keyStepsFound: [],
              keyStepsMissing: [],
              evidence: [],
            })),
            overallFeedback: "本题未作答，计 0 分。",
            modelSolution: question.fullSolution,
            assessment: {
              method: "deterministic-empty",
              confidence: "high",
              reviewStatus: "accepted",
              scoreDelta: 0,
              passScores: [0],
              agreementRate: 100,
              rationale: "空白答案由确定性规则处理，未调用 AI。",
            },
          },
        });
        setGradingProgress(nextGrades.length);
        continue;
      }
      try {
        const selectedPrompt = question.essayPrompts?.find(
          (prompt) => prompt.id === works[question.id]?.[ESSAY_PROMPT_KEY]
        );
        const payload: GradeRequest = {
          questionId: question.id,
          testId: question.testId,
          questionContext: [question.context, selectedPrompt ? `Selected prompt: ${selectedPrompt.title}` : undefined].filter(Boolean).join("\n\n"),
          parts: question.parts.map((part) => ({
            label: part.label,
            question: selectedPrompt ? `${part.question}\nSelected prompt: ${selectedPrompt.title}` : part.question,
            marks: part.marks,
            solutionOutline: part.solutionOutline,
            studentWork: works[question.id]?.[part.label] ?? "",
          })),
          fullSolution: question.fullSolution,
          responseKind: question.responseKind,
          rubricDimensions: question.rubricDimensions,
        };
        const response = await fetch("/api/grade-answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          nextGrades.push({ questionId: question.id, error: "AI 评分暂不可用" });
        } else {
          nextGrades.push({ questionId: question.id, grading: await response.json() as GradeResponse });
        }
      } catch {
        nextGrades.push({ questionId: question.id, error: "AI 评分连接失败" });
      }
      setGradingProgress(nextGrades.length);
    }

    setGrades(nextGrades);
    setPhase("results");
  };

  const handleAutoSubmit = useEffectEvent(() => {
    void submit(true);
  });

  useEffect(() => {
    if (phase !== "running") return;
    const tick = () => {
      const remaining = remainingAttemptSeconds(deadlineAt.current);
      setTimeLeft(remaining);
      if (remaining === 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        handleAutoSubmit();
      }
    };
    timerRef.current = setInterval(tick, 1000);
    tick();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  useEffect(() => {
    if (phase !== "running" || !startedAt.current || !deadlineAt.current) return;
    const snapshot: ExamAttemptSnapshot<WrittenAttemptPayload> = {
      version: 2,
      attemptId: createAttemptId(paper.testId, paper.id, startedAt.current),
      runner: "written",
      testId: paper.testId,
      scopeId: paper.id,
      startedAt: startedAt.current,
      deadlineAt: deadlineAt.current,
      savedAt: Date.now(),
      payload: { currentIndex, works },
    };
    window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
    if (Date.now() - lastRemoteSaveRef.current >= 10_000) {
      lastRemoteSaveRef.current = Date.now();
      void saveRemoteProgress({
        kind: "WRITTEN_EXAM",
        resourceId: paper.id,
        payload: snapshot,
        startedAt: new Date(snapshot.startedAt).toISOString(),
        testId: paper.testId,
        mode: paper.id.toLowerCase().includes("diagnostic") ? "diagnostic" : "paper",
      });
    }
  }, [currentIndex, paper.id, paper.testId, phase, storageKey, timeLeft, works]);

  if (phase === "briefing") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link href={`/tests/${paper.testId}`} className="text-sm text-[var(--indigo)] hover:underline">
          ← 返回 {testLabel}
        </Link>
        <p className="mt-8 text-xs font-semibold uppercase text-[var(--ink-faint)]">Fixed written paper</p>
        <h1 className="mt-2 text-2xl font-bold text-[var(--ink)]">{paper.title}</h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">{paper.titleEn}</p>
        <p className="mt-5 text-sm leading-7 text-[var(--ink-soft)]">{paper.description}</p>

        <div className="mt-7 grid grid-cols-3 border-y border-[var(--border)] py-4 text-center">
          <div><strong className="block text-xl">{Math.round(durationSec / 60)}</strong><span className="text-xs text-[var(--ink-faint)]">分钟</span></div>
          <div><strong className="block text-xl">{questions.length}</strong><span className="text-xs text-[var(--ink-faint)]">{isEssayPaper ? "写作任务" : "书面题"}</span></div>
          <div><strong className="block text-xl">{totalMarks}</strong><span className="text-xs text-[var(--ink-faint)]">{isEssayPaper ? "训练量表" : "计分上限"}</span></div>
        </div>

        <ul className="mt-6 space-y-2 text-sm text-[var(--ink-soft)]">
          {instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}
        </ul>
        {savedAttempt && (
          <div className="mt-5 border-l-2 border-[var(--indigo)] bg-[var(--info-bg)] px-4 py-3">
            <p className="text-sm font-semibold">发现未完成的书面卷</p>
            <p className="mt-1 text-xs text-[var(--ink-soft)]">第 {savedAttempt.payload.currentIndex + 1} 题 · 剩余约 {Math.ceil(remainingAttemptSeconds(savedAttempt.deadlineAt) / 60)} 分钟</p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => { window.localStorage.removeItem(storageKey); void clearRemoteProgress("WRITTEN_EXAM", paper.id); setSavedAttempt(null); }} className="rounded border border-[var(--border)] px-3 py-2 text-xs">放弃进度</button>
              <button type="button" onClick={resume} className="rounded bg-[var(--indigo)] px-3 py-2 text-xs font-semibold text-white">继续作答</button>
            </div>
          </div>
        )}
        <button type="button" onClick={begin} className="mt-8 w-full rounded-md bg-[var(--indigo)] py-3 text-sm font-semibold text-white hover:bg-[var(--indigo-hover)]">
          {savedAttempt ? "放弃进度并重新开始" : isEssayPaper ? "开始写作任务" : "开始书面考试"}
        </button>
      </div>
    );
  }

  if (phase === "grading") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <ExamReliabilityStatus online={online} />
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--indigo)]" />
        <h1 className="mt-5 text-xl font-bold">{isEssayPaper ? "正在按写作量表生成反馈" : "正在按证明步骤评分"}</h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">已完成 {gradingProgress} / {questions.length} 题</p>
      </div>
    );
  }

  if (phase === "results") {
    return (
      <WrittenPaperResults
        paper={paper}
        questions={questions}
        works={works}
        grades={grades}
        timeUsedSec={timeUsedSec}
        startedAtMs={startedAtMs}
        onRetry={begin}
      />
    );
  }

  const current = questions[currentIndex];
  const currentModule = paper.modules.find((module) =>
    module.questions.some((question) => question.id === current.id)
  );
  const currentSectionLabel = paper.modules.length > 1
    ? currentModule?.title.split("·")[0]?.trim()
    : undefined;
  const answered = questions.filter(isAnswered).length;
  const selectedPromptId = works[current.id]?.[ESSAY_PROMPT_KEY];

  return (
    <div className="min-h-screen bg-white">
      <ExamReliabilityStatus online={online} />
      <header className="sticky top-16 z-20 border-b border-[var(--border)] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{paper.title}</p>
            <p className="text-xs text-[var(--ink-faint)]">{answered}/{questions.length} 已作答</p>
          </div>
          <span className={`font-mono text-lg font-bold tabular-nums ${timeLeft < 600 ? "text-[var(--danger)]" : "text-[var(--ink)]"}`}>
            {formatTime(timeLeft)}
          </span>
          <button type="button" onClick={() => void submit()} className="rounded-md bg-[var(--indigo)] px-3 py-2 text-xs font-semibold text-white">
            交卷
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-7 md:grid-cols-[120px_1fr]">
        <nav aria-label="题目导航" className="grid grid-cols-6 gap-2 md:block md:space-y-2">
          {questions.map((question, index) => {
            const done = Object.values(works[question.id] ?? {}).some((value) => value.trim());
            return (
              <button
                key={question.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-10 w-full rounded-md border text-sm font-semibold ${
                  index === currentIndex
                    ? "border-[var(--indigo)] bg-[var(--indigo)] text-white"
                    : done
                      ? "border-[color:var(--indigo)]/30 bg-[var(--info-bg)] text-[var(--indigo)]"
                      : "border-[var(--border)] text-[var(--ink-soft)]"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </nav>

        <section className="min-w-0">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <span className="text-sm font-semibold">第 {currentIndex + 1} 题</span>
            <span className="text-right text-xs text-[var(--ink-faint)]">
              {currentSectionLabel ? `${currentSectionLabel} · ` : ""}{TOPIC_LABELS[current.topicId] ?? current.topicId} · {current.totalMarks} 分
            </span>
          </div>
          {current.context && <MathRenderer text={current.context} className="mt-5 text-sm leading-7 text-[var(--ink)]" block />}

          {validationMessage && (
            <p role="alert" className="mt-4 border-l-2 border-[var(--danger)] pl-3 text-sm text-[var(--danger)]">
              {validationMessage}
            </p>
          )}

          {current.responseKind === "essay" && current.essayPrompts && (
            <fieldset className="mt-6">
              <legend className="text-sm font-semibold">选择一个题目</legend>
              <div className="mt-3 space-y-2">
                {current.essayPrompts.map((prompt) => {
                  const selected = selectedPromptId === prompt.id;
                  return (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => updateWork(current.id, ESSAY_PROMPT_KEY, prompt.id)}
                      className={`flex w-full items-start gap-3 rounded-md border px-3 py-3 text-left text-sm transition ${selected ? "border-[var(--indigo)] bg-[var(--info-bg)]" : "border-[var(--border)] hover:border-[color:var(--indigo)]/40"}`}
                    >
                      <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${selected ? "border-[var(--indigo)] bg-[var(--indigo)] text-white" : "border-[var(--border)] text-[var(--ink-faint)]"}`}>{prompt.id}</span>
                      <span>{prompt.title}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div className="mt-7 space-y-7">
            {current.parts.map((part) => (
              <div key={part.label}>
                <div className="mb-2 flex items-start justify-between gap-4 text-sm">
                  <MathRenderer text={`${part.label}. ${part.question}`} className="leading-6" />
                  <span className="shrink-0 text-xs text-[var(--ink-faint)]">{part.marks} 分</span>
                </div>
                <textarea
                  value={works[current.id]?.[part.label] ?? ""}
                  onChange={(event) => updateWork(current.id, part.label, event.target.value)}
                  rows={current.responseKind === "essay" ? 22 : 7}
                  placeholder={current.responseKind === "essay" ? "在此输入英文作文……" : "写出定义、关键推导与结论……"}
                  className="w-full resize-y rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-sm leading-6 outline-none focus:border-[var(--indigo)] focus:ring-2 focus:ring-[color:var(--indigo)]/10"
                />
                {current.responseKind === "essay" && (
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[var(--ink-faint)]">
                      建议 {current.recommendedWords?.[0]}–{current.recommendedWords?.[1]} 词 · 上限 {current.maxWords} 词
                    </span>
                    <span className={countWords(works[current.id]?.[part.label] ?? "") > (current.maxWords ?? Infinity) ? "font-semibold text-[var(--danger)]" : "font-semibold text-[var(--ink-soft)]"}>
                      {countWords(works[current.id]?.[part.label] ?? "")} 词
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between border-t border-[var(--border)] pt-5">
            <button type="button" disabled={currentIndex === 0} onClick={() => setCurrentIndex((index) => index - 1)} className="text-sm text-[var(--ink-soft)] disabled:opacity-30">← 上一题</button>
            {currentIndex < questions.length - 1 ? (
              <button type="button" onClick={() => setCurrentIndex((index) => index + 1)} className="text-sm font-semibold text-[var(--indigo)]">下一题 →</button>
            ) : (
              <button type="button" onClick={() => void submit()} className="text-sm font-semibold text-[var(--indigo)]">完成并交卷 →</button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function WrittenPaperResults({
  paper,
  questions,
  works,
  grades,
  timeUsedSec,
  startedAtMs,
  onRetry,
}: {
  paper: MockPaper;
  questions: LongQuestion[];
  works: WrittenWorks;
  grades: WrittenGrade[];
  timeUsedSec: number;
  startedAtMs: number;
  onRetry: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const persistedRef = useRef(false);
  const graded = grades.filter((result) => result.grading);
  const scoredGrades = getCountedResults(grades, paper.bestQuestionCount);
  const earned = scoredGrades.reduce((sum, result) => sum + (result.grading?.totalEarned ?? 0), 0);
  const max = scoredGrades.reduce((sum, result) => sum + (result.grading?.totalMax ?? 0), 0);
  const pending = grades.length - graded.length;
  const reviewRecommended = graded.filter(
    (result) => result.grading?.assessment.reviewStatus === "review-recommended"
  ).length;
  const topicRows = [...new Set(questions.map((question) => question.topicId))].map((topicId) => {
    const topicQuestions = questions.filter((question) => question.topicId === topicId);
    const topicGrades = scoredGrades.filter((result) => topicQuestions.some((question) => question.id === result.questionId));
    return {
      topicId,
      earned: topicGrades.reduce((sum, result) => sum + (result.grading?.totalEarned ?? 0), 0),
      max: topicGrades.reduce((sum, result) => sum + (result.grading?.totalMax ?? 0), 0),
    };
  });
  const missingSteps = graded.flatMap((result) => result.grading?.perPart.flatMap((part) => part.keyStepsMissing) ?? []).slice(0, 6);
  const diagnosis = buildSessionDiagnosis(questions.flatMap((question) => {
    const result = grades.find((item) => item.questionId === question.id);
    return result?.grading ? [{
      question,
      work: works[question.id],
      earned: result.grading.totalEarned,
      max: result.grading.totalMax,
      feedback: result.grading.perPart,
    }] : [];
  }));

  useEffect(() => {
    if (persistedRef.current) return;
    persistedRef.current = true;
    const payload = {
      testId: paper.testId,
      mode: "paper",
      paperId: paper.id,
      startedAt: startedAtMs ? new Date(startedAtMs).toISOString() : undefined,
      totalEarned: earned,
      totalMax: max,
      timeUsedSec,
      clientMeta: { schemaVersion: 1, viewport: `${window.innerWidth}x${window.innerHeight}`, locale: navigator.language },
      answers: questions.map((question) => {
        const result = grades.find((item) => item.questionId === question.id);
        return {
          questionId: question.id,
          type: "long" as const,
          work: works[question.id] ?? {},
          earned: result?.grading?.totalEarned ?? 0,
          max: result?.grading?.totalMax ?? 0,
          feedback: result?.grading?.perPart.map((part) => ({
            ...part,
            assessment: result.grading?.assessment,
          })),
        };
      }),
    };
    void persistExamSession(payload).then((id) => setSavedSessionId(id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-xs font-semibold uppercase text-[var(--ink-faint)]">Written paper report</p>
       <h1 className="mt-2 text-2xl font-bold">{paper.title} · {questions.some((question) => question.responseKind === "essay") ? "写作反馈" : "整卷报告"}</h1>

      <div className="mt-7 grid gap-px bg-[var(--border)] sm:grid-cols-4">
        <div className="bg-white p-4"><strong className="block text-2xl">{earned}/{max || "-"}</strong><span className="text-xs text-[var(--ink-faint)]">{questions.some((question) => question.responseKind === "essay") ? "训练量表得分" : paper.bestQuestionCount ? `最高 ${paper.bestQuestionCount} 题得分` : "已评分得分"}</span></div>
        <div className="bg-white p-4"><strong className="block text-2xl">{max ? Math.round(earned / max * 100) : 0}%</strong><span className="text-xs text-[var(--ink-faint)]">已评分得分率</span></div>
        <div className="bg-white p-4"><strong className="block text-2xl">{Math.round(timeUsedSec / 60)}</strong><span className="text-xs text-[var(--ink-faint)]">用时（分钟）</span></div>
        <div className="bg-white p-4"><strong className="block text-2xl">{pending + reviewRecommended}</strong><span className="text-xs text-[var(--ink-faint)]">待自评 / 复核</span></div>
      </div>

      {pending > 0 && (
        <p className="mt-4 border-l-2 border-[var(--warning)] pl-3 text-sm text-[var(--warning)]">
          待自评题目未按零分处理，也未计入得分率。
        </p>
      )}
      {reviewRecommended > 0 && (
        <p className="mt-4 border-l-2 border-[var(--warning)] pl-3 text-sm text-[var(--warning)]">
          {reviewRecommended} 道题的独立阅卷分歧超过阈值，已完成自动裁决，但仍建议对照评分标准复核。
        </p>
      )}

      <DiagnosisSummary diagnosis={diagnosis} />

      <section className="mt-9">
        <h2 className="text-base font-bold">主题表现</h2>
        <div className="mt-3 divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {topicRows.map((row) => (
            <div key={row.topicId} className="flex items-center justify-between py-3 text-sm">
              <span>{TOPIC_LABELS[row.topicId] ?? row.topicId}</span>
              <span className="font-semibold">{row.max ? `${row.earned}/${row.max}` : "待自评"}</span>
            </div>
          ))}
        </div>
      </section>

      {missingSteps.length > 0 && (
        <section className="mt-9">
          <h2 className="text-base font-bold">高频失分点</h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--ink-soft)]">
            {missingSteps.map((step, index) => <li key={`${step}-${index}`}>• {step}</li>)}
          </ul>
        </section>
      )}

      <section className="mt-9">
        <h2 className="text-base font-bold">逐题评分</h2>
        <div className="mt-3 divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {questions.map((question, index) => {
            const result = grades.find((item) => item.questionId === question.id);
            const open = expandedId === question.id;
            const itemDiagnosis = result?.grading ? diagnoseAnswer({
              question,
              work: works[question.id],
              earned: result.grading.totalEarned,
              max: result.grading.totalMax,
              feedback: result.grading.perPart,
            }) : null;
            return (
              <div key={question.id}>
                <button type="button" onClick={() => setExpandedId(open ? null : question.id)} className="flex w-full items-center gap-3 py-4 text-left">
                  <span className="text-xs text-[var(--ink-faint)]">Q{index + 1}</span>
                  <span className="flex-1 text-sm font-medium">{TOPIC_LABELS[question.topicId] ?? question.topicId}</span>
                  <strong className={result?.error ? "text-[var(--warning)]" : "text-[var(--ink)]"}>
                    {result?.grading ? `${result.grading.totalEarned}/${result.grading.totalMax}` : "待自评"}
                  </strong>
                  <span className="text-xs text-[var(--ink-faint)]">{open ? "收起" : "展开"}</span>
                </button>
                {open && (
                  <div className="pb-5 text-sm">
                    {result?.grading ? (
                      <div className="space-y-4">
                        <GradingTrustPanel assessment={result.grading.assessment} />
                        {result.grading.dimensions && result.grading.dimensions.length > 0 && (
                          <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
                            {result.grading.dimensions.map((dimension) => (
                              <div key={dimension.id} className="py-3">
                                <div className="flex justify-between font-semibold"><span>{dimension.label}</span><span>{dimension.earned}/{dimension.max}</span></div>
                                <p className="mt-1 text-[var(--ink-soft)]">{dimension.feedback}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {result.grading.perPart.map((part) => (
                          <div key={part.label} className="border-l-2 border-[var(--border)] pl-3">
                            <div className="flex justify-between font-semibold"><span>{part.label}</span><span>{part.earned}/{part.max}</span></div>
                            <p className="mt-1 text-[var(--ink-soft)]">{part.feedback}</p>
                            {part.evidence.length > 0 && (
                              <ul className="mt-2 space-y-1 text-xs text-[var(--ink-soft)]">
                                {part.evidence.map((item, evidenceIndex) => (
                                  <li key={`${item.criterion}-${evidenceIndex}`}>
                                    <span className="font-semibold">{item.marksAwarded} 分 · {item.criterion}</span>
                                    {item.quote && <span>：“{item.quote}”</span>}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                        <p className="text-[var(--ink-soft)]">{result.grading.overallFeedback}</p>
                        {itemDiagnosis && <QuestionDiagnosis diagnosis={itemDiagnosis} question={question} compact />}
                      </div>
                    ) : (
                      <div>
                        <p className="text-[var(--warning)]">{result?.error}。请对照下方评分要点自评。</p>
                        <div className="mt-4 space-y-3">
                          {question.parts.map((part) => (
                            <div key={part.label} className="border-l-2 border-[var(--border)] pl-3">
                              <div className="font-semibold">{part.label} · {part.marks} 分</div>
                              <MathRenderer text={part.solutionOutline} className="mt-1 text-[var(--ink-soft)]" block />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <details className="mt-4">
                      <summary className="cursor-pointer font-semibold text-[var(--indigo)]">{question.responseKind === "essay" ? "查看评分标准说明" : "查看完整参考解答"}</summary>
                      <MathRenderer text={question.fullSolution} className="mt-3 leading-7" block />
                    </details>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Link href={`/tests/${paper.testId}`} className="rounded-md border border-[var(--border)] py-3 text-center text-sm">返回 {TEST_LABELS[paper.testId] ?? paper.testId.toUpperCase()}</Link>
        {savedSessionId && <Link href={`/tests/${paper.testId}/history/${savedSessionId}`} className="rounded-md border border-[var(--indigo)] py-3 text-center text-sm font-semibold text-[var(--indigo)]">查看完整报告</Link>}
        <button type="button" onClick={onRetry} className="rounded-md bg-[var(--indigo)] py-3 text-sm font-semibold text-white">重做本卷</button>
      </div>
    </div>
  );
}
