"use client";

import { useEffect, useState } from "react";
import { BarChart3, BrainCircuit, Clock3, Play, RotateCcw, Target } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { AdaptiveProfile, AdaptiveTask, AdaptiveTopicProfile } from "@/lib/tests/adaptive";

type AdaptiveResponse = AdaptiveProfile & { authenticated: true; recommendedQuestionIds: string[] };

const stageLabel: Record<AdaptiveProfile["stage"], string> = {
  diagnostic: "诊断阶段",
  foundation: "基础巩固",
  building: "能力提升",
  "exam-ready": "整卷冲刺",
};

const statusLabel: Record<AdaptiveTopicProfile["status"], string> = {
  unassessed: "待诊断",
  starting: "数据积累中",
  "needs-work": "需要强化",
  developing: "正在提升",
  secure: "较为稳定",
  mastered: "已掌握",
};

const trendLabel: Record<AdaptiveTopicProfile["trend"], string> = {
  new: "新数据",
  improving: "上升",
  stable: "稳定",
  declining: "回落",
};

function TaskIcon({ task }: { task: AdaptiveTask }) {
  if (task.kind === "review") return <RotateCcw className="size-4" aria-hidden="true" />;
  if (task.kind === "mock") return <Clock3 className="size-4" aria-hidden="true" />;
  if (task.kind === "diagnostic") return <BrainCircuit className="size-4" aria-hidden="true" />;
  return <Target className="size-4" aria-hidden="true" />;
}

export function AdaptiveLearningPanel({ testId, variant }: { testId: string; variant: "plan" | "analysis" }) {
  const [data, setData] = useState<AdaptiveResponse | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "unauthorized" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/exam-sessions/adaptive?testId=${testId}&count=15`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("load failed");
        const result = await response.json() as AdaptiveResponse | { authenticated: false };
        if (!result.authenticated) {
          setState("unauthorized");
          return null;
        }
        return result;
      })
      .then((result) => {
        if (!result) return;
        setData(result);
        setState("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState("error");
      });
    return () => controller.abort();
  }, [testId]);

  if (state === "loading") {
    return <div className="h-44 animate-pulse rounded-lg bg-[var(--surface)]" aria-label="正在加载个性化学习计划" />;
  }

  if (state === "unauthorized") {
    return (
      <div className="border-y border-[var(--border)] py-8 text-center">
        <BrainCircuit className="mx-auto size-7 text-[var(--indigo)]" aria-hidden="true" />
        <h3 className="mt-3 font-semibold">登录后生成个人学习路径</h3>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">练习记录会用于安排诊断、复习和下一组题目。</p>
        <Link href="/login" className="mt-4 inline-flex items-center gap-2 rounded-md bg-[var(--indigo)] px-4 py-2 text-sm font-medium text-white">
          前往登录 <Play className="size-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  if (state === "error" || !data) {
    return <p className="border-y border-[var(--border)] py-6 text-sm text-[var(--danger)]">个性化数据暂时无法加载，请稍后刷新。</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <div className="text-xs font-semibold text-[var(--indigo)]">{stageLabel[data.stage]}</div>
          <h3 className="mt-1 text-xl font-bold text-[var(--ink)]">
            {variant === "plan" ? "你的本周训练重点" : "当前能力画像"}
          </h3>
        </div>
        <Link
          href={`/tests/${testId}/practice?adaptive=1&count=15`}
          className="inline-flex items-center gap-2 rounded-md bg-[var(--indigo)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--indigo-hover)]"
        >
          <Play className="size-4" aria-hidden="true" /> 开始智能训练
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--border)] sm:grid-cols-4">
        {[
          ["备考准备度", `${data.readiness}%`],
          ["知识覆盖", `${data.coverage}%`],
          ["独立题目", String(data.uniqueQuestions)],
          ["到期复习", String(data.dueReviewCount)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white px-4 py-3">
            <div className="text-xl font-bold text-[var(--ink)]">{value}</div>
            <div className="mt-0.5 text-xs text-[var(--ink-faint)]">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Link href={`/tests/${testId}/review`} className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--indigo)] hover:underline">
          <RotateCcw className="size-3.5" aria-hidden="true" /> 查看复习队列
        </Link>
      </div>

      {variant === "plan" ? <TaskList tasks={data.tasks} /> : <TopicAnalysis testId={testId} topics={data.topics} />}

      <p className="text-xs leading-relaxed text-[var(--ink-faint)]">
        准备度综合知识点掌握、覆盖范围和样本置信度；系统会随每次练习更新，不等同于官方考试分数预测。
      </p>
    </div>
  );
}

function TaskList({ tasks }: { tasks: AdaptiveTask[] }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Target className="size-4 text-[var(--indigo)]" aria-hidden="true" />
        <h4 className="font-semibold">下一步行动</h4>
      </div>
      <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {tasks.map((task, index) => (
          <div key={task.id} className="flex items-center gap-3 py-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[var(--surface)] text-[var(--indigo)]">
              <TaskIcon task={task} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[var(--ink)]">{index + 1}. {task.title}</div>
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--ink-soft)]">{task.detail}</p>
            </div>
            <Link href={task.href} className="shrink-0 rounded-md border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--indigo)] hover:bg-[var(--info-bg)]">
              开始
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopicAnalysis({ testId, topics }: { testId: string; topics: AdaptiveTopicProfile[] }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <BarChart3 className="size-4 text-[var(--indigo)]" aria-hidden="true" />
        <h4 className="font-semibold">知识点掌握度</h4>
      </div>
      <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {topics.map((topic) => (
          <div key={topic.id} className="py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-[var(--ink)]">{topic.title}</div>
                <div className="mt-0.5 text-xs text-[var(--ink-faint)]">
                  {statusLabel[topic.status]} · {trendLabel[topic.trend]} · {topic.uniqueQuestions} 道独立题
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[var(--ink)]">{topic.mastery}%</span>
                <Link href={`/tests/${testId}/practice?topic=${topic.id}&adaptive=1&count=10`} className="text-xs font-medium text-[var(--indigo)] hover:underline">
                  智能强化 →
                </Link>
              </div>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
              <div className="h-full rounded-full bg-[var(--indigo)]" style={{ width: `${topic.mastery}%` }} />
            </div>
            <div className="mt-1 text-right text-[11px] text-[var(--ink-faint)]">置信度 {topic.confidence}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
