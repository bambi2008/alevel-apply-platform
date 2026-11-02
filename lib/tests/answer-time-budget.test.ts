import { describe, expect, it } from "vitest";
import { moduleAnswerTimeBudget } from "./answer-time-budget";
import { getMockPapersForTest } from "./mock-papers";
import type { LongQuestion, MCQQuestion } from "./questions/types";

const mcq = (id: string, difficulty: 1 | 2 | 3): MCQQuestion => ({ id, type: "mcq", testId: "tmua", topicId: "tmua-logic", difficulty, marks: 1, question: "Q", options: [{ key: "A", text: "A" }, { key: "B", text: "B" }], answer: "A", solution: "A" });
const written = (id: string, marks: number): LongQuestion => ({ id, type: "long", testId: "step", topicId: "step-pure1", difficulty: 3, totalMarks: marks, parts: [{ label: "a", marks, question: "Q", solutionOutline: "A" }], fullSolution: "A" });

describe("module-normalized pacing references", () => {
  it("weights MCQs by relative difficulty and assigns exact integer seconds", () => {
    const questions = [mcq("a", 1), mcq("b", 2), mcq("c", 3)];
    const budget = moduleAnswerTimeBudget(questions, 4500);
    expect([...budget.values()].reduce((sum, seconds) => sum + seconds, 0)).toBe(4500);
    expect([...budget.values()]).toEqual([1200, 1500, 1800]);
    const rounded = moduleAnswerTimeBudget([mcq("a", 1), mcq("b", 1), mcq("c", 1)], 10);
    expect([...rounded.values()]).toEqual([4, 3, 3]);
  });
  it("weights written questions by marks without modifying them", () => {
    const questions = [written("a", 5), written("b", 10), written("c", 15)];
    const snapshot = JSON.stringify(questions);
    expect([...moduleAnswerTimeBudget(questions, 3600).values()]).toEqual([600, 1200, 1800]);
    expect(JSON.stringify(questions)).toBe(snapshot);
  });
  it("uses six counted answers for STEP and CSAT, not every offered question", () => {
    const step = Array.from({ length: 12 }, (_, i) => written(String(i), 20));
    expect([...moduleAnswerTimeBudget(step, 10800, 6).values()]).toEqual(Array(12).fill(1800));
    const csat = Array.from({ length: 8 }, (_, i) => written(String(i), 20));
    expect([...moduleAnswerTimeBudget(csat, 10800, 6).values()]).toEqual(Array(8).fill(1800));
  });
  it("normalizes every released compulsory module to its actual duration", () => {
    for (const exam of ["mat", "step", "tmua", "bmo", "lnat", "esat", "pat", "tara", "bpho", "ucat", "ielts", "csat", "caie9709"]) {
      for (const paper of getMockPapersForTest(exam)) for (const section of paper.modules) {
        const count = paper.modules.length === 1 ? paper.bestQuestionCount : undefined;
        const budget = moduleAnswerTimeBudget(section.questions, section.durationSec, count);
        expect([...budget.values()].reduce((sum, seconds) => sum + seconds, 0), `${paper.id}/${section.id}`).toBe(Math.round(section.durationSec * section.questions.length / (count ?? section.questions.length)));
      }
    }
  });
  it("rejects duplicate IDs and invalid counted workloads; missing duration has no reference", () => {
    expect(moduleAnswerTimeBudget([], 100).size).toBe(0);
    expect(moduleAnswerTimeBudget([mcq("a", 1)], NaN).size).toBe(0);
    expect(() => moduleAnswerTimeBudget([mcq("a", 1), mcq("a", 2)], 100)).toThrow("Duplicate");
    expect(() => moduleAnswerTimeBudget([written("a", 20)], 100, 6)).toThrow("Invalid counted");
  });
});
