import { describe, expect, it } from "vitest";

import { CAIE9709_P3_WRITTEN_PAPERS } from "./caie9709-p3-written-papers";
import type { LongQuestion } from "@/lib/tests/questions/types";

const expectedTopics = new Set([
  "caie9709-algebra",
  "caie9709-log-exp",
  "caie9709-trig",
  "caie9709-differentiation",
  "caie9709-integration",
  "caie9709-numerical",
  "caie9709-vectors",
  "caie9709-de",
  "caie9709-complex",
]);

describe("CAIE 9709 P3 fixed written papers", () => {
  it("contains four complete 110-minute, 75-mark papers", () => {
    expect(CAIE9709_P3_WRITTEN_PAPERS).toHaveLength(4);

    for (const paper of CAIE9709_P3_WRITTEN_PAPERS) {
      expect(paper.testId).toBe("caie9709");
      expect(paper.modules).toHaveLength(1);

      const module = paper.modules[0];
      expect(module.durationSec).toBe(110 * 60);
      expect(module.questions).toHaveLength(11);
      expect(module.questions.every((question) => question.type === "long")).toBe(true);

      const questions = module.questions.filter(
        (question): question is LongQuestion => question.type === "long",
      );
      expect(questions.reduce((sum, question) => sum + question.totalMarks, 0)).toBe(75);
      expect(questions.filter((question) => question.difficulty === 3).length).toBeGreaterThanOrEqual(4);
      expect(questions.some((question) => question.topicId === "caie9709-differentiation")).toBe(true);
      expect(questions.some((question) => question.topicId === "caie9709-integration")).toBe(true);

      for (const question of questions) {
        expect(question.parts.reduce((sum, part) => sum + part.marks, 0)).toBe(question.totalMarks);
      }
    }
  });

  it("uses 44 unique questions and covers all nine P3 topics", () => {
    const questions = CAIE9709_P3_WRITTEN_PAPERS
      .flatMap((paper) => paper.modules[0].questions)
      .filter((question): question is LongQuestion => question.type === "long");
    const ids = new Set(questions.map((question) => question.id));
    const topics = new Set(questions.map((question) => question.topicId));

    expect(ids.size).toBe(44);
    expect(topics).toEqual(expectedTopics);
  });
});
