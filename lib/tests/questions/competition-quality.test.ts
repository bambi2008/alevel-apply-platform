import { describe, expect, it } from "vitest";
import { BPHO_QUESTIONS } from "./bpho";
import { BMO_QUESTIONS } from "./bmo";
import type { MCQQuestion, Question } from "./types";

function normalized(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function topicCounts(questions: Question[], type: Question["type"]): Record<string, number> {
  return questions
    .filter((question) => question.type === type)
    .reduce<Record<string, number>>((counts, question) => {
      counts[question.topicId] = (counts[question.topicId] ?? 0) + 1;
      return counts;
    }, {});
}

function mcqsByTopic(questions: Question[]): Map<string, MCQQuestion[]> {
  const grouped = new Map<string, MCQQuestion[]>();
  for (const question of questions) {
    if (question.type !== "mcq") continue;
    const group = grouped.get(question.topicId) ?? [];
    group.push(question);
    grouped.set(question.topicId, group);
  }
  return grouped;
}

function expectNoDuplicatePrompts(questions: Question[]) {
  const prompts = questions.map((question) =>
    normalized(question.type === "mcq" ? question.question : `${question.context ?? ""} ${question.parts.map((part) => part.question).join(" ")}`)
  );
  expect(new Set(prompts).size).toBe(prompts.length);
}

function expectUniqueOptions(questions: Question[]) {
  for (const question of questions.filter((item): item is MCQQuestion => item.type === "mcq")) {
    const options = question.options.map((option) => normalized(option.text));
    expect(new Set(options).size, `${question.id}: repeated option text`).toBe(options.length);
  }
}

describe("competition bank quality and calibration", () => {
  it("has no duplicate prompts or repeated option text", () => {
    expectNoDuplicatePrompts(BPHO_QUESTIONS);
    expectNoDuplicatePrompts(BMO_QUESTIONS);
    expectUniqueOptions(BPHO_QUESTIONS);
    expectUniqueOptions(BMO_QUESTIONS);
  });

  it("keeps BPhO topic coverage within deliberate bounds", () => {
    const mcq = topicCounts(BPHO_QUESTIONS, "mcq");
    const long = topicCounts(BPHO_QUESTIONS, "long");
    const mcqTotal = Object.values(mcq).reduce((sum, count) => sum + count, 0);
    expect(mcq["bpho-mechanics"] / mcqTotal).toBeLessThan(0.45);
    expect(mcq["bpho-modern"]).toBeGreaterThanOrEqual(25);
    expect(Math.max(...Object.values(long)) - Math.min(...Object.values(long))).toBeLessThanOrEqual(4);
  });

  it("keeps BMO proof topics balanced and strengthens short geometry/number theory", () => {
    const mcq = topicCounts(BMO_QUESTIONS, "mcq");
    const long = topicCounts(BMO_QUESTIONS, "long");
    expect(new Set(Object.values(long))).toEqual(new Set([20]));
    expect(mcq["bmo-number"]).toBeGreaterThanOrEqual(45);
    expect(mcq["bmo-geometry"]).toBeGreaterThanOrEqual(38);
    expect(mcq["bmo-algebra"] / Object.values(mcq).reduce((sum, count) => sum + count, 0)).toBeLessThan(0.45);
  });

  it("offers all three difficulty levels in each competition short-answer topic", () => {
    for (const questions of [BPHO_QUESTIONS, BMO_QUESTIONS]) {
      for (const [topicId, topicQuestions] of mcqsByTopic(questions)) {
        expect(new Set(topicQuestions.map((question) => question.difficulty)), topicId).toEqual(new Set([1, 2, 3]));
      }
    }
  });
});
