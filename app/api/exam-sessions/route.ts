import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export interface SaveSessionRequest {
  testId: string;
  mode: "practice" | "mock";
  totalEarned: number;
  totalMax: number;
  timeUsedSec?: number;
  answers: {
    questionId: string;
    type: "mcq" | "long";
    selected?: string;
    work?: Record<string, string>;
    earned: number;
    max: number;
    feedback?: unknown;
  }[];
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SaveSessionRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const profile = await db.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    return NextResponse.json({ error: "No student profile" }, { status: 404 });
  }

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
