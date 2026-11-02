import { describe, expect, it } from "vitest";
import { getMockPaper } from "../mock-papers";
import { getMockPapersForTest } from "../mock-papers";
import { LNAT_QUESTIONS } from "../questions/lnat";
import { buildLnatMockAudit } from "./lnat-mocks";
import type { MCQQuestion } from "../questions/types";
import { calibrationSourceId } from "../difficulty-calibration";

describe("LNAT fixed-paper audit", () => {
  it("locks original and released Section A structure with separate difficulty versions", () => {
    const paper = getMockPaper("lnat-mock-1");
    expect(paper).toBeTruthy();
    expect(paper!.modules).toHaveLength(1);
    expect(paper!.modules[0].durationSec).toBe(95 * 60);
    expect(paper!.modules[0].questions).toHaveLength(42);

    const report = buildLnatMockAudit();
    const summary = report.papers.find((item) => calibrationSourceId(item.paperId) === "lnat-mock-1");
    expect([1,2,3].map(level => paper!.modules[0].questions.filter(q=>q.difficulty===level).length)).toEqual([8,24,10]);
    expect(summary).toEqual({
      paperId: "lnat-mock-1-cal20261026",
      questions: 42,
      passages: 12,
      passageSplit: "3/3/3/3/3/3/4/4/4/4/4/4",
      difficulty: { 1: 5, 2: 28, 3: 9 },
      answerCounts: { A: 11, B: 11, C: 10, D: 10 },
      passageWords: { min: 55, average: 134, max: 178 },
      questionTypes: { core: 4, interpretation: 26, evaluation: 12 },
    });
    expect(paper!.modules[0].questions.every((question) => question.type !== "mcq" || question.options.map((option) => option.key).join("") === "ABCD")).toBe(true);
    expect(report.issues.filter((issue) => issue.paperId === summary!.paperId)).toEqual([]);
  });

  it("keeps three current-format Section B writing papers", () => {
    const report = buildLnatMockAudit();
    expect(report.writtenPapers).toBe(3);
    expect(report.issues.filter((issue) => issue.paperId.startsWith("lnat-written-"))).toEqual([]);
  });

  it("exposes only current four-option MCQs in practice and fixed papers", () => {
    const practiceMcqs = LNAT_QUESTIONS.filter((question): question is MCQQuestion => question.type === "mcq");
    const fixedMcqs = getMockPapersForTest("lnat")
      .flatMap((paper) => paper.modules.flatMap((module) => module.questions))
      .filter((question): question is MCQQuestion => question.type === "mcq");

    expect(practiceMcqs).toHaveLength(31);

    for (const question of [...practiceMcqs, ...fixedMcqs]) {
      expect(question.options.map((option) => option.key).join(""), question.id).toBe("ABCD");
      expect(question.options.some((option) => option.key === question.answer), question.id).toBe(true);
    }
  });

  it("seals all five full papers without audit findings", () => {
    const report = buildLnatMockAudit();
    expect(report.objectivePapers).toBe(5);
    expect(report.questionCount).toBe(210);
    expect(report.practiceQuestions).toBe(31);
    expect(report.critical).toBe(0);
    expect(report.warnings).toBe(0);
  });
});
