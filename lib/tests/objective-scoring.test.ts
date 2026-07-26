import { describe, expect, it } from "vitest";
import type { MCQQuestion } from "./questions/types";
import { decodeMatrixAnswer, encodeMatrixAnswer, estimateIeltsBand, estimateSjtBand, estimateUcatScaledScore, isObjectiveAnswerComplete, scoreObjectiveAnswer } from "./objective-scoring";

const base: MCQQuestion = {
  id: "q", type: "mcq", testId: "ucat", topicId: "ucat-dm", difficulty: 2, marks: 1,
  question: "Question", options: [{ key: "A", text: "One" }, { key: "B", text: "Two" }, { key: "C", text: "Three" }, { key: "D", text: "Four" }], answer: "C", solution: "Solution",
};

describe("UCAT objective scoring", () => {
  it("awards adjacent SJT partial credit", () => {
    const question = { ...base, scoringMode: "adjacent" as const };
    expect(scoreObjectiveAnswer(question, "C")).toEqual({ earned: 1, max: 1, correct: true });
    expect(scoreObjectiveAnswer(question, "B")).toEqual({ earned: 0.5, max: 1, correct: false });
    expect(scoreObjectiveAnswer(question, "A").earned).toBe(0);
  });

  it("awards two, one, or zero marks for five-statement decisions", () => {
    const question: MCQQuestion = { ...base, responseMode: "matrix", statements: ["a", "b", "c", "d", "e"].map((id) => ({ id, text: id })), matrixAnswer: ["yes", "no", "yes", "no", "yes"] };
    expect(encodeMatrixAnswer(question.matrixAnswer!)).toBe("YNYNY");
    expect(decodeMatrixAnswer("YN-NY", 5)).toEqual(["yes", "no", undefined, "no", "yes"]);
    expect(isObjectiveAnswerComplete(question, "YNYNY")).toBe(true);
    expect(scoreObjectiveAnswer(question, "YNYNY").earned).toBe(2);
    expect(scoreObjectiveAnswer(question, "YNYNN").earned).toBe(1);
    expect(scoreObjectiveAnswer(question, "YYNNN").earned).toBe(0);
  });

  it("produces bounded training estimates", () => {
    expect(estimateUcatScaledScore(0, 44)).toBe(300);
    expect(estimateUcatScaledScore(44, 44)).toBe(900);
    expect(estimateSjtBand(80, 100)).toBe(1);
    expect(estimateSjtBand(49, 100)).toBe(4);
  });

  it("maps IELTS Listening and Academic Reading raw scores to training bands", () => {
    expect(estimateIeltsBand(40, "listening")).toBe(9);
    expect(estimateIeltsBand(30, "listening")).toBe(7);
    expect(estimateIeltsBand(30, "reading")).toBe(7);
    expect(estimateIeltsBand(23, "reading")).toBe(6);
  });
});
