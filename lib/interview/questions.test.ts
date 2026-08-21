import { describe, expect, it } from "vitest";
import { INTERVIEW_QUESTIONS } from "./questions";

describe("mathematics and physics interview expansion", () => {
  const subjects = ["maths", "physics"] as const;

  it.each(subjects)("contains six unique %s prompts", (subjectId) => {
    const questions = INTERVIEW_QUESTIONS.filter((question) => question.subjectId === subjectId);
    expect(questions).toHaveLength(6);
    expect(new Set(questions.map((question) => question.id)).size).toBe(6);
    expect(new Set(questions.map((question) => question.prompt)).size).toBe(6);
  });

  it.each(subjects)("contains four fully specified challenge prompts for %s", (subjectId) => {
    const challengeQuestions = INTERVIEW_QUESTIONS.filter(
      (question) => question.subjectId === subjectId && question.difficulty === 3,
    );
    expect(challengeQuestions).toHaveLength(4);

    for (const question of challengeQuestions) {
      expect(question.prompt.length, question.id).toBeGreaterThan(45);
      expect(question.approach.length, question.id).toBeGreaterThan(120);
      expect(question.followUps, question.id).toHaveLength(3);
      expect(question.format, question.id).not.toBe("");
      expect(question.timebox, question.id).toMatch(/分钟/);
      expect(question.assessedSkills?.length, question.id).toBeGreaterThanOrEqual(4);
    }
  });

  it("keeps every new prompt original within the local interview bank", () => {
    const fingerprints = INTERVIEW_QUESTIONS.map((question) =>
      question.prompt.toLocaleLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, ""),
    );
    expect(new Set(fingerprints).size).toBe(INTERVIEW_QUESTIONS.length);
  });
});
