import { describe, expect, it } from "vitest";
import { buildRemediationProfile, selectRemediationQuestions } from "@/lib/tests/remediation";
import type { AdaptiveAnswerObservation } from "@/lib/tests/adaptive";

const now = new Date("2026-07-26T12:00:00.000Z");

function answer(questionId: string, score: number, date: string, topicId = "algebra"): AdaptiveAnswerObservation {
  return {
    questionId,
    topicId,
    difficulty: 2,
    earned: score,
    max: 100,
    completedAt: new Date(date),
  };
}

describe("remediation evidence", () => {
  it("does not treat one successful retry as verified", () => {
    const profile = buildRemediationProfile({
      now,
      answers: [
        answer("q1", 30, "2026-07-20T10:00:00.000Z"),
        answer("q1", 90, "2026-07-22T10:00:00.000Z"),
      ],
    });
    expect(profile.cases[0].status).toBe("recovered");
    expect(profile.verifiedCount).toBe(0);
  });

  it("requires successful retries across dates and time to verify recovery", () => {
    const profile = buildRemediationProfile({
      now,
      answers: [
        answer("q1", 40, "2026-07-18T10:00:00.000Z"),
        answer("q1", 85, "2026-07-20T10:00:00.000Z"),
        answer("q1", 90, "2026-07-24T10:00:00.000Z"),
      ],
    });
    expect(profile.cases[0].status).toBe("verified");
    expect(profile.recoveryRate).toBe(100);
  });

  it("marks a new failure after recovery as relapse", () => {
    const profile = buildRemediationProfile({
      now,
      answers: [
        answer("q1", 20, "2026-07-18T10:00:00.000Z"),
        answer("q1", 90, "2026-07-22T10:00:00.000Z"),
        answer("q1", 50, "2026-07-25T10:00:00.000Z"),
      ],
    });
    expect(profile.cases[0].status).toBe("relapsed");
    expect(profile.relapsedCount).toBe(1);
  });

  it("selects exact due questions before same-topic variants", () => {
    const profile = buildRemediationProfile({
      now,
      answers: [answer("q1", 20, "2026-07-24T10:00:00.000Z")],
    });
    const selected = selectRemediationQuestions({
      profile,
      count: 2,
      now,
      questions: [
        { id: "q2", topicId: "algebra", difficulty: 3, type: "mcq" },
        { id: "q1", topicId: "algebra", difficulty: 2, type: "mcq" },
        { id: "q3", topicId: "geometry", difficulty: 3, type: "mcq" },
      ],
    });
    expect(selected).toEqual(["q1", "q2"]);
  });
});
