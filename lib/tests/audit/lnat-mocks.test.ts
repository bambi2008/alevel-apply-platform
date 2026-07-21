import { describe, expect, it } from "vitest";
import { getMockPaper } from "../mock-papers";
import { buildLnatMockAudit } from "./lnat-mocks";

describe("LNAT fixed-paper audit", () => {
  it("locks Mock 1 as a complete official-structure Section A paper", () => {
    const paper = getMockPaper("lnat-mock-1");
    expect(paper).toBeTruthy();
    expect(paper!.modules).toHaveLength(1);
    expect(paper!.modules[0].durationSec).toBe(95 * 60);
    expect(paper!.modules[0].questions).toHaveLength(42);

    const report = buildLnatMockAudit();
    const summary = report.papers.find((item) => item.paperId === "lnat-mock-1");
    expect(summary).toEqual({
      paperId: "lnat-mock-1",
      questions: 42,
      passages: 12,
      passageSplit: "3/3/3/3/3/3/4/4/4/4/4/4",
      difficulty: { 1: 8, 2: 24, 3: 10 },
      answerCounts: { A: 9, B: 9, C: 8, D: 8, E: 8 },
    });
    expect(report.issues.filter((issue) => issue.paperId === "lnat-mock-1")).toEqual([]);
  });

  it("keeps three current-format Section B writing papers", () => {
    const report = buildLnatMockAudit();
    expect(report.writtenPapers).toBe(3);
    expect(report.issues.filter((issue) => issue.paperId.startsWith("lnat-written-"))).toEqual([]);
  });
});
