import type { LearningEventType, Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export async function ensureStudentContext(userId: string) {
  const profile = await db.studentProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
    select: { id: true },
  });
  await db.betaParticipant.upsert({
    where: { studentId: profile.id },
    update: {},
    create: { studentId: profile.id },
  });
  return profile;
}

export async function recordLearningEvent(input: {
  studentId: string;
  type: LearningEventType;
  eventKey: string;
  testId?: string;
  resourceId?: string;
  sessionId?: string;
  score?: number;
  maxScore?: number;
  metadata?: Prisma.InputJsonValue;
  occurredAt?: Date;
}) {
  const occurredAt = input.occurredAt ?? new Date();
  await db.betaParticipant.createMany({
    data: [{ studentId: input.studentId, lastActiveAt: occurredAt }],
    skipDuplicates: true,
  });
  await db.$transaction([
    db.learningEvent.createMany({
      data: [{
        studentId: input.studentId,
        type: input.type,
        eventKey: input.eventKey,
        testId: input.testId,
        resourceId: input.resourceId,
        sessionId: input.sessionId,
        score: input.score,
        maxScore: input.maxScore,
        metadata: input.metadata,
        occurredAt,
      }],
      skipDuplicates: true,
    }),
    db.betaParticipant.updateMany({
      where: { studentId: input.studentId, lastActiveAt: { lt: occurredAt } },
      data: { lastActiveAt: occurredAt },
    }),
  ]);
}

export function activeDayEventKey(studentId: string, now = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return `active-day:${studentId}:${formatter.format(now)}`;
}
