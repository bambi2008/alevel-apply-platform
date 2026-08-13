import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { addUtcDays, shanghaiDateKey, utcDateFromKey } from "@/lib/study/dates";

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("done") }),
  z.object({ action: z.literal("reopen") }),
  z.object({ action: z.literal("skip") }),
  z.object({ action: z.literal("postpone"), days: z.number().int().min(1).max(14).default(1) }),
]);

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = actionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  const { id } = await params;
  const task = await db.studyTask.findFirst({ where: { id, student: { userId } } });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const now = new Date();
  if (parsed.data.action === "done") await db.studyTask.update({ where: { id }, data: { status: "DONE", completedAt: now } });
  if (parsed.data.action === "reopen") await db.studyTask.update({ where: { id }, data: { status: "PLANNED", completedAt: null } });
  if (parsed.data.action === "skip") await db.studyTask.update({ where: { id }, data: { status: "SKIPPED", completedAt: null } });
  if (parsed.data.action === "postpone") {
    const nextDate = addUtcDays(utcDateFromKey(shanghaiDateKey()), parsed.data.days);
    await db.$transaction([
      db.studyTask.update({ where: { id }, data: { status: "SKIPPED" } }),
      db.studyTask.create({ data: {
        studentId: task.studentId,
        goalId: task.goalId,
        testId: task.testId,
        sourceKey: `${task.sourceKey}:postponed:${Date.now()}`,
        kind: task.kind,
        title: task.title,
        detail: task.detail,
        href: task.href,
        topicId: task.topicId,
        scheduledFor: nextDate,
        estimatedMinutes: task.estimatedMinutes,
      } }),
    ]);
  }
  return NextResponse.json({ ok: true });
}
