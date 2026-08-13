import { describe, expect, it } from "vitest";
import { buildAdaptiveProfile } from "@/lib/tests/adaptive";
import { buildWeeklyReport, calculateStreak, generateStudyWeek } from "./planner";

const now = new Date("2026-07-23T08:00:00.000Z");
const profile = buildAdaptiveProfile({
  testId: "tmua",
  topics: [{ id: "algebra", title: "代数", titleEn: "Algebra" }],
  answers: [],
  now,
});

describe("study execution planner", () => {
  it("materialises tasks within the weekly time budget", () => {
    const tasks = generateStudyWeek({
      goals: [{ id: "g1", testId: "tmua", targetDate: new Date("2026-10-20"), weeklyMinutes: 90 }],
      profiles: { tmua: profile },
      now,
    });
    expect(tasks).toHaveLength(3);
    expect(tasks.every((task) => task.kind === "DIAGNOSTIC")).toBe(true);
    expect(tasks.reduce((sum, task) => sum + task.estimatedMinutes, 0)).toBe(90);
  });

  it("stops scheduling after the target date", () => {
    const tasks = generateStudyWeek({
      goals: [{ id: "g1", testId: "tmua", targetDate: new Date("2026-07-24"), weeklyMinutes: 300 }],
      profiles: { tmua: profile },
      now,
    });
    expect(tasks).toHaveLength(2);
  });

  it("calculates streaks and weekly report rates", () => {
    const activeDates = ["2026-07-20", "2026-07-21", "2026-07-22"];
    expect(calculateStreak(activeDates, now)).toBe(3);
    expect(buildWeeklyReport({ plannedTasks: 5, completedTasks: 4, sessionMinutes: 80, questionsAnswered: 40, earned: 30, max: 40, activeDates, currentStreak: 3 }))
      .toMatchObject({ completionRate: 80, accuracy: 75 });
  });
});
