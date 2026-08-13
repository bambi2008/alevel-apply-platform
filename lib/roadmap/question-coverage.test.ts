import { describe, expect, it } from "vitest";
import { calculateQuestionCoverage } from "./question-coverage";

describe("calculateQuestionCoverage", () => {
  it("counts unique practiced questions that belong to the available bank", () => {
    expect(calculateQuestionCoverage(
      ["q1", "q2", "q3", "q3"],
      ["q1", "q1", "q3", "mock-only"],
    )).toEqual({ attempted: 2, available: 3, pct: 67 });
  });

  it("does not report full progress after a single question", () => {
    expect(calculateQuestionCoverage(["q1", "q2", "q3", "q4"], ["q1"]).pct).toBe(25);
  });
});
