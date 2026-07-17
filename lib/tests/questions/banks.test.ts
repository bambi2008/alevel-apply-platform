import { describe, it, expect } from "vitest";
import { MAT_QUESTIONS } from "@/lib/tests/questions/mat";
import { STEP_QUESTIONS } from "@/lib/tests/questions/step";
import { ESAT_QUESTIONS } from "@/lib/tests/questions/esat";
import { TMUA_QUESTIONS } from "@/lib/tests/questions/tmua";
import { BPHO_QUESTIONS } from "@/lib/tests/questions/bpho";
import { BPHO4_LONG_SAMPLE } from "@/lib/tests/questions/bpho4-long";
import { BPHO5_LONG_SAMPLE } from "@/lib/tests/questions/bpho5-long";
import { BMO_SMC_TOPUP } from "@/lib/tests/questions/bmo-smc-topup";
import { getAllMockQuestions } from "@/lib/tests/mock-papers";
import { getTestById } from "@/lib/tests";
import { getQuestionById } from "@/lib/tests/lookup";
import type { Question } from "@/lib/tests/questions/types";

const banks: Record<string, Question[]> = {
  mat: MAT_QUESTIONS,
  step: STEP_QUESTIONS,
  esat: ESAT_QUESTIONS,
  tmua: TMUA_QUESTIONS,
  bpho: BPHO_QUESTIONS,
};

const allQuestions: Question[] = [
  ...MAT_QUESTIONS,
  ...STEP_QUESTIONS,
  ...ESAT_QUESTIONS,
  ...TMUA_QUESTIONS,
  ...BPHO_QUESTIONS,
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

describe("BPhO fourth long-question batch", () => {
  it("covers every BPhO topic exactly once", () => {
    expect(BPHO4_LONG_SAMPLE).toHaveLength(5);
    expect(BPHO4_LONG_SAMPLE.map((q) => q.topicId).sort()).toEqual(
      ["bpho-mechanics", "bpho-waves", "bpho-em", "bpho-thermal", "bpho-modern"].sort()
    );
  });

  it("contains five 25-mark staged problems", () => {
    for (const question of BPHO4_LONG_SAMPLE) {
      expect(question.totalMarks).toBe(25);
      expect(question.parts.length).toBeGreaterThanOrEqual(5);
      expect(question.parts.reduce((sum, part) => sum + part.marks, 0)).toBe(25);
    }
  });
});

describe("BPhO fifth long-question batch", () => {
  it("covers every BPhO topic exactly once", () => {
    expect(BPHO5_LONG_SAMPLE).toHaveLength(5);
    expect(BPHO5_LONG_SAMPLE.map((q) => q.topicId).sort()).toEqual(
      ["bpho-mechanics", "bpho-waves", "bpho-em", "bpho-thermal", "bpho-modern"].sort()
    );
  });

  it("contains five 25-mark staged problems", () => {
    for (const question of BPHO5_LONG_SAMPLE) {
      expect(question.totalMarks).toBe(25);
      expect(question.parts.length).toBeGreaterThanOrEqual(5);
      expect(question.parts.reduce((sum, part) => sum + part.marks, 0)).toBe(25);
    }
  });
});

describe("BMO number theory and geometry top-up", () => {
  it("adds ten questions to each under-represented topic", () => {
    expect(BMO_SMC_TOPUP).toHaveLength(20);
    expect(BMO_SMC_TOPUP.filter((q) => q.topicId === "bmo-number")).toHaveLength(10);
    expect(BMO_SMC_TOPUP.filter((q) => q.topicId === "bmo-geometry")).toHaveLength(10);
  });

  it("contains a deliberate difficulty spread", () => {
    const counts = BMO_SMC_TOPUP.reduce<Record<number, number>>((acc, question) => {
      acc[question.difficulty] = (acc[question.difficulty] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts[1]).toBeGreaterThanOrEqual(3);
    expect(counts[2]).toBeGreaterThanOrEqual(8);
    expect(counts[3]).toBeGreaterThanOrEqual(5);
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
          expect(
            q.parts.reduce((sum, part) => sum + part.marks, 0),
            `${q.id}: part marks do not add up to totalMarks`
          ).toBe(q.totalMarks);
          for (const part of q.parts) {
            expect((part.question ?? "").length, `${q.id}: empty part question`).toBeGreaterThan(0);
            expect(
              (part.solutionOutline ?? "").length,
              `${q.id}: empty part solution outline`
            ).toBeGreaterThan(0);
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
