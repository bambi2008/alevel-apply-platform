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

  it("keeps duplicate prompts blocked while recording remaining quality warnings", () => {
    const report = buildTmuaMockAudit();
    expect(report.issues.filter(i=>i.severity==="critical")).toEqual([]);
    expect(report.issues.every(i=>["PAPER1_TOO_EASY","PAPER2_TOO_EASY","ANSWER_POSITION_BIAS","NO_EXTENDED_OPTIONS","DIRECT_LOGIC_OVERUSE"].includes(i.code))).toBe(true);
    expect(report.warnings).toBe(report.issues.filter(i=>i.severity==="warning").length);
  });
});
