import { describe, expect, it } from "vitest";
import { buildSessionDiagnosis, diagnoseAnswer, optionReview } from "./diagnosis";
import type { LongQuestion, MCQQuestion } from "./questions/types";

const mcq: MCQQuestion = {
  id: "diagnosis-mcq",
  type: "mcq",
  testId: "tmua",
  topicId: "tmua-algebra",
  difficulty: 2,
  marks: 1,
  question: "What is 2+2?",
  options: [
    { key: "A", text: "4" },
    { key: "B", text: "5" },
  ],
  answer: "A",
  solution: "Adding gives 4.",
};

const written: LongQuestion = {
  id: "diagnosis-written",
  type: "long",
  testId: "step",
  topicId: "step-pure1",
  difficulty: 3,
  totalMarks: 10,
  parts: [{ label: "(i)", marks: 10, question: "Prove it.", solutionOutline: "Use induction." }],
  fullSolution: "A complete induction proof.",
};

describe("answer diagnosis", () => {
  it("distinguishes rushing, changing away and stable concept gaps", () => {
    expect(diagnoseAnswer({
      question: mcq, selected: "B", earned: 0, max: 1, timeSpentSec: 5,
    }).code).toBe("rushed");
    expect(diagnoseAnswer({
      question: mcq, selected: "B", firstSelected: "A", earned: 0, max: 1, timeSpentSec: 70,
    }).code).toBe("changed-away");
    expect(diagnoseAnswer({
      question: mcq, selected: "B", firstSelected: "B", earned: 0, max: 1, timeSpentSec: 90,
    }).code).toBe("concept-gap");
  });

  it("treats behaviourally uncertain correct answers as fragile", () => {
    const result = diagnoseAnswer({
      question: mcq,
      selected: "A",
      earned: 1,
      max: 1,
      answerChanges: 3,
      flagged: true,
    });
    expect(result.code).toBe("fragile-correct");
    expect(result.severity).toBe("attention");
  });

  it("uses written scoring evidence without penalising completed steps twice", () => {
    expect(diagnoseAnswer({
      question: written,
      work: { "(i)": "" },
      earned: 0,
      max: 10,
    }).code).toBe("unanswered");
    const result = diagnoseAnswer({
      question: written,
      work: { "(i)": "Base case only." },
      earned: 3,
      max: 10,
      feedback: [{ label: "(i)", keyStepsMissing: ["inductive hypothesis", "inductive step"] }],
    });
    expect(result.code).toBe("missing-steps");
    expect(result.evidence).toContain("inductive hypothesis");
  });

  it("builds an ordered session-level remediation summary", () => {
    const summary = buildSessionDiagnosis([
      { question: mcq, selected: "A", earned: 1, max: 1 },
      { question: mcq, selected: "B", earned: 0, max: 1, timeSpentSec: 5 },
      { question: written, work: { "(i)": "start" }, earned: 2, max: 10 },
    ]);
    expect(summary.secureCount).toBe(1);
    expect(summary.attentionCount).toBe(1);
    expect(summary.priorityCount).toBe(1);
    expect(summary.primaryIssue?.severity).toBe("priority");
    expect(summary.recommendations.length).toBeGreaterThan(0);
  });

  it("supports authored distractor explanations with a safe fallback", () => {
    expect(optionReview(mcq, "B").detail).toContain("A");
    expect(optionReview({
      ...mcq,
      optionExplanations: { B: "This adds one twice." },
    }, "B").detail).toBe("This adds one twice.");
  });
});
