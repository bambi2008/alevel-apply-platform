import { describe, it, expect } from "vitest";
import { parseOffer, gradePoints, evaluateMatch, type ProgramRequirement } from "./index";

describe("parseOffer", () => {
  it("parses A*AA into three grades", () => {
    expect(parseOffer("A*AA")).toEqual(["A*", "A", "A"]);
  });
  it("ignores spaces and is case-insensitive", () => {
    expect(parseOffer("a a b")).toEqual(["A", "A", "B"]);
  });
});

describe("gradePoints", () => {
  it("maps grades to points", () => {
    expect(gradePoints("A*")).toBe(6);
    expect(gradePoints("A")).toBe(5);
    expect(gradePoints("U")).toBe(0);
  });
});

describe("evaluateMatch", () => {
  const req: ProgramRequirement = {
    typicalOffer: "AAA",
    minimumOffer: "AAB",
    requiredSubjects: [{ subject: "Mathematics", minGrade: "A" }],
    ielts: 6.5,
  };

  const grades = (m: string, x: string, y: string) => ({
    grades: [
      { subject: "Mathematics", grade: m },
      { subject: "Physics", grade: x },
      { subject: "Chemistry", grade: y },
    ],
  });

  it("safety when student exceeds typical offer", () => {
    const r = evaluateMatch({ ...grades("A*", "A*", "A*"), ielts: 7.5 }, req);
    expect(r.meetsTypical).toBe(true);
    expect(r.category).toBe("safety");
  });

  it("match when student exactly meets typical offer", () => {
    const r = evaluateMatch({ ...grades("A", "A", "A"), ielts: 6.5 }, req);
    expect(r.meetsTypical).toBe(true);
    expect(r.category).toBe("match");
  });

  it("reach when between minimum and typical", () => {
    const r = evaluateMatch({ ...grades("A", "A", "B"), ielts: 7 }, req);
    expect(r.meetsTypical).toBe(false);
    expect(r.eligible).toBe(true);
    expect(r.category).toBe("reach");
  });

  it("reach when one grade below minimum", () => {
    const r = evaluateMatch({ ...grades("A", "B", "B"), ielts: 7 }, req);
    expect(r.eligible).toBe(false);
    expect(r.category).toBe("reach");
  });

  it("out_of_reach when far below and required subject too low", () => {
    const r = evaluateMatch({ ...grades("B", "B", "B"), ielts: 6.5 }, req);
    expect(r.meetsSubjects).toBe(false);
    expect(r.category).toBe("out_of_reach");
  });

  it("fails subjects when required subject missing", () => {
    const r = evaluateMatch(
      {
        grades: [
          { subject: "Economics", grade: "A*" },
          { subject: "Physics", grade: "A*" },
          { subject: "Chemistry", grade: "A*" },
        ],
        ielts: 7,
      },
      req,
    );
    expect(r.meetsSubjects).toBe(false);
  });

  it("flags english below requirement", () => {
    const r = evaluateMatch({ ...grades("A", "A", "A"), ielts: 5.5 }, req);
    expect(r.meetsEnglish).toBe(false);
  });

  it("excludes non-counting subjects from the grade total", () => {
    const r = evaluateMatch(
      {
        grades: [
          { subject: "Mathematics", grade: "A*" },
          { subject: "Physics", grade: "A" },
          { subject: "General Studies", grade: "A*" },
        ],
        ielts: 7,
      },
      { ...req, excludedSubjects: ["General Studies"] },
    );
    // 只计入 Maths(6) + Physics(5) = 11，低于最低 14
    expect(r.studentPoints).toBe(11);
    expect(r.eligible).toBe(false);
    expect(r.reasons.some((x) => x.includes("不计入"))).toBe(true);
  });
});
