import { describe, expect, it } from "vitest";
import {
  analyseIeltsReadiness,
  buildIeltsTimeline,
  roundIeltsOverall,
} from "./planner";

describe("IELTS condition planner", () => {
  it("uses IELTS half-band overall rounding", () => {
    expect(roundIeltsOverall({
      listening: 7,
      reading: 7,
      writing: 6.5,
      speaking: 6.5,
    })).toBe(7);
  });

  it("distinguishes a single-component gap from a full retake case", () => {
    const oneSkill = analyseIeltsReadiness(
      { listening: 8, reading: 8, writing: 6.5, speaking: 7.5 },
      { overall: 7.5, component: 7 },
    );
    expect(oneSkill.overall).toBe(7.5);
    expect(oneSkill.belowTarget).toEqual(["writing"]);
    expect(oneSkill.recommendation).toBe("verify-one-skill-retake");

    const fullRetake = analyseIeltsReadiness(
      { listening: 7, reading: 7, writing: 6, speaking: 6.5 },
      { overall: 7.5, component: 7 },
    );
    expect(fullRetake.recommendation).toBe("full-retake");
  });

  it("flags a short result window before the condition deadline", () => {
    expect(buildIeltsTimeline("2026-07-26", "2026-08-10", "2026-08-25")).toEqual({
      daysToTest: 15,
      daysFromTestToDeadline: 15,
      warning: "result-window-tight",
    });
  });
});
