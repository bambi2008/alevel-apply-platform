import { describe, expect, it } from "vitest";
import { CSAT_QUESTIONS } from "../questions/csat";
import { CSAT_WRITTEN_PAPERS } from "../mock-papers/ielts-csat-written-papers";

describe("CSAT fixed-paper audit", () => {
  it("locks two independent eight-question choose-six papers", () => {
    expect(CSAT_QUESTIONS).toHaveLength(16);
    expect(CSAT_WRITTEN_PAPERS).toHaveLength(2);

    for (const paper of CSAT_WRITTEN_PAPERS) {
      expect(paper.bestQuestionCount).toBe(6);
      expect(paper.modules).toHaveLength(1);
      expect(paper.modules[0].durationSec).toBe(180 * 60);
      expect(paper.modules[0].questions).toHaveLength(8);
      expect(new Set(paper.modules[0].questions.map((question) => question.topicId)).size).toBe(5);
    }
  });

  it("does not repeat a long-question task between the fixed papers", () => {
    const taskSets = CSAT_WRITTEN_PAPERS.map((paper) =>
      new Set(
        paper.modules[0].questions.map((question) =>
          question.type === "long" ? question.parts[0].question : question.id,
        ),
      ),
    );
    expect([...taskSets[0]].filter((task) => taskSets[1].has(task))).toEqual([]);
  });
});
