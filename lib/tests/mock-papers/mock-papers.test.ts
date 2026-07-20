import { describe, it, expect } from "vitest";
import {
  getMockPapersForTest,
  getMockPaper,
  getAllMockQuestions,
} from "@/lib/tests/mock-papers";
import type { MCQQuestion } from "@/lib/tests/questions/types";
import { getCountedResults } from "./scoring";

describe("mock papers", () => {
  it("ESAT has ten general papers and three specification-completion modules", () => {
    expect(getMockPapersForTest("esat").length).toBe(13);
  });

  it("getMockPaper resolves known ids and rejects unknown", () => {
    expect(getMockPaper("esat-mock-1")).toBeTruthy();
    expect(getMockPaper("does-not-exist")).toBeUndefined();
  });

  it("every paper has modules with timed questions", () => {
    for (const p of getMockPapersForTest("esat")) {
      expect(p.modules.length, `${p.id}: no modules`).toBeGreaterThan(0);
      for (const m of p.modules) {
        expect(m.questions.length, `${p.id}/${m.id}: no questions`).toBeGreaterThan(0);
        expect(m.durationSec, `${p.id}/${m.id}: no duration`).toBeGreaterThan(0);
      }
    }
  });

  it("every mock question has answer among options", () => {
    for (const q of getAllMockQuestions().filter((question): question is MCQQuestion => question.type === "mcq")) {
      const keys = q.options.map((o) => o.key);
      expect(keys, `${q.id}: answer not in options`).toContain(q.answer);
    }
  });

  it("offers three current-format ESAT science completion modules", () => {
    const papers = getMockPapersForTest("esat").filter((paper) => paper.id.startsWith("esat-gap-"));
    expect(papers).toHaveLength(3);
    for (const paper of papers) {
      expect(paper.formatType).toBe("current");
      expect(paper.modules).toHaveLength(1);
      expect(paper.modules[0].durationSec).toBe(40 * 60);
      expect(paper.modules[0].questions).toHaveLength(27);
      expect(paper.modules[0].questions.every((question) => question.type === "mcq")).toBe(true);
    }
  });

  it("mock question ids are unique", () => {
    const ids = getAllMockQuestions().map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("offers one official-structure TMUA calibration paper with variable option counts", () => {
    const paper = getMockPaper("tmua-calibration-1");
    expect(paper).toBeTruthy();
    expect(paper!.formatType).toBe("current");
    expect(paper!.modules).toHaveLength(2);
    expect(paper!.modules.map((module) => module.durationSec)).toEqual([75 * 60, 75 * 60]);
    expect(paper!.modules.map((module) => module.questions.length)).toEqual([20, 20]);

    const [paper1, paper2] = paper!.modules.map((module) => module.questions as MCQQuestion[]);
    expect([1, 2, 3].map((level) => paper1.filter((q) => q.difficulty === level).length)).toEqual([2, 12, 6]);
    expect([1, 2, 3].map((level) => paper2.filter((q) => q.difficulty === level).length)).toEqual([1, 10, 9]);
    expect(new Set([...paper1, ...paper2].map((q) => q.options.length))).toEqual(new Set([5, 6, 7, 8]));
    expect(paper1.map((q) => q.answer).join("")).toBe("CBEDDCDBBECDCCCBCDBD");
    expect(paper2.map((q) => q.answer).join("")).toBe("CCBBBABACGFECDAABBGH");

    for (const question of [...paper1, ...paper2]) {
      const keys = question.options.map((option) => option.key).join("");
      expect(keys, `${question.id}: non-sequential option keys`).toBe("ABCDEFGH".slice(0, question.options.length));
    }
  });

  it("upgrades three weak TMUA mocks with calibrated medium-to-hard endings", () => {
    const targets = [
      { id: "tmua-mock-6", paper1Replacements: 8, paper2Replacements: 8, p1Hard: 6, p2Hard: 8 },
      { id: "tmua-mock-9", paper1Replacements: 8, paper2Replacements: 8, p1Hard: 7, p2Hard: 9 },
      { id: "tmua-mock-10", paper1Replacements: 8, paper2Replacements: 10, p1Hard: 6, p2Hard: 8 },
    ];

    for (const target of targets) {
      const paper = getMockPaper(target.id)!;
      expect(paper.modules.map((module) => module.questions.length)).toEqual([20, 20]);
      const [paper1, paper2] = paper.modules.map((module) => module.questions as MCQQuestion[]);
      const p1Tail = paper1.slice(-target.paper1Replacements);
      const p2Tail = paper2.slice(-target.paper2Replacements);

      expect(p1Tail.every((question) => question.id.includes("-cal-"))).toBe(true);
      expect(p2Tail.every((question) => question.id.includes("-cal-"))).toBe(true);
      expect(paper1.filter((question) => question.difficulty === 3)).toHaveLength(target.p1Hard);
      expect(paper2.filter((question) => question.difficulty === 3)).toHaveLength(target.p2Hard);
      expect(Math.max(...[...paper1, ...paper2].map((question) => question.options.length))).toBe(8);
      const answerPositions = new Set(p2Tail.map((question) => question.answer));
      for (const answer of ["F", "G", "H"]) expect(answerPositions).toContain(answer);

      for (const question of [...p1Tail, ...p2Tail]) {
        expect(question.options.map((option) => option.key).join(""))
          .toBe("ABCDEFGH".slice(0, question.options.length));
      }
    }
  });

  it("every fixed paper keeps test ownership and valid written marks", () => {
    for (const testId of ["mat", "pat", "step", "bmo", "bpho", "lnat", "tara"]) {
      for (const paper of getMockPapersForTest(testId)) {
        const questions = paper.modules.flatMap((module) => module.questions);
        expect(questions.every((question) => question.testId === testId), `${paper.id}: wrong testId`).toBe(true);
        for (const question of questions) {
          if (question.type !== "long") continue;
          expect(question.parts.length, `${question.id}: no parts`).toBeGreaterThan(0);
          expect(
            question.parts.reduce((sum, part) => sum + part.marks, 0),
            `${question.id}: part marks do not match total`
          ).toBe(question.totalMarks);
          expect(question.fullSolution.trim(), `${question.id}: missing solution`).not.toBe("");
        }
        if (paper.bestQuestionCount) {
          expect(paper.bestQuestionCount).toBeLessThanOrEqual(questions.length);
        }
      }
    }
  });

  it("offers three fixed BMO1 written papers with official paper structure", () => {
    const papers = getMockPapersForTest("bmo").filter((paper) => paper.id.startsWith("bmo1-written-"));
    expect(papers).toHaveLength(3);

    for (const paper of papers) {
      const questions = paper.modules.flatMap((module) => module.questions);
      expect(paper.modules).toHaveLength(1);
      expect(paper.modules[0].durationSec).toBe(210 * 60);
      expect(questions).toHaveLength(6);
      expect(questions.every((question) => question.type === "long")).toBe(true);
      expect(questions.reduce((sum, question) => sum + (question.type === "long" ? question.totalMarks : 0), 0)).toBe(60);
      expect(new Set(questions.map((question) => question.topicId))).toEqual(
        new Set(["bmo-number", "bmo-algebra", "bmo-geometry", "bmo-combinatorics"])
      );
    }
  });

  it("offers three fixed BPhO written papers with balanced 100-mark structure", () => {
    const papers = getMockPapersForTest("bpho").filter((paper) => paper.id.startsWith("bpho-written-"));
    expect(papers).toHaveLength(3);

    for (const paper of papers) {
      expect(paper.modules).toHaveLength(2);
      expect(paper.modules.map((module) => module.durationSec)).toEqual([80 * 60, 80 * 60]);

      const [section1, section2] = paper.modules;
      expect(section1.questions).toHaveLength(13);
      expect(section2.questions).toHaveLength(2);
      expect([...section1.questions, ...section2.questions].every((question) => question.type === "long")).toBe(true);
      expect(section1.questions.reduce((sum, question) => sum + (question.type === "long" ? question.totalMarks : 0), 0)).toBe(50);
      expect(section2.questions.reduce((sum, question) => sum + (question.type === "long" ? question.totalMarks : 0), 0)).toBe(50);
      expect(new Set(section1.questions.map((question) => question.topicId))).toEqual(
        new Set(["bpho-mechanics", "bpho-waves", "bpho-em", "bpho-thermal", "bpho-modern"])
      );
    }
  });

  it("offers five MAT 2025 typed-response sets", () => {
    const papers = getMockPapersForTest("mat").filter((paper) => paper.id.startsWith("mat-written-"));
    expect(papers).toHaveLength(5);
    for (const paper of papers) {
      const questions = paper.modules.flatMap((module) => module.questions);
      expect(paper.modules).toHaveLength(1);
      expect(paper.modules[0].durationSec).toBe(45 * 60);
      expect(questions).toHaveLength(2);
      expect(questions.every((question) => question.type === "long")).toBe(true);
      expect(questions.reduce((sum, question) => sum + (question.type === "long" ? question.totalMarks : 0), 0)).toBe(30);
      expect(paper.formatType).toBe("legacy");
    }
  });

  it("offers three balanced PAT written extension papers without claiming official format", () => {
    const papers = getMockPapersForTest("pat").filter((paper) => paper.id.startsWith("pat-written-extension-"));
    expect(papers).toHaveLength(3);
    for (const paper of papers) {
      const questions = paper.modules.flatMap((module) => module.questions);
      expect(paper.description).toContain("非官方");
      expect(questions).toHaveLength(12);
      expect(questions.every((question) => question.type === "long")).toBe(true);
      expect(new Set(questions.map((question) => question.topicId))).toEqual(new Set([
        "pat-mech", "pat-em", "pat-wave", "pat-thermo", "pat-modern", "pat-math",
      ]));
      expect(paper.formatType).toBe("extension");
    }
  });

  it("offers two STEP 2 papers and two STEP 3 papers with best-six scoring", () => {
    const papers = getMockPapersForTest("step").filter((paper) => paper.id.includes("-written-"));
    expect(papers).toHaveLength(4);
    expect(papers.filter((paper) => paper.id.startsWith("step2-"))).toHaveLength(2);
    expect(papers.filter((paper) => paper.id.startsWith("step3-"))).toHaveLength(2);

    for (const paper of papers) {
      const questions = paper.modules.flatMap((module) => module.questions);
      expect(paper.modules).toHaveLength(1);
      expect(paper.modules[0].durationSec).toBe(180 * 60);
      expect(paper.bestQuestionCount).toBe(6);
      expect(paper.formatType).toBe("current");
      expect(questions).toHaveLength(12);
      expect(questions.filter((question) => question.topicId.startsWith("step-pure"))).toHaveLength(8);
      expect(questions.filter((question) => question.topicId === "step-mech")).toHaveLength(2);
      expect(questions.filter((question) => question.topicId === "step-stats")).toHaveLength(2);
      expect(questions.reduce((sum, question) => sum + (question.type === "long" ? question.totalMarks : 0), 0)).toBe(240);
    }
  });

  it("counts only the six strongest STEP answers", () => {
    const results = [3, 18, 7, 12, 20, 5, 15, 9].map((earned) => ({
      grading: { totalEarned: earned, totalMax: 20 },
    }));
    const counted = getCountedResults(results, 6);
    expect(counted.map((result) => result.grading.totalEarned)).toEqual([20, 18, 15, 12, 9, 7]);
    expect(counted.reduce((sum, result) => sum + result.grading.totalEarned, 0)).toBe(81);
  });

  it("keeps the calibrated STEP 3 paper 2 options at extended-response difficulty", () => {
    const paper = getMockPaper("step3-written-2");
    expect(paper).toBeTruthy();
    const finalFour = paper!.modules[0].questions.slice(-4);
    expect(finalFour).toHaveLength(4);
    expect(finalFour.map((question) => question.topicId)).toEqual([
      "step-mech", "step-mech", "step-stats", "step-stats",
    ]);
    for (const question of finalFour) {
      expect(question.type).toBe("long");
      expect(question.difficulty).toBe(3);
      if (question.type === "long") {
        expect(question.totalMarks).toBe(20);
        expect(question.parts.length).toBeGreaterThanOrEqual(4);
      }
    }
  });

  it.each([
    { testId: "lnat", prefix: "lnat-written-" },
    { testId: "tara", prefix: "tara-written-" },
  ])("offers three fixed $testId writing papers with three-option tasks", ({ testId, prefix }) => {
    const papers = getMockPapersForTest(testId).filter((paper) => paper.id.startsWith(prefix));
    expect(papers).toHaveLength(3);

    for (const paper of papers) {
      expect(paper.formatType).toBe("current");
      expect(paper.modules).toHaveLength(1);
      expect(paper.modules[0].durationSec).toBe(40 * 60);
      expect(paper.modules[0].questions).toHaveLength(1);

      const question = paper.modules[0].questions[0];
      expect(question.type).toBe("long");
      if (question.type === "long") {
        expect(question.responseKind).toBe("essay");
        expect(question.essayPrompts).toHaveLength(3);
        expect(question.maxWords).toBe(750);
        expect(question.rubricDimensions?.reduce((sum, item) => sum + item.maxMarks, 0)).toBe(20);
      }
    }
  });
});
