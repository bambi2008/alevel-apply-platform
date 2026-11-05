import { Prisma, type PrismaClient } from "@prisma/client";
import type { StorageAdapter } from "./storage";

export const STUDY_RETENTION_DAYS = 365;
export function studyRetentionCutoff(now = new Date()): Date { return new Date(now.getTime() - STUDY_RETENTION_DAYS * 86_400_000); }
export function isStudyDataExpired(createdAt: Date, now = new Date()): boolean { return createdAt.getTime() <= studyRetentionCutoff(now).getTime(); }
const RETENTION_LOCK = 2026102601;
export interface RetentionCounts { feedback: number; sessionFeedback: number; sessions: number; studyAttempts: number; answers: number; images: number; aiEvaluations: number; aiFeedbackCache: number; learningRecords: number; progressSnapshots: number; events: number; failedImages: number; skippedLocked: boolean }
const examEvents = ["DIAGNOSTIC_STARTED", "DIAGNOSTIC_COMPLETED", "PRACTICE_STARTED", "PRACTICE_COMPLETED", "MOCK_STARTED", "MOCK_COMPLETED", "REMEDIATION_STARTED", "REMEDIATION_COMPLETED", "INTERVIEW_STARTED", "INTERVIEW_COMPLETED"] as const;

/** Default is read-only. The only file deletions use the storage adapter's
 * validated opaque object keys. Accounts, consents and backups are untouched. */
export async function runStudyRetention({ client, storage, dryRun = true, now = new Date() }: { client: PrismaClient; storage: Pick<StorageAdapter, "delete">; dryRun?: boolean; now?: Date }): Promise<RetentionCounts> {
  const createdAt = { lte: studyRetentionCutoff(now) };
  const eventWhere = { createdAt, type: { in: [...examEvents] } };
  const sessionFeedbackWhere = { OR: [{ createdAt }, { session: { createdAt } }] };
  const empty: RetentionCounts = { feedback: 0, sessionFeedback: 0, sessions: 0, studyAttempts: 0, answers: 0, images: 0, aiEvaluations: 0, aiFeedbackCache: 0, learningRecords: 0, progressSnapshots: 0, events: 0, failedImages: 0, skippedLocked: false };
  if (dryRun) {
    const [feedback, sessions, answers, images, aiEvaluations, learningRecords, progressSnapshots, events, studyAttempts, sessionFeedback, aiFeedbackCache] = await Promise.all([
      client.questionFeedback.count({ where: { createdAt } }), client.examSession.count({ where: { createdAt } }), client.examAnswer.count({ where: { session: { createdAt } } }),
      client.answerImage.count({ where: { createdAt } }), client.aiEvaluation.count({ where: { createdAt } }), client.learningRecord.count({ where: { createdAt } }),
      client.progressSnapshot.count({ where: { createdAt } }), client.learningEvent.count({ where: eventWhere }),
      client.studyAttempt.count({ where: { createdAt } }),
      client.studySessionFeedback.count({ where: sessionFeedbackWhere }), client.aiFeedbackUse.count({ where: { createdAt } }),
    ]);
    return { ...empty, feedback, sessions, answers, images, aiEvaluations, learningRecords, progressSnapshots, events, studyAttempts, sessionFeedback, aiFeedbackCache };
  }
  return client.$transaction(async tx => {
    const lock = await tx.$queryRaw<Array<{ locked: boolean }>>(Prisma.sql`SELECT pg_try_advisory_xact_lock(${RETENTION_LOCK}::bigint) AS locked`);
    if (!lock[0]?.locked) return { ...empty, skippedLocked: true };
    const result = { ...empty };
    result.answers = await tx.examAnswer.count({ where: { session: { createdAt } } });
    result.feedback = (await tx.questionFeedback.deleteMany({ where: { createdAt } })).count;
    result.sessionFeedback = (await tx.studySessionFeedback.deleteMany({ where: sessionFeedbackWhere })).count;
    result.sessions = (await tx.examSession.deleteMany({ where: { createdAt } })).count;
    result.studyAttempts = (await tx.studyAttempt.deleteMany({ where: { createdAt } })).count;
    result.aiEvaluations = (await tx.aiEvaluation.deleteMany({ where: { createdAt } })).count;
    result.aiFeedbackCache = (await tx.aiFeedbackUse.deleteMany({ where: { createdAt } })).count;
    result.learningRecords = (await tx.learningRecord.deleteMany({ where: { createdAt } })).count;
    result.progressSnapshots = (await tx.progressSnapshot.deleteMany({ where: { createdAt } })).count;
    result.events = (await tx.learningEvent.deleteMany({ where: eventWhere })).count;
    let after: string | undefined;
    while (true) {
      // Lexical ID bounds still work after deleting the preceding page.
      const images: Array<{ id: string; fileKey: string }> = await tx.answerImage.findMany({
        where: { createdAt, ...(after ? { id: { gt: after } } : {}) },
        select: { id: true, fileKey: true }, orderBy: { id: "asc" }, take: 200,
      });
      if (!images.length) break;
      after = images[images.length - 1].id;
      for (const image of images) {
        try { await storage.delete(image.fileKey); }
        catch { result.failedImages++; continue; }
        // Keep failed files' metadata for retry; never orphan an undeleted file.
        result.images += (await tx.answerImage.deleteMany({ where: { id: image.id, createdAt } })).count;
      }
      if (images.length < 200) break;
    }
    return result;
  }, { timeout: 300_000, maxWait: 10_000 });
}
