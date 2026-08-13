import { describe, expect, it } from "vitest";
import {
  createAttemptId,
  examAttemptKey,
  examProgressKey,
  parseExamAttempt,
  parseExamProgress,
  remainingAttemptSeconds,
  summarizeModule,
} from "./exam-progress";

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

describe("unified exam attempt snapshots", () => {
  const snapshot = {
    version: 2 as const,
    attemptId: "tmua:mock-1:1000",
    runner: "written" as const,
    testId: "tmua",
    scopeId: "mock-1",
    startedAt: 1_000,
    deadlineAt: 61_000,
    savedAt: 10_000,
    payload: { currentIndex: 2, works: { q1: { "(i)": "work" } } },
  };

  it("restores valid generic payloads and derives reliable remaining time", () => {
    const restored = parseExamAttempt(
      JSON.stringify(snapshot),
      { runner: "written", testId: "tmua", scopeId: "mock-1" },
      (payload): payload is typeof snapshot.payload => Boolean(payload && typeof payload === "object" && "works" in payload),
      11_000,
    );
    expect(restored?.attemptId).toBe(snapshot.attemptId);
    expect(remainingAttemptSeconds(snapshot.deadlineAt, 11_000)).toBe(50);
    expect(examAttemptKey("written", "mock-1")).toContain("v2");
    expect(createAttemptId("tmua", "mock-1", 1_000)).toBe(snapshot.attemptId);
  });

  it("rejects mismatched, expired and invalid snapshots", () => {
    const expected = { runner: "written" as const, testId: "tmua", scopeId: "mock-1" };
    const valid = (payload: unknown): payload is typeof snapshot.payload => Boolean(payload && typeof payload === "object" && "works" in payload);
    expect(parseExamAttempt(JSON.stringify(snapshot), { ...expected, scopeId: "mock-2" }, valid, 11_000)).toBeNull();
    expect(parseExamAttempt(JSON.stringify(snapshot), expected, valid, 62_000)).toBeNull();
    expect(parseExamAttempt(JSON.stringify({ ...snapshot, payload: null }), expected, valid, 11_000)).toBeNull();
  });
});
