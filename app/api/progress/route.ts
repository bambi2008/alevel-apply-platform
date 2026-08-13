import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { activeDayEventKey, ensureStudentContext, recordLearningEvent } from "@/lib/beta/events";

const kindSchema = z.enum([
  "OBJECTIVE_EXAM",
  "WRITTEN_EXAM",
  "INTERVIEW_DRILL",
  "INTERVIEW_PAPER",
  "CAMBRIDGE_ASSESSMENT",
  "IELTS_SPEAKING",
]);

const saveSchema = z.object({
  kind: kindSchema,
  resourceId: z.string().min(1).max(180),
  payload: z.record(z.string(), z.unknown()),
  startedAt: z.string().datetime().optional(),
  testId: z.string().max(40).optional(),
  mode: z.enum(["diagnostic", "practice", "mock", "paper", "interview"]).optional(),
});

async function currentStudent() {
  const session = await auth();
  const userId = session?.user.id;
  return userId ? ensureStudentContext(userId) : null;
}

function startedEventType(kind: z.infer<typeof kindSchema>, mode?: string) {
  if (kind.startsWith("INTERVIEW") || kind === "CAMBRIDGE_ASSESSMENT" || kind === "IELTS_SPEAKING") {
    return "INTERVIEW_STARTED" as const;
  }
  if (mode === "diagnostic") return "DIAGNOSTIC_STARTED" as const;
  if (mode === "practice") return "PRACTICE_STARTED" as const;
  return "MOCK_STARTED" as const;
}

export async function GET(request: NextRequest) {
  const student = await currentStudent();
  if (!student) return NextResponse.json({ authenticated: false }, { status: 401 });
  const parsed = z.object({
    kind: kindSchema,
    resourceId: z.string().min(1).max(180),
  }).safeParse({
    kind: request.nextUrl.searchParams.get("kind"),
    resourceId: request.nextUrl.searchParams.get("resourceId"),
  });
  if (!parsed.success) return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  const progress = await db.progressSnapshot.findUnique({
    where: { studentId_kind_resourceId: { studentId: student.id, ...parsed.data } },
    select: { payload: true, startedAt: true, updatedAt: true, expiresAt: true },
  });
  if (!progress || progress.expiresAt <= new Date()) return NextResponse.json({ progress: null });
  return NextResponse.json({ progress });
}

export async function PUT(request: NextRequest) {
  const student = await currentStudent();
  if (!student) return NextResponse.json({ authenticated: false }, { status: 401 });
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 512 * 1024) return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  const parsed = saveSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid progress" }, { status: 400 });
  const startedAt = parsed.data.startedAt ? new Date(parsed.data.startedAt) : new Date();
  await db.progressSnapshot.upsert({
    where: {
      studentId_kind_resourceId: {
        studentId: student.id,
        kind: parsed.data.kind,
        resourceId: parsed.data.resourceId,
      },
    },
    update: {
      payload: parsed.data.payload as Prisma.InputJsonValue,
      startedAt,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60_000),
    },
    create: {
      studentId: student.id,
      kind: parsed.data.kind,
      resourceId: parsed.data.resourceId,
      payload: parsed.data.payload as Prisma.InputJsonValue,
      startedAt,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60_000),
    },
  });
  await Promise.all([
    recordLearningEvent({
      studentId: student.id,
      type: startedEventType(parsed.data.kind, parsed.data.mode),
      eventKey: `started:${student.id}:${parsed.data.kind}:${parsed.data.resourceId}:${startedAt.toISOString()}`,
      testId: parsed.data.testId,
      resourceId: parsed.data.resourceId,
      occurredAt: startedAt,
      metadata: parsed.data.mode ? { mode: parsed.data.mode } : undefined,
    }),
    recordLearningEvent({
      studentId: student.id,
      type: "ACTIVE_DAY",
      eventKey: activeDayEventKey(student.id),
    }),
  ]);
  return NextResponse.json({ saved: true });
}

export async function DELETE(request: NextRequest) {
  const student = await currentStudent();
  if (!student) return NextResponse.json({ authenticated: false }, { status: 401 });
  const parsed = z.object({
    kind: kindSchema,
    resourceId: z.string().min(1).max(180),
  }).safeParse({
    kind: request.nextUrl.searchParams.get("kind"),
    resourceId: request.nextUrl.searchParams.get("resourceId"),
  });
  if (!parsed.success) return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  await db.progressSnapshot.deleteMany({
    where: { studentId: student.id, ...parsed.data },
  });
  return NextResponse.json({ deleted: true });
}
