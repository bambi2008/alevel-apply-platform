"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3 } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface PreviewTask {
  id: string;
  testId: string;
  title: string;
  estimatedMinutes: number;
  status: "PLANNED" | "DONE" | "SKIPPED";
  scheduledFor: string;
}

interface PreviewData {
  authenticated: true;
  today: string;
  goals: unknown[];
  tasks: PreviewTask[];
}

export function StudyTodayPreview() {
  const [data, setData] = useState<PreviewData | null>(null);

  useEffect(() => {
    fetch("/api/study/agenda", { method: "POST" })
      .then((response) => response.ok ? response.json() as Promise<PreviewData> : null)
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) return null;
  const todayTasks = data.tasks.filter((task) => task.scheduledFor.slice(0, 10) === data.today && task.status !== "SKIPPED");

  return (
    <section className="border-y border-[var(--border)] py-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--ink)]">
            <CalendarDays className="size-5 text-[var(--indigo)]" aria-hidden="true" /> 今日备考
          </h2>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            {data.goals.length === 0 ? "设置目标后，系统会自动安排每天的训练。" : todayTasks.length ? `${todayTasks.filter((task) => task.status === "DONE").length}/${todayTasks.length} 项已完成` : "今天没有安排，保持状态或提前完成明日任务。"}
          </p>
        </div>
        <Link href="/study" className="shrink-0 text-sm font-medium text-[var(--indigo)] hover:underline">打开备考中心 →</Link>
      </div>
      {todayTasks.length > 0 && (
        <div className="mt-4 divide-y divide-[var(--border)] border-t border-[var(--border)]">
          {todayTasks.slice(0, 3).map((task) => (
            <div key={task.id} className="flex items-center gap-3 py-3">
              {task.status === "DONE" ? <CheckCircle2 className="size-4 shrink-0 text-[var(--success)]" aria-hidden="true" /> : <Clock3 className="size-4 shrink-0 text-[var(--ink-faint)]" aria-hidden="true" />}
              <span className={`min-w-0 flex-1 truncate text-sm ${task.status === "DONE" ? "text-[var(--ink-faint)] line-through" : "text-[var(--ink)]"}`}>{task.testId.toUpperCase()} · {task.title}</span>
              <span className="text-xs text-[var(--ink-faint)]">{task.estimatedMinutes} 分钟</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
