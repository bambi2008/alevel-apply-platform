import { describe, expect, it } from "vitest";
import { getMockPapersForTest } from "../mock-papers";
import { reviewedDifficultyContract } from "./reviewed-difficulty";
describe("frozen reviewed difficulty contract", () => {
  it("accepts only exact reviewed current papers", () => {
    for (const testId of ["lnat","tara","ucat"]) for (const paper of getMockPapersForTest(testId)) expect(reviewedDifficultyContract(paper),paper.id).toBe("reviewed");
  });
  it("rejects altered difficulty, content, marks and invented approved versions", () => {
    const paper=getMockPapersForTest("ucat")[0];
    for (const field of ["difficulty","question","marks"] as const) {
      const copy=structuredClone(paper),question=copy.modules[0].questions[0];
      if(question.type!=="mcq") throw Error("Expected objective fixture");
      if(field==="difficulty") question.difficulty=question.difficulty===3 ? 1 : 3;
      else if(field==="question") question.question+=" changed";
      else question.marks++;
      expect(reviewedDifficultyContract(copy)).toBe("drift");
    }
    expect(reviewedDifficultyContract({...paper,id:"unknown-cal20261026"})).toBe("drift");
    expect(reviewedDifficultyContract({...paper,id:"unreviewed-legacy"})).toBe("legacy");
  });
});
