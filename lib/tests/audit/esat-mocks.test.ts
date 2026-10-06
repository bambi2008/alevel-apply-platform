import { describe, expect, it } from "vitest";
import { buildEsatMockAudit } from "./esat-mocks";

describe("ESAT mock-paper audit", () => {
  it("locks six three-module combinations and removes former mixed/gap full-mock claims", () => {
    const report = buildEsatMockAudit();
    expect(report.paperCount).toBe(6);
    expect(report.completePaperCount).toBe(6);
    expect(report.gapPaperCount).toBe(0);
    expect(report.intensificationPaperCount).toBe(0);
    expect(report.moduleCount).toBe(18);
    expect(report.questionCount).toBe(486);
    expect(report.subjectModules).toEqual({ math: 9, physics: 3, chemistry: 3, biology: 3 });
  });

  it("keeps structure valid and records limited reuse/difficulty without inflated labels", () => {
    const report = buildEsatMockAudit();
    expect(report.critical).toBe(0);
    expect(report.warnings).toBeGreaterThan(0);
    expect(report.issues.filter(i=>i.severity==="critical")).toEqual([]);
    expect(report.issues.map(i=>i.code)).toContain("REUSED_MODULE_BANKS");
    expect(report.issues.map(i=>i.code)).toContain("TOO_FEW_HARD");
    expect(report.issues.map(i=>i.code)).not.toContain("ANSWER_POSITION_BIAS");
    expect(report.modules.every((module) => module.questions === 27)).toBe(true);
    expect(report.modules.every((module) => Object.values(module.answerCounts).sort().join(",") === "5,5,5,6,6")).toBe(true);
  });
});
