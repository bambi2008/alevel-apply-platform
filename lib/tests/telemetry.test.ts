import { describe, expect, it } from "vitest";
import { createQuestionTelemetry } from "./telemetry";

describe("question telemetry", () => {
  it("tracks active time, revisits, answer changes and flags", () => {
    let clock = 0;
    const tracker = createQuestionTelemetry(() => clock);
    tracker.visit("q1");
    clock = 4_000;
    tracker.answer("q1", "A");
    tracker.answer("q1", "C");
    tracker.flag("q1", true);
    tracker.visit("q2");
    clock = 7_000;
    tracker.visit("q1");
    clock = 9_000;
    expect(tracker.snapshot(["q1", "q2"])).toEqual({
      q1: { timeSpentSec: 6, answerChanges: 1, visits: 2, flagged: true, firstSelected: "A" },
      q2: { timeSpentSec: 3, answerChanges: 0, visits: 1, flagged: false, firstSelected: undefined },
    });
  });
});
