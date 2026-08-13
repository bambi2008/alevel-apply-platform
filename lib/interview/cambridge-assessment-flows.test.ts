import { describe, expect, it } from "vitest";
import { ASSESSMENT_QUESTIONS } from "./assessment-questions";
import { CAMBRIDGE_ASSESSMENT_FLOWS } from "./cambridge-assessment-flows";

describe("Cambridge college assessment fixed flows", () => {
  it("covers all three assessment subjects with fixed tasks", () => {
    expect(CAMBRIDGE_ASSESSMENT_FLOWS.map((flow) => flow.subjectId)).toEqual([
      "cambridge-source",
      "cambridge-language-aptitude",
      "cambridge-visual",
    ]);
    expect(CAMBRIDGE_ASSESSMENT_FLOWS.map((flow) => flow.tasks.length)).toEqual([3, 3, 2]);
  });

  it("references real questions with usable preparation and response windows", () => {
    const questionIds = new Set(ASSESSMENT_QUESTIONS.map((question) => question.id));
    const tasks = CAMBRIDGE_ASSESSMENT_FLOWS.flatMap((flow) => flow.tasks);
    expect(new Set(tasks.map((task) => task.questionId)).size).toBe(tasks.length);
    expect(tasks.every((task) => questionIds.has(task.questionId))).toBe(true);
    expect(tasks.every((task) => task.preparationSec >= 120)).toBe(true);
    expect(tasks.every((task) => task.responseSec >= 300)).toBe(true);
  });
});
