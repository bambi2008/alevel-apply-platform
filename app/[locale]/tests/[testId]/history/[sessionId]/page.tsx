"use client";

import { use, useEffect, useState, type MouseEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { MCQQuestion, LongQuestion, Question } from "@/lib/tests/questions/types";
import { MathRenderer } from "@/components/math-renderer";
import { QuestionDiagnosis } from "@/components/exam-diagnosis";
import { optionReview, type AnswerDiagnosis } from "@/lib/tests/diagnosis";
import { ExamPerformanceReportView } from "@/components/exam-performance-report";
import { SessionFeedback } from "@/components/session-feedback";
import type { ExamPerformanceReport } from "@/lib/tests/report";
import type { GradeAssessment, GradeEvidence } from "@/lib/tests/grading";
import { GradingTrustPanel } from "@/components/grading-trust-panel";
import { forceFullNavigation } from "@/lib/navigation";
import { decodeMatrixAnswer } from "@/lib/tests/objective-scoring";

interface PartFeedback {
  label: string;
  earned: number;
  max: number;
  feedback: string;
  keyStepsFound?: string[];
  keyStepsMissing?: string[];
  evidence?: GradeEvidence[];
  assessment?: GradeAssessment;
}

interface SessionAnswer {
  questionId: string;
  type: "mcq" | "long";
  selected: string | null;
  work: Record<string, string> | null;
  earned: number;
  max: number;
  feedback: PartFeedback[] | null;
  timeSpentSec: number | null;
  answerChanges: number;
  visits: number;
  flagged: boolean;
  firstSelected: string | null;
  gradingPending?: boolean;
}

interface SessionDetail {
  id: string;
  testId: string;
  mode: string;
  paperId: string | null;
  totalEarned: number;
  totalMax: number;
  timeUsedSec: number | null;
  createdAt: string;
  answers: SessionAnswer[];
  gradingPending?: boolean;
}

export default function SessionReviewPage({
  params,
}: {
  params: Promise<{ testId: string; sessionId: string }>;
}) {
  const { testId, sessionId } = use(params);
  const locale = useLocale();
  const en = locale === "en";
  const [data, setData] = useState<SessionDetail | null>(null);
  const [report, setReport] = useState<ExamPerformanceReport | null>(null);
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const requestedReturnTo = searchParams.get("returnTo");
  const returnTo = requestedReturnTo && requestedReturnTo.startsWith("/") && !requestedReturnTo.startsWith("//")
    ? requestedReturnTo
    : undefined;
  const fallbackReturnTo = data?.paperId
    ? `/tests/${testId}/paper/${data.paperId}?reviewSession=${encodeURIComponent(sessionId)}`
    : `/tests/${testId}`;
  const handleBack = (event: MouseEvent<HTMLAnchorElement>) => {
    if (returnTo) {
      forceFullNavigation(event);
      return;
    }
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) return;
    event.preventDefault();
    if (window.history.length > 1) window.history.back();
    else window.location.assign(fallbackReturnTo);
  };

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/exam-sessions/${sessionId}/report`, { cache: "no-store", signal: controller.signal, headers: { "x-qiaoshen-locale": locale } })
      .then((r) => {
        if (r.status === 401) throw new Error(en ? "Sign in to view the report." : "请先登录后查看");
        if (r.status === 404) throw new Error(en ? "This report is unavailable." : "记录不存在或无权访问");
        if (!r.ok) throw new Error(en ? "Could not load the report." : "加载失败");
        return r.json() as Promise<{ session: SessionDetail; questions?: Question[]; report: ExamPerformanceReport }>;
      })
      .then((result) => {
        if (controller.signal.aborted) return;
        setData(result.session);
        setQuestionBank(result.questions ?? []);
        setReport(result.report);
      })
      .catch((e) => { if (!controller.signal.aborted) setError(e.message); });
    return () => controller.abort();
  }, [sessionId, locale, en]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-neutral-500">
        <p className="text-lg mb-4">⚠️ {error}</p>
        <Link href={returnTo ?? fallbackReturnTo} onClick={handleBack} className="text-sm text-blue-600 hover:underline">
          {en ? "← Back to exam" : "← 返回备考详情"}
        </Link>
      </div>
    );
  }

  if (!data || !report) {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-neutral-400 text-sm">{en ? "Loading…" : "加载中…"}</div>;
  }

  const fmtDate = new Date(data.createdAt).toLocaleString(en ? "en-GB" : "zh-CN", {
    timeZone: "Asia/Shanghai", year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link href={returnTo ?? fallbackReturnTo} onClick={handleBack} className="text-sm text-neutral-500 hover:text-neutral-800">
          {en ? "← Back to review" : "← 返回本次复盘"}
        </Link>
        <span className="text-sm text-neutral-400">{fmtDate}</span>
      </div>

      {data.gradingPending && <p className="my-4 border-l-2 border-amber-600 pl-3 text-sm" role="status">{en
        ? "Some written answers are awaiting feedback. The score covers marked answers only."
        : "部分书面作答尚未评分。当前分数仅统计已评分题目。"}</p>}
      {(!data.gradingPending || data.totalMax > 0) && <ExamPerformanceReportView report={report} />}

      {/* 逐题回看 */}
      <div className="mt-12 border-t border-neutral-200 pt-8">
        <h2 className="text-lg font-bold">{en ? "Question review" : "逐题回看"}</h2>
        <p className="mt-1 text-sm text-neutral-500">{en ? "Compare your answers with the marking points and explanations." : "核对答案、评分点和本题错因"}</p>
      </div>
      <div className="mt-5 space-y-6">
        {data.answers.map((a, idx) => (
          <ReviewCard
            key={`${a.questionId}-${idx}`}
            index={idx + 1}
            answer={a}
            question={questionBank.find((question) => question.id === a.questionId)}
            returnTo={returnTo}
            diagnosis={report.diagnosis.answers.find(item => item.questionId === a.questionId)}
          />
        ))}
      </div>
      <SessionFeedback key={data.id} sessionId={data.id} questionIds={data.answers.map(answer => answer.questionId)} />
    </div>
  );
}

function ReviewCard({ index, answer, question: q, returnTo, diagnosis: itemDiagnosis }: { index: number; answer: SessionAnswer; question?: Question; returnTo?: string; diagnosis?: AnswerDiagnosis }) {
  const en = useLocale() === "en";
  const correctish = answer.max > 0 && answer.earned >= answer.max;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4 text-xs">
        <span className="text-neutral-500">{en ? `Question ${index} · ${answer.type === "mcq" ? "Objective" : "Written"}` : `第 ${index} 题 · ${answer.type === "mcq" ? "选择题" : "大题"}`}</span>
        <span className={`px-2 py-0.5 rounded-full font-medium ${
          answer.gradingPending ? "bg-neutral-100 text-neutral-700" : correctish ? "bg-green-100 text-green-700" :
          answer.earned > 0 ? "bg-amber-100 text-amber-700" :
          "bg-red-100 text-red-600"
        }`}>
          {answer.gradingPending ? (en ? "Awaiting marks" : "尚未评分") : `${answer.earned}/${answer.max} ${en ? "marks" : "分"}`}
        </span>
      </div>

      {!q && (
        <p className="text-sm text-neutral-500">{en ? "The original question is unavailable." : "题目内容已更新，无法还原原题。"}</p>
      )}

      {q && answer.type === "mcq" && (
        <MCQReview q={q as MCQQuestion} selected={answer.selected} />
      )}

      {q && answer.type === "long" && (
        <LongReview q={q as LongQuestion} work={answer.work} feedback={answer.feedback} />
      )}
      {q && itemDiagnosis && <QuestionDiagnosis diagnosis={itemDiagnosis} question={q} returnTo={returnTo} />}
    </div>
  );
}

function MCQReview({ q, selected }: { q: MCQQuestion; selected: string | null }) {
  const en = useLocale() === "en";
  const matrix = q.responseMode === "matrix" ? decodeMatrixAnswer(selected ?? undefined, q.statements?.length ?? 0) : null;
  const label = (value: "yes" | "no" | undefined) => value === "yes" ? (en ? "Yes" : "是") : value === "no" ? (en ? "No" : "否") : "—";
  return (
    <div className="space-y-4">
      <MathRenderer text={q.question} className="text-neutral-900 leading-relaxed" block />
      <div className="space-y-2">
        {matrix ? q.statements?.map((statement, index) => <div key={statement.id} className="border-b border-black/15 py-3 text-sm">
          <MathRenderer text={statement.text} />
          <p className="mt-1 text-neutral-600">{en ? "You: " : "你的选择："}{label(matrix[index])} · {en ? "Answer: " : "参考答案："}{label(q.matrixAnswer?.[index])}</p>
        </div>) : q.options.map((opt) => {
          const isCorrect = opt.key === q.answer;
          const isChosen = opt.key === selected;
          let cls = "border-neutral-200 bg-white";
          if (isCorrect) cls = "border-green-500 bg-green-50";
          else if (isChosen) cls = "border-red-400 bg-red-50";
          const review = optionReview(q, opt.key);
          return (
            <div key={opt.key} className={`rounded-xl border-2 px-4 py-2.5 ${cls}`}>
              <div className="flex items-start gap-3">
                <span className="font-bold text-sm shrink-0 w-5">{opt.key}.</span>
                <MathRenderer text={opt.text} className="flex-1 text-sm" />
                {isCorrect && <span className="text-green-700 text-sm shrink-0">{en ? "✓ Correct" : "✓ 正确"}</span>}
                {isChosen && !isCorrect && <span className="text-red-600 text-sm shrink-0">{en ? "Your choice" : "你的选择"}</span>}
              </div>
              {!en && (isCorrect || isChosen) && (
                <p className="ml-8 mt-1 text-xs leading-5 text-neutral-500">
                  <span className="font-medium">{review.title}：</span>{review.detail}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-sm">
        <span className="font-medium text-neutral-700">{en ? "Explanation" : "解题过程"}</span>
        <MathRenderer text={q.solution} className="mt-1 text-neutral-700 leading-relaxed" block />
      </div>
    </div>
  );
}

function LongReview({
  q,
  work,
  feedback,
}: {
  q: LongQuestion;
  work: Record<string, string> | null;
  feedback: PartFeedback[] | null;
}) {
  const en = useLocale() === "en";
  const [showSolution, setShowSolution] = useState(false);
  const fbByLabel = new Map((feedback ?? []).map((f) => [f.label, f] as const));
  const assessment = feedback?.find((item) => item.assessment)?.assessment;

  return (
    <div className="space-y-5">
      {assessment && <GradingTrustPanel assessment={assessment} />}
      {q.context && (
        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
          <MathRenderer text={q.context} className="text-sm text-neutral-700" block />
        </div>
      )}

      {q.parts.map((part) => {
        const fb = fbByLabel.get(part.label);
        const myWork = work?.[part.label] ?? "";
        return (
          <div key={part.label} className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-neutral-800">{part.label}</span>
              <span className="text-xs text-neutral-500">[{part.marks} {en ? "marks" : "分"}]</span>
            </div>
            <MathRenderer text={part.question} className="text-neutral-700 leading-relaxed text-sm" block />

            <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
              <p className="text-xs text-neutral-500 mb-1">{en ? "Your answer" : "你的作答"}</p>
              <p className="text-sm text-neutral-700 whitespace-pre-wrap font-mono">
                {myWork.trim() || (en ? "No typed notes" : "无补充文字")}
              </p>
            </div>

            {fb && (
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-blue-700 font-medium">{en ? "AI feedback" : "AI 反馈"}</p>
                  <span className={`text-xs font-bold ${fb.earned === fb.max ? "text-green-600" : "text-amber-600"}`}>
                    {fb.earned}/{fb.max} {en ? "marks" : "分"}
                  </span>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed">{fb.feedback}</p>
                {fb.evidence && fb.evidence.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-neutral-600">
                    {fb.evidence.map((item, evidenceIndex) => (
                      <li key={`${item.criterion}-${evidenceIndex}`}>
                        <span className="font-semibold">{item.marksAwarded} {en ? "marks" : "分"} · {item.criterion}</span>
                        {item.quote && <span>：“{item.quote}”</span>}
                      </li>
                    ))}
                  </ul>
                )}
                {fb.keyStepsMissing && fb.keyStepsMissing.length > 0 && (
                  <p className="mt-1 text-xs text-red-600">{en ? "Missing: " : "缺少："}{fb.keyStepsMissing.join(en ? ", " : "、")}</p>
                )}
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => setShowSolution((v) => !v)}
        className="text-sm text-blue-600 hover:underline"
      >
        {showSolution ? (en ? "Hide reference answer" : "收起参考答案") : (en ? "Show reference answer" : "查看参考答案")}
      </button>
      {showSolution && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <MathRenderer text={q.fullSolution} className="text-sm text-neutral-700 leading-relaxed" block />
        </div>
      )}
    </div>
  );
}
