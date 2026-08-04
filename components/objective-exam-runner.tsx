"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Calculator, ChevronLeft, ChevronRight, Delete, Flag, LayoutGrid, RotateCcw, Save, Send, Volume2, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MathRenderer } from "@/components/math-renderer";
import type { MockPaper } from "@/lib/tests/mock-papers";
import type { MCQQuestion } from "@/lib/tests/questions/types";
import { createQuestionTelemetry, type QuestionTelemetrySnapshot, type QuestionTelemetryTracker } from "@/lib/tests/telemetry";
import { examProgressKey, parseExamProgress, summarizeModule, type ObjectiveExamProgress } from "@/lib/tests/exam-progress";
import { decodeMatrixAnswer, encodeMatrixAnswer, estimateIeltsBand, estimateSjtBand, estimateUcatScaledScore, isObjectiveAnswerComplete, scoreObjectiveAnswer } from "@/lib/tests/objective-scoring";
import { DiagnosisSummary, QuestionDiagnosis } from "@/components/exam-diagnosis";
import { buildSessionDiagnosis, diagnoseAnswer, optionReview } from "@/lib/tests/diagnosis";
import { persistExamSession } from "@/lib/tests/persist-session";
import { useExamReliability } from "@/hooks/use-exam-reliability";
import { ExamReliabilityStatus } from "@/components/exam-reliability-status";
import { clearRemoteProgress, loadRemoteProgress, saveRemoteProgress } from "@/lib/learning/client";

type ObjectivePaper = Omit<MockPaper, "modules"> & {
  modules: Array<Omit<MockPaper["modules"][number], "questions"> & { questions: MCQQuestion[] }>;
};
type Phase = "briefing" | "instructions" | "running" | "results";

function instructionDuration(paper: ObjectivePaper, moduleId: string): number {
  if (paper.testId !== "ucat") return 0;
  return moduleId === "qr" ? 120 : 90;
}

