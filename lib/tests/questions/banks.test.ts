import { describe, it, expect } from "vitest";
import { MAT_QUESTIONS } from "@/lib/tests/questions/mat";
import { STEP_QUESTIONS } from "@/lib/tests/questions/step";
import { ESAT_QUESTIONS } from "@/lib/tests/questions/esat";
import { TMUA_QUESTIONS } from "@/lib/tests/questions/tmua";
import { getAllMockQuestions } from "@/lib/tests/mock-papers";
import { getTestById } from "@/lib/tests";
import { getQuestionById } from "@/lib/tests/lookup";
import type { Question } from "@/lib/tests/questions/types";

const banks: Record<string, Question[]> = {
  mat: MAT_QUESTIONS,
  step: STEP_QUESTIONS,
  esat: ESAT_QUESTIONS,
  tmua: TMUA_QUESTIONS,
};

const allQuestions: Question[] = [
  ...MAT_QUESTIONS,
  ...STEP_QUESTIONS,
  ...ESAT_QUESTIONS,
  ...TMUA_QUESTIONS,
  ...getAllMockQuestions(),
];

describe("question bank global integrity", () => {
  it("all question ids are globally unique", () => {
    const seen = new Set<string>();
    const dups: string[] = [];
    for (const q of allQuestions) {
      if (seen.has(q.id)) dups.push(q.id);
      seen.add(q.id);
    }
    expect(dups).toEqual([]);
  });

  it("lookup resolves every question id", () => {
    const unresolved = allQuestions
      .filter((q) => !getQuestionById(q.id))
      .map((q) => q.id);
    expect(unresolved).toEqual([]);
  });
});

for (const [name, bank] of Object.entries(banks)) {
  describe(`bank: ${name}`, () => {
    it("is non-empty", () => {
      expect(bank.length).toBeGreaterThan(0);
    });

    it("every MCQ answer is one of its options, keys unique", () => {
      for (const q of bank) {
        if (q.type !== "mcq") continue;
        const keys = q.options.map((o) => o.key);
        expect(keys, `${q.id}: answer not in options`).toContain(q.answer);
        expect(new Set(keys).size, `${q.id}: duplicate option keys`).toBe(
          keys.length
        );
        expect(keys.length, `${q.id}: too few options`).toBeGreaterThanOrEqual(2);
      }
    });

    it("every question has valid difficulty, positive marks, non-empty text", () => {
      for (const q of bank) {
        expect([1, 2, 3], `${q.id}: bad difficulty`).toContain(q.difficulty);
        if (q.type === "mcq") {
          expect(q.marks, `${q.id}: non-positive marks`).toBeGreaterThan(0);
          expect((q.question ?? "").length, `${q.id}: empty question`).toBeGreaterThan(0);
          expect((q.solution ?? "").length, `${q.id}: empty solution`).toBeGreaterThan(0);
        } else {
          // 长题：分值在 totalMarks；文本在各小问 question 与 fullSolution
          expect(q.totalMarks, `${q.id}: non-positive totalMarks`).toBeGreaterThan(0);
          expect(q.parts.length, `${q.id}: no parts`).toBeGreaterThan(0);
          expect((q.fullSolution ?? "").length, `${q.id}: empty fullSolution`).toBeGreaterThan(0);
          for (const part of q.parts) {
            expect((part.question ?? "").length, `${q.id}: empty part question`).toBeGreaterThan(0);
          }
        }
      }
    });

    it("every question references a real topic within its test", () => {
      for (const q of bank) {
        const test = getTestById(q.testId);
        expect(test, `${q.id}: unknown testId ${q.testId}`).toBeTruthy();
        const topicIds = test!.topics.map((t) => t.id);
        expect(topicIds, `${q.id}: unknown topicId ${q.topicId}`).toContain(
          q.topicId
        );
      }
    });
  });
}
