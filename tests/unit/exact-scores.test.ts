import { describe, expect, it } from "vitest";
import { hasPendingWrittenScores, withExactAnswer, withExactSession } from "../../lib/tests/exact-scores";

describe("expanded score columns with legacy fallback", () => {
  it("preserves old whole-mark records when exact fields are absent or null", () => {
    expect(withExactSession({ totalEarned: 7, totalEarnedExact: null, answers: [{ earned: 3, earnedExact: null }] })).toMatchObject({ totalEarned: 7, answers: [{ earned: 3 }] });
    expect(withExactAnswer({ earned: 4 })).toEqual({ earned: 4 });
  });
  it("uses fractional and zero exact marks without mutating stored legacy values", () => {
    const stored = { totalEarned: 1, totalEarnedExact: 0.5, answers: [{ earned: 1, earnedExact: 0.5 }, { earned: 1, earnedExact: 0 }] };
    expect(withExactSession(stored)).toMatchObject({ totalEarned: 0.5, answers: [{ earned: 0.5 }, { earned: 0 }] });
    expect(stored).toMatchObject({ totalEarned: 1, answers: [{ earned: 1 }, { earned: 1 }] });
  });
  it("distinguishes unmarked written work from an assigned zero", () => {
    expect(hasPendingWrittenScores({ pendingWrittenQuestionIds: ["q"] })).toBe(true);
    expect(hasPendingWrittenScores({ pendingWrittenQuestionIds: [] })).toBe(false);
    expect(hasPendingWrittenScores(null)).toBe(false);
    expect(hasPendingWrittenScores({ totalEarned: 0 })).toBe(false);
  });
});
