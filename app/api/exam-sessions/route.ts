import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// 严格校验写入体，避免脏数据导致 500 或写入垃圾。
const answerSchema = z.object({
  questionId: z.string().min(1).max(100),
  type: z.enum(["mcq", "long"]),
  selected: z.string().max(20).optional(),
  work: z.record(z.string()).optional(),
  earned: z.number().int().min(0).max(1000),
  max: z.number().int().min(0).max(1000),
  feedback: z.unknown().optional(),
});

const saveSessionSchema = z.object({
  testId: z.string().min(1).max(40),
  mode: z.enum(["practice", "mock", "paper"]),
  totalEarned: z.number().int().min(0).max(100000),
  totalMax: z.number().int().min(0).max(100000),
  timeUsedSec: z.number().int().min(0).max(86400).optional(),
  answers: z.array(answerSchema).max(300),
});

export type SaveSessionRequest = z.infer<typeof saveSessionSchema>;

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = saveSessionSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.issues.slice(0, 5) },
      { status: 400 }
    );
  }
  const body = parsed.data;

  // 自动建档：确保有一条 StudentProfile，使笔试成绩能入库。
  const profile = await db.studentProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
    select: { id: true },
  });

  const examSession = await db.examSession.create({
    data: {
      studentId: profile.id,
      testId: body.testId,
      mode: body.mode,
      totalEarned: body.totalEarned,
      totalMax: body.totalMax,
      timeUsedSec: body.timeUsedSec,
      answers: {
        create: body.answers.map((a) => ({
          questionId: a.questionId,
          type: a.type,
          selected: a.selected,
          work: a.work ?? undefined,
          earned: a.earned,
          max: a.max,
          feedback: a.feedback ? (a.feedback as object) : undefined,
        })),
      },
    },
    select: { id: true },
  });

  return NextResponse.json({ id: examSession.id }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const testId = req.nextUrl.searchParams.get("testId") ?? undefined;

  const profile = await db.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) return NextResponse.json([]);

  const sessions = await db.examSession.findMany({
    where: {
      studentId: profile.id,
      ...(testId ? { testId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      testId: true,
      mode: true,
      totalEarned: true,
      totalMax: true,
      timeUsedSec: true,
      createdAt: true,
      _count: { select: { answers: true } },
    },
  });

  return NextResponse.json(sessions);
}
