import { describe, expect, it } from "vitest";
import { CORE_AREAS, coreAreaForPath, coreAreaTitle } from "./core-navigation";

describe("five-area navigation without route migrations", () => {
  it("shares the owner's five entrance names in both locales", () => {
    expect(CORE_AREAS.map((area) => coreAreaTitle(area, "zh-CN"))).toEqual(["A Level", "竞赛", "大学入学考试", "面试", "文书"]);
    expect(CORE_AREAS.map((area) => coreAreaTitle(area, "en"))).toEqual(["A Level", "Competitions", "University Admissions Tests", "Interviews", "Personal Statements"]);
    expect(new Set(CORE_AREAS.map((area) => area.href)).size).toBe(5);
  });
  it.each(["/tests/bmo", "/en/tests/bpho/practice", "/zh-CN/background/projects/a", "/tests/bmo/paper/bmo1-written-1"])("places %s under competitions", (path) => {
    expect(coreAreaForPath(path)?.key).toBe("competitions");
  });
  it("separates A Level from admissions, including nested and saved-history routes", () => {
    expect(coreAreaForPath("/en/tests/caie9709/history/session")?.key).toBe("alevel");
    expect(coreAreaForPath("/tests/tmua/paper/tmua-mock-1")?.key).toBe("admissions");
    expect(coreAreaForPath("/tests")?.key).toBe("admissions");
    expect(coreAreaForPath("/tests/bmofake")?.key).toBe("admissions");
    expect(coreAreaForPath("/account")).toBeUndefined();
  });
});
