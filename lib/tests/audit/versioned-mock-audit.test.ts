import { describe, expect, it } from "vitest";
import { buildLnatMockAudit } from "./lnat-mocks";
import { buildTaraMockAudit } from "./tara-mocks";
describe("structural audit follows the approved versioned registry", () => {
  it("does not silently skip calibrated LNAT papers", () => {
    const report=buildLnatMockAudit();
    expect(report.objectivePapers).toBe(5);
    expect(report.questionCount).toBe(210);
    expect(report.critical).toBe(0);
    expect(report.papers.every(p=>p.paperId.includes("-cal20261026"))).toBe(true);
    expect(report.issues).toEqual([]);
  });
  it("resolves current TARA IDs to the original fixed skill mapping", () => {
    const report=buildTaraMockAudit();
    expect(report.objectivePapers).toBe(6);
    expect(report.questionCount).toBe(264);
    expect(report.critical).toBe(0);
    for(const section of report.modules.filter(m=>m.moduleId==="ps")) expect(section.problemSkills).toEqual({"relevant-selection":5,"finding-procedures":12,"identifying-similarity":5});
    expect(report.issues).toEqual([]);
  });
});
