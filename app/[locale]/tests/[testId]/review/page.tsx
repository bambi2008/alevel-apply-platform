"use client";

import { use, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, Play, RotateCcw, ShieldCheck, TrendingUp } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTestById } from "@/lib/tests";
import { getQuestionById, getTopicMeta } from "@/lib/tests/lookup";
import type { RemediationCase, RemediationProfile, RemediationStatus } from "@/lib/tests/remediation";

type RemediationResponse = { authenticated: true; profile: RemediationProfile };

const statusMeta: Record<RemediationStatus, { label: string; className: string }> = {
  relapsed: { label: "复发", className: "bg-[var(--danger-bg)] text-[var(--danger)]" },
  due: { label: "待复测", className: "bg-[var(--warning-bg)] text-[var(--warning)]" },
  scheduled: { label: "已排期", className: "bg-[var(--surface)] text-[var(--ink-soft)]" },
  recovered: { label: "已恢复", className: "bg-[var(--info-bg)] text-[var(--indigo)]" },
  verified: { label: "已稳定", className: "bg-[var(--success-bg)] text-[var(--success)]" },
};

function reviewLabel(item: RemediationCase) {
  const due = new Date(item.nextReviewAt);
  if (item.status === "relapsed") return "立即复测";
  if (due <= new Date()) return item.daysOverdue ? `逾期 ${item.daysOverdue} 天` : "今天复测";
  return `${due.getMonth() + 1}月${due.getDate()}日复测`;
}

function isActionable(item: RemediationCase) {
  return item.status === "relapsed"
    || item.status === "due"
    || (item.status === "recovered" && new Date(item.nextReviewAt) <= new Date());
}

