import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getTestById } from "@/lib/tests";
import { loadStudentAdaptiveData } from "@/lib/study/adaptive-server";
import { addUtcDays, shanghaiDateKey, utcDateFromKey } from "@/lib/study/dates";
import { buildWeeklyReport, calculateStreak, generateStudyWeek } from "@/lib/study/planner";

async function currentStudent() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return null;
  return db.studentProfile.upsert({ where: { userId }, create: { userId }, update: {}, select: { id: true } });
}

export async function GET() {
  const student = await currentStudent();
  if (!student) return NextResponse.json({ authenticated: false });
  return NextResponse.json(await buildAgenda(student.id));
}

export async function POST() {
  const student = await currentStudent();
  if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const goals = await db.studyGoal.findMany({ where: { studentId: student.id, active: true }, orderBy: { targetDate: "asc" } });
  const profiles = Object.fromEntries((await Promise.all(goals.map(async (goal) => {
    const data = await loadStudentAdaptiveData(student.id, goal.testId);
    return data ? [goal.testId, data.profile] as const : null;
  }))).filter((entry): entry is readonly [string, NonNullable<typeof entry>[1]] => !!entry));
  const generated = generateStudyWeek({ goals, profiles, now: utcDateFromKey(shanghaiDateKey()) });
  for (const task of generated) {
    await db.studyTask.upsert({
      where: { studentId_sourceKey_scheduledFor: { studentId: student.id, sourceKey: task.sourceKey, scheduledFor: task.scheduledFor } },
      create: { studentId: student.id, ...task },
      update: { title: task.title, detail: task.detail, href: task.href, estimatedMinutes: task.estimatedMinutes, topicId: task.topicId },
    });
  }
  return NextResponse.json(await buildAgenda(student.id));
}

async function buildAgenda(studentId: string) {
  const today = utcDateFromKey(shanghaiDateKey());
  const weekEnd = addUtcDays(today, 7);
  const reportStart = addUtcDays(today, -6);
  const activityStart = addUtcDays(today, -35);
  const [goals, tasks, reportTasks, sessions, streakTasks, streakSessions] = await Promise.all([
    db.studyGoal.findMany({ where: { studentId, active: true }, orderBy: { targetDate: "asc" } }),
    db.studyTask.findMany({ where: { studentId, scheduledFor: { gte: today, lt: weekEnd } }, orderBy: [{ scheduledFor: "asc" }, { createdAt: "asc" }] }),
    db.studyTask.findMany({ where: { studentId, scheduledFor: { gte: reportStart, lt: addUtcDays(today, 1) } } }),
    db.examSession.findMany({ where: { studentId, completedAt: { gte: reportStart, lt: addUtcDays(today, 1) } }, select: { completedAt: true, timeUsedSec: true, totalEarned: true, totalMax: true, _count: { select: { answers: true } } } }),
    db.studyTask.findMany({ where: { studentId, status: "DONE", completedAt: { gte: activityStart } }, select: { completedAt: true } }),
    db.examSession.findMany({ where: { studentId, completedAt: { gte: activityStart } }, select: { completedAt: true } }),
  ]);
  const activeDates = [...streakTasks.map((item) => item.completedAt), ...streakSessions.map((item) => item.completedAt)]
    .filter((date): date is Date => !!date)
    .map(shanghaiDateKey);
  const reportDates = new Set([
    ...reportTasks.filter((task) => task.completedAt).map((task) => shanghaiDateKey(task.completedAt!)),
    ...sessions.map((session) => shanghaiDateKey(session.completedAt)),
  ]);
  const report = buildWeeklyReport({
    plannedTasks: reportTasks.filter((task) => task.status !== "SKIPPED").length,
    completedTasks: reportTasks.filter((task) => task.status === "DONE").length,
    sessionMinutes: Math.round(sessions.reduce((sum, session) => sum + (session.timeUsedSec ?? 0), 0) / 60),
    questionsAnswered: sessions.reduce((sum, session) => sum + session._count.answers, 0),
    earned: sessions.reduce((sum, session) => sum + session.totalEarned, 0),
    max: sessions.reduce((sum, session) => sum + session.totalMax, 0),
    activeDates: [...reportDates],
    currentStreak: calculateStreak(activeDates, today),
  });
  return {
    authenticated: true,
    today: shanghaiDateKey(),
    goals: goals.map((goal) => ({ ...goal, test: getTestById(goal.testId)?.abbr ?? goal.testId.toUpperCase(), targetDate: goal.targetDate.toISOString().slice(0, 10) })),
    tasks,
    report,
  };
}
