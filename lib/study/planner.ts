import type { AdaptiveProfile, AdaptiveTask } from "@/lib/tests/adaptive";

const DAY_MS = 24 * 60 * 60 * 1000;

export interface StudyGoalInput {
  id: string;
  testId: string;
  targetDate: Date;
  weeklyMinutes: number;
}

export interface PlannedStudyTask {
  goalId: string;
  testId: string;
  sourceKey: string;
  kind: "DIAGNOSTIC" | "REVIEW" | "FOCUS" | "MOCK";
  title: string;
  detail: string;
  href: string;
  topicId?: string;
  scheduledFor: Date;
  estimatedMinutes: number;
}

export interface WeeklyReportInput {
  plannedTasks: number;
  completedTasks: number;
  sessionMinutes: number;
  questionsAnswered: number;
  earned: number;
  max: number;
  activeDates: string[];
  currentStreak: number;
}

export interface WeeklyReport extends WeeklyReportInput {
  completionRate: number;
  accuracy: number | null;
}

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function taskMinutes(task: AdaptiveTask) {
  if (task.kind === "mock") return 120;
  if (task.kind === "diagnostic") return 30;
  if (task.kind === "review") return Math.max(15, (task.questionCount ?? 8) * 2);
  return Math.max(20, (task.questionCount ?? 10) * 2);
}

function fallbackTask(testId: string): AdaptiveTask {
  return {
    id: "adaptive",
    kind: "focus",
    title: "完成一组智能训练",
    detail: "系统将按当前掌握度安排薄弱知识点和匹配难度的新题。",
    href: `/tests/${testId}/practice?adaptive=1&count=10`,
    questionCount: 10,
  };
}

export function generateStudyWeek(args: {
  goals: StudyGoalInput[];
  profiles: Record<string, AdaptiveProfile>;
  now?: Date;
  days?: number;
}): PlannedStudyTask[] {
  const now = startOfUtcDay(args.now ?? new Date());
  const days = Math.max(1, Math.min(14, args.days ?? 7));
  const tasks: PlannedStudyTask[] = [];

  for (const goal of args.goals) {
    const profileTasks = args.profiles[goal.testId]?.tasks.length
      ? args.profiles[goal.testId].tasks
      : [fallbackTask(goal.testId)];
    const weeklyBudget = Math.max(30, Math.min(1200, goal.weeklyMinutes));
    let usedMinutes = 0;
    let cursor = 0;

    for (let dayIndex = 0; dayIndex < days && usedMinutes < weeklyBudget; dayIndex++) {
      const scheduledFor = new Date(now.getTime() + dayIndex * DAY_MS);
      if (scheduledFor > startOfUtcDay(goal.targetDate)) break;
      const task = profileTasks[cursor % profileTasks.length] ?? fallbackTask(goal.testId);
      const estimatedMinutes = taskMinutes(task);
      if (usedMinutes > 0 && usedMinutes + estimatedMinutes > weeklyBudget) break;
      const kind = task.kind.toUpperCase() as PlannedStudyTask["kind"];
      tasks.push({
        goalId: goal.id,
        testId: goal.testId,
        sourceKey: `${goal.testId}:${task.kind}:${task.topicId ?? task.id}`,
        kind,
        title: task.title,
        detail: task.detail,
        href: task.href,
        topicId: task.topicId,
        scheduledFor,
        estimatedMinutes,
      });
      usedMinutes += estimatedMinutes;
      cursor++;
    }
  }

  return tasks.sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime() || a.testId.localeCompare(b.testId));
}

export function calculateStreak(activeDates: string[], now = new Date()) {
  const dates = new Set(activeDates);
  let cursor = startOfUtcDay(now);
  if (!dates.has(cursor.toISOString().slice(0, 10))) cursor = new Date(cursor.getTime() - DAY_MS);
  let streak = 0;
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor = new Date(cursor.getTime() - DAY_MS);
  }
  return streak;
}

export function buildWeeklyReport(input: WeeklyReportInput): WeeklyReport {
  return {
    ...input,
    completionRate: input.plannedTasks > 0 ? Math.round((input.completedTasks / input.plannedTasks) * 100) : 0,
    accuracy: input.max > 0 ? Math.round((input.earned / input.max) * 100) : null,
  };
}
