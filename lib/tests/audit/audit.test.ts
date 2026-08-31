import { describe, expect, it } from "vitest";
import { buildQuestionBankAudit } from "./index";
import { buildDetailedQuestionCalibrations, calibrateQuestionDifficulty } from "./calibration";
import { findSemanticRisks } from "./semantic";
import { findTeachingRisks } from "./teaching";
import type { MCQQuestion } from "@/lib/tests/questions/types";

describe("question bank audit", () => {
  it("inventories every supported test without structural blockers", () => {
    const report = buildQuestionBankAudit();
    expect(report.totals.tests).toBe(13);
    expect(report.totals.questions).toBe(2766);
    expect(report.totals.mockPapers).toBe(130);
    expect(report.totals.topicsCovered).toBe(86);
    expect(report.totals.topicsTotal).toBe(86);
    expect(report.totals.critical).toBe(0);
    expect(report.totals.warning).toBe(3);
  });

  it("keeps structural blockers at zero and explicitly records uncalibrated CAIE difficulty gaps", () => {
    const report = buildQuestionBankAudit();
    // Do not relabel routine questions as hard just to force zero warnings.
    // R2 preserves these visible warnings until genuine difficulty calibration exists.
    expect(report.issues.filter((issue) => issue.severity !== "info").map(({ code, severity, testId, topicId }) => ({ code, severity, testId, topicId })))
      .toEqual(["caie9709-log-exp", "caie9709-numerical", "caie9709-vectors"].map(topicId => ({
        code: "MISSING_DIFFICULTY_LEVEL", severity: "warning", testId: "caie9709", topicId,
      })));
  });

  it("tracks complete ESAT topic coverage without empty science modules", () => {
    const report = buildQuestionBankAudit();
    const esat = report.tests.find((test) => test.id === "esat");
    expect(esat?.topicsCovered).toBe(21);
    expect(esat?.topicsTotal).toBe(21);
    expect(report.issues).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "EMPTY_TOPIC", testId: "esat" }),
    ]));
  });
});

describe("difficulty calibration", () => {
  it("compares observed score rates with labelled difficulty bands", () => {
    const rows = calibrateQuestionDifficulty([
      { questionId: "bmo-sp-nt-001", attempts: 12, earned: 47, max: 48 },
      { questionId: "bmo-sp-ge-012", attempts: 12, earned: 7, max: 72 },
      { questionId: "bmo-sp-nt-005", attempts: 4, earned: 10, max: 20 },
    ]);
    expect(rows.find((row) => row.questionId === "bmo-sp-nt-001")?.status).toBe("easier-than-label");
    expect(rows.find((row) => row.questionId === "bmo-sp-nt-001")?.suggestedDifficulty).toBe(1);
    expect(rows.find((row) => row.questionId === "bmo-sp-ge-012")?.status).toBe("harder-than-label");
    expect(rows.find((row) => row.questionId === "bmo-sp-ge-012")?.suggestedDifficulty).toBe(3);
    expect(rows.find((row) => row.questionId === "bmo-sp-nt-005")?.status).toBe("insufficient");
    expect(rows.find((row) => row.questionId === "bmo-sp-nt-005")?.suggestedDifficulty).toBe(2);
  });

  it("gates decisions by attempts and unique students and exposes behaviour metrics", () => {
    const observations = Array.from({ length: 30 }, (_, index) => ({
      questionId: "bmo-sp-nt-001",
      sessionId: `session-${index}`,
      studentId: `student-${index % 20}`,
      selected: undefined,
      earned: 4,
      max: 4,
      timeSpentSec: 45 + index,
      answerChanges: index % 3 === 0 ? 1 : 0,
      visits: 1,
      flagged: index % 5 === 0,
      sessionScoreRate: index / 30,
    }));
    const row = buildDetailedQuestionCalibrations(observations)[0];
    expect(row.status).toBe("easier-than-label");
    expect(row.uniqueStudents).toBe(20);
    expect(row.telemetryCoverage).toBe(1);
    expect(row.changeRate).toBeCloseTo(1 / 3);
    expect(row.flagRate).toBeCloseTo(0.2);
    expect(row.scoreInterval[0]).toBeGreaterThan(0.8);
  });
});

describe("semantic question audit", () => {
  const base: Omit<MCQQuestion, "solution"> = {
    id: "semantic-fixture",
    type: "mcq" as const,
    testId: "mat",
    topicId: "mat-poly",
    difficulty: 2 as const,
    marks: 1,
    question: "What is 2 + 2?",
    options: [
      { key: "A", text: "4" },
      { key: "B", text: "5" },
    ],
    answer: "A",
  };

  it("rejects ambiguous or conflicting answer commentary", () => {
    expect(findSemanticRisks({ ...base, solution: "Both A and B are correct." }).map((risk) => risk.code))
      .toContain("AMBIGUOUS_CORRECT_OPTION");
    expect(findSemanticRisks({ ...base, solution: "The computed value is 4. Closest answer: 5." }).map((risk) => risk.code))
      .toContain("ANSWER_SOLUTION_CONFLICT");
  });

  it("flags unfinished self-correction prose", () => {
    expect(findSemanticRisks({ ...base, solution: "Hmm, let me recompute this." }).map((risk) => risk.code))
      .toContain("DRAFT_REASONING");
  });
});

describe("teaching quality audit", () => {
  it("requires complete distractor explanations once authored review is enabled", () => {
    const risks = findTeachingRisks({
      id: "teaching-fixture",
      type: "mcq",
      testId: "mat",
      topicId: "mat-poly",
      difficulty: 1,
      marks: 1,
      question: "What is 2 + 2?",
      options: [{ key: "A", text: "4" }, { key: "B", text: "5" }],
      answer: "A",
      solution: "Adding gives 4.",
      optionExplanations: { A: "Correct because 2+2=4." },
    });
    expect(risks.map((risk) => risk.code)).toContain("INCOMPLETE_OPTION_EXPLANATIONS");
  });
});
