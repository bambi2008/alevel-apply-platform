import { describe, expect, it } from "vitest";
import { examProgressKey, parseExamProgress, summarizeModule } from "./exam-progress";

const saved = {
  version: 1 as const,
  paperId: "tmua-mock-1",
  moduleIndex: 1,
  questionIndex: 4,
  answers: { q1: "A" },
  flagged: { q2: true },
  timeLeft: 120,
  startedAt: 1_000,
  savedAt: 2_000,
};

describe("objective exam progress", () => {
  it("restores a valid in-progress module", () => {
    expect(parseExamProgress(JSON.stringify(saved), saved.paperId, [20, 20], 3_000)).toEqual({ ...saved, timeLeft: 119 });
    expect(examProgressKey(saved.paperId)).toContain(saved.paperId);
  });

  it("rejects stale, malformed, and out-of-range progress", () => {
    expect(parseExamProgress("not-json", saved.paperId, [20, 20], 3_000)).toBeNull();
    expect(parseExamProgress(JSON.stringify({ ...saved, moduleIndex: 2 }), saved.paperId, [20, 20], 3_000)).toBeNull();
    expect(parseExamProgress(JSON.stringify(saved), saved.paperId, [20, 20], saved.savedAt + 121_000)).toBeNull();
    expect(parseExamProgress(JSON.stringify(saved), saved.paperId, [20, 20], saved.savedAt + 8 * 24 * 60 * 60 * 1000)).toBeNull();
  });

  it("summarizes answered, unanswered, and marked questions", () => {
    expect(summarizeModule(["q1", "q2", "q3"], { q1: "A", q3: "B" }, { q2: true })).toEqual({
      answered: 2,
      unanswered: 1,
      marked: 1,
    });
  });
});
