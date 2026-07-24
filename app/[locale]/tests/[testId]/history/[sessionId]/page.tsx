"use client";

import { use, useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { getTestById } from "@/lib/tests";
import { getQuestionById } from "@/lib/tests/lookup";
import type { MCQQuestion, LongQuestion } from "@/lib/tests/questions/types";
import { MathRenderer } from "@/components/math-renderer";
import { DiagnosisSummary, QuestionDiagnosis } from "@/components/exam-diagnosis";
import { buildSessionDiagnosis, diagnoseAnswer, optionReview } from "@/lib/tests/diagnosis";

interface PartFeedback {
  label: string;
  earned: number;
  max: number;
  feedback: string;
  keyStepsFound?: string[];
  keyStepsMissing?: string[];
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
}

interface SessionDetail {
  id: string;
  testId: string;
  mode: string;
  totalEarned: number;
  totalMax: number;
  timeUsedSec: number | null;
  createdAt: string;
  answers: SessionAnswer[];
}

export default function SessionReviewPage({
  params,
}: {
  params: Promise<{ testId: string; sessionId: string }>;
}) {
  const { testId, sessionId } = use(params);
  const test = getTestById(testId);

  const [data, setData] = useState<SessionDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/exam-sessions/${sessionId}`)
      .then((r) => {
        if (r.status === 401) throw new Error("请先登录后查看");
        if (r.status === 404) throw new Error("记录不存在或无权访问");
        if (!r.ok) throw new Error("加载失败");
        return r.json() as Promise<SessionDetail>;
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, [sessionId]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-neutral-500">
        <p className="text-lg mb-4">⚠️ {error}</p>
        <Link href={`/tests/${testId}`} className="text-sm text-blue-600 hover:underline">
          ← 返回备考详情
        </Link>
      </div>
    );
  }

  if (!data) {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-neutral-400 text-sm">加载中…</div>;
  }

  const pct = data.totalMax > 0 ? Math.round((data.totalEarned / data.totalMax) * 100) : 0;
  const fmtDate = new Date(data.createdAt).toLocaleString("zh-CN", {
    year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const sessionDiagnosis = buildSessionDiagnosis(data.answers.flatMap((answer) => {
    const question = getQuestionById(answer.questionId);
    return question ? [{
      question,
      selected: answer.selected,
      earned: answer.earned,
      max: answer.max,
      work: answer.work,
      feedback: answer.feedback,
      timeSpentSec: answer.timeSpentSec,
      answerChanges: answer.answerChanges,
      visits: answer.visits,
      flagged: answer.flagged,
      firstSelected: answer.firstSelected,
    }] : [];
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link href={`/tests/${testId}`} className="text-sm text-neutral-500 hover:text-neutral-800">
          ← {test?.abbr ?? testId} 备考详情
        </Link>
        <span className="text-sm text-neutral-400">{fmtDate}</span>
      </div>

      {/* 概要 */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 mb-8 flex items-center gap-5">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${
          pct >= 80 ? "bg-green-100 text-green-700" :
          pct >= 60 ? "bg-amber-100 text-amber-700" :
          "bg-red-100 text-red-600"
        }`}>
          {pct}%
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
              {data.mode === "mock" ? "模拟考试" : "专项练习"}
            </span>
            <span className="text-sm font-medium">{data.totalEarned} / {data.totalMax} 分</span>
          </div>
          <p className="text-sm text-neutral-500 mt-1">共 {data.answers.length} 题 · 逐题回看</p>
        </div>
      </div>

      <DiagnosisSummary diagnosis={sessionDiagnosis} />

      {/* 逐题回看 */}
      <div className="mt-8 space-y-6">
        {data.answers.map((a, idx) => (
          <ReviewCard key={`${a.questionId}-${idx}`} index={idx + 1} answer={a} />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ index, answer }: { index: number; answer: SessionAnswer }) {
  const q = getQuestionById(answer.questionId);
  const correctish = answer.max > 0 && answer.earned >= answer.max;
  const itemDiagnosis = q ? diagnoseAnswer({
    question: q,
    selected: answer.selected,
    earned: answer.earned,
    max: answer.max,
    work: answer.work,
    feedback: answer.feedback,
    timeSpentSec: answer.timeSpentSec,
    answerChanges: answer.answerChanges,
    visits: answer.visits,
    flagged: answer.flagged,
    firstSelected: answer.firstSelected,
  }) : null;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4 text-xs">
        <span className="text-neutral-400">第 {index} 题 · {answer.type === "mcq" ? "选择题" : "大题"}</span>
        <span className={`px-2 py-0.5 rounded-full font-medium ${
          correctish ? "bg-green-100 text-green-700" :
          answer.earned > 0 ? "bg-amber-100 text-amber-700" :
          "bg-red-100 text-red-600"
        }`}>
          {answer.earned}/{answer.max} 分
        </span>
      </div>

      {!q && (
        <p className="text-sm text-neutral-400">（题目内容已更新，无法还原原题）</p>
      )}

      {q && answer.type === "mcq" && (
        <MCQReview q={q as MCQQuestion} selected={answer.selected} />
      )}

      {q && answer.type === "long" && (
        <LongReview q={q as LongQuestion} work={answer.work} feedback={answer.feedback} />
      )}
      {q && itemDiagnosis && <QuestionDiagnosis diagnosis={itemDiagnosis} question={q} />}
    </div>
  );
}

function MCQReview({ q, selected }: { q: MCQQuestion; selected: string | null }) {
  return (
    <div className="space-y-4">
      <MathRenderer text={q.question} className="text-neutral-900 leading-relaxed" block />
      <div className="space-y-2">
        {q.options.map((opt) => {
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
                {isCorrect && <span className="text-green-600 text-sm shrink-0">✓ 正确</span>}
                {isChosen && !isCorrect && <span className="text-red-500 text-sm shrink-0">你的选择</span>}
              </div>
              {(isCorrect || isChosen) && (
                <p className="ml-8 mt-1 text-xs leading-5 text-neutral-500">
                  <span className="font-medium">{review.title}：</span>{review.detail}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-sm">
        <span className="font-medium text-neutral-700">解题过程：</span>
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
  const [showSolution, setShowSolution] = useState(false);
  const fbByLabel = new Map((feedback ?? []).map((f) => [f.label, f] as const));

  return (
    <div className="space-y-5">
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
              <span className="text-xs text-neutral-400">[{part.marks} 分]</span>
            </div>
            <MathRenderer text={part.question} className="text-neutral-700 leading-relaxed text-sm" block />

            <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
              <p className="text-xs text-neutral-400 mb-1">你的作答</p>
              <p className="text-sm text-neutral-700 whitespace-pre-wrap font-mono">
                {myWork.trim() || "（未作答）"}
              </p>
            </div>

            {fb && (
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-blue-700 font-medium">AI 反馈</p>
                  <span className={`text-xs font-bold ${fb.earned === fb.max ? "text-green-600" : "text-amber-600"}`}>
                    {fb.earned}/{fb.max} 分
                  </span>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed">{fb.feedback}</p>
                {fb.keyStepsMissing && fb.keyStepsMissing.length > 0 && (
                  <p className="mt-1 text-xs text-red-500">缺少：{fb.keyStepsMissing.join("、")}</p>
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
        {showSolution ? "收起" : "查看"}标准答案
      </button>
      {showSolution && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <MathRenderer text={q.fullSolution} className="text-sm text-neutral-700 leading-relaxed" block />
        </div>
      )}
    </div>
  );
}
