import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { activeDayEventKey, ensureStudentContext, recordLearningEvent } from "@/lib/beta/events";

const kindSchema = z.enum(["INTERVIEW_DRILL", "INTERVIEW_PAPER", "CAMBRIDGE_ASSESSMENT", "IELTS_SPEAKING"]);
const recordSchema = z.object({
  kind: kindSchema,
  resourceId: z.string().min(1).max(180),
  subject: z.string().max(160).optional(),
  score: z.number().finite().optional(),
  maxScore: z.number().finite().positive().optional(),
  weakestSkillId: z.string().max(80).optional(),
  attemptKey: z.string().min(8).max(240),
  completedAt: z.string().datetime().optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

async function currentStudent() {
  const session = await auth();
  return session?.user.id ? ensureStudentContext(session.user.id) : null;
}

export async function GET(request: NextRequest) {
  const student = await currentStudent();
  if (!student) return NextResponse.json({ authenticated: false, records: [] }, { status: 401 });
  const parsed = z.object({ kind: kindSchema, subject: z.string().max(160).optional() }).safeParse({
    kind: request.nextUrl.searchParams.get("kind"),
    subject: request.nextUrl.searchParams.get("subject") ?? undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  const records = await db.learningRecord.findMany({
    where: { studentId: student.id, kind: parsed.data.kind, subject: parsed.data.subject },
    orderBy: { completedAt: "desc" },
    take: 20,
    select: {
      id: true,
      resourceId: true,
      subject: true,
      score: true,
      maxScore: true,
      weakestSkillId: true,
      payload: true,
      attemptKey: true,
      completedAt: true,
    },
  });
  return NextResponse.json({ authenticated: true, records });
}

export async function POST(request: NextRequest) {
  const student = await currentStudent();
  if (!student) return NextResponse.json({ authenticated: false }, { status: 401 });
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 256 * 1024) return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  const parsed = recordSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid learning record" }, { status: 400 });
  const completedAt = parsed.data.completedAt ? new Date(parsed.data.completedAt) : new Date();
  const record = await db.learningRecord.upsert({
    where: { attemptKey: parsed.data.attemptKey },
    update: {},
    create: {
      studentId: student.id,
      kind: parsed.data.kind,
      resourceId: parsed.data.resourceId,
      subject: parsed.data.subject,
      score: parsed.data.score,
      maxScore: parsed.data.maxScore,
      weakestSkillId: parsed.data.weakestSkillId,
      attemptKey: parsed.data.attemptKey,
      payload: parsed.data.payload as Prisma.InputJsonValue | undefined,
      completedAt,
    },
    select: { id: true },
  });
  await Promise.all([
    recordLearningEvent({
      studentId: student.id,
      type: "INTERVIEW_COMPLETED",
      eventKey: `interview-completed:${student.id}:${parsed.data.attemptKey}`,
      resourceId: parsed.data.resourceId,
      score: parsed.data.score,
      maxScore: parsed.data.maxScore,
      occurredAt: completedAt,
      metadata: { kind: parsed.data.kind, subject: parsed.data.subject ?? null },
    }),
    recordLearningEvent({
      studentId: student.id,
      type: "ACTIVE_DAY",
      eventKey: activeDayEventKey(student.id, completedAt),
      occurredAt: completedAt,
    }),
  ]);
  return NextResponse.json({ id: record.id }, { status: 201 });
}
