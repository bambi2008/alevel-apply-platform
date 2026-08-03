import { describe, expect, it } from "vitest";
import { getQuantitativeDrills, QUANTITATIVE_INTERVIEW_DRILLS, scoreQuantitativeResponse } from "./quantitative-interview";
import { getQuantitativeInterviewPapers } from "./quantitative-interview-papers";

describe("quantitative interview drills", () => {
  it("keeps every drill timed, follow-up based, and linked to a supported subject", () => {
    expect(QUANTITATIVE_INTERVIEW_DRILLS).toHaveLength(30);
    for (const drill of QUANTITATIVE_INTERVIEW_DRILLS) {
      expect(drill.timeLimitSec).toBeGreaterThan(0);
      expect(drill.followUpSec).toBeGreaterThan(0);
      expect(drill.followUp).not.toBe("");
      expect(drill.checkpoints.length).toBeGreaterThanOrEqual(4);
      expect(drill.subjectIds.length).toBeGreaterThan(0);
    }
  });

  it("filters drills by subject", () => {
    expect(getQuantitativeDrills("maths").length).toBeGreaterThanOrEqual(3);
    expect(getQuantitativeDrills("humanities")).toHaveLength(0);
  });

  it("builds three complete papers for every quantitative subject", () => {
    for (const subject of ["maths", "physics", "engineering", "chemistry", "biology", "economics", "compsci"]) {
      const papers = getQuantitativeInterviewPapers(subject);
      expect(papers).toHaveLength(3);
      expect(papers.every((paper) => paper.tasks.length > 0)).toBe(true);
      expect(papers.every((paper) => paper.tasks.length === 3)).toBe(true);
    }
  });

  it("makes the scoring rubric reward a complete calculation and defence", () => {
    const drill = QUANTITATIVE_INTERVIEW_DRILLS[1];
    const result = scoreQuantitativeResponse(
      drill,
      "我先设 a_n，近似并忽略小项。展开平方差得到 a_n^2 = 2n，单位和量级检查后结果合理。",
      "如果改成 c，我会重新代入，增长常数取决于 c，并检查边界。",
    );
    expect(result.total).toBeGreaterThanOrEqual(5);
    expect(result.band).toContain("高压");
  });
});
