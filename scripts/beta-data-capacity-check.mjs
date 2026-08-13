import { existsSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  const envFile = [".env.local", ".env"].find(existsSync);
  if (envFile) process.loadEnvFile(envFile);
}

const db = new PrismaClient();
const students = Number(process.env.BETA_DATA_STUDENTS || 50);
const concurrency = Number(process.env.BETA_DATA_CONCURRENCY || 10);
const maxP95Ms = Number(process.env.BETA_DATA_MAX_P95_MS || 2000);
const runId = randomUUID();
const emailPrefix = `capacity-${runId}-`;
const timings = [];
const failures = [];
let nextStudent = 0;

async function simulateStudent(index) {
  const started = performance.now();
  const email = `${emailPrefix}${index}@example.test`;
  try {
    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, role: "STUDENT", profile: { create: {} } },
        select: { id: true, profile: { select: { id: true } } },
      });
      const studentId = user.profile.id;
      const now = new Date();
      await tx.betaParticipant.create({ data: { studentId, source: "capacity-check" } });
      await tx.authSession.create({
        data: {
          userId: user.id,
          tokenHash: createHash("sha256").update(`${runId}:${index}`).digest("hex"),
          expiresAt: new Date(now.getTime() + 60_000),
        },
      });
      await tx.progressSnapshot.create({
        data: {
          studentId,
          kind: "OBJECTIVE_EXAM",
          resourceId: "capacity-tmua",
          payload: { questionIndex: 1, savedAt: now.getTime() },
          startedAt: now,
          expiresAt: new Date(now.getTime() + 60_000),
        },
      });
      const session = await tx.examSession.create({
        data: {
          studentId,
          testId: "tmua",
          mode: "practice",
          totalEarned: 1,
          totalMax: 1,
          answers: { create: [{ questionId: "capacity-check", type: "mcq", selected: "A", earned: 1, max: 1 }] },
        },
      });
      await tx.learningEvent.createMany({
        data: [
          { studentId, type: "REGISTERED", eventKey: `capacity:${runId}:${index}:registered`, occurredAt: now },
          { studentId, type: "PRACTICE_COMPLETED", eventKey: `capacity:${runId}:${index}:practice`, testId: "tmua", sessionId: session.id, score: 1, maxScore: 1, occurredAt: now },
        ],
      });
    });
    timings.push(performance.now() - started);
  } catch (error) {
    failures.push({ index, error: error instanceof Error ? error.message : String(error) });
  }
}

async function worker() {
  while (nextStudent < students) await simulateStudent(nextStudent++);
}

try {
  await Promise.all(Array.from({ length: Math.min(concurrency, students) }, () => worker()));
  const ordered = [...timings].sort((a, b) => a - b);
  const p95Ms = ordered[Math.min(ordered.length - 1, Math.ceil(ordered.length * 0.95) - 1)] || 0;
  const created = await db.user.count({ where: { email: { startsWith: emailPrefix } } });
  const summary = { students, concurrency, created, failures: failures.length, p95Ms: Math.round(p95Ms) };
  console.log(JSON.stringify(summary, null, 2));
  if (failures.length || created !== students || p95Ms > maxP95Ms) {
    console.error("First failures:", failures.slice(0, 3));
    process.exitCode = 1;
  } else {
    console.log("Beta data capacity gate passed");
  }
} finally {
  await db.user.deleteMany({ where: { email: { startsWith: emailPrefix } } });
  await db.$disconnect();
}
