import { describe, it, expect } from "vitest";
import { parseOffer, gradePoints, evaluateMatch } from "./index";

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
  const req = {
    aLevelOffer: "A*AA",
    requiredSubjects: [{ subject: "Mathematics", minGrade: "A" }],
    ielts: 6.5,
  };

  it("classifies as safety when student exceeds the offer", () => {
    const r = evaluateMatch(
      { grades: [
        { subject: "Mathematics", grade: "A*" },
        { subject: "Physics", grade: "A*" },
        { subject: "Chemistry", grade: "A*" },
      ], ielts: 7.5 },
      req,
    );
    expect(r.meetsGrades).toBe(true);
    expect(r.meetsSubjects).toBe(true);
    expect(r.meetsEnglish).toBe(true);
    expect(r.category).toBe("safety");
  });

  it("classifies as match when student exactly meets the offer", () => {
    const r = evaluateMatch(
      { grades: [
        { subject: "Mathematics", grade: "A*" },
        { subject: "Physics", grade: "A" },
        { subject: "Chemistry", grade: "A" },
      ], ielts: 6.5 },
      req,
    );
    expect(r.category).toBe("match");
  });

  it("classifies as reach when one grade short", () => {
    const r = evaluateMatch(
      { grades: [
        { subject: "Mathematics", grade: "A" },
        { subject: "Physics", grade: "A" },
        { subject: "Chemistry", grade: "A" },
      ], ielts: 7 },
      req,
    );
    expect(r.meetsGrades).toBe(false);
    expect(r.category).toBe("reach");
  });

  it("classifies as out_of_reach when far below", () => {
    const r = evaluateMatch(
      { grades: [
        { subject: "Mathematics", grade: "B" },
        { subject: "Physics", grade: "C" },
        { subject: "Chemistry", grade: "C" },
      ], ielts: 6.5 },
      req,
    );
    expect(r.category).toBe("out_of_reach");
  });

  it("fails subjects when required subject missing", () => {
    const r = evaluateMatch(
      { grades: [
        { subject: "Economics", grade: "A*" },
        { subject: "Physics", grade: "A*" },
        { subject: "Chemistry", grade: "A*" },
      ], ielts: 7 },
      req,
    );
    expect(r.meetsSubjects).toBe(false);
  });

  it("flags english below requirement", () => {
    const r = evaluateMatch(
      { grades: [
        { subject: "Mathematics", grade: "A*" },
        { subject: "Physics", grade: "A" },
        { subject: "Chemistry", grade: "A" },
      ], ielts: 5.5 },
      req,
    );
    expect(r.meetsEnglish).toBe(false);
  });
});
