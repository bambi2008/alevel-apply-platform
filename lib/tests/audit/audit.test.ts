import { describe, expect, it } from "vitest";
import { buildQuestionBankAudit } from "./index";
import { calibrateQuestionDifficulty } from "./calibration";

describe("question bank audit", () => {
  it("inventories every supported test without structural blockers", () => {
    const report = buildQuestionBankAudit();
    expect(report.totals.tests).toBe(9);
    expect(report.totals.questions).toBe(2352);
    expect(report.totals.mockPapers).toBe(94);
    expect(report.totals.topicsCovered).toBe(55);
    expect(report.totals.topicsTotal).toBe(62);
    expect(report.totals.critical).toBe(0);
    expect(report.totals.warning).toBe(22);
  });

  it("tracks remaining written-format gaps without flagging completed paper sets", () => {
    const report = buildQuestionBankAudit();
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "TEST_DIFFICULTY_SKEW", testId: "lnat", severity: "warning" }),
    ]));
    expect(report.issues).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "MISSING_FIXED_WRITTEN_PAPER", testId: "mat" }),
      expect.objectContaining({ code: "MISSING_FIXED_WRITTEN_PAPER", testId: "pat" }),
      expect.objectContaining({ code: "MISSING_FIXED_WRITTEN_PAPER", testId: "step" }),
      expect.objectContaining({ code: "MISSING_WRITTEN_PRACTICE", testId: "pat" }),
      expect.objectContaining({ code: "MISSING_FIXED_WRITTEN_PAPER", testId: "lnat" }),
      expect.objectContaining({ code: "MISSING_FIXED_WRITTEN_PAPER", testId: "tara" }),
      expect.objectContaining({ code: "MISSING_WRITTEN_PRACTICE", testId: "lnat" }),
      expect.objectContaining({ code: "MISSING_WRITTEN_PRACTICE", testId: "tara" }),
      expect.objectContaining({ code: "DUPLICATE_PROMPT", testId: "lnat" }),
      expect.objectContaining({ code: "DUPLICATE_PROMPT", testId: "tara" }),
      expect.objectContaining({ code: "TOPIC_IMBALANCE", testId: "lnat" }),
      expect.objectContaining({ code: "TOPIC_IMBALANCE", testId: "tara" }),
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
    expect(rows.find((row) => row.questionId === "bmo-sp-ge-012")?.status).toBe("harder-than-label");
    expect(rows.find((row) => row.questionId === "bmo-sp-nt-005")?.status).toBe("insufficient");
  });
});
