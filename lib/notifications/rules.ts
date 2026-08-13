import { addUtcDays, utcDateFromKey } from "@/lib/study/dates";

export type NotificationCategoryValue = "STUDY" | "APPLICATION" | "DEADLINE" | "REPORT" | "SYSTEM";
export type NotificationPriorityValue = "INFO" | "IMPORTANT" | "URGENT";

export interface NotificationCandidate {
  sourceKey: string;
  category: NotificationCategoryValue;
  priority: NotificationPriorityValue;
  title: string;
  body: string;
  href: string;
  scheduledFor: Date;
  expiresAt?: Date;
}

interface DueTask { id: string; title: string; dueDate: Date }
interface StudyTaskInput { scheduledFor: Date; status: string }
interface TimelineInput { id: string; date: Date; title: string }

export interface NotificationRuleInput {
  todayKey: string;
  studyTasks: StudyTaskInput[];
  applicationTasks: DueTask[];
  timeline: TimelineInput[];
  weeklyActivityCount: number;
}

function dateKey(date: Date) { return date.toISOString().slice(0, 10); }

export function startOfWeekKey(todayKey: string) {
  const date = utcDateFromKey(todayKey);
  const day = date.getUTCDay() || 7;
  return dateKey(addUtcDays(date, 1 - day));
}

export function buildNotificationCandidates(input: NotificationRuleInput): NotificationCandidate[] {
  const today = utcDateFromKey(input.todayKey);
  const tomorrow = addUtcDays(today, 1);
  const candidates: NotificationCandidate[] = [];
  const planned = input.studyTasks.filter((task) => task.status === "PLANNED");
  const dueToday = planned.filter((task) => dateKey(task.scheduledFor) === input.todayKey);
  const overdue = planned.filter((task) => task.scheduledFor < today);

  if (dueToday.length) candidates.push({
    sourceKey: `study-today:${input.todayKey}`, category: "STUDY", priority: "IMPORTANT",
    title: `今天有 ${dueToday.length} 项备考任务`, body: "按计划完成今天的训练，学习路径会根据作答结果自动更新。",
    href: "/study", scheduledFor: today, expiresAt: tomorrow,
  });
  if (overdue.length) candidates.push({
    sourceKey: `study-overdue:${input.todayKey}`, category: "STUDY", priority: "URGENT",
    title: `${overdue.length} 项备考任务已逾期`, body: "可以立即完成，或在备考中心顺延到新的日期。",
    href: "/study", scheduledFor: today, expiresAt: tomorrow,
  });

  for (const task of input.applicationTasks) {
    const days = Math.ceil((task.dueDate.getTime() - today.getTime()) / 86_400_000);
    if (days < -30 || days > 7) continue;
    const dueLabel = days < 0 ? `已逾期 ${Math.abs(days)} 天` : days === 0 ? "今天截止" : `${days} 天后截止`;
    candidates.push({
      sourceKey: `application-task:${task.id}:${dateKey(task.dueDate)}`, category: "APPLICATION",
      priority: days <= 2 ? "URGENT" : "IMPORTANT", title: task.title, body: dueLabel,
      href: "/tasks", scheduledFor: today, expiresAt: days < 0 ? tomorrow : addUtcDays(task.dueDate, 2),
    });
  }

  for (const milestone of input.timeline) {
    const days = Math.ceil((milestone.date.getTime() - today.getTime()) / 86_400_000);
    if (days < 0 || days > 30) continue;
    candidates.push({
      sourceKey: `timeline:${milestone.id}:${dateKey(milestone.date)}`, category: "DEADLINE",
      priority: days <= 7 ? "URGENT" : "IMPORTANT", title: milestone.title,
      body: days === 0 ? "关键节点就在今天" : `距离关键节点还有 ${days} 天`,
      href: "/timeline", scheduledFor: today, expiresAt: addUtcDays(milestone.date, 1),
    });
  }

  if (input.weeklyActivityCount > 0) {
    const weekKey = startOfWeekKey(input.todayKey);
    candidates.push({
      sourceKey: `weekly-report:${weekKey}`, category: "REPORT", priority: "INFO", title: "本周学习报告已更新",
      body: `最近 7 天记录了 ${input.weeklyActivityCount} 次学习活动，查看完成率与训练表现。`,
      href: "/study#weekly-report", scheduledFor: today, expiresAt: addUtcDays(utcDateFromKey(weekKey), 14),
    });
  }
  return candidates;
}

export function categoryIsEnabled(category: NotificationCategoryValue, preferences: {
  studyEnabled: boolean; applicationEnabled: boolean; deadlineEnabled: boolean; weeklyReportEnabled: boolean;
}) {
  if (category === "STUDY") return preferences.studyEnabled;
  if (category === "APPLICATION") return preferences.applicationEnabled;
  if (category === "DEADLINE") return preferences.deadlineEnabled;
  if (category === "REPORT") return preferences.weeklyReportEnabled;
  return true;
}
