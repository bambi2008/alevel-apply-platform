import { describe, expect, it } from "vitest";
import { questionForDelivery } from "../../lib/tests/delivery-projection";
import type { Question } from "../../lib/tests/questions/types";

describe("pre-submission question boundary", () => {
  it("does not disclose objective keys, solution, hints or accidentally added fields", () => {
    const source = {
      id: "q", type: "mcq", testId: "tmua", topicId: "algebra", difficulty: 2,
      marks: 1, question: "Find x.", options: [{ key: "A", text: "1" }, { key: "B", text: "2" }],
      answer: "B", matrixAnswer: ["yes"], solution: "CONFIDENTIAL solution", hint: "CONFIDENTIAL hint",
      optionExplanations: { B: "CONFIDENTIAL explanation" }, futureSecret: "CONFIDENTIAL future field",
    } as unknown as Question;
    const delivered = questionForDelivery(source);
    expect(JSON.stringify(delivered)).not.toContain("CONFIDENTIAL");
    for (const key of ["answer", "matrixAnswer", "solution", "hint", "optionExplanations", "futureSecret"]) expect(delivered).not.toHaveProperty(key);
    expect(delivered).toMatchObject({ id: "q", type: "mcq", question: "Find x.", options: [{ key: "A", text: "1" }, { key: "B", text: "2" }] });
  });
  it("removes nested written mark schemes without altering prompts or marks", () => {
    const source = {
      id: "long", type: "long", testId: "step", topicId: "pure", difficulty: 3, totalMarks: 10,
      context: "Given f(x)", fullSolution: "CONFIDENTIAL answer",
      parts: [{ label: "a", marks: 10, question: "Prove the identity.", solutionOutline: "CONFIDENTIAL steps", hint: "CONFIDENTIAL hint", futureSecret: "CONFIDENTIAL nested" }],
    } as unknown as Question;
    const before = JSON.stringify(source);
    const delivered = questionForDelivery(source);
    expect(JSON.stringify(delivered)).not.toContain("CONFIDENTIAL");
    expect(delivered).not.toHaveProperty("fullSolution");
    expect(delivered.type === "long" && delivered.parts).toEqual([{ label: "a", marks: 10, question: "Prove the identity." }]);
    expect(JSON.stringify(source)).toBe(before);
  });
});
