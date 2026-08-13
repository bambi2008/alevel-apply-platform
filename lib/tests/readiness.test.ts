import { describe, expect, it } from "vitest";
import { buildExamReadiness, type ReadinessAttempt } from "@/lib/tests/readiness";
import type { AdaptiveProfile } from "@/lib/tests/adaptive";

function profile(overrides: Partial<AdaptiveProfile> = {}): AdaptiveProfile {
  return {
    stage: "exam-ready",
    readiness: 82,
    coverage: 100,
    totalAttempts: 80,
    uniqueQuestions: 70,
    dueReviewCount: 0,
    reviewSchedule: [],
    dueReviews: [],
    tasks: [],
    topics: [
      { id: "a", title: "代数", titleEn: "Algebra", mastery: 84, confidence: 88, attempts: 30, uniqueQuestions: 20, accuracy: 84, status: "secure", trend: "stable", priority: 20, lastPracticedAt: "2026-07-23T00:00:00.000Z" },
      { id: "b", title: "几何", titleEn: "Geometry", mastery: 80, confidence: 82, attempts: 25, uniqueQuestions: 18, accuracy: 80, status: "secure", trend: "stable", priority: 24, lastPracticedAt: "2026-07-22T00:00:00.000Z" },
    ],
    ...overrides,
  };
}

function attempt(id: string, score: number, daysAgo: number, overrides: Partial<ReadinessAttempt> = {}): ReadinessAttempt {
  return {
    id,
    mode: "paper",
    paperId: `paper-${id}`,
    scorePercent: score,
    completionPercent: 100,
    timeRatio: 0.9,
    completedAt: new Date(Date.UTC(2026, 6, 24 - daysAgo)),
    ...overrides,
  };
}

describe("buildExamReadiness", () => {
  const now = new Date("2026-07-24T00:00:00.000Z");

  it("does not declare readiness without two full mocks", () => {
    const result = buildExamReadiness({ testId: "tmua", adaptive: profile(), attempts: [attempt("1", 92, 1)], now });
    expect(result.status).toBe("collecting");
    expect(result.score).toBeLessThanOrEqual(64);
    expect(result.risks.some((risk) => risk.code === "mock-evidence" && risk.severity === "critical")).toBe(true);
  });

  it("marks strong, recent and stable evidence ready", () => {
    const attempts = [attempt("1", 82, 10), attempt("2", 84, 6), attempt("3", 86, 3), attempt("4", 85, 1)];
    const result = buildExamReadiness({ testId: "tmua", adaptive: profile(), attempts, now });
    expect(result.status).toBe("ready");
    expect(result.confidence).toBe("high");
    expect(result.risks).toHaveLength(0);
  });

  it("surfaces weak coverage and incomplete papers as blocking risks", () => {
    const weak = profile({
      coverage: 35,
      topics: [{ ...profile().topics[0], mastery: 42, confidence: 75 }],
    });
    const attempts = [
      attempt("1", 68, 4, { completionPercent: 65 }),
      attempt("2", 71, 1, { completionPercent: 70 }),
    ];
    const result = buildExamReadiness({ testId: "esat", adaptive: weak, attempts, now });
    expect(result.status).not.toBe("ready");
    expect(result.risks.map((risk) => risk.code)).toEqual(expect.arrayContaining(["coverage", "weak-topic", "completion"]));
    expect(result.sprint.length).toBeGreaterThan(0);
  });

  it("flags stale evidence even when historical scores were strong", () => {
    const result = buildExamReadiness({
      testId: "lnat",
      adaptive: profile(),
      attempts: [attempt("1", 84, 45), attempt("2", 86, 40)],
      now,
    });
    expect(result.risks.some((risk) => risk.code === "stale")).toBe(true);
    expect(result.status).not.toBe("ready");
  });

  it("keeps relapsed remediation evidence visible in readiness", () => {
    const attempts = [attempt("1", 84, 6), attempt("2", 86, 1)];
    const result = buildExamReadiness({
      testId: "tmua",
      adaptive: profile(),
      attempts,
      remediation: { activeCount: 4, dueCount: 2, relapsedCount: 1, recoveryRate: 60 },
      now,
    });
    expect(result.risks.some((risk) => risk.code === "remediation")).toBe(true);
  });
});
