import { describe, expect, it } from "vitest";
import { isObjectiveAnswerComplete, scoreObjectiveAnswer } from "../../lib/tests/objective-scoring";
import type { MCQQuestion } from "../../lib/tests/questions/types";
const question: MCQQuestion = { id: "sjt-fixture", type: "mcq", testId: "ucat", topicId: "sjt", difficulty: 2, marks: 1, question: "Choose a response.", options: [{ key: "A", text: "First" }, { key: "B", text: "Second" }], answer: "A", scoringMode: "adjacent", solution: "A" };
describe("objective response integrity", () => {
  it("does not give adjacent credit to an option outside the question", () => {
    expect(scoreObjectiveAnswer(question, "B").earned).toBe(0.5);
    expect(scoreObjectiveAnswer(question, "INVALID")).toMatchObject({ earned: 0, correct: false });
  });
  it("does not treat arbitrary matrix characters or missing keys as a completed correct response", () => {
    const matrix: MCQQuestion = { ...question, responseMode: "matrix", statements: [{ id: "s", text: "Statement" }], matrixAnswer: ["yes"] };
    expect(isObjectiveAnswerComplete(matrix, "?")).toBe(false);
    expect(scoreObjectiveAnswer(matrix, "?").earned).toBe(0);
    expect(scoreObjectiveAnswer({ ...matrix, matrixAnswer: undefined }, "Y").earned).toBe(0);
  });
});
