"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CalendarDays, CheckCircle2, ClipboardCheck, Clock3, Gauge, Play, ShieldCheck, Target } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ExamReadiness } from "@/lib/tests/readiness";

type ReadinessResponse = ExamReadiness & {
  remediation: {
    activeCount: number;
    dueCount: number;
    recoveredCount: number;
    verifiedCount: number;
    relapsedCount: number;
    recoveryRate: number;
  };
  goal: {
    targetDate: string;
    targetLevel: string | null;
    weeklyMinutes: number;
    daysRemaining: number;
  } | null;
};

const statusMeta: Record<ExamReadiness["status"], { label: string; color: string }> = {
  collecting: { label: "证据积累中", color: "text-[var(--ink-soft)]" },
  "not-ready": { label: "尚未就绪", color: "text-[var(--danger)]" },
  "nearly-ready": { label: "接近就绪", color: "text-[var(--warning)]" },
  ready: { label: "训练证据已就绪", color: "text-[var(--success)]" },
};

const dimensionLabels: Record<keyof ExamReadiness["dimensions"], string> = {
  mastery: "知识掌握",
  coverage: "考纲覆盖",
  mockPerformance: "整卷表现",
  consistency: "稳定性",
  completion: "完成度",
  pacing: "时间节奏",
  recency: "近期状态",
};

