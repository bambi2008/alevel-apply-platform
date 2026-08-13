import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// 单次练习/模拟记录的完整明细（供回看页使用）。仅本人可读。
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const exam = await db.examSession.findFirst({
    // findFirst + studentId 双条件 = 既按 id 取，又确保归属本人，避免越权读他人记录
    where: { id, studentId: profile.id },
    select: {
      id: true,
      testId: true,
      mode: true,
      totalEarned: true,
      totalMax: true,
      timeUsedSec: true,
      paperId: true,
      presetId: true,
      startedAt: true,
      completedAt: true,
      createdAt: true,
      answers: {
        select: {
          questionId: true,
          type: true,
          selected: true,
          work: true,
          earned: true,
          max: true,
          feedback: true,
          timeSpentSec: true,
          answerChanges: true,
          visits: true,
          flagged: true,
          firstSelected: true,
        },
      },
    },
  });

  if (!exam) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(exam);
}
