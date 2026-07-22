"use client";

import { use, useEffect, useState } from "react";
import { CheckCircle2, Clock3, Play, RotateCcw } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTestById } from "@/lib/tests";
import { getQuestionById, getTopicMeta } from "@/lib/tests/lookup";
import type { AdaptiveProfile, DueReview } from "@/lib/tests/adaptive";

type ReviewResponse = AdaptiveProfile & { authenticated: true; recommendedQuestionIds: string[] };

function dueLabel(review: DueReview) {
  if (review.daysOverdue > 0) return `已逾期 ${review.daysOverdue} 天`;
  const due = new Date(review.dueAt);
  const today = new Date();
  if (due <= today) return "今天复习";
  return `${due.getMonth() + 1}月${due.getDate()}日`;
}

export default function ReviewQueuePage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params);
  const test = getTestById(testId);
  const [data, setData] = useState<ReviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/exam-sessions/adaptive?testId=${testId}&count=15`)
      .then((response) => {
        if (!response.ok) throw new Error("复习队列加载失败");
        return response.json() as Promise<ReviewResponse | { authenticated: false }>;
      })
      .then((result) => {
        if (!result.authenticated) throw new Error("请先登录查看复习队列");
        setData(result);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "复习队列加载失败"));
  }, [testId]);

  if (!test) return null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href={`/tests/${testId}?tab=analysis`} className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
        ← 返回 {test.abbr} 能力画像
      </Link>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <h1 className="text-2xl font-bold">复习队列</h1>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">根据最近一次作答结果安排 1、3 或 10 天后的再次练习。</p>
        </div>
        {!!data?.dueReviewCount && (
          <Link href={`/tests/${testId}/practice?adaptive=1&review=1&count=${Math.min(10, data.dueReviewCount)}`} className="inline-flex items-center gap-2 rounded-md bg-[var(--indigo)] px-4 py-2.5 text-sm font-medium text-white">
            <Play className="size-4" aria-hidden="true" /> 开始今日复习
          </Link>
        )}
      </div>

      {error && (
        <div className="py-12 text-center text-sm text-[var(--ink-soft)]">
          <p>{error}</p>
          {error.includes("登录") && <Link href="/login" className="mt-4 inline-block text-[var(--indigo)] hover:underline">前往登录</Link>}
        </div>
      )}
      {!error && !data && <div className="h-48 animate-pulse bg-[var(--surface)]" />}
      {data && data.reviewSchedule.length === 0 && (
        <div className="py-14 text-center">
          <CheckCircle2 className="mx-auto size-8 text-[var(--success)]" aria-hidden="true" />
          <h2 className="mt-3 font-semibold">复习队列还是空的</h2>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">完成诊断后，系统会在这里安排错题和巩固题。</p>
          <Link href={`/tests/${testId}/practice?adaptive=1&count=15`} className="mt-4 inline-flex items-center gap-2 rounded-md bg-[var(--indigo)] px-4 py-2 text-sm font-medium text-white">
            开始诊断 <Play className="size-4" aria-hidden="true" />
          </Link>
        </div>
      )}
      {data && data.reviewSchedule.length > 0 && (
        <div className="divide-y divide-[var(--border)] border-b border-[var(--border)]">
          {data.reviewSchedule.map((review) => {
            const question = getQuestionById(review.questionId);
            const topic = getTopicMeta(testId, review.topicId);
            const isDue = new Date(review.dueAt) <= new Date();
            return (
              <div key={review.questionId} className="flex items-center gap-4 py-4">
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-md ${isDue ? "bg-[var(--warning-bg)] text-[var(--warning)]" : "bg-[var(--surface)] text-[var(--ink-faint)]"}`}>
                  {isDue ? <RotateCcw className="size-4" aria-hidden="true" /> : <Clock3 className="size-4" aria-hidden="true" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{topic?.title ?? review.topicId}</span>
                    <span className="text-xs text-[var(--ink-faint)]">上次得分 {review.lastScore}%</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-[var(--ink-soft)]">
                    {question?.type === "mcq" ? question.question : question?.parts[0]?.question ?? review.questionId}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <div className={`text-xs font-medium ${isDue ? "text-[var(--warning)]" : "text-[var(--ink-faint)]"}`}>{dueLabel(review)}</div>
                  <Link href={`/tests/${testId}/practice?topic=${review.topicId}&adaptive=1&count=10`} className="mt-1 inline-block text-xs text-[var(--indigo)] hover:underline">同类强化</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