export function ExamReadinessPanel({ testId }: { testId: string }) {
  const [data, setData] = useState<ReadinessResponse | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "unauthorized" | "empty" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/exam-sessions/readiness?testId=${testId}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("load failed");
        return response.json() as Promise<{ authenticated: boolean; readiness?: ReadinessResponse | null }>;
      })
      .then((result) => {
        if (!result.authenticated) return setState("unauthorized");
        if (!result.readiness) return setState("empty");
        setData(result.readiness);
        setState("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState("error");
      });
    return () => controller.abort();
  }, [testId]);

  if (state === "loading") return <div className="h-72 animate-pulse rounded-lg bg-[var(--surface)]" aria-label="正在计算考试就绪度" />;
  if (state === "unauthorized") return (
    <EmptyState
      icon={<ShieldCheck className="size-8 text-[var(--indigo)]" />}
      title="登录后建立考前就绪证据"
      detail="系统会读取你的整卷、专项训练和计时记录，不公开个人成绩。"
      action={<Link href="/login" className="rounded-md bg-[var(--indigo)] px-4 py-2 text-sm font-medium text-white">前往登录</Link>}
    />
  );
  if (state === "empty") return (
    <EmptyState
      icon={<ClipboardCheck className="size-8 text-[var(--indigo)]" />}
      title="先完成第一组诊断"
      detail="完成专项诊断后，系统才能识别覆盖缺口并安排整卷证据。"
      action={<Link href={`/tests/${testId}/practice?adaptive=1&count=15`} className="rounded-md bg-[var(--indigo)] px-4 py-2 text-sm font-medium text-white">开始诊断</Link>}
    />
  );
  if (state === "error" || !data) return <p className="border-y border-[var(--border)] py-8 text-center text-sm text-[var(--danger)]">就绪度暂时无法加载，请稍后刷新。</p>;

  const meta = statusMeta[data.status];
  return (
    <div className="space-y-7">
      <div className="grid gap-6 border-b border-[var(--border)] pb-6 md:grid-cols-[180px_1fr]">
        <div className="flex items-center gap-4 md:block">
          <div className="flex size-24 items-center justify-center rounded-full border-8 border-[var(--surface-2)] text-3xl font-bold text-[var(--ink)] md:size-32">
            {data.score}
          </div>
          <div className="md:mt-3">
            <div className={`text-sm font-semibold ${meta.color}`}>{meta.label}</div>
            <div className="mt-1 text-xs text-[var(--ink-faint)]">证据置信度：{data.confidence === "high" ? "高" : data.confidence === "medium" ? "中" : "低"}</div>
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-[var(--indigo)]">EXAM READINESS</div>
          <h3 className="mt-1 text-2xl font-bold text-[var(--ink)]">{data.headline}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">
            该分数衡量平台内的训练证据是否足以支持上考场，不是官方换算分、排名、录取概率或成绩承诺。
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Evidence label="完整整卷" value={`${data.evidence.fullMocks} 次`} />
            <Evidence label="不同固定卷" value={`${data.evidence.distinctPapers} 套`} />
            <Evidence label="独立题目" value={`${data.evidence.uniqueQuestions} 道`} />
            <Evidence label="待清零" value={`${data.remediation.activeCount} 道`} />
            {data.goal && <Evidence label="距目标日" value={`${data.goal.daysRemaining} 天`} />}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/tests/${testId}?tab=practice`} className="inline-flex items-center gap-2 rounded-md bg-[var(--indigo)] px-4 py-2.5 text-sm font-medium text-white">
              <Play className="size-4" /> 进入整卷训练
            </Link>
            <Link href={`/study?test=${testId}`} className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-4 py-2.5 text-sm font-medium">
              <CalendarDays className="size-4" /> {data.goal ? "调整考试目标" : "设置考试日期"}
            </Link>
            <Link href={`/tests/${testId}/review`} className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-4 py-2.5 text-sm font-medium">
              <ClipboardCheck className="size-4" /> 错题复测
            </Link>
          </div>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center gap-2"><Gauge className="size-4 text-[var(--indigo)]" /><h4 className="font-semibold">七项考场证据</h4></div>
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {(Object.entries(data.dimensions) as Array<[keyof ExamReadiness["dimensions"], number]>).map(([key, value]) => (
            <div key={key}>
              <div className="mb-1.5 flex justify-between text-xs"><span className="text-[var(--ink-soft)]">{dimensionLabels[key]}</span><span className="font-semibold">{value}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-2)]"><div className="h-full rounded-full bg-[var(--indigo)]" style={{ width: `${value}%` }} /></div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2"><AlertTriangle className="size-4 text-[var(--warning)]" /><h4 className="font-semibold">上考场前的风险门槛</h4></div>
        {data.risks.length ? (
          <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {data.risks.map((risk) => (
              <div key={risk.code} className="flex gap-3 py-3.5">
                <span className={`mt-0.5 text-xs font-semibold ${risk.severity === "critical" ? "text-[var(--danger)]" : "text-[var(--warning)]"}`}>
                  {risk.severity === "critical" ? "阻断" : "注意"}
                </span>
                <div><div className="text-sm font-semibold">{risk.title}</div><p className="mt-0.5 text-xs leading-relaxed text-[var(--ink-soft)]">{risk.detail}</p></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 border-y border-[var(--border)] py-4 text-sm text-[var(--success)]"><CheckCircle2 className="size-5" />当前没有阻断性风险，继续用整卷保持状态。</div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2"><Target className="size-4 text-[var(--indigo)]" /><h4 className="font-semibold">最后冲刺顺序</h4></div>
        <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {data.sprint.map((task, index) => (
            <div key={task.id} className="flex items-center gap-3 py-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[var(--surface)] text-sm font-bold text-[var(--indigo)]">{index + 1}</span>
              <div className="min-w-0 flex-1"><div className="text-sm font-semibold">{task.title}</div><p className="mt-0.5 text-xs leading-relaxed text-[var(--ink-soft)]">{task.detail}</p></div>
              <span className="hidden shrink-0 items-center gap-1 text-xs text-[var(--ink-faint)] sm:inline-flex"><Clock3 className="size-3.5" />{task.estimatedMinutes} 分钟</span>
              <Link href={task.href} className="shrink-0 rounded-md border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--indigo)]">开始</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Evidence({ label, value }: { label: string; value: string }) {
  return <span className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1"><span className="text-[var(--ink-faint)]">{label}</span> <strong className="ml-1 text-[var(--ink)]">{value}</strong></span>;
}

function EmptyState({ icon, title, detail, action }: { icon: React.ReactNode; title: string; detail: string; action: React.ReactNode }) {
  return <div className="border-y border-[var(--border)] py-12 text-center">{icon}<h3 className="mt-3 font-semibold">{title}</h3><p className="mx-auto mt-1 max-w-md text-sm text-[var(--ink-soft)]">{detail}</p><div className="mt-4">{action}</div></div>;
}
