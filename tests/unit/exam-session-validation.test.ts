import { describe, expect, it } from "vitest";
import { submitAttemptSchema } from "@/lib/tests/study-attempts";

const answer = { questionId: "synthetic-q1", work: { "(a)": "$x=2$", note: "原始手写说明" } };

describe("canonical submission payload validation", () => {
  it("preserves written work and optional timing without accepting caller grades", () => {
    const telemetry = { timeSpentSec: 43, answerChanges: 2, visits: 3, flagged: true };
    const parsed = submitAttemptSchema.parse({ answers: [{ ...answer, telemetry }] });
    expect(parsed).toEqual({ complete: false, answers: [{ ...answer, telemetry }] });
    expect(submitAttemptSchema.safeParse({ complete: true, answers: [{ ...answer, score: { earned: 4, max: 4 } }] }).success).toBe(false);
    expect(submitAttemptSchema.safeParse({ complete: true, answers: [{ ...answer, grading: { totalEarned: 4 } }] }).success).toBe(false);
  });

  it.each([null, [], { "(a)": 42 }])("rejects non-string work records: %j", work => {
    expect(submitAttemptSchema.safeParse({ answers: [{ ...answer, work }] }).success).toBe(false);
  });

  it("accepts a full paper payload but bounds images and answer count", () => {
    expect(submitAttemptSchema.safeParse({ answers: Array(300).fill(answer) }).success).toBe(true);
    expect(submitAttemptSchema.safeParse({ answers: Array(301).fill(answer) }).success).toBe(false);
    expect(submitAttemptSchema.safeParse({ answers: [{ ...answer, answerImageIds: { "(a)": Array(5).fill("image-id") } }] }).success).toBe(false);
  });
});
