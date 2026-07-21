import { describe, expect, it } from "vitest";
import { TARA_FIXED_PS_PAPERS } from "../mock-papers/tara-fixed-problem-papers";
import { buildTaraMockAudit } from "./tara-mocks";

describe("TARA fixed-paper audit", () => {
  it("locks six objective papers and three writing papers", () => {
    const report = buildTaraMockAudit();
    expect(report.objectivePapers).toBe(6);
    expect(report.writtenPapers).toBe(3);
    expect(report.moduleCount).toBe(12);
    expect(report.questionCount).toBe(264);
  });

  it("keeps the fixed suite at zero critical issues and warnings", () => {
    const report = buildTaraMockAudit();
    expect(report.critical).toBe(0);
    expect(report.warnings).toBe(0);
    expect(report.issues).toEqual([]);
  });

  it("keeps each generated service-selection answer eligible and cheapest", () => {
    for (const questions of TARA_FIXED_PS_PAPERS) {
      const question = questions[1];
      const services = [...question.question.matchAll(/(Aster|Birch|Cedar|Dahlia|Elm): arrives (\d+):(\d+), (\d+) change\(s\), fare £(\d+)/g)]
        .map((match) => ({ label: match[1], minutes: Number(match[2]) * 60 + Number(match[3]), changes: Number(match[4]), fare: Number(match[5]) }))
        .filter((service) => service.minutes <= 9 * 60 + 30 && service.changes <= 1)
        .sort((left, right) => left.fare - right.fare);
      const answerText = question.options.find((option) => option.key === question.answer)?.text;
      expect(services.length).toBeGreaterThan(0);
      expect(answerText).toBe(services[0].label);
    }
  });
});
