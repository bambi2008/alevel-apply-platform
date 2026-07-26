import { describe, expect, it } from "vitest";
import { ASSESSMENT_QUESTIONS } from "./assessment-questions";
import { HK_INTERVIEW_FLOWS } from "./hk-interview-flows";

describe("Hong Kong interview fixed flows", () => {
  it("covers all four interview formats", () => {
    expect(HK_INTERVIEW_FLOWS.map((flow) => flow.subjectId)).toEqual([
      "hk-general",
      "hk-medicine-mmi",
      "hk-business-group",
      "hk-stem",
    ]);
    expect(HK_INTERVIEW_FLOWS.map((flow) => flow.tasks.length)).toEqual([3, 3, 2, 2]);
  });

  it("uses each reviewed station once with a complete timer", () => {
    const questionIds = new Set(ASSESSMENT_QUESTIONS.map((question) => question.id));
    const tasks = HK_INTERVIEW_FLOWS.flatMap((flow) => flow.tasks);
    expect(new Set(tasks.map((task) => task.questionId)).size).toBe(tasks.length);
    expect(tasks.every((task) => questionIds.has(task.questionId))).toBe(true);
    expect(tasks.every((task) => task.preparationSec >= 60 && task.responseSec >= 120)).toBe(true);
  });
});
