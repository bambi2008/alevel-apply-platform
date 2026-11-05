import { describe, expect, it, vi } from "vitest";
import type { PrismaClient } from "@prisma/client";
import { isStudyDataExpired, runStudyRetention, studyRetentionCutoff } from "./data-retention";
import { nextRetentionRun } from "../scripts/study-retention-worker.mjs";
const now = new Date("2026-10-26T01:00:00Z");
function fixture() {
  const old = new Date(+now - 366 * 86_400_000), young = new Date(+now - 364 * 86_400_000);
  const tables = Object.fromEntries(["questionFeedback", "studySessionFeedback", "examSession", "studyAttempt", "examAnswer", "answerImage", "aiEvaluation", "aiFeedbackUse", "learningRecord", "progressSnapshot", "learningEvent"].map(name => [name, [{ id: `${name}-old`, createdAt: old, fileKey: "old.jpg" }, { id: `${name}-young`, createdAt: young, fileKey: "young.jpg" }]]));
  const calls: string[] = [];
  const matches = (row: { id: string; createdAt: Date }, arg: { where?: { createdAt?: { lte: Date }; session?: { createdAt: { lte: Date } }; id?: string | { gt: string }; OR?: Array<{ createdAt?: { lte: Date } }> } }) => {
    const where = arg.where ?? {}, cutoff = where.createdAt ?? where.session?.createdAt ?? where.OR?.[0]?.createdAt;
    return (!cutoff || row.createdAt <= cutoff.lte) && (!where.id || (typeof where.id === "string" ? row.id === where.id : row.id > where.id.gt));
  };
  const client = Object.fromEntries(Object.keys(tables).map(name => [name, {
    count: vi.fn(async arg => tables[name].filter(row => matches(row, arg)).length),
    findMany: vi.fn(async arg => tables[name].filter(row => matches(row, arg)).slice(0, 200)),
    deleteMany: vi.fn(async arg => { const removed = tables[name].filter(row => matches(row, arg)); tables[name] = tables[name].filter(row => !matches(row, arg)); calls.push(`metadata:${name}`); return { count: removed.length }; }),
  }]));
  const query = vi.fn(async () => [{ locked: true }]);
  Object.assign(client, { $queryRaw: query, $transaction: async (fn: (tx: unknown) => unknown) => fn(client) });
  const storage = { delete: vi.fn(async (key: string) => { calls.push(`file:${key}`); }) };
  return { client: client as unknown as PrismaClient, tables, storage, calls, query };
}
describe("365-day study-data retention", () => {
  it("uses creation time and inclusive 365-day boundary", () => {
    expect(isStudyDataExpired(new Date(+now - 366 * 86_400_000), now)).toBe(true);
    expect(isStudyDataExpired(studyRetentionCutoff(now), now)).toBe(true);
    expect(isStudyDataExpired(new Date(+now - 364 * 86_400_000), now)).toBe(false);
  });
  it("defaults to dry-run: counts without deleting a row or object", async () => {
    const f = fixture(), before = structuredClone(f.tables);
    const result = await runStudyRetention({ ...f, now });
    expect(result).toMatchObject({ feedback: 1, sessionFeedback: 1, sessions: 1, answers: 1, images: 1, aiEvaluations: 1, aiFeedbackCache: 1, failedImages: 0 });
    expect(f.tables).toEqual(before); expect(f.storage.delete).not.toHaveBeenCalled(); expect(f.query).not.toHaveBeenCalled();
  });
  it("deletes 366-day records/photos while keeping all 364-day fixtures", async () => {
    const f = fixture();
    const result = await runStudyRetention({ ...f, now, dryRun: false });
    expect(result).toMatchObject({ feedback: 1, sessions: 1, studyAttempts: 1, images: 1, aiEvaluations: 1, learningRecords: 1, progressSnapshots: 1 });
    for (const name of ["questionFeedback", "studySessionFeedback", "examSession", "studyAttempt", "answerImage", "aiEvaluation", "aiFeedbackUse", "learningRecord", "progressSnapshot", "learningEvent"]) expect(f.tables[name].map(row => row.id)).toEqual([`${name}-young`]);
    expect(f.storage.delete).toHaveBeenCalledWith("old.jpg");
    expect(f.storage.delete).not.toHaveBeenCalledWith("young.jpg");
    expect(f.calls.indexOf("file:old.jpg")).toBeLessThan(f.calls.indexOf("metadata:answerImage"));
  });
  it("keeps a failed photo's metadata for a retry instead of orphaning its bytes", async () => {
    const f = fixture(); f.storage.delete.mockRejectedValue(Error("storage unavailable"));
    expect(await runStudyRetention({ ...f, now, dryRun: false })).toMatchObject({ images: 0, failedImages: 1 });
    expect(f.tables.answerImage).toHaveLength(2);
  });
  it("does not delete when another retention worker owns the advisory lock", async () => {
    const f = fixture(); f.query.mockResolvedValue([{ locked: false }]);
    expect((await runStudyRetention({ ...f, now, dryRun: false })).skippedLocked).toBe(true);
    expect(f.calls).toEqual([]);
  });
  it("schedules the next 03:00 China-time run independently of host timezone", () => {
    expect(nextRetentionRun(new Date("2026-10-26T18:59:00Z")).toISOString()).toBe("2026-10-26T19:00:00.000Z");
    expect(nextRetentionRun(new Date("2026-10-26T19:00:00Z")).toISOString()).toBe("2026-10-27T19:00:00.000Z");
  });
});
