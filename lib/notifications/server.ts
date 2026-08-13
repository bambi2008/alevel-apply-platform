import { db } from "@/lib/db";
import { buildTimeline } from "@/lib/timeline";
import { addUtcDays, shanghaiDateKey, utcDateFromKey } from "@/lib/study/dates";
import { buildNotificationCandidates, categoryIsEnabled } from "./rules";
import type { Region } from "@/lib/data/types";

const MILESTONE_TITLES: Record<string, string> = {
  research: "开始院校与专业调研",
  "ucas-reg": "完成 UCAS 注册",
  oxbridge: "牛剑及医学申请截止",
  "ps-draft": "完成个人陈述初稿",
  "hk-open": "香港高校申请开放",
  "ucas-main": "UCAS 常规申请截止",
  "hk-deadline": "香港高校主要申请截止",
  "ucas-decisions": "UCAS 录取结果阶段",
  "ucas-reply": "UCAS 回复 Offer 截止",
  exams: "A-Level 考试阶段",
  results: "放榜与补录阶段",
};

export async function syncNotificationsForUser(userId: string) {
  const todayKey = shanghaiDateKey();
  const today = utcDateFromKey(todayKey);
  const weekAgo = addUtcDays(today, -6);
  const profile = await db.studentProfile.findUnique({
    where: { userId },
    include: {
      studyTasks: {
        where: { status: "PLANNED", scheduledFor: { lt: addUtcDays(today, 1) } },
        select: { scheduledFor: true, status: true },
      },
      tasks: {
        where: { status: { not: "DONE" }, dueDate: { not: null, lt: addUtcDays(today, 8) } },
        select: { id: true, title: true, dueDate: true },
      },
    },
  });
  const preferences = await db.notificationPreference.upsert({
    where: { userId }, create: { userId }, update: {},
  });
  if (!profile) return;

  const [recentSessions, recentStudyTasks] = await Promise.all([
    db.examSession.count({ where: { studentId: profile.id, completedAt: { gte: weekAgo } } }),
    db.studyTask.count({ where: { studentId: profile.id, status: "DONE", completedAt: { gte: weekAgo } } }),
  ]);
  const targetRegions: Region[] = profile.targetRegions.length ? profile.targetRegions : ["UK", "HK"];
  const timeline = profile.intakeYear
    ? buildTimeline(profile.intakeYear, targetRegions, today).milestones.map((item) => ({
        id: item.id, date: item.date, title: MILESTONE_TITLES[item.id] ?? item.id,
      }))
    : [];
  const candidates = buildNotificationCandidates({
    todayKey,
    studyTasks: profile.studyTasks,
    applicationTasks: profile.tasks.flatMap((task) => task.dueDate ? [{ ...task, dueDate: task.dueDate }] : []),
    timeline,
    weeklyActivityCount: recentSessions + recentStudyTasks,
  }).filter((item) => categoryIsEnabled(item.category, preferences));

  await db.$transaction(candidates.map((item) => db.notification.upsert({
    where: { userId_sourceKey: { userId, sourceKey: item.sourceKey } },
    create: { userId, ...item },
    update: {
      title: item.title, body: item.body, href: item.href, priority: item.priority,
      scheduledFor: item.scheduledFor, expiresAt: item.expiresAt,
    },
  })));
}
