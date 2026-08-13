import { describe, expect, it } from "vitest";
import { analyzePortfolio, categoryRank } from "./analyze";

describe("portfolio analysis", () => {
  it("recognizes a balanced UK and HK portfolio", () => {
    const result = analyzePortfolio([
      { category: "reach", region: "UK", universityId: "cam" },
      { category: "match", region: "UK", universityId: "warwick" },
      { category: "safety", region: "HK", universityId: "cityu" },
    ]);
    expect(result).toMatchObject({ score: 100, balanced: true });
    expect(result.issues).toEqual([]);
  });

  it("flags UCAS overflow, concentration and an aggressive mix", () => {
    const result = analyzePortfolio(Array.from({ length: 6 }, (_, index) => ({ category: "reach" as const, region: "UK" as const, universityId: index < 3 ? "same" : `u${index}` })), ["UK"]);
    expect(result.issues.map((issue) => issue.code)).toEqual(expect.arrayContaining(["UCAS_LIMIT", "NO_SAFETY", "NO_MATCH", "TOO_AGGRESSIVE", "CONCENTRATION"]));
    expect(result.score).toBeLessThan(40);
  });

  it("orders recommendations with matches first", () => {
    expect(["reach", "safety", "match"].sort((a, b) => categoryRank(a as never) - categoryRank(b as never))).toEqual(["match", "safety", "reach"]);
  });
});
