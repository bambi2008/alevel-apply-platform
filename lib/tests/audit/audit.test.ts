import { describe, expect, it } from "vitest";
import { buildQuestionBankAudit } from "./index";
import { calibrateQuestionDifficulty } from "./calibration";

describe("question bank audit", () => {
  it("inventories every supported test without structural blockers", () => {
    const report = buildQuestionBankAudit();
    expect(report.totals.tests).toBe(9);
    expect(report.totals.questions).toBe(2632);
    expect(report.totals.mockPapers).toBe(98);
    expect(report.totals.topicsCovered).toBe(64);
    expect(report.totals.topicsTotal).toBe(64);
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
});
