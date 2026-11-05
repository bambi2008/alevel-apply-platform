"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { MathRenderer } from "@/components/math-renderer";
import { HandwrittenAnswerInput, type AnswerImageRef } from "@/components/handwritten-answer-input";
import { MembershipRequired } from "@/components/membership-required";
import { GradingTrustPanel } from "@/components/grading-trust-panel";
import { HandwritingRecognitionNote } from "@/components/handwriting-recognition-note";
import { BasicCalculator } from "@/components/basic-calculator";
import { SessionFeedback } from "@/components/session-feedback";
import { refreshAiRemaining } from "@/components/ai-remaining";
import { loadPreviousPaperWork, projectPreviousPaperWork } from "@/lib/tests/previous-work";
import { createQuestionTelemetry, type QuestionTelemetryTracker } from "@/lib/tests/telemetry";
import { useExamReliability } from "@/hooks/use-exam-reliability";
import type { GradeResponse } from "@/lib/tests/grading";
import { decodeMatrixAnswer, encodeMatrixAnswer } from "@/lib/tests/objective-scoring";
import type { AttemptReceipt, DeliveredAttempt, DeliveredQuestion, PracticeCatalogItem, ReviewedAnswer, SubmittedAnswer } from "@/lib/tests/delivery-types";

async function requestJson<T>(url: string, body?: unknown): Promise<T> {
  const localeHeader = { "x-qiaoshen-locale": document.documentElement.lang };
  const response = await fetch(url, body === undefined ? { cache: "no-store", headers: localeHeader } : {
    method: "POST", headers: { "Content-Type": "application/json", ...localeHeader }, body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok && (data.code === "ai_quota_exhausted" || data.code === "ai_in_progress")) throw Error(data.code);
  if (!response.ok) throw Error(response.status === 402 ? (data.error === "trial_expired" ? "trial_expired" : "membership_required") : response.status === 401 ? "unauthenticated" : data.consentRequired ? "ai_consent_required" : "request_failed");
  return data as T;
}

// Receipts also contain server-only score/feedback fields. Never echo those
// into a new submission (including when resuming a cached receipt).
function submissionOnly(answer: SubmittedAnswer): SubmittedAnswer {
  return { questionId: answer.questionId, selected: answer.selected, work: answer.work,
    answerImageIds: answer.answerImageIds, selectedPromptId: answer.selectedPromptId, telemetry: answer.telemetry };
}

function instructionSeconds(testId: string, moduleId: string): number {
  return testId === "ucat" ? (moduleId === "qr" ? 120 : 90) : 0;
}

export function SecureStudySession({ testId, title, catalog, topics, paperId, paperSummary, userId, offer, aiEnabled = false }: {
  testId: string; title: string; catalog?: PracticeCatalogItem[];
  topics?: Array<{ id: string; title: string }>;
  paperId?: string; paperSummary?: Array<{ title: string; count: number; minutes: number }>;
  userId: string;
  offer: { priceFen: number; months: number }; aiEnabled?: boolean;
}) {
  const locale = useLocale();
  const en = locale === "en";
  const query = useSearchParams();
  const [topic, setTopic] = useState(query.get("topic") ?? "all");
  const [module, setModule] = useState(query.get("module") ?? (testId === "esat" ? "math1" : testId === "step" ? "step2" : "all"));
  const [format, setFormat] = useState("all");
  const [strategy, setStrategy] = useState(query.get("adaptive") === "1" ? "adaptive" : "mixed");
  const [count, setCount] = useState(10);
  const [attempt, setAttempt] = useState<DeliveredAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, SubmittedAnswer>>({});
  const [images, setImages] = useState<Record<string, Record<string, AnswerImageRef[]>>>({});
  const [reviewed, setReviewed] = useState<Record<string, ReviewedAnswer>>({});
  const [complete, setComplete] = useState(false);
  const [index, setIndex] = useState(0);
  const [moduleIndex, setModuleIndex] = useState(0);
  const [deadline, setDeadline] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [instructionDeadline, setInstructionDeadline] = useState(0);
  const [instructionRemaining, setInstructionRemaining] = useState(0);
  const [calculator, setCalculator] = useState(false);
  const [playedAudio, setPlayedAudio] = useState<Record<string, boolean>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const telemetry = useRef<QuestionTelemetryTracker | null>(null);
  if (telemetry.current === null) { telemetry.current = createQuestionTelemetry(); }
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const busyRef = useRef(false);
  const storageKey = `qiaoshen:secure-attempt:${userId}:${paperId ?? testId}`;
  const [saved, setSaved] = useState(false);
  const pool = (catalog ?? []).filter(q => (topic === "all" || q.topicId === topic)
    && (format === "all" || q.type === format)
    && (module === "all" || q.module === module || (testId === "step" && module === "step3")));
  const currentModule = attempt?.paper?.modules[moduleIndex];
  const calculatorAllowed = testId === "ucat" && ["dm", "qr"].includes(currentModule?.id ?? "");
  const visibleIds = currentModule?.questionIds ?? attempt?.questions.map(q => q.id) ?? [];
  const question = attempt?.questions.find(q => q.id === visibleIds[index]);
  const { online } = useExamReliability(!!attempt && !complete);
  useEffect(() => { if (question && !complete) telemetry.current?.visit(question.id); }, [question, complete]);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => { if (calculatorAllowed && event.altKey && event.key.toLowerCase() === "c") { event.preventDefault(); setCalculator(open => !open); } };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [calculatorAllowed]);
  useEffect(() => () => { if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel(); }, []);

  useEffect(() => { setSaved(!!window.localStorage.getItem(storageKey)); }, [storageKey]);
  useEffect(() => {
    if (!attempt || complete) return;
    try { window.localStorage.setItem(storageKey, JSON.stringify({ id: attempt.id, answers, images, index, moduleIndex, deadline, instructionDeadline, playedAudio, flagged, savedAt: Date.now() })); }
    catch { /* Keep the current work available in memory. */ }
  }, [attempt, answers, images, index, moduleIndex, deadline, instructionDeadline, playedAudio, flagged, complete, storageKey]);

  const reportError = (caught: unknown) => setError(caught instanceof Error ? caught.message : "request_failed");
  const acceptReceipt = useCallback((receipt: AttemptReceipt) => {
    setReviewed(previous => ({ ...previous, ...Object.fromEntries(receipt.reviewed.map(row => [row.question.id, row])) }));
    setAnswers(previous => ({ ...previous, ...Object.fromEntries(receipt.reviewed.map(row => [row.question.id, row.submission])) }));
    if (receipt.completedAt) {
      setComplete(true);
      setAttempt(previous => previous ? { ...previous, completedAt: receipt.completedAt, reportId: receipt.reportId } : previous);
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  const finish = useCallback(async () => {
    if (!attempt || busyRef.current) return;
    busyRef.current = true; setBusy(true); setError("");
    try {
      const stats = telemetry.current!.snapshot(attempt.questions.map(q => q.id));
      acceptReceipt(await requestJson<AttemptReceipt>(`/api/study-attempts/${attempt.id}/answers`, { complete: true, answers: attempt.questions.map(q => ({ ...submissionOnly(answers[q.id] ?? { questionId: q.id }), telemetry: { ...stats[q.id], flagged: !!flagged[q.id] } })) }));
    } catch (caught) { reportError(caught); }
    finally { busyRef.current = false; setBusy(false); }
  }, [attempt, answers, flagged, acceptReceipt]);

  const nextModule = useCallback(() => {
    if (!attempt?.paper || moduleIndex + 1 >= attempt.paper.modules.length) { void finish(); return; }
    const next = moduleIndex + 1;
    setModuleIndex(next); setIndex(0);
    const instruction = instructionSeconds(testId, attempt.paper.modules[next].id);
    setInstructionRemaining(instruction);
    setInstructionDeadline(instruction ? Date.now() + instruction * 1000 : 0);
    setDeadline(Date.now() + (instruction + attempt.paper.modules[next].durationSec) * 1000);
    setCalculator(false);
  }, [attempt, moduleIndex, finish, testId]);

  useEffect(() => {
    if (!attempt?.paper || complete || !deadline) return;
    const tick = () => {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(seconds);
      setInstructionRemaining(Math.max(0, Math.ceil((instructionDeadline - Date.now()) / 1000)));
      if (!seconds && !error && !busyRef.current) nextModule();
    };
    tick(); const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [attempt, complete, deadline, nextModule, error, instructionDeadline]);

  const start = async (restorePrevious = false) => {
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true); setError("");
    try {
      const previous = restorePrevious && paperId ? await loadPreviousPaperWork(paperId) : null;
      if (restorePrevious && !previous) throw Error("no_previous_work");
      let ids = [...pool].map(q => ({ q, weight: Math.random() * q.difficulty })).sort((a, b) => b.weight - a.weight).slice(0, count).map(row => row.q.id);
      if (!paperId && strategy === "adaptive") {
        const params = new URLSearchParams({ testId, count: String(Math.min(count, pool.length)), module, format });
        if (topic !== "all") params.set("topicId", topic);
        if (query.get("review") === "1") params.set("review", "1");
        if (query.get("remediation") === "1") params.set("remediation", "1");
        const recommendations = await requestJson<{ recommendedQuestionIds?: string[] }>(`/api/exam-sessions/adaptive?${params}`);
        const allowed = new Set(pool.map(question => question.id));
        ids = (recommendations.recommendedQuestionIds ?? []).filter(id => allowed.has(id)).slice(0, count);
        if (!ids.length) throw Error("no_recommendations");
      }
      const next = await requestJson<DeliveredAttempt>("/api/study-attempts", paperId
        ? { mode: "paper", testId, paperId, locale }
        : { mode: "practice", testId, questionIds: ids, locale });
      const restored = previous ? projectPreviousPaperWork(next.questions, previous) : null;
      setAttempt(next); setAnswers(restored?.answers ?? {}); setImages(restored?.images ?? {}); setReviewed({}); setComplete(false); setIndex(0); setModuleIndex(0); setFlagged({}); setPlayedAudio({});
      telemetry.current = createQuestionTelemetry();
      if (next.paper) {
        const instruction = instructionSeconds(testId, next.paper.modules[0].id);
        setInstructionRemaining(instruction);
        setInstructionDeadline(instruction ? Date.now() + instruction * 1000 : 0);
        setDeadline(Date.now() + (instruction + next.paper.modules[0].durationSec) * 1000);
      }
    } catch (caught) { reportError(caught); }
    finally { busyRef.current = false; setBusy(false); }
  };

  const resume = async () => {
    setBusy(true); setError("");
    try {
      const value = JSON.parse(window.localStorage.getItem(storageKey) ?? "null") as { id: string; savedAt: number; answers?: Record<string, SubmittedAnswer>; images?: typeof images; index?: number; moduleIndex?: number; deadline?: number; instructionDeadline?: number; playedAudio?: Record<string, boolean>; flagged?: Record<string, boolean> } | null;
      if (!value || typeof value.id !== "string" || !Number.isFinite(value.savedAt) || Date.now() - value.savedAt >= 365 * 86_400_000) { window.localStorage.removeItem(storageKey); throw Error("request_failed"); }
      const next = await requestJson<DeliveredAttempt & { reviewed: ReviewedAnswer[] }>(`/api/study-attempts/${encodeURIComponent(value.id)}`);
      if (next.testId !== testId || (next.paper?.id ?? null) !== (paperId ?? null)) throw Error("request_failed");
      const resumedModule = Math.max(0, Math.min((next.paper?.modules.length ?? 1) - 1, Number.isSafeInteger(value.moduleIndex) ? value.moduleIndex! : 0));
      const resumedCount = next.paper?.modules[resumedModule].questionIds.length ?? next.questions.length;
      setAttempt(next); setAnswers({ ...value.answers, ...Object.fromEntries(next.reviewed.map(row => [row.question.id, row.submission])) }); setImages(value.images ?? {});
      setIndex(Math.max(0, Math.min(resumedCount - 1, Number.isSafeInteger(value.index) ? value.index! : 0))); setModuleIndex(resumedModule); setDeadline(Number.isFinite(value.deadline) ? value.deadline! : 0);
      setReviewed(Object.fromEntries(next.reviewed.map(row => [row.question.id, row]))); setComplete(!!next.completedAt);
      setInstructionDeadline(value.instructionDeadline ?? 0); setPlayedAudio(value.playedAudio ?? {}); setFlagged(value.flagged ?? {});
    } catch (caught) { reportError(caught); }
    finally { setBusy(false); }
  };

  const commitQuestion = async () => {
    if (!attempt || !question || busyRef.current) return;
    busyRef.current = true; setBusy(true); setError("");
    try {
      const receipt = await requestJson<AttemptReceipt>(`/api/study-attempts/${attempt.id}/answers`, { complete: false, answers: [{ ...submissionOnly(answers[question.id] ?? { questionId: question.id }), telemetry: telemetry.current!.snapshot([question.id])[question.id] }] });
      acceptReceipt(receipt);
    } catch (caught) { reportError(caught); }
    finally { busyRef.current = false; setBusy(false); }
  };

  const setAnswer = (value: Partial<SubmittedAnswer>) => {
    if (!question || reviewed[question.id]) return;
    if (value.selected) telemetry.current?.answer(question.id, value.selected);
    setAnswers(current => ({ ...current, [question.id]: { ...current[question.id], questionId: question.id, ...value } }));
  };
  if (error === "membership_required" || error === "trial_expired") return <MembershipRequired offer={offer} expiredTrial={error === "trial_expired"} />;
  const errorNode = error ? <p role="alert" className="my-4 text-sm text-red-700">{error === "unauthenticated" ? <Link href="/login" className="underline">{en ? "Sign in to continue" : "请先登录"}</Link> : error === "no_recommendations" ? (en ? "No matching review questions are due. Choose mixed practice or another topic." : "当前没有匹配的待复习题，请选择混合练习或其他考点。") : error === "no_previous_work" ? (en ? "No earlier draft was found on this account for this paper." : "这个账号没有本套卷的旧版草稿。") : en ? "Could not save or load this attempt. Your current work is kept; please try again." : "本次作答暂时无法保存或加载，当前内容已保留，请重试。"}</p> : null;
  if (!attempt) return <section className="mx-auto max-w-4xl px-5 py-10">
    <h1 className="text-3xl font-semibold">{title}</h1>
    {paperSummary ? <ul className="mt-6 divide-y border-y border-black/15">{paperSummary.map((row, i) => <li key={i} className="flex justify-between gap-4 py-4"><span>{row.title}</span><span>{row.count} {en ? "questions" : "题"} · {row.minutes} {en ? "minutes" : "分钟"}</span></li>)}</ul> : <div className="mt-7 grid gap-4 sm:grid-cols-2">
      <label className="text-sm">{en ? "Selection" : "选题方式"}<select className="input mt-2" value={strategy} onChange={e => setStrategy(e.target.value)}><option value="mixed">{en ? "Mixed practice" : "混合练习"}</option><option value="adaptive">{en ? "Adaptive practice" : "智能练习"}</option></select></label>
      <label className="text-sm">{en ? "Topic" : "考点"}<select className="input mt-2" value={topic} onChange={e => setTopic(e.target.value)}><option value="all">{en ? "All topics" : "所有考点"}</option>{topics?.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</select></label>
      {["esat", "step"].includes(testId) && <label className="text-sm">{en ? "Module" : "模块"}<select className="input mt-2" value={module} onChange={e => setModule(e.target.value)}>{(testId === "esat" ? ["math1", "math2", "physics", "chemistry", "biology"] : ["step2", "step3"]).map(id => <option key={id} value={id}>{id}</option>)}</select></label>}
      <label className="text-sm">{en ? "Answer format" : "题型"}<select className="input mt-2" value={format} onChange={e => setFormat(e.target.value)}><option value="all">{en ? "All formats" : "全部题型"}</option><option value="mcq">{en ? "Multiple choice" : "选择题"}</option><option value="long">{en ? "Written answers" : "书面作答"}</option></select></label>
      <label className="text-sm">{en ? "Number of questions" : "题数"}<input className="input mt-2" type="number" min={1} max={Math.min(30, pool.length) || 1} value={count} onChange={e => setCount(Math.max(1, Math.min(30, Number(e.target.value) || 1)))} /></label>
    </div>}
    {errorNode}<div className="mt-7 flex flex-wrap gap-3"><button className="btn btn-primary" type="button" disabled={busy || (!paperId && !pool.length)} onClick={() => void start()}>{busy ? (en ? "Loading…" : "正在加载…") : en ? "Start practice →" : "开始作答 →"}</button>{saved && <button className="btn btn-secondary" type="button" disabled={busy} onClick={() => void resume()}>{en ? "Resume saved work" : "继续已保存作答"}</button>}</div>
    {paperId && !saved && <details className="mt-5 text-sm text-neutral-600">
      <summary className="cursor-pointer underline">{en ? "Work saved before this update" : "更新前保存的作答"}</summary>
      <p className="mt-2">{en ? "Import an older draft saved to this account. A new timer will start." : "可导入此前保存在本账号的作答，计时重新开始。"}</p>
      <button className="btn btn-secondary mt-3" type="button" disabled={busy} onClick={() => void start(true)}>{en ? "Import previous work" : "导入旧版作答"}</button>
    </details>}
  </section>;

  if (complete) return <section className="mx-auto max-w-5xl px-5 py-10">
    <h1 className="text-3xl font-semibold">{en ? "Completed practice" : "本次练习已完成"}</h1>
    <p className="mt-3 text-sm text-neutral-600">{en ? "Written answers without AI feedback are unmarked, not incorrect. Compare your working with the reference solution." : "尚未获得 AI 反馈的书面作答不判为错误，请对照参考解答核查步骤。"}</p>
    {attempt.paper?.bestQuestionCount && <p className="mt-3 text-sm">{en ? `The best ${attempt.paper.bestQuestionCount} marked questions count towards the total.` : `总分计入得分最高的 ${attempt.paper.bestQuestionCount} 题。`}</p>}
    <div className="mt-7 space-y-5">{attempt.questions.map((q, i) => <details key={q.id} className="border border-black/15 bg-white/40 p-5"><summary className="cursor-pointer font-medium">{i + 1}. {q.type === "mcq" ? (reviewed[q.id]?.submission.score?.correct ? (en ? "Correct" : "正确") : (en ? "Review answer" : "核对答案")) : en ? "Written solution" : "书面作答"}</summary><MathRenderer text={q.type === "mcq" ? q.question : [q.context, ...q.parts.map(p => `${p.label}. ${p.question}`)].filter(Boolean).join("\n\n")} block className="mt-4 text-base leading-8" />{reviewed[q.id] && <SolutionReview row={reviewed[q.id]} en={en} attemptId={attempt.id} aiEnabled={aiEnabled} offer={offer} />}</details>)}</div>
    {attempt.reportId && <SessionFeedback key={attempt.reportId} sessionId={attempt.reportId} questionIds={attempt.questions.map(q => q.id)} />}
    <div className="mt-7 flex gap-5"><button type="button" className="btn btn-primary" onClick={() => { setAttempt(null); setSaved(false); }}>{en ? "Another practice" : "再练一组"}</button><Link href={attempt.reportId ? `/tests/${testId}/history/${attempt.reportId}` : `/tests/${testId}/history`} className="inline-flex min-h-11 items-center underline">{en ? "Study report" : "学习报告"}</Link></div>
  </section>;
  if (!question) return <section className="mx-auto max-w-4xl p-8">{errorNode}<button type="button" className="btn btn-primary" disabled={busy} onClick={() => void finish()}>{en ? "Submit practice" : "提交练习"}</button></section>;
  const response = answers[question.id] ?? { questionId: question.id };
  const committed = reviewed[question.id];
  if (currentModule && instructionRemaining > 0) return <section className="mx-auto max-w-4xl px-5 py-10">
    <h1 className="text-2xl font-semibold">{en ? currentModule.titleEn : currentModule.title}</h1>
    <p className="mt-4 font-mono text-2xl" aria-live="off">{instructionRemaining} {en ? "seconds · instructions" : "秒 · 阅读说明"}</p>
    <p className="mt-4 text-sm leading-7">{en ? "This instruction time is separate from answer time. You cannot return to a submitted module." : "说明阅读时间独立于答题时间，提交模块后不能返回。"}</p>
    {calculatorAllowed && <p className="mt-2 text-sm">{en ? "A basic calculator is available in this module (Alt+C)." : "本模块可使用基础计算器（Alt+C）。"}</p>}
    <button type="button" className="btn btn-primary mt-6" onClick={() => { setInstructionRemaining(0); setInstructionDeadline(0); setDeadline(Date.now() + currentModule.durationSec * 1000); }}>{en ? "Start this module" : "开始本模块"}</button>
  </section>;
  return <section className="mx-auto max-w-5xl px-5 py-7">
    {!online && <p role="status" className="mb-4 text-sm text-amber-800">{en ? "Offline. Your work is kept on this device. Reconnect before submitting; the timer continues." : "当前离线，作答暂存在本机。请恢复网络后提交，计时不会暂停。"}</p>}
    {calculator && calculatorAllowed && <BasicCalculator onClose={() => setCalculator(false)} />}
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/15 pb-5"><h1 className="text-xl font-semibold">{attempt.paper?.title ?? title}</h1><span className="font-mono">{currentModule ? `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}` : `${index + 1}/${visibleIds.length}`}</span></header>
    {currentModule && <><div className="mt-4 flex gap-3"><button type="button" className="btn btn-secondary" aria-pressed={!!flagged[question.id]} onClick={() => { const next = !flagged[question.id]; setFlagged(current => ({ ...current, [question.id]: next })); telemetry.current?.flag(question.id, next); }}>{flagged[question.id] ? (en ? "Flagged" : "已标记") : en ? "Flag for review" : "标记待检查"}</button>{calculatorAllowed && <button type="button" className="btn btn-secondary" onClick={() => setCalculator(open => !open)}>{en ? "Calculator" : "计算器"}</button>}</div><nav className="my-5 flex flex-wrap gap-2" aria-label={en ? "Questions in this module" : "本模块题号"}>{visibleIds.map((id, i) => <button key={id} type="button" aria-current={index === i ? "step" : undefined} aria-label={`${i + 1}${flagged[id] ? (en ? ", flagged" : "，已标记") : ""}`} className={`min-h-11 min-w-11 border px-2 ${index === i ? "bg-[#101817] text-white" : flagged[id] ? "border-amber-700 bg-amber-50" : "border-black/20 bg-white/40"}`} disabled={busy} onClick={() => setIndex(i)}>{i + 1}{flagged[id] ? " ·" : ""}</button>)}</nav></>}
    <article className="mt-7 space-y-5">
      <QuestionResponse question={question} answer={response} images={images[question.id] ?? {}} en={en} disabled={busy || !!committed || (!!deadline && remaining <= 0)} audioPlayed={!!playedAudio[question.type === "mcq" ? question.audioSectionId ?? question.id : question.id]} onAudioPlay={() => setPlayedAudio(current => ({ ...current, [question.type === "mcq" ? question.audioSectionId ?? question.id : question.id]: true }))} singlePlay={!!paperId}
        onChange={setAnswer} onImagesChange={(label, next) => {
          setImages(current => ({ ...current, [question.id]: { ...current[question.id], [label]: next } }));
          setAnswer({ answerImageIds: { ...response.answerImageIds, [label]: next.map(image => image.id) } });
        }} />
      {committed && <SolutionReview row={committed} en={en} attemptId={attempt.id} aiEnabled={aiEnabled} offer={offer} />}
    </article>
    {errorNode}<div className="mt-7 flex flex-wrap justify-between gap-3">
      {currentModule ? <><button type="button" className="btn btn-secondary" disabled={busy || index === 0} onClick={() => setIndex(i => i - 1)}>{en ? "Previous" : "上一题"}</button>{index + 1 < visibleIds.length ? <button type="button" className="btn btn-primary" disabled={busy} onClick={() => setIndex(i => i + 1)}>{en ? "Next" : "下一题"}</button> : <button type="button" className="btn btn-primary" disabled={busy} onClick={nextModule}>{en ? "Submit module" : "提交本模块"}</button>}</>
        : !committed ? <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void commitQuestion()}>{en ? "Submit this answer" : "提交本题答案"}</button>
          : <button type="button" className="btn btn-primary" disabled={busy} onClick={() => index + 1 < visibleIds.length ? setIndex(i => i + 1) : void finish()}>{index + 1 < visibleIds.length ? (en ? "Next →" : "下一题 →") : en ? "Complete practice" : "完成练习"}</button>}
    </div>
  </section>;
}

function QuestionResponse({ question: q, answer, images, en, disabled, onChange, onImagesChange, audioPlayed, onAudioPlay, singlePlay }: {
  question: DeliveredQuestion; answer: SubmittedAnswer; images: Record<string, AnswerImageRef[]>;
  en: boolean; disabled: boolean; onChange: (value: Partial<SubmittedAnswer>) => void;
  onImagesChange: (label: string, images: AnswerImageRef[]) => void;
  audioPlayed: boolean; onAudioPlay: () => void; singlePlay: boolean;
}) {
  return <>
    {q.context && !(q.type === "mcq" && q.audioScript) && <MathRenderer text={q.context} block className="leading-8" />}
    {q.type === "mcq" ? <><MathRenderer text={q.question} block className="text-lg leading-8" />
      {q.audioScript && <button type="button" className="btn btn-secondary" disabled={disabled || (singlePlay && audioPlayed) || typeof speechSynthesis === "undefined"} onClick={() => {
        onAudioPlay();
        speechSynthesis.cancel(); const speech = new SpeechSynthesisUtterance(q.audioScript); speech.lang = "en-GB"; speechSynthesis.speak(speech);
      }}>{singlePlay && audioPlayed ? (en ? "Recording already played" : "本节录音已播放") : en ? "Play practice audio" : "播放练习音频"}</button>}
      {q.responseMode === "matrix" ? <div className="space-y-4">{q.statements?.map((statement, i) => {
        const values = decodeMatrixAnswer(answer.selected, q.statements?.length ?? 0);
        return <fieldset key={statement.id} disabled={disabled} className="border border-black/15 p-4"><legend>{statement.text}</legend>{(["yes", "no"] as const).map(value => <label key={value} className="mr-5 inline-flex min-h-11 items-center gap-2"><input type="radio" name={`${q.id}:${statement.id}`} checked={values[i] === value} onChange={() => { values[i] = value; onChange({ selected: encodeMatrixAnswer(values) }); }} />{value === "yes" ? (en ? "Yes" : "是") : en ? "No" : "否"}</label>)}</fieldset>;
      })}</div> : <div className="space-y-3">{q.options.map(option => <button key={option.key} type="button" disabled={disabled} aria-pressed={answer.selected === option.key} className={`flex min-h-14 w-full gap-4 border p-4 text-left ${answer.selected === option.key ? "border-[#101817] bg-white" : "border-black/20 bg-white/35"}`} onClick={() => onChange({ selected: option.key })}><strong>{option.key}.</strong><MathRenderer text={option.text} /></button>)}</div>}
    </> : <>
      {q.essayPrompts && <label className="block text-sm">{en ? "Essay prompt" : "写作题目"}<select className="input mt-2" disabled={disabled} value={answer.selectedPromptId ?? ""} onChange={e => onChange({ selectedPromptId: e.target.value })}><option value="">{en ? "Choose a prompt" : "选择题目"}</option>{q.essayPrompts.map(prompt => <option key={prompt.id} value={prompt.id}>{prompt.title}</option>)}</select></label>}
      {q.parts.map(part => <div key={part.label} className="space-y-3 border-t border-black/15 pt-5"><div className="flex justify-between gap-3"><MathRenderer text={`${part.label}. ${part.question}`} block className="text-lg leading-8" /><span className="shrink-0 text-sm text-neutral-500">{part.marks} {en ? "marks" : "分"}</span></div>
        {q.responseKind === "essay" ? <label className="block text-sm">{en ? "Your answer" : "你的作答"}<textarea className="input mt-2 min-h-60" disabled={disabled} value={answer.work?.[part.label] ?? ""} onChange={e => onChange({ work: { ...answer.work, [part.label]: e.target.value } })} /><span className="mt-2 block text-sm text-neutral-600">{(answer.work?.[part.label] ?? "").trim().split(/\s+/).filter(Boolean).length} {en ? "words" : "词"}{q.maxWords ? ` / ${q.maxWords}` : ""}</span></label>
          : <HandwrittenAnswerInput disabled={disabled} contextKey={`${q.id}:${part.label}`} value={answer.work?.[part.label] ?? ""} onChange={value => onChange({ work: { ...answer.work, [part.label]: value } })} images={images[part.label] ?? []} onImagesChange={next => onImagesChange(part.label, next)} />}
      </div>)}
    </>}
  </>;
}

function SolutionReview({ row, en, attemptId, aiEnabled, offer }: { row: ReviewedAnswer; en: boolean; attemptId: string; aiEnabled: boolean; offer: { priceFen: number; months: number } }) {
  const q = row.question;
  const [grading, setGrading] = useState<GradeResponse | null>(row.submission.grading ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const grade = async (reviewMode: "standard" | "adjudicate" = "standard") => {
    if (busy) return;
    setBusy(true); setError("");
    try { setGrading(await requestJson<GradeResponse>("/api/grade-answer", { attemptId, questionId: q.id, reviewMode })); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "request_failed"); }
    finally { refreshAiRemaining(); setBusy(false); }
  };
  if (error === "membership_required" || error === "trial_expired") return <MembershipRequired offer={offer} expiredTrial={error === "trial_expired"} />;
  const answerLabel = q.type === "mcq" && q.responseMode === "matrix"
    ? q.matrixAnswer?.map((value, i) => `${i + 1}: ${value === "yes" ? (en ? "Yes" : "是") : en ? "No" : "否"}`).join(" · ")
    : q.type === "mcq" ? q.answer : "";
  return <section className="mt-5 border-t border-black/15 pt-5">
    <h2 className="font-semibold">{q.type === "mcq" ? (en ? `Answer: ${answerLabel}` : `参考答案：${answerLabel}`) : grading ? (en ? "AI practice feedback" : "AI 练习反馈") : en ? "Reference solution · unmarked" : "参考解答 · 尚未评分"}</h2>
    {q.type === "long" && aiEnabled && !grading && <button type="button" className="btn btn-secondary mt-4" disabled={busy} onClick={() => void grade()}>{busy ? (en ? "Preparing feedback…" : "正在生成反馈…") : en ? "Get AI practice feedback" : "获取 AI 练习反馈"}</button>}
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error === "ai_consent_required" ? <Link href="/account" className="underline">{en ? "Review your optional AI-processing consent in Account & Privacy." : "请到账号与隐私查看是否同意可选的 AI 数据处理。"}</Link>
      : error === "ai_quota_exhausted" ? (en ? "You've used today's AI feedback. Please come back tomorrow." : "今天的 AI 批改次数已用完，明天再来吧。")
      : error === "ai_in_progress" ? (en ? "This feedback is being prepared. Try again shortly." : "这份反馈正在生成，请稍后重试。")
      : en ? "Feedback is temporarily unavailable. Your submitted work is saved; please try again." : "反馈暂时不可用，提交的作答已保存，请稍后重试。"}</p>}
    {grading && <div className="mt-4 space-y-4">
      <p aria-live="polite" className="font-semibold">{en ? "Practice mark" : "练习参考分"} {grading.totalEarned}/{grading.totalMax}</p>
      <GradingTrustPanel assessment={grading.assessment} />
      {grading.imageReview && <HandwritingRecognitionNote review={grading.imageReview} />}
      {grading.perPart.map(part => <div key={part.label}><p className="text-sm font-semibold">{part.label} · {part.earned}/{part.max}</p><MathRenderer text={part.feedback} block className="mt-1 text-sm leading-7" /></div>)}
    </div>}
    <details className="mt-4"><summary className="cursor-pointer py-2 text-sm">{en ? "Reference solution" : "查看参考解答"}</summary><MathRenderer text={q.type === "mcq" ? q.solution : q.fullSolution} block className="mt-3 text-base leading-8" /></details>
  </section>;
}
