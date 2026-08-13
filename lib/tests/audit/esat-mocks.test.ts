import { describe, expect, it } from "vitest";
import { buildEsatMockAudit } from "./esat-mocks";

describe("ESAT mock-paper audit", () => {
  it("locks the ten complete papers, three gap modules and two maths intensification papers", () => {
    const report = buildEsatMockAudit();
    expect(report.paperCount).toBe(15);
    expect(report.completePaperCount).toBe(10);
    expect(report.gapPaperCount).toBe(3);
    expect(report.intensificationPaperCount).toBe(2);
    expect(report.moduleCount).toBe(25);
    expect(report.questionCount).toBe(675);
    expect(report.subjectModules).toEqual({ math: 11, physics: 8, chemistry: 3, biology: 3 });
  });

  it("keeps every module structurally valid and calibrated", () => {
    const report = buildEsatMockAudit();
    expect(report.critical).toBe(0);
    expect(report.warnings).toBe(0);
    expect(report.issues).toEqual([]);
    expect(report.modules.every((module) => module.questions === 27)).toBe(true);
    expect(report.modules.every((module) => module.difficulty[3] >= 4)).toBe(true);
    expect(report.modules.every((module) => Object.values(module.answerCounts).sort().join(",") === "5,5,5,6,6")).toBe(true);
  });
});
