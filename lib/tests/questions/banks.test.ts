import { describe, it, expect } from "vitest";
import { MAT_QUESTIONS } from "@/lib/tests/questions/mat";
import { STEP_QUESTIONS } from "@/lib/tests/questions/step";
import { ESAT_QUESTIONS } from "@/lib/tests/questions/esat";
import { TMUA_QUESTIONS } from "@/lib/tests/questions/tmua";
import { BPHO_QUESTIONS } from "@/lib/tests/questions/bpho";
import { PAT_QUESTIONS } from "@/lib/tests/questions/pat";
import { LNAT_QUESTIONS } from "@/lib/tests/questions/lnat";
import { TARA_QUESTIONS } from "@/lib/tests/questions/tara";
import { TMUA_REASONING_ROUND_2 } from "@/lib/tests/questions/tmua-reasoning-round-2";
import { BPHO4_LONG_SAMPLE } from "@/lib/tests/questions/bpho4-long";
import { BPHO5_LONG_SAMPLE } from "@/lib/tests/questions/bpho5-long";
import { BMO_SMC_TOPUP } from "@/lib/tests/questions/bmo-smc-topup";
import { BMO_SHORT_PROOFS } from "@/lib/tests/questions/bmo-short-proofs";
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

describe("ESAT science gap fill", () => {
  it("keeps at least twenty questions and all difficulty levels in every target topic", () => {
    const topics = [
      "esat-phys4", "esat-phys5", "esat-phys6", "esat-phys7",
      "esat-chem4", "esat-chem5", "esat-bio4",
    ];
    for (const topicId of topics) {
      const questions = ESAT_QUESTIONS.filter((question) => question.topicId === topicId);
      expect(questions.length, `${topicId}: insufficient practice`).toBeGreaterThanOrEqual(20);
      expect(new Set(questions.map((question) => question.difficulty)), `${topicId}: missing difficulty`).toEqual(new Set([1, 2, 3]));
    }
  });
});

describe("question bank difficulty calibration", () => {
  it("keeps every calibrated topic represented at all three relative difficulty levels", () => {
    const targets = [
      { bank: PAT_QUESTIONS, topicId: "pat-wave" },
      { bank: LNAT_QUESTIONS, topicId: "lnat-read" },
      { bank: LNAT_QUESTIONS, topicId: "lnat-analyse" },
      { bank: TARA_QUESTIONS, topicId: "tara-critical" },
      ...["step-pure1", "step-pure2", "step-pure3", "step-pure4", "step-mech"]
        .map((topicId) => ({ bank: STEP_QUESTIONS, topicId })),
    ];
    for (const { bank, topicId } of targets) {
      const levels = new Set(bank.filter((question) => question.topicId === topicId).map((question) => question.difficulty));
      expect(levels, `${topicId}: missing relative difficulty level`).toEqual(new Set([1, 2, 3]));
    }
  });

  it("retains a genuine high-difficulty PAT wave set", () => {
    const hardWaveQuestions = PAT_QUESTIONS.filter((question) => question.topicId === "pat-wave" && question.difficulty === 3);
    expect(hardWaveQuestions).toHaveLength(5);
    expect(hardWaveQuestions.every((question) => question.id.startsWith("pat-wave-cal-"))).toBe(true);
  });
});

describe("TMUA reasoning round two", () => {
  it("adds five medium-to-hard questions to every TMUA topic", () => {
    expect(TMUA_REASONING_ROUND_2).toHaveLength(25);
    for (const topicId of ["tmua-algebra", "tmua-calc", "tmua-stats", "tmua-logic", "tmua-discrete"]) {
      const questions = TMUA_REASONING_ROUND_2.filter((question) => question.topicId === topicId);
      expect(questions, `${topicId}: wrong batch size`).toHaveLength(5);
      expect(questions.every((question) => question.difficulty >= 2)).toBe(true);
    }
  });

  it("keeps the independently checked answer key stable", () => {
    expect(TMUA_REASONING_ROUND_2.map((question) => question.answer).join("")).toBe(
      "CBCDC" + "CCBCC" + "CDBCD" + "CDCCA" + "DCCDD",
    );
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

describe("BMO number theory and geometry short proofs", () => {
  it("adds twelve typed short proofs to each target topic", () => {
    expect(BMO_SHORT_PROOFS).toHaveLength(24);
    expect(BMO_SHORT_PROOFS.filter((q) => q.topicId === "bmo-number")).toHaveLength(12);
    expect(BMO_SHORT_PROOFS.filter((q) => q.topicId === "bmo-geometry")).toHaveLength(12);
  });

  it("keeps every problem within the 4-6 mark bridge range", () => {
    for (const question of BMO_SHORT_PROOFS) {
      expect(question.parts).toHaveLength(1);
      expect(question.totalMarks).toBeGreaterThanOrEqual(4);
      expect(question.totalMarks).toBeLessThanOrEqual(6);
      expect(question.parts[0].marks).toBe(question.totalMarks);
    }
  });

  it("covers all three difficulty levels in both target topics", () => {
    for (const topicId of ["bmo-number", "bmo-geometry"]) {
      const difficulties = BMO_SHORT_PROOFS
        .filter((question) => question.topicId === topicId)
        .map((question) => question.difficulty);
      expect(new Set(difficulties)).toEqual(new Set([1, 2, 3]));
    }
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
