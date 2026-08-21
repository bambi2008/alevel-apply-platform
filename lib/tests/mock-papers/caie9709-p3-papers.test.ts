import { describe, expect, it } from "vitest";

import { CAIE9709_P3_WRITTEN_PAPERS } from "./caie9709-p3-written-papers";
import type { LongQuestion } from "@/lib/tests/questions/types";
import { CAIE9709_QUESTIONS } from "@/lib/tests/questions/caie9709";

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
  it("contains eight complete 110-minute, 75-mark papers", () => {
    expect(CAIE9709_P3_WRITTEN_PAPERS).toHaveLength(8);

    for (const paper of CAIE9709_P3_WRITTEN_PAPERS) {
      expect(paper.testId).toBe("caie9709");
      expect(paper.modules).toHaveLength(1);

      const paperModule = paper.modules[0];
      expect(paperModule.durationSec).toBe(110 * 60);
      expect(paperModule.questions).toHaveLength(11);
      expect(paperModule.questions.every((question) => question.type === "long")).toBe(true);

      const questions = paperModule.questions.filter(
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

  it("uses 88 unique questions and covers only the nine P3 topics", () => {
    const questions = CAIE9709_P3_WRITTEN_PAPERS
      .flatMap((paper) => paper.modules[0].questions)
      .filter((question): question is LongQuestion => question.type === "long");
    const ids = new Set(questions.map((question) => question.id));
    const topics = new Set(questions.map((question) => question.topicId));

    expect(questions).toHaveLength(88);
    expect(ids.size).toBe(88);
    expect(CAIE9709_QUESTIONS).toHaveLength(88);
    expect(topics).toEqual(expectedTopics);
  });

  it("passes answer-completeness and exact-duplicate audits", () => {
    const questions = CAIE9709_P3_WRITTEN_PAPERS
      .flatMap((paper) => paper.modules[0].questions)
      .filter((question): question is LongQuestion => question.type === "long");
    const fingerprints = new Set<string>();

    for (const question of questions) {
      const fingerprint = [question.context ?? "", ...question.parts.map((part) => part.question)]
        .join(" ")
        .toLocaleLowerCase()
        .replace(/\\[a-z]+/g, "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
      expect(fingerprint.length, `${question.id} fingerprint`).toBeGreaterThan(0);
      expect(fingerprints.has(fingerprint), `duplicate question: ${question.id}`).toBe(false);
      fingerprints.add(fingerprint);

      expect(question.fullSolution).toBe(question.parts.map((part) => `${part.label} ${part.solutionOutline}`).join("\n\n"));
      for (const part of question.parts) {
        expect(part.question.length, `${question.id} prompt`).toBeGreaterThan(10);
        expect(part.solutionOutline.length, `${question.id} solution`).toBeGreaterThan(20);
        expect(part.solutionOutline).not.toMatch(/TODO|TBC|待补|略$/i);
      }
    }
  });

  it("passes difficulty and paper-balance audits", () => {
    for (const paper of CAIE9709_P3_WRITTEN_PAPERS) {
      const questions = paper.modules[0].questions.filter(
        (question): question is LongQuestion => question.type === "long",
      );
      const topicCounts = new Map<string, number>();
      const marksByDifficulty = new Map<number, number>([[1, 0], [2, 0], [3, 0]]);

      for (const question of questions) {
        topicCounts.set(question.topicId, (topicCounts.get(question.topicId) ?? 0) + 1);
        marksByDifficulty.set(
          question.difficulty,
          (marksByDifficulty.get(question.difficulty) ?? 0) + question.totalMarks,
        );
      }

      expect(topicCounts.size, paper.id).toBeGreaterThanOrEqual(8);
      expect(Math.max(...topicCounts.values()), paper.id).toBeLessThanOrEqual(2);
      expect(marksByDifficulty.get(1), paper.id).toBe(12);
      expect(marksByDifficulty.get(3), paper.id).toBeGreaterThanOrEqual(35);
      expect(marksByDifficulty.get(3), paper.id).toBeLessThanOrEqual(40);
    }
  });

  it("recomputes the four new iterative answers", () => {
    const iterate = (start: number, fn: (value: number) => number) => {
      let value = start;
      for (let index = 0; index < 200; index += 1) value = fn(value);
      return value.toFixed(4);
    };

    expect(iterate(1.7, (x) => Math.cbrt(7 - x))).toBe("1.7392");
    expect(iterate(1, (x) => Math.log(4 - x))).toBe("1.0737");
    expect(iterate(1, (x) => Math.acos(x / 2))).toBe("1.0299");
    expect(iterate(1, (x) => Math.log(3 / x))).toBe("1.0499");
  });
});
