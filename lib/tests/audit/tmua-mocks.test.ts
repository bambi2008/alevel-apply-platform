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

  it("keeps the sealed eleven-paper suite free of quality warnings", () => {
    const report = buildTmuaMockAudit();
    expect(report.warnings).toBe(0);
    expect(report.issues).toEqual([]);
    expect(report.papers.every((paper) => paper.issueCount === 0)).toBe(true);
  });
});