export function ObjectiveExamRunner({ paper }: { paper: ObjectivePaper }) {
  const [phase, setPhase] = useState<Phase>("briefing");
  const [moduleIndex, setModuleIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [reviewing, setReviewing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(paper.modules[0].durationSec);
  const [savedSession, setSavedSession] = useState<ObjectiveExamProgress | null>(null);
  const [behavior, setBehavior] = useState<Record<string, QuestionTelemetrySnapshot>>({});
  const [timeUsedSec, setTimeUsedSec] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [instructionTimeLeft, setInstructionTimeLeft] = useState(instructionDuration(paper, paper.modules[0].id));
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [playedAudioSections, setPlayedAudioSections] = useState<Record<string, boolean>>({});
  const [speakingSection, setSpeakingSection] = useState<string | null>(null);
  const startedAtRef = useRef(0);
  const moduleDeadlineRef = useRef(0);
  const telemetryRef = useRef<QuestionTelemetryTracker>(createQuestionTelemetry());
  const lastRemoteSaveRef = useRef(0);
  const storageKey = useMemo(() => examProgressKey(paper.id), [paper.id]);
  const currentModule = paper.modules[moduleIndex];
  const currentQuestion = currentModule.questions[questionIndex];
  const { online } = useExamReliability(phase === "running" || phase === "instructions");

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const playListeningSection = useCallback((question: MCQQuestion) => {
    if (!question.audioSectionId || !question.audioScript || playedAudioSections[question.audioSectionId]) return;
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(question.audioScript);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find((voice) => voice.lang.toLowerCase() === "en-gb")
      ?? voices.find((voice) => voice.lang.toLowerCase().startsWith("en"))
      ?? null;
    utterance.lang = "en-GB";
    utterance.rate = 0.92;
    utterance.onend = () => setSpeakingSection(null);
    utterance.onerror = () => setSpeakingSection(null);
    window.speechSynthesis.cancel();
    setPlayedAudioSections((current) => ({ ...current, [question.audioSectionId!]: true }));
    setSpeakingSection(question.audioSectionId);
    window.speechSynthesis.speak(utterance);
  }, [playedAudioSections]);

  useEffect(() => {
    let cancelled = false;
    const local = parseExamProgress(
      window.localStorage.getItem(storageKey),
      paper.id,
      paper.modules.map((module) => module.questions.length),
    );
    void loadRemoteProgress<ObjectiveExamProgress>("OBJECTIVE_EXAM", paper.id).then((remoteRaw) => {
      if (cancelled) return;
      const remote = parseExamProgress(
        remoteRaw ? JSON.stringify(remoteRaw) : null,
        paper.id,
        paper.modules.map((module) => module.questions.length),
      );
      const restored = !local ? remote : !remote ? local : remote.savedAt > local.savedAt ? remote : local;
      if (restored) setSavedSession(restored);
    });
    return () => { cancelled = true; };
  }, [paper.id, paper.modules, storageKey]);

  const finish = useCallback(() => {
    const ids = paper.modules.flatMap((module) => module.questions.map((question) => question.id));
    setBehavior(telemetryRef.current.snapshot(ids));
    setTimeUsedSec(startedAtRef.current ? Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000)) : 0);
    window.localStorage.removeItem(storageKey);
    void clearRemoteProgress("OBJECTIVE_EXAM", paper.id);
    setSavedSession(null);
    setReviewing(false);
    setPhase("results");
  }, [paper.id, paper.modules, storageKey]);

  const submitModule = useCallback(() => {
    if (moduleIndex + 1 >= paper.modules.length) {
      finish();
      return;
    }
    const nextModule = moduleIndex + 1;
    setModuleIndex(nextModule);
    setQuestionIndex(0);
    setReviewing(false);
    setTimeLeft(paper.modules[nextModule].durationSec);
    const instructions = instructionDuration(paper, paper.modules[nextModule].id);
    setInstructionTimeLeft(instructions);
    setCalculatorOpen(false);
    setPlayedAudioSections({});
    setSpeakingSection(null);
    if (instructions === 0) moduleDeadlineRef.current = Date.now() + paper.modules[nextModule].durationSec * 1000;
    setPhase(instructions > 0 ? "instructions" : "running");
    window.scrollTo({ top: 0 });
  }, [finish, moduleIndex, paper]);

  const startCurrentModule = useCallback(() => {
    setCalculatorOpen(false);
    moduleDeadlineRef.current = Date.now() + timeLeft * 1000;
    setPhase("running");
  }, [timeLeft]);

  useEffect(() => {
    if (phase !== "instructions") return;
    if (instructionTimeLeft <= 0) {
      const timeout = window.setTimeout(startCurrentModule, 0);
      return () => window.clearTimeout(timeout);
    }
    const timer = window.setInterval(() => setInstructionTimeLeft((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [instructionTimeLeft, phase, startCurrentModule]);

  useEffect(() => {
    if (phase !== "running") return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((moduleDeadlineRef.current - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        window.clearInterval(timer);
        window.setTimeout(submitModule, 0);
      }
    };
    const timer = window.setInterval(tick, 1000);
    tick();
    return () => window.clearInterval(timer);
  }, [moduleIndex, phase, submitModule]);

  useEffect(() => {
    if (phase !== "running") return;
    const progress: ObjectiveExamProgress = {
      version: 1,
      paperId: paper.id,
      moduleIndex,
      questionIndex,
      answers,
      flagged,
      timeLeft,
      startedAt: startedAtRef.current,
      savedAt: Date.now(),
    };
    window.localStorage.setItem(storageKey, JSON.stringify(progress));
    if (Date.now() - lastRemoteSaveRef.current >= 10_000) {
      lastRemoteSaveRef.current = Date.now();
      void saveRemoteProgress({
        kind: "OBJECTIVE_EXAM",
        resourceId: paper.id,
        payload: progress,
        startedAt: new Date(progress.startedAt).toISOString(),
        testId: paper.testId,
        mode: paper.id.toLowerCase().includes("diagnostic") ? "diagnostic" : "paper",
      });
    }
  }, [answers, flagged, moduleIndex, paper.id, paper.testId, phase, questionIndex, storageKey, timeLeft]);

  useEffect(() => {
    if (phase === "running" && !reviewing) telemetryRef.current.visit(currentQuestion.id);
  }, [currentQuestion.id, phase, reviewing]);

  const choose = useCallback((key: string) => {
    telemetryRef.current.answer(currentQuestion.id, key);
    setAnswers((current) => ({ ...current, [currentQuestion.id]: key }));
  }, [currentQuestion.id]);

  const toggleFlag = useCallback(() => {
    const next = !flagged[currentQuestion.id];
    telemetryRef.current.flag(currentQuestion.id, next);
    setFlagged((current) => ({ ...current, [currentQuestion.id]: next }));
  }, [currentQuestion.id, flagged]);

  useEffect(() => {
    if (phase !== "running" || reviewing) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey) return;
      const key = event.key.toLowerCase();
      if (key === "f") { event.preventDefault(); toggleFlag(); }
      if (key === "c" && paper.testId === "ucat" && ["dm", "qr"].includes(currentModule.id)) {
        event.preventDefault(); setCalculatorOpen((open) => !open);
      }
      if (["a", "b", "c", "d", "e"].includes(key) && currentQuestion.responseMode !== "matrix") {
        const option = currentQuestion.options.find((item) => item.key.toLowerCase() === key);
        if (option) { event.preventDefault(); choose(option.key); }
      }
      if (key === "n" && questionIndex < currentModule.questions.length - 1) {
        event.preventDefault(); setQuestionIndex((index) => index + 1);
      }
      if (key === "p" && questionIndex > 0) {
        event.preventDefault(); setQuestionIndex((index) => index - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [choose, currentModule.id, currentModule.questions.length, currentQuestion, paper.testId, phase, questionIndex, reviewing, toggleFlag]);

  const begin = () => {
    window.localStorage.removeItem(storageKey);
    void clearRemoteProgress("OBJECTIVE_EXAM", paper.id);
    setAnswers({});
    setFlagged({});
    setModuleIndex(0);
    setQuestionIndex(0);
    setReviewing(false);
    setTimeLeft(paper.modules[0].durationSec);
    startedAtRef.current = Date.now();
    moduleDeadlineRef.current = startedAtRef.current + paper.modules[0].durationSec * 1000;
    setStartedAt(startedAtRef.current);
    telemetryRef.current = createQuestionTelemetry();
    setSavedSession(null);
    const instructions = instructionDuration(paper, paper.modules[0].id);
    setInstructionTimeLeft(instructions);
    setPhase(instructions > 0 ? "instructions" : "running");
  };

  const resume = () => {
    if (!savedSession) return;
    setAnswers(savedSession.answers);
    setFlagged(savedSession.flagged);
    setModuleIndex(savedSession.moduleIndex);
    setQuestionIndex(savedSession.questionIndex);
    setTimeLeft(savedSession.timeLeft);
    startedAtRef.current = savedSession.startedAt;
    moduleDeadlineRef.current = Date.now() + savedSession.timeLeft * 1000;
    setStartedAt(savedSession.startedAt);
    telemetryRef.current = createQuestionTelemetry();
    setReviewing(false);
    setPhase("running");
  };

  const discardSaved = () => {
    window.localStorage.removeItem(storageKey);
    void clearRemoteProgress("OBJECTIVE_EXAM", paper.id);
    setSavedSession(null);
  };

  const chooseMatrix = (statementIndex: number, value: "yes" | "no") => {
    setAnswers((current) => {
      const values = decodeMatrixAnswer(current[currentQuestion.id], currentQuestion.statements?.length ?? 0);
      values[statementIndex] = value;
      const encoded = encodeMatrixAnswer(values);
      telemetryRef.current.answer(currentQuestion.id, encoded);
      return { ...current, [currentQuestion.id]: encoded };
    });
  };

  if (phase === "briefing") return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href={`/tests/${paper.testId}`} className="text-sm font-medium text-blue-600 hover:underline">返回 {paper.testId.toUpperCase()}</Link>
      <h1 className="mt-4 text-2xl font-bold">{paper.title}</h1>
      <p className="mt-1 text-sm text-neutral-500">{paper.titleEn}</p>
      {savedSession && <section className="mt-6 border-l-2 border-blue-600 bg-blue-50 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-sm font-semibold text-blue-950">发现未完成的考试</p><p className="mt-0.5 text-xs text-blue-700">模块 {savedSession.moduleIndex + 1} · 第 {savedSession.questionIndex + 1} 题 · 剩余约 {Math.ceil(savedSession.timeLeft / 60)} 分钟</p></div>
          <div className="flex gap-2"><button type="button" onClick={discardSaved} className="inline-flex items-center gap-1 rounded border border-blue-200 px-3 py-2 text-xs font-medium text-blue-800"><RotateCcw className="size-3.5" />放弃</button><button type="button" onClick={resume} className="rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white">继续考试</button></div>
        </div>
      </section>}
      <section className="mt-6 rounded-lg border border-neutral-200 bg-white p-6">
        <p className="text-sm leading-6 text-neutral-700">{paper.description}</p>
        <div className="mt-5 divide-y divide-neutral-100 border-y border-neutral-100">{paper.modules.map((module, index) => <div key={module.id} className="flex items-center justify-between py-3"><div><p className="text-sm font-semibold">模块 {index + 1} · {module.title}</p><p className="text-xs text-neutral-500">{module.questions.length} 题</p></div><span className="text-sm font-semibold text-blue-600">{Math.round(module.durationSec / 60)} 分钟</span></div>)}</div>
        <p className="mt-4 text-xs leading-5 text-neutral-500">每个模块独立计时。交卷后不能返回上一模块；系统会自动保存当前进度，倒计时结束时自动提交。</p>
        <button type="button" onClick={begin} className="mt-5 w-full rounded-md bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700">{savedSession ? "放弃进度并重新开始" : "开始考试"}</button>
      </section>
    </main>
  );

  if (phase === "results") return <ObjectiveResults paper={paper} answers={answers} behavior={behavior} startedAt={startedAt} timeUsedSec={timeUsedSec} />;

  if (phase === "instructions") {
    const instructionMinutes = String(Math.floor(instructionTimeLeft / 60)).padStart(2, "0");
    const instructionSeconds = String(instructionTimeLeft % 60).padStart(2, "0");
    const calculatorAvailable = ["dm", "qr"].includes(currentModule.id);
    return <main className="mx-auto max-w-3xl px-4 py-10">
      <ExamReliabilityStatus online={online} />
      <header className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div><p className="text-xs font-semibold text-blue-600">模块 {moduleIndex + 1}/{paper.modules.length}</p><h1 className="mt-1 text-2xl font-bold">{currentModule.title}说明</h1><p className="mt-1 text-sm text-neutral-500">{currentModule.titleEn}</p></div>
        <p className="font-mono text-2xl font-bold tabular-nums">{instructionMinutes}:{instructionSeconds}</p>
      </header>
      <section className="mt-6 border-y border-neutral-200 py-6">
        <p className="text-base font-semibold">本模块共 {currentModule.questions.length} 题，作答时间 {Math.round(currentModule.durationSec / 60)} 分钟。</p>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-neutral-600">
          <li>所有题目都应作答，答错不倒扣；可标记题目并在交卷总览中返回检查。</li>
          <li>使用 Alt+N / Alt+P 前后翻题，Alt+F 标记，Alt+A-D 选择单选答案。</li>
          {calculatorAvailable && <li>本模块可使用基础屏幕计算器；点击工具栏计算器或按 Alt+C 打开。</li>}
          {currentModule.id === "dm" && <li>五陈述 Yes/No 题须逐条作答；全部正确得 2 分，仅错一项得 1 分。</li>}
          {currentModule.id === "sjt" && <li>情境判断最佳等级得满分，相邻等级可获部分分。</li>}
        </ul>
      </section>
      <button type="button" onClick={startCurrentModule} className="mt-6 w-full rounded-md bg-blue-600 py-3 text-sm font-semibold text-white">开始本模块</button>
    </main>;
  }

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const urgent = timeLeft < 5 * 60;
  const completeAnswers = Object.fromEntries(currentModule.questions
    .filter((question) => isObjectiveAnswerComplete(question, answers[question.id]))
    .map((question) => [question.id, answers[question.id]]));
  const summary = summarizeModule(currentModule.questions.map((question) => question.id), completeAnswers, flagged);

  if (reviewing) return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <ExamReliabilityStatus online={online} />
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-5"><div><p className="text-xs font-semibold text-blue-600">模块 {moduleIndex + 1}/{paper.modules.length}</p><h1 className="mt-1 text-2xl font-bold">交卷总览</h1><p className="mt-1 text-sm text-neutral-500">{currentModule.title}</p></div><p className={`font-mono text-2xl font-bold tabular-nums ${urgent ? "text-red-600" : "text-neutral-900"}`}>{minutes}:{seconds}</p></header>
      <section className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200"><Metric value={summary.answered} label="已答" /><Metric value={summary.unanswered} label="未答" /><Metric value={summary.marked} label="已标记" /></section>
      <div className="mt-6 grid grid-cols-6 gap-2 sm:grid-cols-10">{currentModule.questions.map((question, index) => <QuestionNumber key={question.id} index={index} active={false} answered={isObjectiveAnswerComplete(question, answers[question.id])} flagged={Boolean(flagged[question.id])} onClick={() => { setQuestionIndex(index); setReviewing(false); }} />)}</div>
      {summary.unanswered > 0 && <p className="mt-5 border-l-2 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900">仍有 {summary.unanswered} 题未作答。客观题不倒扣分，建议返回补答。</p>}
      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row"><button type="button" onClick={() => setReviewing(false)} className="flex-1 rounded-md border border-neutral-300 py-3 text-sm font-medium">返回检查</button><button type="button" onClick={submitModule} className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-600 py-3 text-sm font-semibold text-white"><Send className="size-4" />{moduleIndex + 1 < paper.modules.length ? "提交并进入下一模块" : "确认交卷"}</button></div>
    </main>
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-4 sm:py-6">
      <ExamReliabilityStatus online={online} />
      <header className="sticky top-16 z-20 -mx-4 flex items-center justify-between border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div><p className="text-xs text-neutral-500">模块 {moduleIndex + 1}/{paper.modules.length} · Q{questionIndex + 1}/{currentModule.questions.length}</p><p className="text-sm font-semibold text-neutral-800">{currentModule.title}</p></div>
        <div className="flex items-center gap-2"><span className="hidden items-center gap-1 text-xs text-neutral-400 sm:flex"><Save className="size-3.5" />自动保存</span>{paper.testId === "ucat" && ["dm", "qr"].includes(currentModule.id) && <button type="button" onClick={() => setCalculatorOpen((open) => !open)} title="计算器（Alt+C）" aria-label="计算器" className="flex size-9 items-center justify-center rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-50"><Calculator className="size-4" /></button>}<p className={`font-mono text-xl font-bold tabular-nums ${urgent ? "text-amber-600" : "text-neutral-900"}`}>{minutes}:{seconds}</p><button type="button" onClick={() => setReviewing(true)} title="交卷总览" className="flex size-9 items-center justify-center rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-50"><LayoutGrid className="size-4" /></button></div>
      </header>
      {calculatorOpen && <BasicCalculator onClose={() => setCalculatorOpen(false)} />}
      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <section className="min-w-0 rounded-lg border border-neutral-200 bg-white p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3"><span className="text-xs font-semibold text-neutral-400">QUESTION {questionIndex + 1}</span><button type="button" onClick={toggleFlag} className={`inline-flex h-8 items-center gap-1.5 rounded border px-2.5 text-xs font-medium ${flagged[currentQuestion.id] ? "border-amber-400 bg-amber-50 text-amber-800" : "border-neutral-300 text-neutral-600"}`}><Flag className="size-3.5" fill={flagged[currentQuestion.id] ? "currentColor" : "none"} />{flagged[currentQuestion.id] ? "已标记" : "标记"}</button></div>
          {currentQuestion.audioScript && currentQuestion.audioSectionId && (
            <div className="mt-4 border-l-2 border-blue-600 bg-blue-50 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-blue-900">{currentQuestion.audioTitle ?? "Listening recording"}</p>
                  <p className="mt-1 text-xs text-blue-700">训练录音只可启动一次；播放期间可继续翻题作答。</p>
                </div>
                <button
                  type="button"
                  disabled={Boolean(playedAudioSections[currentQuestion.audioSectionId])}
                  onClick={() => playListeningSection(currentQuestion)}
                  className="inline-flex items-center gap-2 rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:bg-blue-200 disabled:text-blue-700"
                >
                  <Volume2 className="size-4" />
                  {speakingSection === currentQuestion.audioSectionId ? "正在播放" : playedAudioSections[currentQuestion.audioSectionId] ? "本节已播放" : "播放本节录音"}
                </button>
              </div>
            </div>
          )}
          {currentQuestion.context && !currentQuestion.audioScript && <MathRenderer text={currentQuestion.context} className="mt-4 border-l-2 border-neutral-300 bg-neutral-50 px-4 py-3 text-sm leading-6 text-neutral-700" block />}
          <MathRenderer text={currentQuestion.question} className="mt-4 text-base leading-7 text-neutral-900" block />
          {currentQuestion.responseMode === "matrix" ? <div className="mt-6 divide-y divide-neutral-100 border-y border-neutral-200">{currentQuestion.statements?.map((statement, index) => { const selected = decodeMatrixAnswer(answers[currentQuestion.id], currentQuestion.statements?.length ?? 0)[index]; return <div key={statement.id} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_11rem] sm:items-center"><MathRenderer text={statement.text} className="text-sm leading-6" /><div className="grid grid-cols-2 gap-1"><button type="button" onClick={() => chooseMatrix(index, "yes")} className={`rounded border px-3 py-2 text-xs font-semibold ${selected === "yes" ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-300"}`}>Yes</button><button type="button" onClick={() => chooseMatrix(index, "no")} className={`rounded border px-3 py-2 text-xs font-semibold ${selected === "no" ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-300"}`}>No</button></div></div>; })}</div> : <div className="mt-6 space-y-2">{currentQuestion.options.map((option) => <button key={option.key} type="button" onClick={() => choose(option.key)} className={`flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left transition ${answers[currentQuestion.id] === option.key ? "border-blue-500 bg-blue-50" : "border-neutral-200 hover:bg-neutral-50"}`}><span className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${answers[currentQuestion.id] === option.key ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-300 text-neutral-500"}`}>{option.key}</span><MathRenderer text={option.text} className="flex-1 text-sm leading-6" /></button>)}</div>}
          <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4"><button type="button" disabled={questionIndex === 0} onClick={() => setQuestionIndex((index) => index - 1)} className="inline-flex h-10 items-center gap-1 rounded border border-neutral-300 px-3 text-sm disabled:opacity-40"><ChevronLeft className="size-4" />上一题</button><button type="button" onClick={() => questionIndex + 1 < currentModule.questions.length ? setQuestionIndex((index) => index + 1) : setReviewing(true)} className="inline-flex h-10 items-center gap-1 rounded bg-blue-600 px-3 text-sm font-semibold text-white">{questionIndex + 1 < currentModule.questions.length ? "下一题" : "查看总览"}<ChevronRight className="size-4" /></button></div>
        </section>
        <aside className="rounded-lg border border-neutral-200 bg-white p-4 lg:sticky lg:top-32"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-neutral-500">答题导航</span><span className="text-xs text-neutral-400">{summary.answered}/{currentModule.questions.length}</span></div><div className="mt-3 grid grid-cols-6 gap-1.5 lg:grid-cols-5">{currentModule.questions.map((question, index) => <QuestionNumber key={question.id} index={index} active={index === questionIndex} answered={isObjectiveAnswerComplete(question, answers[question.id])} flagged={Boolean(flagged[question.id])} onClick={() => setQuestionIndex(index)} />)}</div><button type="button" onClick={() => setReviewing(true)} className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded border border-neutral-300 py-2 text-xs font-medium"><LayoutGrid className="size-3.5" />交卷总览</button></aside>
      </div>
    </main>
  );
}

function BasicCalculator({ onClose }: { onClose: () => void }) {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [operation, setOperation] = useState<"+" | "-" | "*" | "/" | null>(null);
  const [replace, setReplace] = useState(true);

  const calculate = useCallback((left: number, right: number, op: "+" | "-" | "*" | "/") => {
    if (op === "+") return left + right;
    if (op === "-") return left - right;
    if (op === "*") return left * right;
    return right === 0 ? NaN : left / right;
  }, []);
  const inputDigit = useCallback((digit: string) => setDisplay((current) => {
    if (replace) { setReplace(false); return digit === "." ? "0." : digit; }
    if (digit === "." && current.includes(".")) return current;
    return current.length >= 14 ? current : current === "0" && digit !== "." ? digit : current + digit;
  }), [replace]);
  const selectOperation = useCallback((next: "+" | "-" | "*" | "/") => {
    const value = Number(display);
    if (stored !== null && operation && !replace) {
      const result = calculate(stored, value, operation);
      setDisplay(Number.isFinite(result) ? String(Number(result.toPrecision(12))) : "Error");
      setStored(result);
    } else setStored(value);
    setOperation(next); setReplace(true);
  }, [calculate, display, operation, replace, stored]);
  const equals = useCallback(() => {
    if (stored === null || !operation) return;
    const result = calculate(stored, Number(display), operation);
    setDisplay(Number.isFinite(result) ? String(Number(result.toPrecision(12))) : "Error");
    setStored(null); setOperation(null); setReplace(true);
  }, [calculate, display, operation, stored]);
  const clear = useCallback(() => { setDisplay("0"); setStored(null); setOperation(null); setReplace(true); }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (/^[0-9.]$/.test(event.key)) { event.preventDefault(); inputDigit(event.key); }
      if (["+", "-", "*", "/"].includes(event.key)) { event.preventDefault(); selectOperation(event.key as "+" | "-" | "*" | "/"); }
      if (event.key === "Enter" || event.key === "=") { event.preventDefault(); equals(); }
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [equals, inputDigit, onClose, selectOperation]);

  const keys = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"];
  return <aside role="dialog" aria-label="基础计算器" className="fixed right-3 top-36 z-40 w-[min(18rem,calc(100vw-1.5rem))] rounded-lg border border-neutral-300 bg-white p-3 shadow-xl">
    <div className="flex items-center justify-between"><span className="text-xs font-semibold text-neutral-600">Calculator</span><button type="button" onClick={onClose} aria-label="关闭计算器" className="flex size-7 items-center justify-center rounded hover:bg-neutral-100"><X className="size-4" /></button></div>
    <output className="mt-2 block min-h-12 overflow-hidden rounded border border-neutral-300 bg-neutral-50 px-3 py-2 text-right font-mono text-xl tabular-nums">{display}</output>
    <div className="mt-2 grid grid-cols-4 gap-1.5"><button type="button" onClick={clear} className="col-span-2 rounded border border-neutral-300 py-2 text-sm font-semibold">ON/C</button><button type="button" onClick={() => setDisplay((value) => value.length > 1 ? value.slice(0, -1) : "0")} aria-label="退格" className="col-span-2 flex items-center justify-center rounded border border-neutral-300 py-2"><Delete className="size-4" /></button>{keys.map((key) => <button key={key} type="button" onClick={() => key === "=" ? equals() : ["+", "-", "*", "/"].includes(key) ? selectOperation(key as "+" | "-" | "*" | "/") : inputDigit(key)} className={`rounded border py-2.5 text-sm font-semibold ${["+", "-", "*", "/", "="].includes(key) ? "border-blue-200 bg-blue-50 text-blue-800" : "border-neutral-300"}`}>{key === "*" ? "×" : key === "/" ? "÷" : key}</button>)}</div>
  </aside>;
}

function QuestionNumber({ index, active, answered, flagged, onClick }: { index: number; active: boolean; answered: boolean; flagged: boolean; onClick: () => void }) {
  const style = active ? "border-blue-600 bg-blue-600 text-white" : flagged ? "border-amber-400 bg-amber-50 text-amber-800" : answered ? "border-green-300 bg-green-50 text-green-800" : "border-neutral-200 text-neutral-500 hover:bg-neutral-50";
  return <button type="button" aria-label={`第 ${index + 1} 题${flagged ? "，已标记" : answered ? "，已作答" : "，未作答"}`} onClick={onClick} className={`aspect-square rounded border text-xs font-semibold ${style}`}>{index + 1}</button>;
}

function Metric({ value, label }: { value: number; label: string }) {
  return <div className="bg-white p-4"><strong className="text-2xl">{value}</strong><p className="text-xs text-neutral-500">{label}</p></div>;
}

function ObjectiveResults({ paper, answers, behavior, startedAt, timeUsedSec }: { paper: ObjectivePaper; answers: Record<string, string>; behavior: Record<string, QuestionTelemetrySnapshot>; startedAt: number; timeUsedSec: number }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const persistedRef = useRef(false);
  const moduleScores = paper.modules.map((module) => ({ module, earned: module.questions.reduce((sum, question) => sum + scoreObjectiveAnswer(question, answers[question.id]).earned, 0), max: module.questions.reduce((sum, question) => sum + scoreObjectiveAnswer(question, answers[question.id]).max, 0) }));
  const totalEarned = moduleScores.reduce((sum, item) => sum + item.earned, 0);
  const totalMax = moduleScores.reduce((sum, item) => sum + item.max, 0);
  const diagnosis = buildSessionDiagnosis(paper.modules.flatMap((module) => module.questions.map((question) => {
    const score = scoreObjectiveAnswer(question, answers[question.id]);
    return {
      question,
      selected: answers[question.id],
      earned: score.earned,
      max: score.max,
      ...behavior[question.id],
    };
  })));
  const ieltsBands = paper.testId === "ielts"
    ? moduleScores.flatMap(({ module, earned }) =>
        module.id === "listening" || module.id === "reading"
          ? [{ id: module.id, label: module.id === "listening" ? "Listening" : "Academic Reading", raw: earned, band: estimateIeltsBand(earned, module.id) }]
          : []
      )
    : [];

  useEffect(() => {
    if (persistedRef.current) return;
    persistedRef.current = true;
    const questions = paper.modules.flatMap((module) => module.questions);
    void persistExamSession({
      testId: paper.testId, mode: "paper", paperId: paper.id,
      startedAt: startedAt ? new Date(startedAt).toISOString() : undefined,
      timeUsedSec,
      clientMeta: { schemaVersion: 2, runner: "objective-v2", viewport: `${window.innerWidth}x${window.innerHeight}`, locale: navigator.language },
      totalEarned, totalMax,
      answers: questions.map((question) => ({ questionId: question.id, type: "mcq", selected: answers[question.id], ...scoreObjectiveAnswer(question, answers[question.id]), ...behavior[question.id] })),
    }).then((id) => setSavedSessionId(id));
    // Result persistence is intentionally best-effort and runs once per completed attempt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <main className="mx-auto max-w-3xl px-4 py-10">
    <header className="border-b border-neutral-200 pb-7 text-center"><p className="text-sm text-neutral-500">{paper.title} · 成绩</p><p className="mt-3 text-5xl font-bold text-blue-600">{totalEarned}<span className="text-2xl text-neutral-400">/{totalMax}</span></p><p className="mt-1 text-sm text-neutral-500">正确率 {Math.round((totalEarned / totalMax) * 100)}%</p></header>
    {paper.testId === "ucat" && <UcatScoreSummary moduleScores={moduleScores} />}
    {ieltsBands.length > 0 && (
      <section className="mt-6 border-y border-neutral-200 py-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">IELTS training estimate</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {ieltsBands.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-neutral-50 px-4 py-3">
              <div><p className="text-sm font-semibold">{item.label}</p><p className="text-xs text-neutral-500">原始分 {item.raw}/40</p></div>
              <strong className="text-2xl text-blue-600">Band {item.band.toFixed(1)}</strong>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-neutral-500">按常见原始分区间生成的训练估算，不是 IELTS 官方等值成绩。</p>
      </section>
    )}
    <section className="mt-6 grid gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200 sm:grid-cols-2">{moduleScores.map(({ module, earned, max }) => <div key={module.id} className="bg-white p-4 text-center"><p className="text-xs text-neutral-500">{module.title}</p><p className="mt-1 text-2xl font-bold">{earned}<span className="text-base text-neutral-400">/{max}</span></p><p className="text-xs text-neutral-400">{Math.round((earned / max) * 100)}%</p></div>)}</section>
    <DiagnosisSummary diagnosis={diagnosis} />
    <h2 className="mt-8 text-base font-bold">逐题回看</h2>
    <div className="mt-3 space-y-5">{paper.modules.map((module) => <section key={module.id}><p className="mb-2 text-xs font-semibold text-neutral-500">{module.title}</p><div className="divide-y divide-neutral-100 border-y border-neutral-200">{module.questions.map((question, index) => { const selected = answers[question.id]; const score = scoreObjectiveAnswer(question, selected); const itemDiagnosis = diagnoseAnswer({ question, selected, earned: score.earned, max: score.max, ...behavior[question.id] }); const selectedOption = question.options.find((option) => option.key === selected); const selectedReview = selectedOption ? optionReview(question, selectedOption.key) : null; return <div key={question.id}><button type="button" onClick={() => setOpen((current) => ({ ...current, [question.id]: !current[question.id] }))} className="flex w-full items-center gap-3 py-3 text-left"><span className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${score.correct ? "bg-green-100 text-green-700" : score.earned > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{score.correct ? "✓" : score.earned > 0 ? "½" : "×"}</span><span className="text-xs text-neutral-400">Q{index + 1}</span><MathRenderer text={question.question} className="line-clamp-1 flex-1 text-sm" /><span className="text-xs text-neutral-400">{open[question.id] ? "收起" : "查看"}</span></button>{open[question.id] && <div className="pb-4 pl-9"><p className="text-xs text-neutral-500">得分：{score.earned}/{score.max} · 你的答案：{selected || "未答"}{question.responseMode !== "matrix" ? ` · 正确答案：${question.answer}` : ""}</p>{selectedReview && <p className="mt-2 text-xs leading-5 text-neutral-600"><span className="font-semibold">{selectedReview.title}：</span>{selectedReview.detail}</p>}<MathRenderer text={question.solution} className="mt-2 rounded bg-neutral-50 px-3 py-2 text-sm text-neutral-700" block /><QuestionDiagnosis diagnosis={itemDiagnosis} question={question} compact /></div>}</div>; })}</div></section>)}</div>
    <div className="mt-8 grid gap-3 sm:grid-cols-3">
      <Link href={`/tests/${paper.testId}`} className="rounded-md border border-neutral-300 py-3 text-center text-sm">返回考试主页</Link>
      {savedSessionId && <Link href={`/tests/${paper.testId}/history/${savedSessionId}`} className="rounded-md border border-blue-600 py-3 text-center text-sm font-semibold text-blue-700">查看完整报告</Link>}
      <Link href={`/tests/${paper.testId}/paper/${paper.id}`} className="rounded-md bg-blue-600 py-3 text-center text-sm font-semibold text-white">重新作答</Link>
    </div>
  </main>;
}

function UcatScoreSummary({ moduleScores }: { moduleScores: Array<{ module: ObjectivePaper["modules"][number]; earned: number; max: number }> }) {
  const cognitive = moduleScores.slice(0, 3).map((item) => estimateUcatScaledScore(item.earned, item.max));
  const sjt = moduleScores[3];
  return <section className="mt-6 border-y border-neutral-200 py-5"><div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{cognitive.map((score, index) => <div key={moduleScores[index].module.id}><p className="text-xs text-neutral-500">{moduleScores[index].module.titleEn}</p><p className="mt-1 text-2xl font-bold">{score}</p></div>)}<div><p className="text-xs text-neutral-500">Situational Judgement</p><p className="mt-1 text-2xl font-bold">Band {estimateSjtBand(sjt?.earned ?? 0, sjt?.max ?? 1)}</p></div></div><p className="mt-4 text-xs leading-5 text-neutral-500">训练估算：认知分数按本卷原始正确率线性映射至 300–900，SJT Band 使用平台训练阈值；并非 UCAT 官方换算或成绩预测。</p></section>;
}
