import { describe, expect, it } from "vitest";
import { calculateLearningGain, returnedAfterDays, type ScorePoint } from "./metrics";

function point(type: string, day: number, score: number, testId = "tmua"): ScorePoint {
  return {
    type,
    testId,
    score,
    maxScore: 100,
    occurredAt: new Date(Date.UTC(2026, 0, day)),
  };
}

describe("Beta metrics", () => {
  it("uses the diagnostic and latest later score from the same exam", () => {
    const gain = calculateLearningGain([
      point("PRACTICE_COMPLETED", 1, 40),
      point("DIAGNOSTIC_COMPLETED", 2, 50),
      point("PRACTICE_COMPLETED", 3, 60),
      point("MOCK_COMPLETED", 5, 72),
    ]);
    expect(gain).toEqual({ testId: "tmua", preScore: 50, postScore: 72, delta: 22 });
  });

  it("does not manufacture gain without a later comparable result", () => {
    expect(calculateLearningGain([point("DIAGNOSTIC_COMPLETED", 1, 50)])).toBeNull();
  });

  it("counts return only after the full seven-day threshold", () => {
    const registered = new Date("2026-01-01T00:00:00.000Z");
    expect(returnedAfterDays(registered, [{ type: "ACTIVE_DAY", occurredAt: new Date("2026-01-07T23:59:59.000Z") }], 7)).toBe(false);
    expect(returnedAfterDays(registered, [{ type: "ACTIVE_DAY", occurredAt: new Date("2026-01-08T00:00:00.000Z") }], 7)).toBe(true);
  });
});
