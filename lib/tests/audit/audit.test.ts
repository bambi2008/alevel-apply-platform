import { describe, expect, it } from "vitest";
import { buildQuestionBankAudit } from "./index";
import { buildDetailedQuestionCalibrations, calibrateQuestionDifficulty } from "./calibration";

describe("question bank audit", () => {
  it("inventories every supported test without structural blockers", () => {
    const report = buildQuestionBankAudit();
    expect(report.totals.tests).toBe(10);
    expect(report.totals.questions).toBe(2540);
    expect(report.totals.mockPapers).toBe(102);
    expect(report.totals.topicsCovered).toBe(68);
    expect(report.totals.topicsTotal).toBe(68);
    expect(report.totals.critical).toBe(0);
    expect(report.totals.warning).toBe(0);
  });

  it("keeps the supported question banks free of audit findings", () => {
    const report = buildQuestionBankAudit();
    expect(report.issues.filter((issue) => issue.severity !== "info")).toEqual([]);
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
