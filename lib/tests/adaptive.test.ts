import { describe, expect, it } from "vitest";
import { buildAdaptiveProfile, selectAdaptiveQuestions, type AdaptiveAnswerObservation } from "./adaptive";

const now = new Date("2026-07-22T00:00:00.000Z");
const topics = [
  { id: "algebra", title: "代数", titleEn: "Algebra" },
  { id: "geometry", title: "几何", titleEn: "Geometry" },
];

function answer(questionId: string, topicId: string, earned: number, daysAgo: number, difficulty: 1 | 2 | 3 = 2): AdaptiveAnswerObservation {
  return { questionId, topicId, difficulty, earned, max: 1, completedAt: new Date(now.getTime() - daysAgo * 86400000) };
}

describe("adaptive learning profile", () => {
  it("starts with a balanced diagnostic task", () => {
    const profile = buildAdaptiveProfile({ testId: "tmua", topics, answers: [], now });
    expect(profile.stage).toBe("diagnostic");
    expect(profile.coverage).toBe(0);
    expect(profile.tasks[0]).toMatchObject({ kind: "diagnostic", questionCount: 15 });
  });

  it("prioritises weak topics and schedules overdue mistakes", () => {
    const answers = [
      answer("a1", "algebra", 0, 8, 1),
      answer("a2", "algebra", 0, 5, 2),
      answer("a3", "algebra", 1, 3, 2),
      answer("a4", "algebra", 0, 2, 3),
      answer("g1", "geometry", 1, 4, 2),
      answer("g2", "geometry", 1, 3, 2),
      answer("g3", "geometry", 1, 2, 3),
      answer("g4", "geometry", 1, 1, 3),
      ...Array.from({ length: 8 }, (_, index) => answer(`extra-${index}`, index % 2 ? "geometry" : "algebra", 1, 1, 2)),
    ];
    const profile = buildAdaptiveProfile({ testId: "tmua", topics, answers, now });
    expect(profile.topics[0].id).toBe("algebra");
    expect(profile.dueReviews.map((item) => item.questionId)).toContain("a1");
    expect(profile.tasks.some((task) => task.kind === "review")).toBe(true);
  });

  it("selects due mistakes before unseen questions and limits one-topic dominance", () => {
    const answers = Array.from({ length: 12 }, (_, index) => answer(`seen-${index}`, index % 2 ? "geometry" : "algebra", index === 0 ? 0 : 1, index === 0 ? 5 : 1));
    const profile = buildAdaptiveProfile({ testId: "tmua", topics, answers, now });
    const questions = [
      { id: "seen-0", topicId: "algebra", difficulty: 1 as const, type: "mcq" as const },
      ...Array.from({ length: 8 }, (_, index) => ({ id: `new-a-${index}`, topicId: "algebra", difficulty: 2 as const, type: "mcq" as const })),
      ...Array.from({ length: 8 }, (_, index) => ({ id: `new-g-${index}`, topicId: "geometry", difficulty: 2 as const, type: "mcq" as const })),
    ];
    const selected = selectAdaptiveQuestions({ questions, answers, profile, count: 6, now });
    expect(selected[0]).toBe("seen-0");
    expect(selected.filter((id) => id.startsWith("new-a")).length).toBeLessThanOrEqual(3);
    expect(selected.filter((id) => id.startsWith("new-g")).length).toBeGreaterThan(0);
  });
});
