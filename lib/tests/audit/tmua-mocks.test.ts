import { describe, expect, it } from "vitest";
import { buildTmuaMockAudit } from "./tmua-mocks";

describe("TMUA mock-paper audit", () => {
  it("audits all eleven two-paper mocks without structural blockers", () => {
    const report = buildTmuaMockAudit();
    expect(report.paperCount).toBe(11);
    expect(report.questionCount).toBe(440);
    expect(report.critical).toBe(0);
    expect(report.papers.every((paper) => paper.modules.length === 2)).toBe(true);
    expect(report.papers.flatMap((paper) => paper.modules).every((module) => module.questions === 20)).toBe(true);
  });

  it("leaves no quality warnings on the five newly calibrated mocks", () => {
    const report = buildTmuaMockAudit();
    const calibrated = new Set(["tmua-mock-2", "tmua-mock-3", "tmua-mock-5", "tmua-mock-7", "tmua-mock-8"]);
    expect(report.issues.filter((issue) => calibrated.has(issue.paperId))).toEqual([]);
  });

  it("keeps the remaining calibration backlog explicit", () => {
    const report = buildTmuaMockAudit();
    expect(new Set(report.issues.map((issue) => issue.paperId))).toEqual(new Set(["tmua-mock-1", "tmua-mock-4"]));
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ paperId: "tmua-mock-1", code: "PAPER1_TOO_EASY" }),
      expect.objectContaining({ paperId: "tmua-mock-4", code: "ANSWER_POSITION_BIAS" }),
    ]));
  });
});
