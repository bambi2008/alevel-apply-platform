import { describe, expect, it } from "vitest";
import type { UserProfile } from "@/lib/profile/store";
import { ADMISSIONS_TESTS, getTestPurpose } from "./index";
import { filterTestsForIntent } from "./intent-filter";

function visibleIds(overrides: Partial<UserProfile>): string[] {
  const profile: UserProfile = {
    targetRegions: ["UK"],
    intendedUniversities: [],
    intendedMajors: [],
    subjects: [],
    ...overrides,
  };
  return filterTestsForIntent(
    ADMISSIONS_TESTS.filter((test) => getTestPurpose(test) !== "competition"),
    profile,
  ).map((test) => test.id);
}

describe("intent-driven exam visibility", () => {
  it.each([
    "Aerospace Engineering",
    "Aeronautical Engineering",
    "航空航天工程",
    "机械工程",
  ])("retains CAIE 9709 for engineering intent: %s", (major) => {
    const ids = visibleIds({ intendedMajors: [major] });
    expect(ids).toContain("caie9709");
    expect(ids).toContain("esat");
    expect(ids).not.toContain("lnat");
    expect(ids).not.toContain("ucat");
  });

  it("shows law tests without unrelated STEM exams", () => {
    const ids = visibleIds({ intendedMajors: ["Law (LLB)"] });
    expect(ids).toEqual(expect.arrayContaining(["lnat", "ielts"]));
    expect(ids).not.toContain("caie9709");
    expect(ids).not.toContain("esat");
  });

  it("uses saved A-Level subjects when the major is not yet recognized", () => {
    const ids = visibleIds({
      intendedMajors: ["Undecided"],
      subjects: [{ subject: "Mathematics", grade: "A*", kind: "PREDICTED" }],
    });
    expect(ids).toContain("caie9709");
    expect(ids).toContain("tmua");
  });

  it("only exposes the Cambridge college CS assessment for matching university and major intent", () => {
    expect(visibleIds({ intendedMajors: ["Computer Science"], intendedUniversities: ["University of Cambridge"] })).toContain("csat");
    expect(visibleIds({ intendedMajors: ["Computer Science"], intendedUniversities: ["University College London"] })).not.toContain("csat");
  });
});
