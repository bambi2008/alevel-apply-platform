import { describe, it, expect } from "vitest";
import {
  getMockPapersForTest,
  getMockPaper,
  getAllMockQuestions,
} from "@/lib/tests/mock-papers";
import type { MCQQuestion } from "@/lib/tests/questions/types";
import { getCountedResults } from "./scoring";

describe("mock papers", () => {
  it("ESAT has 10 mock papers", () => {
    expect(getMockPapersForTest("esat").length).toBe(10);
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

  it("mock question ids are unique", () => {
    const ids = getAllMockQuestions().map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every fixed paper keeps test ownership and valid written marks", () => {
    for (const testId of ["mat", "pat", "step", "bmo", "bpho"]) {
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
});
