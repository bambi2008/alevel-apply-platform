"use client";

import { useState, useEffect, useRef, useCallback, use } from "react";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getMockPaper, type MockPaper } from "@/lib/tests/mock-papers";
import type { MCQQuestion } from "@/lib/tests/questions/types";
import { MathRenderer } from "@/components/math-renderer";
import { WrittenPaperRunner } from "@/components/written-paper-runner";
import { ObjectiveExamRunner } from "@/components/objective-exam-runner";
import { ChevronLeft, ChevronRight, Flag, Send } from "lucide-react";
import { createQuestionTelemetry, type QuestionTelemetrySnapshot, type QuestionTelemetryTracker } from "@/lib/tests/telemetry";
import { persistExamSession } from "@/lib/tests/persist-session";

type Phase = "briefing" | "running" | "results";
type ObjectivePaper = Omit<MockPaper, "modules"> & {
  modules: Array<Omit<MockPaper["modules"][number], "questions"> & { questions: MCQQuestion[] }>;
};

export default function MockPaperPage({
  params,
}: {
  params: Promise<{ testId: string; paperId: string }>;
}) {
  const { testId, paperId } = use(params);
  const paper = getMockPaper(paperId);
  if (!paper || paper.testId !== testId) notFound();

  const hasWrittenQuestions = paper.modules.some((module) => module.questions.some((question) => question.type === "long"));
  return hasWrittenQuestions
    ? <WrittenPaperRunner paper={paper} />
    : paper.testId === "lnat"
      ? <LnatPaperRunner paper={paper as ObjectivePaper} />
    : paper.formatType === "legacy"
      ? <PaperRunner paper={paper as ObjectivePaper} />
      : <ObjectiveExamRunner paper={paper as ObjectivePaper} />;
}

function PaperRunner({ paper }: { paper: ObjectivePaper }) {
  const [phase, setPhase] = useState<Phase>("briefing");
  const [moduleIndex, setModuleIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);
  const telemetryRef = useRef<QuestionTelemetryTracker>(createQuestionTelemetry());
  const [startedAtValue, setStartedAtValue] = useState(0);
  const [timeUsedSec, setTimeUsedSec] = useState(0);
  const [behavior, setBehavior] = useState<Record<string, QuestionTelemetrySnapshot>>({});

  const currentModule = paper.modules[moduleIndex];

  // 进入某模块时重置倒计时
  const startModule = useCallback(
    (idx: number) => {
      setModuleIndex(idx);
      setTimeLeft(paper.modules[idx].durationSec);
    },
    [paper.modules]
  );

  const finish = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeUsedSec(startedAtRef.current ? Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000)) : 0);
    setBehavior(telemetryRef.current.snapshot(paper.modules.flatMap((module) => module.questions.map((question) => question.id))));
    setPhase("results");
  }, [paper.modules]);

  const nextModule = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (moduleIndex + 1 < paper.modules.length) {
      startModule(moduleIndex + 1);
    } else {
      finish();
    }
  }, [moduleIndex, paper.modules.length, startModule, finish]);

  // 倒计时
  useEffect(() => {
    if (phase !== "running") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          // 到点自动交卷进入下一模块
          setTimeout(() => nextModule(), 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, moduleIndex, nextModule]);

  const begin = () => {
    setAnswers({});
    startedAtRef.current = Date.now();
    setStartedAtValue(startedAtRef.current);
    telemetryRef.current = createQuestionTelemetry();
    setPhase("running");
    startModule(0);
  };

  const choose = (qid: string, key: string) => {
    telemetryRef.current.answer(qid, key);
    setAnswers((a) => ({ ...a, [qid]: key }));
  };

  if (phase === "briefing") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link href={`/tests/${paper.testId}`} className="text-sm text-blue-600 hover:underline">
          ← 返回 {paper.testId.toUpperCase()}
        </Link>
        <h1 className="text-2xl font-bold mt-4 mb-2">{paper.title}</h1>
        <p className="text-sm text-neutral-500 mb-6">{paper.titleEn}</p>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
          <p className="text-sm text-neutral-700 leading-relaxed">{paper.description}</p>
          <div className="space-y-2">
            {paper.modules.map((m, i) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
                <div>
                  <span className="text-sm font-medium text-neutral-800">模块 {i + 1} · {m.title}</span>
                  <p className="text-xs text-neutral-500">{m.questions.length} 题</p>
                </div>
                <span className="text-sm font-semibold text-blue-600">{Math.round(m.durationSec / 60)} 分钟</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-800">
            ⚠️ 每个模块独立计时，时间到会<strong>自动交卷</strong>并进入下一模块，期间不能返回上一模块。无负分，建议每题都作答。请预留完整的不被打断的时间。
          </div>
          <button
            onClick={begin}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            开始考试
          </button>
        </div>
      </div>
    );
  }

  if (phase === "running") {
    const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const ss = String(timeLeft % 60).padStart(2, "0");
    const urgent = timeLeft <= 60;
    const answeredInModule = currentModule.questions.filter((q) => answers[q.id]).length;

    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* 顶部模块计时条 */}
        <div className="sticky top-16 z-10 -mx-4 px-4 py-3 bg-white/95 backdrop-blur border-b border-neutral-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-500">模块 {moduleIndex + 1}/{paper.modules.length}</p>
            <p className="text-sm font-semibold text-neutral-800">{currentModule.title}</p>
          </div>
          <div className="text-right">
            <p className={`font-mono font-bold text-xl tabular-nums ${urgent ? "text-red-600" : "text-neutral-900"}`}>{mm}:{ss}</p>
            <p className="text-xs text-neutral-400">{answeredInModule}/{currentModule.questions.length} 已答</p>
          </div>
        </div>

        <div className="space-y-5 mt-5">
          {currentModule.questions.map((q, i) => (
            <McqCard key={q.id} q={q} index={i} selected={answers[q.id]} onChoose={(k) => choose(q.id, k)} />
          ))}
        </div>

        <button
          onClick={nextModule}
          className="w-full mt-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
        >
          {moduleIndex + 1 < paper.modules.length ? "交卷并进入下一模块 →" : "交卷并查看成绩"}
        </button>
        <p className="text-center text-xs text-neutral-400 mt-2">交卷后无法返回本模块</p>
      </div>
    );
  }

  // results
  return <PaperResults paper={paper} answers={answers} behavior={behavior} startedAt={startedAtValue} timeUsedSec={timeUsedSec} />;
}

