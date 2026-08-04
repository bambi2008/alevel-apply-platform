import "server-only";

import { db } from "@/lib/db";
import { questionDraftSchema } from "@/lib/tests/authoring";
import type { Question } from "@/lib/tests/questions/types";

function publishedQuestion(record: {
  payload: unknown;
  subjectReviewerId: string | null;
  teachingReviewerId: string | null;
}): Question | null {
  if (
    !record.subjectReviewerId
    || !record.teachingReviewerId
    || record.subjectReviewerId === record.teachingReviewerId
  ) return null;
  const parsed = questionDraftSchema.safeParse(record.payload);
  return parsed.success ? parsed.data.question as Question : null;
}

export async function getPublishedQuestionsForTest(testId: string): Promise<Question[]> {
  const records = await db.questionDraftRecord.findMany({
    where: { testId, stage: "APPROVED", rightsStatus: { in: ["OWNED", "LICENSED"] } },
    orderBy: { updatedAt: "desc" },
    select: { payload: true, subjectReviewerId: true, teachingReviewerId: true },
  });
  const latest = new Map<string, Question>();
  for (const record of records) {
    const question = publishedQuestion(record);
    if (question && !latest.has(question.id)) latest.set(question.id, question);
  }
  return [...latest.values()];
}

export async function getPublishedQuestionsByIds(questionIds: string[]): Promise<Question[]> {
  if (!questionIds.length) return [];
  const records = await db.questionDraftRecord.findMany({
    where: {
      questionId: { in: [...new Set(questionIds)] },
      stage: "APPROVED",
      rightsStatus: { in: ["OWNED", "LICENSED"] },
    },
    orderBy: { updatedAt: "desc" },
    select: { payload: true, subjectReviewerId: true, teachingReviewerId: true },
  });
  const latest = new Map<string, Question>();
  for (const record of records) {
    const question = publishedQuestion(record);
    if (question && !latest.has(question.id)) latest.set(question.id, question);
  }
  return [...latest.values()];
}
