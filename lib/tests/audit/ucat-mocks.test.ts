import { describe, expect, it } from "vitest";
import { getMockPapersForTest } from "@/lib/tests/mock-papers";
import { UCAT_QUESTIONS } from "@/lib/tests/questions/ucat";
import type { MCQQuestion } from "@/lib/tests/questions/types";

describe("UCAT full mock structure", () => {
  const papers = getMockPapersForTest("ucat");
  const expected = [
    { id: "vr", count: 44, durationSec: 22 * 60 },
    { id: "dm", count: 35, durationSec: 37 * 60 },
    { id: "qr", count: 36, durationSec: 26 * 60 },
    { id: "sjt", count: 69, durationSec: 26 * 60 },
  ];

  it("matches the current four-module question counts and timings", () => {
    expect(papers).toHaveLength(5);
    for (const paper of papers) {
      expect(paper.modules).toHaveLength(4);
      expected.forEach((spec, index) => {
        const section = paper.modules[index];
        expect(section.id).toBe(spec.id);
        expect(section.questions).toHaveLength(spec.count);
        expect(section.durationSec).toBe(spec.durationSec);
        expect(section.questions.every((question) => question.type === "mcq")).toBe(true);
      });
    }
  });

  it("keeps every question id unique and every answer selectable", () => {
    const questions = papers.flatMap((paper) => paper.modules.flatMap((section) => section.questions)) as MCQQuestion[];
    expect(questions).toHaveLength(920);
    expect(new Set(questions.map((question) => question.id)).size).toBe(920);
    expect(new Set(questions.map((question) => question.question.trim().toLowerCase())).size).toBe(920);
    for (const question of questions) {
      expect(question.options.map((option) => option.key)).toContain(question.answer);
      expect(new Set(question.options.map((option) => option.text)).size).toBe(question.options.length);
      expect(question.solution.trim().length).toBeGreaterThan(10);
    }
  });

  it("contains valid two-mark Decision Making matrix items", () => {
    for (const paper of papers) {
      const dm = paper.modules.find((section) => section.id === "dm")!.questions as MCQQuestion[];
      const matrix = dm.filter((question) => question.responseMode === "matrix");
      expect(matrix, paper.id).toHaveLength(7);
      for (const question of matrix) {
        expect(question.marks).toBe(2);
        expect(question.statements).toHaveLength(5);
        expect(question.matrixAnswer).toHaveLength(5);
        expect(question.matrixAnswer?.every((answer) => answer === "yes" || answer === "no")).toBe(true);
      }
    }
  });

  it("uses adjacent partial credit throughout Situational Judgement", () => {
    for (const paper of papers) {
      const sjt = paper.modules.find((section) => section.id === "sjt")!.questions as MCQQuestion[];
      expect(sjt.every((question) => question.scoringMode === "adjacent")).toBe(true);
      expect(sjt.every((question) => question.options.map((option) => option.key).join("") === "ABCD")).toBe(true);
    }
  });

  it("balances answer positions and keeps a real hard-question tail", () => {
    for (const paper of papers) {
      for (const section of paper.modules) {
        const questions = section.questions as MCQQuestion[];
        const hardRate = questions.filter((question) => question.difficulty === 3).length / questions.length;
        expect(hardRate, `${paper.id}/${section.id}`).toBeGreaterThanOrEqual(0.2);
        const singles = questions.filter((question) => question.responseMode !== "matrix");
        const availableKeys = section.id === "vr" ? ["A", "B", "C"] : ["A", "B", "C", "D"];
        const counts = Object.fromEntries(availableKeys.map((key) => [key, singles.filter((question) => question.answer === key).length]));
        for (const key of availableKeys) expect(counts[key], `${paper.id}/${section.id}/${key}`).toBeGreaterThanOrEqual(3);
        expect(Math.max(...Object.values(counts)) / singles.length, `${paper.id}/${section.id} answer skew`).toBeLessThanOrEqual(0.65);
      }
    }
  });

  it("keeps passage and scenario group counts stable", () => {
    for (const paper of papers) {
      const byId = (id: string) => paper.modules.find((section) => section.id === id)!.questions as MCQQuestion[];
      expect(new Set(byId("vr").map((question) => question.context)).size, `${paper.id}/vr`).toBe(11);
      expect(new Set(byId("qr").map((question) => question.context)).size, `${paper.id}/qr`).toBe(9);
      expect(new Set(byId("sjt").map((question) => question.context)).size, `${paper.id}/sjt`).toBe(12);
    }
  });
});

describe("UCAT practice bank", () => {
  it("provides eight immediately gradable questions in every module", () => {
    for (const topicId of ["ucat-vr", "ucat-dm", "ucat-qr", "ucat-sjt"]) {
      const questions = UCAT_QUESTIONS.filter((question) => question.topicId === topicId);
      expect(questions, topicId).toHaveLength(8);
      expect(questions.every((question) => question.responseMode !== "matrix")).toBe(true);
    }
  });
});
