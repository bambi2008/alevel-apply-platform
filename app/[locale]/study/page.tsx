"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarDays, Check, CheckCircle2, Clock3, Flame, Plus, RotateCcw, Target, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ADMISSIONS_TESTS } from "@/lib/tests";

interface StudyGoalView {
  id: string;
  testId: string;
  test: string;
  targetDate: string;
  targetLevel: string | null;
  weeklyMinutes: number;
}

interface StudyTaskView {
  id: string;
  testId: string;
  title: string;
  detail: string | null;
  href: string;
  scheduledFor: string;
  estimatedMinutes: number;
  status: "PLANNED" | "DONE" | "SKIPPED";
}

interface AgendaData {
  authenticated: true;
  today: string;
  goals: StudyGoalView[];
  tasks: StudyTaskView[];
  report: {
    completionRate: number;
    completedTasks: number;
    plannedTasks: number;
    sessionMinutes: number;
    questionsAnswered: number;
    accuracy: number | null;
    activeDates: string[];
    currentStreak: number;
  };
}

function futureDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function dayLabel(value: string, today: string) {
  const key = value.slice(0, 10);
  if (key === today) return "今天";
  const date = new Date(`${key}T00:00:00Z`);
  return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
}

export default function StudyPage() {
  const searchParams = useSearchParams();
  const requestedTest = searchParams.get("test") ?? "tmua";
  const [data, setData] = useState<AgendaData | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "unauthorized" | "error">("loading");
  const [showGoalForm, setShowGoalForm] = useState(!!searchParams.get("test"));
  const [saving, setSaving] = useState(false);
  const [testId, setTestId] = useState(ADMISSIONS_TESTS.some((test) => test.id === requestedTest) ? requestedTest : "tmua");
  const [targetDate, setTargetDate] = useState(futureDate(90));
  const [targetLevel, setTargetLevel] = useState("");
  const [weeklyMinutes, setWeeklyMinutes] = useState(180);

  const refresh = useCallback(async () => {
    try {
      const authResponse = await fetch("/api/study/agenda");
      const initial = await authResponse.json() as { authenticated: boolean };
      if (!initial.authenticated) {
        setState("unauthorized");
        return;
      }
      const response = await fetch("/api/study/agenda", { method: "POST" });
      if (!response.ok) throw new Error("sync failed");
      setData(await response.json() as AgendaData);
      setState("ready");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const saveGoal = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/study/goals", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ testId, targetDate, targetLevel, weeklyMinutes }),
      });
      if (!response.ok) throw new Error("save failed");
      setShowGoalForm(false);
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const removeGoal = async (goal: StudyGoalView) => {
    await fetch(`/api/study/goals?testId=${goal.testId}`, { method: "DELETE" });
    await refresh();
  };

  const updateTask = async (taskId: string, action: "done" | "reopen" | "skip" | "postpone") => {
    await fetch(`/api/study/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(action === "postpone" ? { action, days: 1 } : { action }),
    });
    await refresh();
  };

  const visibleTasks = useMemo(() => data?.tasks.filter((task) => task.status !== "SKIPPED") ?? [], [data]);
  const todayTasks = visibleTasks.filter((task) => task.scheduledFor.slice(0, 10) === data?.today);
  const dateKeys = data ? Array.from({ length: 7 }, (_, index) => {
    const date = new Date(`${data.today}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + index);
    return date.toISOString().slice(0, 10);
  }) : [];

  if (state === "loading") return <main className="mx-auto max-w-6xl px-4 py-12"><div className="h-64 animate-pulse bg-[var(--surface)]" /></main>;
  if (state === "unauthorized") return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <CalendarDays className="mx-auto size-8 text-[var(--indigo)]" aria-hidden="true" />
      <h1 className="mt-4 text-2xl font-bold">登录后使用备考中心</h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">目标、日历和完成记录会在设备间同步。</p>
      <Link href="/login" className="mt-5 inline-block rounded-md bg-[var(--indigo)] px-5 py-2.5 text-sm font-medium text-white">前往登录</Link>
    </main>
  );
  if (state === "error" || !data) return <main className="mx-auto max-w-4xl px-4 py-16 text-center text-[var(--danger)]">备考中心暂时无法加载，请稍后刷新。</main>;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="text-xs font-semibold text-[var(--indigo)]">STUDY EXECUTION</div>
          <h1 className="mt-1 text-3xl font-bold">备考中心</h1>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">今天完成什么、下一周怎么排、最近是否真的在进步。</p>
        </div>
        <button type="button" onClick={() => setShowGoalForm((value) => !value)} className="inline-flex items-center gap-2 rounded-md bg-[var(--indigo)] px-4 py-2.5 text-sm font-medium text-white">
          <Plus className="size-4" aria-hidden="true" /> 添加考试目标
        </button>
      </header>

      {(showGoalForm || data.goals.length === 0) && (
        <section className="grid gap-4 border-b border-[var(--border)] py-6 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-sm font-medium">考试
            <select value={testId} onChange={(event) => setTestId(event.target.value)} className="mt-1 block w-full rounded-md border border-[var(--border)] bg-white px-3 py-2 font-normal">
              {ADMISSIONS_TESTS.filter((test) => test.hasQuestionBank).map((test) => <option key={test.id} value={test.id}>{test.abbr}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium">考试日期
            <input type="date" min={futureDate(1)} value={targetDate} onChange={(event) => setTargetDate(event.target.value)} className="mt-1 block w-full rounded-md border border-[var(--border)] px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-medium">目标水平
            <input value={targetLevel} onChange={(event) => setTargetLevel(event.target.value)} placeholder="例如 7.0 / 80%" className="mt-1 block w-full rounded-md border border-[var(--border)] px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-medium">每周投入
            <select value={weeklyMinutes} onChange={(event) => setWeeklyMinutes(Number(event.target.value))} className="mt-1 block w-full rounded-md border border-[var(--border)] bg-white px-3 py-2 font-normal">
              {[90, 120, 180, 240, 360, 480].map((minutes) => <option key={minutes} value={minutes}>{minutes / 60} 小时</option>)}
            </select>
          </label>
          <button type="button" disabled={saving} onClick={saveGoal} className="self-end rounded-md bg-[var(--ink)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">{saving ? "保存中…" : "保存并生成计划"}</button>
        </section>
      )}

      {data.goals.length > 0 && (
        <section className="border-b border-[var(--border)] py-5">
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            {data.goals.map((goal) => (
              <div key={goal.id} className="flex items-center gap-3 text-sm">
                <span className="font-bold text-[var(--ink)]">{goal.test}</span>
                <span className="text-[var(--ink-soft)]">{goal.targetDate} · {goal.weeklyMinutes / 60} 小时/周{goal.targetLevel ? ` · 目标 ${goal.targetLevel}` : ""}</span>
                <button type="button" onClick={() => removeGoal(goal)} title={`删除 ${goal.test} 目标`} className="text-[var(--ink-faint)] hover:text-[var(--danger)]"><Trash2 className="size-4" aria-hidden="true" /></button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="py-7">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div><h2 className="text-xl font-bold">今天</h2><p className="mt-1 text-sm text-[var(--ink-soft)]">{todayTasks.filter((task) => task.status === "DONE").length}/{todayTasks.length} 项完成</p></div>
          <span className="text-sm text-[var(--ink-faint)]">预计 {todayTasks.filter((task) => task.status !== "DONE").reduce((sum, task) => sum + task.estimatedMinutes, 0)} 分钟</span>
        </div>
        {todayTasks.length === 0 ? <p className="border-y border-[var(--border)] py-8 text-center text-sm text-[var(--ink-faint)]">今天没有任务。添加考试目标后会自动生成计划。</p> : (
          <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {todayTasks.map((task) => <TaskRow key={task.id} task={task} onAction={updateTask} />)}
          </div>
        )}
      </section>

      <section id="weekly-report" className="scroll-mt-24 border-t border-[var(--border)] py-7">
        <h2 className="text-xl font-bold">未来七天</h2>
        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--border)] sm:grid-cols-4 lg:grid-cols-7">
          {dateKeys.length ? dateKeys.map((key) => {
            const tasks = visibleTasks.filter((task) => task.scheduledFor.startsWith(key));
            return <div key={key} className="min-h-32 bg-white p-3"><div className="text-xs font-bold text-[var(--ink-soft)]">{dayLabel(key, data.today)}</div><div className="mt-3 space-y-2">{tasks.map((task) => <div key={task.id} className={`text-xs leading-snug ${task.status === "DONE" ? "text-[var(--ink-faint)] line-through" : "text-[var(--ink)]"}`}><span className="font-bold text-[var(--indigo)]">{task.testId.toUpperCase()}</span> {task.title}</div>)}</div></div>;
          }) : <div className="col-span-full bg-white p-8 text-center text-sm text-[var(--ink-faint)]">暂无计划</div>}
        </div>
      </section>

      <section className="border-t border-[var(--border)] py-7">
        <h2 className="text-xl font-bold">本周报告</h2>
        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--border)] sm:grid-cols-5">
          {[
            ["任务完成率", `${data.report.completionRate}%`, CheckCircle2],
            ["连续学习", `${data.report.currentStreak} 天`, Flame],
            ["训练时间", `${data.report.sessionMinutes} 分钟`, Clock3],
            ["完成题目", `${data.report.questionsAnswered} 道`, Target],
            ["本周正确率", data.report.accuracy === null ? "暂无" : `${data.report.accuracy}%`, RotateCcw],
          ].map(([label, value, Icon]) => <div key={label as string} className="bg-white p-4"><Icon className="size-4 text-[var(--indigo)]" aria-hidden="true" /><div className="mt-3 text-xl font-bold">{value as string}</div><div className="mt-0.5 text-xs text-[var(--ink-faint)]">{label as string}</div></div>)}
        </div>
      </section>
    </main>
  );
}

function TaskRow({ task, onAction }: { task: StudyTaskView; onAction: (id: string, action: "done" | "reopen" | "skip" | "postpone") => Promise<void> }) {
  const done = task.status === "DONE";
  return (
    <div className="flex items-center gap-3 py-4">
      <button type="button" onClick={() => onAction(task.id, done ? "reopen" : "done")} title={done ? "标记为未完成" : "标记为完成"} className={`flex size-7 shrink-0 items-center justify-center rounded-md border ${done ? "border-[var(--success)] bg-[var(--success-bg)] text-[var(--success)]" : "border-[var(--border)] text-transparent hover:text-[var(--ink-faint)]"}`}><Check className="size-4" aria-hidden="true" /></button>
      <div className="min-w-0 flex-1"><div className={`text-sm font-semibold ${done ? "text-[var(--ink-faint)] line-through" : "text-[var(--ink)]"}`}>{task.testId.toUpperCase()} · {task.title}</div><p className="mt-0.5 text-xs text-[var(--ink-soft)]">{task.detail}</p></div>
      <span className="hidden text-xs text-[var(--ink-faint)] sm:block">{task.estimatedMinutes} 分钟</span>
      {!done && <><button type="button" onClick={() => onAction(task.id, "postpone")} className="text-xs text-[var(--ink-soft)] hover:text-[var(--indigo)]">明天</button><Link href={task.href} className="rounded-md bg-[var(--indigo)] px-3 py-2 text-xs font-medium text-white">开始</Link></>}
    </div>
  );
}