export default function ReviewQueuePage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params);
  const test = getTestById(testId);
  const [data, setData] = useState<RemediationProfile | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "unauthorized" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/exam-sessions/remediation?testId=${testId}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("复测数据加载失败");
        return response.json() as Promise<RemediationResponse | { authenticated: false }>;
      })
      .then((result) => {
        if (!result.authenticated) return setState("unauthorized");
        setData(result.profile);
        setState("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState("error");
      });
    return () => controller.abort();
  }, [testId]);

  const actionable = useMemo(() => data?.cases.filter(isActionable) ?? [], [data]);
  const active = useMemo(() => data?.cases.filter((item) => item.status !== "verified") ?? [], [data]);
  const verified = useMemo(() => data?.cases.filter((item) => item.status === "verified") ?? [], [data]);

  if (!test) return null;
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link href={`/tests/${testId}?tab=analysis`} className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
        ← 返回 {test.abbr} 能力画像
      </Link>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <div className="text-xs font-semibold text-[var(--indigo)]">REMEDIATION LOOP</div>
          <h1 className="mt-1 text-2xl font-bold">错题复测与风险清零</h1>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">一次答对只算恢复；跨日期连续复测成功后才算稳定。</p>
        </div>
        {!!actionable.length && (
          <Link href={`/tests/${testId}/practice?adaptive=1&remediation=1&count=${Math.min(10, actionable.length)}`} className="inline-flex items-center gap-2 rounded-md bg-[var(--indigo)] px-4 py-2.5 text-sm font-medium text-white">
            <Play className="size-4" /> 开始今日复测
          </Link>
        )}
      </div>

      {state === "loading" && <div className="mt-6 h-56 animate-pulse rounded-lg bg-[var(--surface)]" />}
      {state === "unauthorized" && (
        <EmptyState icon={<ShieldCheck className="size-8 text-[var(--indigo)]" />} title="登录后查看修复轨迹" detail="系统只分析你的个人作答记录。" action={<Link href="/login" className="text-sm font-medium text-[var(--indigo)]">前往登录 →</Link>} />
      )}
      {state === "error" && <EmptyState icon={<AlertTriangle className="size-8 text-[var(--danger)]" />} title="复测数据暂时无法加载" detail="请稍后刷新页面重试。" />}

      {state === "ready" && data && (
        <div className="mt-6 space-y-8">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-[var(--border)] bg-[var(--border)] sm:grid-cols-4">
            {[
              ["修复率", `${data.recoveryRate}%`],
              ["今日待复测", String(data.dueCount)],
              ["已稳定", String(data.verifiedCount)],
              ["复发", String(data.relapsedCount)],
            ].map(([label, value]) => (
              <div key={label} className="bg-white px-4 py-3">
                <div className="text-xl font-bold">{value}</div>
                <div className="mt-0.5 text-xs text-[var(--ink-faint)]">{label}</div>
              </div>
            ))}
          </div>

          {data.totalCases === 0 && (
            <EmptyState
              icon={<CheckCircle2 className="size-8 text-[var(--success)]" />}
              title="还没有需要修复的失分记录"
              detail="完成诊断或模拟卷后，低于 80% 的题目会进入这里。"
              action={<Link href={`/tests/${testId}/practice?adaptive=1&count=15`} className="text-sm font-medium text-[var(--indigo)]">开始诊断 →</Link>}
            />
          )}

          {!!actionable.length && (
            <CaseSection
              title="今日清零队列"
              icon={<RotateCcw className="size-4 text-[var(--warning)]" />}
              cases={actionable}
              testId={testId}
            />
          )}

          {!!active.length && (
            <CaseSection
              title="全部修复轨迹"
              icon={<TrendingUp className="size-4 text-[var(--indigo)]" />}
              cases={active}
              testId={testId}
            />
          )}

          {!!verified.length && (
            <CaseSection
              title="已通过稳定性复测"
              icon={<CheckCircle2 className="size-4 text-[var(--success)]" />}
              cases={verified}
              testId={testId}
            />
          )}

          {!!data.topics.length && (
            <section>
              <h2 className="text-sm font-semibold">反复失分主题</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.topics.filter((topic) => topic.active > 0).slice(0, 6).map((topic) => {
                  const meta = getTopicMeta(testId, topic.topicId);
                  return (
                    <Link key={topic.topicId} href={`/tests/${testId}/practice?topic=${topic.topicId}&adaptive=1&count=10`} className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs hover:border-[color:var(--indigo)]/30">
                      <strong>{meta?.title ?? topic.topicId}</strong>
                      <span className="ml-2 text-[var(--ink-faint)]">{topic.active} 待清零{topic.relapsed ? ` · ${topic.relapsed} 复发` : ""}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <p className="text-xs leading-relaxed text-[var(--ink-faint)]">
            稳定规则：出现失分后，至少在两个不同日期连续达到 80%，且两次成功间隔不少于 3 天。后续再次低于 80% 会重新标记为复发。
          </p>
        </div>
      )}
    </main>
  );
}

function CaseSection({ title, icon, cases, testId }: { title: string; icon: React.ReactNode; cases: RemediationCase[]; testId: string }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">{icon}<h2 className="font-semibold">{title}</h2></div>
      <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {cases.map((item) => {
          const question = getQuestionById(item.questionId);
          const topic = getTopicMeta(testId, item.topicId);
          const meta = statusMeta[item.status];
          return (
            <div key={`${title}-${item.questionId}`} className="flex items-center gap-3 py-4">
              <span className={`shrink-0 rounded px-2 py-1 text-[11px] font-semibold ${meta.className}`}>{meta.label}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-sm font-semibold">{topic?.title ?? item.topicId}</span>
                  <span className="text-xs text-[var(--ink-faint)]">最近 {item.lastScore}% · 最佳 {item.bestScore}% · {item.attempts} 次作答</span>
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-[var(--ink-soft)]">
                  {question?.type === "mcq" ? question.question : question?.parts[0]?.question ?? item.questionId}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div className="inline-flex items-center gap-1 text-xs text-[var(--ink-faint)]"><Clock3 className="size-3.5" />{reviewLabel(item)}</div>
                {item.status !== "verified" && <Link href={`/tests/${testId}/practice?topic=${item.topicId}&adaptive=1&count=10`} className="mt-1 block text-xs font-medium text-[var(--indigo)]">同类强化 →</Link>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function EmptyState({ icon, title, detail, action }: { icon: React.ReactNode; title: string; detail: string; action?: React.ReactNode }) {
  return <div className="border-y border-[var(--border)] py-12 text-center">{icon}<h2 className="mt-3 font-semibold">{title}</h2><p className="mt-1 text-sm text-[var(--ink-soft)]">{detail}</p>{action && <div className="mt-4">{action}</div>}</div>;
}