function splitLnatQuestion(question: string): { passage: string; prompt: string } {
  const [passagePart, promptPart = ""] = question.split("**Question**");
  return {
    passage: passagePart.replace("**Passage**", "").trim(),
    prompt: promptPart.trim(),
  };
}

function LnatPaperRunner({ paper }: { paper: ObjectivePaper }) {
  const paperModule = paper.modules[0];
  const [phase, setPhase] = useState<Phase>("briefing");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewing, setReviewing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(paperModule.durationSec);
  const startedAtRef = useRef(0);
  const telemetryRef = useRef<QuestionTelemetryTracker>(createQuestionTelemetry());
  const [startedAtValue, setStartedAtValue] = useState(0);
  const [timeUsedSec, setTimeUsedSec] = useState(0);
  const [behavior, setBehavior] = useState<Record<string, QuestionTelemetrySnapshot>>({});

  const finish = useCallback(() => {
    setTimeUsedSec(startedAtRef.current ? Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000)) : 0);
    setBehavior(telemetryRef.current.snapshot(paperModule.questions.map((question) => question.id)));
    setReviewing(false);
    setPhase("results");
  }, [paperModule.questions]);

  useEffect(() => {
    if (phase !== "running") return;
    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);
          setTimeout(finish, 0);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [finish, phase]);

  const begin = () => {
    setAnswers({});
    setFlagged({});
    setCurrentIndex(0);
    setReviewing(false);
    setTimeLeft(paperModule.durationSec);
    startedAtRef.current = Date.now();
    setStartedAtValue(startedAtRef.current);
    telemetryRef.current = createQuestionTelemetry();
    setPhase("running");
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    if (phase === "running" && !reviewing) telemetryRef.current.visit(paperModule.questions[currentIndex].id);
  }, [currentIndex, paperModule.questions, phase, reviewing]);

  const moveToQuestion = (index: number) => {
    setCurrentIndex(index);
    setReviewing(false);
    window.scrollTo({ top: 0 });
  };

  if (phase === "briefing") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/tests/lnat" className="text-sm text-blue-600 hover:underline">← 返回 LNAT</Link>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">{paper.title}</h1>
        <p className="mt-1 text-sm text-neutral-500">{paper.titleEn}</p>
        <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-6">
          <p className="text-sm leading-relaxed text-neutral-700">{paper.description}</p>
          <div className="mt-5 grid grid-cols-3 gap-3 border-y border-neutral-100 py-4 text-center">
            <div><p className="text-xl font-semibold text-neutral-900">12</p><p className="text-xs text-neutral-500">篇文章</p></div>
            <div><p className="text-xl font-semibold text-neutral-900">42</p><p className="text-xs text-neutral-500">道题</p></div>
            <div><p className="text-xl font-semibold text-neutral-900">95</p><p className="text-xs text-neutral-500">分钟</p></div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-neutral-500">考试期间可以前后切换题目并标记复查。倒计时结束后系统自动交卷；选择题无负分。</p>
          <button type="button" onClick={begin} className="mt-5 w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700">
            开始考试
          </button>
        </div>
      </div>
    );
  }

  if (phase === "results") return <PaperResults paper={paper} answers={answers} behavior={behavior} startedAt={startedAtValue} timeUsedSec={timeUsedSec} />;

  const question = paperModule.questions[currentIndex];
  const { passage, prompt } = splitLnatQuestion(question.question);
  const answeredCount = paperModule.questions.filter((item) => answers[item.id]).length;
  const flaggedCount = paperModule.questions.filter((item) => flagged[item.id]).length;
  const unanswered = paperModule.questions.length - answeredCount;
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  const urgent = timeLeft <= 60;

  if (reviewing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <p className="text-xs text-neutral-500">交卷总览</p>
            <h1 className="text-xl font-semibold text-neutral-900">检查作答状态</h1>
          </div>
          <p className={`font-mono text-xl font-bold tabular-nums ${urgent ? "text-red-600" : "text-neutral-900"}`}>{mm}:{ss}</p>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="border-r border-neutral-200"><p className="text-2xl font-semibold text-green-700">{answeredCount}</p><p className="text-xs text-neutral-500">已答</p></div>
          <div className="border-r border-neutral-200"><p className="text-2xl font-semibold text-amber-700">{unanswered}</p><p className="text-xs text-neutral-500">未答</p></div>
          <div><p className="text-2xl font-semibold text-blue-700">{flaggedCount}</p><p className="text-xs text-neutral-500">已标记</p></div>
        </div>
        <div className="mt-6 grid grid-cols-7 gap-2 sm:grid-cols-10">
          {paperModule.questions.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => moveToQuestion(index)}
              className={`aspect-square rounded border text-sm font-medium ${
                flagged[item.id]
                  ? "border-amber-400 bg-amber-50 text-amber-800"
                  : answers[item.id]
                    ? "border-green-300 bg-green-50 text-green-800"
                    : "border-neutral-300 bg-white text-neutral-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        {unanswered > 0 && <p className="mt-5 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">还有 {unanswered} 题未作答。LNAT 不倒扣分，建议检查后再提交。</p>}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <button type="button" onClick={() => moveToQuestion(currentIndex)} className="flex-1 rounded-lg border border-neutral-300 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50">返回检查</button>
          <button type="button" onClick={finish} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700">
            <Send size={16} /> 确认交卷
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6">
      <div className="sticky top-16 z-10 -mx-4 flex items-center justify-between border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div>
          <p className="text-xs text-neutral-500">Section A · Q{currentIndex + 1}/42</p>
          <p className="text-sm font-medium text-neutral-800">{answeredCount}/42 已答 · {flaggedCount} 标记</p>
        </div>
        <div className="flex items-center gap-3">
          <p className={`font-mono text-xl font-bold tabular-nums ${urgent ? "text-red-600" : "text-neutral-900"}`}>{mm}:{ss}</p>
          <button type="button" onClick={() => setReviewing(true)} title="交卷总览" className="flex h-9 items-center gap-1.5 rounded border border-neutral-300 px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
            <Send size={15} /> <span className="hidden sm:inline">交卷</span>
          </button>
        </div>
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <section className="rounded-lg border border-neutral-200 bg-white p-5 lg:sticky lg:top-32 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto">
          <p className="mb-3 text-xs font-semibold uppercase text-neutral-400">Passage</p>
          <MathRenderer text={passage} className="text-[15px] leading-7 text-neutral-800" block />
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-semibold text-neutral-400">QUESTION {currentIndex + 1}</p>
            <button
              type="button"
              onClick={() => setFlagged((current) => {
                const next = !current[question.id];
                telemetryRef.current.flag(question.id, next);
                return { ...current, [question.id]: next };
              })}
              title={flagged[question.id] ? "取消标记" : "标记复查"}
              className={`flex h-8 items-center gap-1.5 rounded border px-2.5 text-xs font-medium ${flagged[question.id] ? "border-amber-400 bg-amber-50 text-amber-800" : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"}`}
            >
              <Flag size={14} fill={flagged[question.id] ? "currentColor" : "none"} /> {flagged[question.id] ? "已标记" : "标记"}
            </button>
          </div>
          <MathRenderer text={prompt} className="mt-3 text-base font-medium leading-7 text-neutral-900" block />
          <div className="mt-5 space-y-2">
            {question.options.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => {
                  telemetryRef.current.answer(question.id, option.key);
                  setAnswers((current) => ({ ...current, [question.id]: option.key }));
                }}
                className={`flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left transition ${answers[question.id] === option.key ? "border-blue-500 bg-blue-50" : "border-neutral-200 hover:bg-neutral-50"}`}
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${answers[question.id] === option.key ? "border-blue-500 bg-blue-600 text-white" : "border-neutral-300 text-neutral-500"}`}>{option.key}</span>
                <MathRenderer text={option.text} className="flex-1 text-sm leading-6 text-neutral-800" />
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
            <button type="button" disabled={currentIndex === 0} onClick={() => moveToQuestion(currentIndex - 1)} title="上一题" className="flex h-9 items-center gap-1 rounded border border-neutral-300 px-3 text-sm text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronLeft size={16} /> 上一题
            </button>
            <button type="button" onClick={() => currentIndex === 41 ? setReviewing(true) : moveToQuestion(currentIndex + 1)} title={currentIndex === 41 ? "交卷总览" : "下一题"} className="flex h-9 items-center gap-1 rounded bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700">
              {currentIndex === 41 ? "查看总览" : "下一题"} <ChevronRight size={16} />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1.5 border-t border-neutral-100 pt-4">
            {paperModule.questions.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => moveToQuestion(index)}
                title={`第 ${index + 1} 题`}
                className={`aspect-square rounded border text-xs font-medium ${
                  index === currentIndex
                    ? "border-blue-600 bg-blue-600 text-white"
                    : flagged[item.id]
                      ? "border-amber-400 bg-amber-50 text-amber-800"
                      : answers[item.id]
                        ? "border-green-300 bg-green-50 text-green-800"
                        : "border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function McqCard({
  q,
  index,
  selected,
  onChoose,
}: {
  q: MCQQuestion;
  index: number;
  selected: string | undefined;
  onChoose: (key: string) => void;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex gap-2 mb-3">
        <span className="text-xs font-semibold text-neutral-400 shrink-0 mt-1">Q{index + 1}</span>
        <MathRenderer text={q.question} className="text-neutral-900 leading-relaxed" block />
      </div>
      <div className="space-y-2">
        {q.options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChoose(opt.key)}
            className={`w-full flex items-start gap-2 text-left px-3 py-2 rounded-lg border transition ${
              selected === opt.key
                ? "border-blue-500 bg-blue-50"
                : "border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            <span className={`text-xs font-bold w-5 shrink-0 mt-0.5 ${selected === opt.key ? "text-blue-600" : "text-neutral-400"}`}>{opt.key}</span>
            <MathRenderer text={opt.text} className="flex-1 text-sm" />
          </button>
        ))}
      </div>
    </div>
  );
}

function PaperResults({ paper, answers, behavior, startedAt, timeUsedSec }: { paper: ObjectivePaper; answers: Record<string, string>; behavior: Record<string, QuestionTelemetrySnapshot>; startedAt: number; timeUsedSec: number }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);

  // 分模块计分
  const moduleScores = paper.modules.map((m) => {
    let earned = 0;
    const max = m.questions.length;
    for (const q of m.questions) if (answers[q.id] === q.answer) earned++;
    return { module: m, earned, max };
  });
  const totalEarned = moduleScores.reduce((s, x) => s + x.earned, 0);
  const totalMax = moduleScores.reduce((s, x) => s + x.max, 0);

  // 存档（best-effort，mode: paper）
  useEffect(() => {
    const allQ = paper.modules.flatMap((m) => m.questions);
    const payload = {
      testId: paper.testId,
      mode: "paper",
      paperId: paper.id,
      startedAt: startedAt ? new Date(startedAt).toISOString() : undefined,
      timeUsedSec,
      clientMeta: { schemaVersion: 1, viewport: `${window.innerWidth}x${window.innerHeight}`, locale: navigator.language },
      totalEarned,
      totalMax,
      answers: allQ.map((q) => ({
        questionId: q.id,
        type: "mcq" as const,
        selected: answers[q.id] ?? undefined,
        earned: answers[q.id] === q.answer ? 1 : 0,
        max: 1,
        ...behavior[q.id],
      })),
    };
    void persistExamSession(payload).then((id) => setSavedSessionId(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="text-center mb-8">
        <p className="text-sm text-neutral-500">{paper.title} · 成绩</p>
        <div className="text-5xl font-bold text-blue-600 mt-3">
          {totalEarned}<span className="text-2xl text-neutral-400">/{totalMax}</span>
        </div>
        <p className="text-sm text-neutral-500 mt-1">正确率 {Math.round((totalEarned / totalMax) * 100)}%</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {moduleScores.map(({ module, earned, max }) => (
          <div key={module.id} className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
            <p className="text-xs text-neutral-500">{module.title}</p>
            <p className="text-2xl font-bold text-neutral-800 mt-1">{earned}<span className="text-base text-neutral-400">/{max}</span></p>
            <p className="text-xs text-neutral-400">{Math.round((earned / max) * 100)}%</p>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-neutral-700 mb-3">逐题回看</h2>
      <div className="space-y-4">
        {paper.modules.map((m) => (
          <div key={m.id}>
            <p className="text-xs font-medium text-neutral-500 mb-2">{m.title}</p>
            <div className="space-y-2">
              {m.questions.map((q, i) => {
                const sel = answers[q.id];
                const correct = sel === q.answer;
                const isOpen = open[q.id];
                return (
                  <div key={q.id} className="rounded-lg border border-neutral-200 bg-white">
                    <button
                      onClick={() => setOpen((o) => ({ ...o, [q.id]: !o[q.id] }))}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left"
                    >
                      <span className={`text-xs w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {correct ? "✓" : "✗"}
                      </span>
                      <span className="text-xs text-neutral-400 shrink-0">Q{i + 1}</span>
                      <MathRenderer text={q.question} className="text-sm text-neutral-800 flex-1" />
                      <span className="text-neutral-400 text-xs">{isOpen ? "▲" : "▼"}</span>
                    </button>
                    {isOpen && (
                      <div className="px-3 pb-3 border-t border-neutral-100 pt-2 space-y-1.5">
                        {q.options.map((opt) => {
                          let cls = "text-neutral-600";
                          if (opt.key === q.answer) cls = "text-green-700 font-medium";
                          else if (opt.key === sel) cls = "text-red-600 line-through";
                          return (
                            <div key={opt.key} className={`flex items-start gap-2 text-sm ${cls}`}>
                              <span className="text-xs font-bold w-4 shrink-0">{opt.key}</span>
                              <MathRenderer text={opt.text} className="flex-1" />
                            </div>
                          );
                        })}
                        <div className="mt-2 text-sm text-neutral-600 bg-neutral-50 rounded-lg px-3 py-2">
                          <MathRenderer text={q.solution} block />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {savedSessionId && (
          <Link href={`/tests/${paper.testId}/history/${savedSessionId}`} className="flex-1 rounded-xl border border-blue-500 py-3 text-center text-sm font-medium text-blue-700">
            查看完整报告
          </Link>
        )}
        <Link href={`/tests/${paper.testId}`} className="flex-1 text-center py-3 rounded-xl border border-neutral-300 text-sm text-neutral-600 hover:bg-neutral-50">
          返回考试主页
        </Link>
        <Link href={`/tests/${paper.testId}/paper/${paper.id}`} className="flex-1 text-center py-3 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700">
          重做本卷
        </Link>
      </div>
    </div>
  );
}
