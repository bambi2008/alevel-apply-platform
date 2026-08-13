import { requireAdmin } from "@/lib/admin/actions";
import { db } from "@/lib/db";
import { calculateLearningGain, returnedAfterDays } from "@/lib/beta/metrics";

const DAY_MS = 24 * 60 * 60_000;

function firstAt(events: Array<{ type: string; occurredAt: Date }>, types: string[]) {
  return events
    .filter((event) => types.includes(event.type))
    .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime())[0]?.occurredAt ?? null;
}

export async function getBetaAnalytics() {
  await requireAdmin();
  const aiSince = new Date(Date.now() - 30 * DAY_MS);
  const [participants, aiTotals, aiByStatus, lowConfidence, staleRunning] = await Promise.all([
    db.betaParticipant.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      cohort: true,
      status: true,
      onboardingCompletedAt: true,
      lastActiveAt: true,
      createdAt: true,
      student: {
        select: {
          id: true,
          fullName: true,
          school: true,
          user: { select: { email: true, phone: true, createdAt: true } },
          _count: { select: { examSessions: true, learningRecords: true } },
          learningEvents: {
            orderBy: { occurredAt: "asc" },
            select: { type: true, testId: true, score: true, maxScore: true, occurredAt: true },
          },
        },
      },
    },
    }),
    db.aiEvaluation.aggregate({
      where: { createdAt: { gte: aiSince } },
      _count: { _all: true },
      _avg: { latencyMs: true },
      _sum: { totalTokens: true, estimatedCostMicros: true },
    }),
    db.aiEvaluation.groupBy({
      by: ["status"],
      where: { createdAt: { gte: aiSince } },
      _count: { _all: true },
    }),
    db.aiEvaluation.count({ where: { createdAt: { gte: aiSince }, confidence: "low" } }),
    db.aiEvaluation.count({
      where: { status: "RUNNING", createdAt: { lt: new Date(Date.now() - 2 * 60_000) } },
    }),
  ]);

  const rows = participants.map((participant) => {
    const events = participant.student.learningEvents;
    const registeredAt = firstAt(events, ["REGISTERED"]) ?? participant.student.user.createdAt;
    const firstPracticeAt = firstAt(events, ["PRACTICE_STARTED", "PRACTICE_COMPLETED"]);
    const firstMockAt = firstAt(events, ["MOCK_STARTED", "MOCK_COMPLETED"]);
    const firstDiagnosticAt = firstAt(events, ["DIAGNOSTIC_STARTED", "DIAGNOSTIC_COMPLETED"]);
    const returnedAfterSevenDays = returnedAfterDays(registeredAt, events, 7);
    const remediationCompleted = events.filter((event) => event.type === "REMEDIATION_COMPLETED").length;
    return {
      id: participant.id,
      studentId: participant.student.id,
      account: participant.student.user.email ?? participant.student.user.phone ?? "未填写",
      name: participant.student.fullName ?? "未填写",
      school: participant.student.school ?? "未填写",
      cohort: participant.cohort,
      status: participant.status,
      registeredAt,
      lastActiveAt: participant.lastActiveAt,
      profileComplete: Boolean(participant.onboardingCompletedAt),
      firstDiagnosticAt,
      firstPracticeAt,
      firstMockAt,
      returnedAfterSevenDays,
      remediationCompleted,
      examSessions: participant.student._count.examSessions,
      interviewRecords: participant.student._count.learningRecords,
      gain: calculateLearningGain(events),
    };
  });

  const distinct = (predicate: (row: (typeof rows)[number]) => boolean) => rows.filter(predicate).length;
  const gains = rows.flatMap((row) => row.gain ? [row.gain.delta] : []);
  const averageGain = gains.length
    ? Math.round((gains.reduce((sum, value) => sum + value, 0) / gains.length) * 10) / 10
    : null;
  const statusCount = Object.fromEntries(aiByStatus.map((item) => [item.status, item._count._all]));
  const aiCount = aiTotals._count._all;
  const aiSucceeded = statusCount.SUCCEEDED ?? 0;

  return {
    generatedAt: new Date(),
    funnel: {
      registered: rows.length,
      profileCompleted: distinct((row) => row.profileComplete),
      diagnostic: distinct((row) => Boolean(row.firstDiagnosticAt)),
      firstPractice: distinct((row) => Boolean(row.firstPracticeAt)),
      firstMock: distinct((row) => Boolean(row.firstMockAt)),
      sevenDayReturn: distinct((row) => row.returnedAfterSevenDays),
      remediation: distinct((row) => row.remediationCompleted > 0),
      measuredGain: gains.length,
      averageGain,
    },
    ai: {
      periodDays: 30,
      evaluations: aiCount,
      succeeded: aiSucceeded,
      failed: statusCount.FAILED ?? 0,
      timedOut: statusCount.TIMED_OUT ?? 0,
      staleRunning,
      successRate: aiCount ? Math.round((aiSucceeded / aiCount) * 1000) / 10 : null,
      averageLatencyMs: aiTotals._avg.latencyMs == null ? null : Math.round(aiTotals._avg.latencyMs),
      totalTokens: aiTotals._sum.totalTokens ?? 0,
      estimatedCostMicros: aiTotals._sum.estimatedCostMicros ?? null,
      lowConfidence,
    },
    rows,
  };
}
