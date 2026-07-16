import { describe, it, expect } from "vitest";
import {
  getMockPapersForTest,
  getMockPaper,
  getAllMockQuestions,
} from "@/lib/tests/mock-papers";

describe("mock papers", () => {
  it("ESAT has 10 mock papers", () => {
    expect(getMockPapersForTest("esat").length).toBe(10);
  });

  it("getMockPaper resolves known ids and rejects unknown", () => {
    expect(getMockPaper("esat-mock-1")).toBeTruthy();
    expect(getMockPaper("does-not-exist")).toBeUndefined();
  });

  it("every paper has modules with timed questions", () => {
    for (const p of getMockPapersForTest("esat")) {
      expect(p.modules.length, `${p.id}: no modules`).toBeGreaterThan(0);
      for (const m of p.modules) {
        expect(m.questions.length, `${p.id}/${m.id}: no questions`).toBeGreaterThan(0);
        expect(m.durationSec, `${p.id}/${m.id}: no duration`).toBeGreaterThan(0);
      }
    }
  });

  it("every mock question has answer among options", () => {
    for (const q of getAllMockQuestions()) {
      const keys = q.options.map((o) => o.key);
      expect(keys, `${q.id}: answer not in options`).toContain(q.answer);
    }
  });

  it("mock question ids are unique", () => {
    const ids = getAllMockQuestions().map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
