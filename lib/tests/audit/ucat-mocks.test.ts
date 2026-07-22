import { describe, expect, it } from "vitest";
import { UCAT_MOCK_1 } from "@/lib/tests/mock-papers";
import { UCAT_QUESTIONS } from "@/lib/tests/questions/ucat";
import type { MCQQuestion } from "@/lib/tests/questions/types";

describe("UCAT full mock structure", () => {
  const expected = [
    { id: "vr", count: 44, durationSec: 22 * 60 },
    { id: "dm", count: 35, durationSec: 37 * 60 },
    { id: "qr", count: 36, durationSec: 26 * 60 },
    { id: "sjt", count: 69, durationSec: 26 * 60 },
  ];

  it("matches the current four-module question counts and timings", () => {
    expect(UCAT_MOCK_1.modules).toHaveLength(4);
    expected.forEach((spec, index) => {
      const section = UCAT_MOCK_1.modules[index];
      expect(section.id).toBe(spec.id);
      expect(section.questions).toHaveLength(spec.count);
      expect(section.durationSec).toBe(spec.durationSec);
      expect(section.questions.every((question) => question.type === "mcq")).toBe(true);
    });
  });

  it("keeps every question id unique and every answer selectable", () => {
    const questions = UCAT_MOCK_1.modules.flatMap((module) => module.questions) as MCQQuestion[];
    expect(new Set(questions.map((question) => question.id)).size).toBe(184);
    for (const question of questions) {
      expect(question.options.map((option) => option.key)).toContain(question.answer);
      expect(new Set(question.options.map((option) => option.text)).size).toBe(question.options.length);
      expect(question.solution.trim().length).toBeGreaterThan(10);
    }
  });

  it("contains valid two-mark Decision Making matrix items", () => {
    const dm = UCAT_MOCK_1.modules.find((module) => module.id === "dm")!.questions as MCQQuestion[];
    const matrix = dm.filter((question) => question.responseMode === "matrix");
    expect(matrix).toHaveLength(7);
    for (const question of matrix) {
      expect(question.marks).toBe(2);
      expect(question.statements).toHaveLength(5);
      expect(question.matrixAnswer).toHaveLength(5);
      expect(question.matrixAnswer?.every((answer) => answer === "yes" || answer === "no")).toBe(true);
    }
  });

  it("uses adjacent partial credit throughout Situational Judgement", () => {
    const sjt = UCAT_MOCK_1.modules.find((module) => module.id === "sjt")!.questions as MCQQuestion[];
    expect(sjt.every((question) => question.scoringMode === "adjacent")).toBe(true);
    expect(sjt.every((question) => question.options.map((option) => option.key).join("") === "ABCD")).toBe(true);
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
