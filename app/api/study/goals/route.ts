import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getTestById } from "@/lib/tests";
import { shanghaiDateKey, utcDateFromKey } from "@/lib/study/dates";

const goalSchema = z.object({
  testId: z.string().min(2).max(20),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  targetLevel: z.string().trim().max(30).optional(),
  weeklyMinutes: z.number().int().min(30).max(1200),
});

async function userId() {
  const session = await auth();
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

export async function GET() {
  const id = await userId();
  if (!id) return NextResponse.json({ authenticated: false });
  const profile = await db.studentProfile.findUnique({ where: { userId: id }, select: { id: true } });
  if (!profile) return NextResponse.json({ authenticated: true, goals: [] });
  const goals = await db.studyGoal.findMany({ where: { studentId: profile.id }, orderBy: { targetDate: "asc" } });
  return NextResponse.json({
    authenticated: true,
    goals: goals.map((goal) => ({ ...goal, targetDate: goal.targetDate.toISOString().slice(0, 10) })),
  });
}

export async function POST(req: NextRequest) {
  const id = await userId();
  if (!id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = goalSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success || !getTestById(parsed.data?.testId ?? "")?.hasQuestionBank) {
    return NextResponse.json({ error: "Invalid goal" }, { status: 400 });
  }
  const input = parsed.data;
  const parsedTargetDate = utcDateFromKey(input.targetDate);
  if (parsedTargetDate < utcDateFromKey(shanghaiDateKey())) {
    return NextResponse.json({ error: "Target date must be in the future" }, { status: 400 });
  }
  const profile = await db.studentProfile.upsert({ where: { userId: id }, create: { userId: id }, update: {}, select: { id: true } });
  const goal = await db.studyGoal.upsert({
    where: { studentId_testId: { studentId: profile.id, testId: input.testId } },
    create: { studentId: profile.id, testId: input.testId, targetDate: parsedTargetDate, targetLevel: input.targetLevel || null, weeklyMinutes: input.weeklyMinutes },
    update: { targetDate: parsedTargetDate, targetLevel: input.targetLevel || null, weeklyMinutes: input.weeklyMinutes, active: true },
  });
  await db.studyTask.deleteMany({ where: { goalId: goal.id, status: "PLANNED" } });
  return NextResponse.json({ id: goal.id }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const id = await userId();
  if (!id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const testId = req.nextUrl.searchParams.get("testId") ?? "";
  const profile = await db.studentProfile.findUnique({ where: { userId: id }, select: { id: true } });
  if (profile) {
    const goals = await db.studyGoal.findMany({ where: { studentId: profile.id, testId }, select: { id: true } });
    await db.$transaction([
      db.studyTask.deleteMany({ where: { goalId: { in: goals.map((goal) => goal.id) } } }),
      db.studyGoal.deleteMany({ where: { studentId: profile.id, testId } }),
    ]);
  }
  return NextResponse.json({ ok: true });
}
