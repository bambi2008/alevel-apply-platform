import { describe, expect, it } from "vitest";
import {
  IELTS_LISTENING_FULL_1,
  IELTS_READING_FULL_1,
  IELTS_WRITING_FULL_1,
} from "../mock-papers/ielts-full-paper-1";
import { IELTS_SPEAKING_PAPERS } from "@/lib/english/speaking-papers";

describe("IELTS full-paper audit", () => {
  it("locks Listening to four ten-question audio sections", () => {
    const sections = IELTS_LISTENING_FULL_1.reduce<Record<string, number>>(
      (counts, question) => {
        const sectionId = question.audioSectionId ?? "missing";
        counts[sectionId] = (counts[sectionId] ?? 0) + 1;
        return counts;
      },
      {},
    );

    expect(IELTS_LISTENING_FULL_1).toHaveLength(40);
    expect(Object.keys(sections)).toHaveLength(4);
    expect(Object.values(sections)).toEqual([10, 10, 10, 10]);
    expect(
      IELTS_LISTENING_FULL_1.every(
        (question) =>
          question.audioSectionId &&
          question.audioTitle &&
          question.audioScript,
      ),
    ).toBe(true);
  });

  it("locks Academic Reading to forty passage-backed questions", () => {
    expect(IELTS_READING_FULL_1).toHaveLength(40);
    expect(
      IELTS_READING_FULL_1.every(
        (question) => question.context && question.context.length >= 500,
      ),
    ).toBe(true);
  });

  it("locks Academic Writing to Task 1 and Task 2", () => {
    expect(IELTS_WRITING_FULL_1).toHaveLength(2);
    expect(IELTS_WRITING_FULL_1.map((question) => question.totalMarks)).toEqual([
      20, 20,
    ]);
    expect(
      IELTS_WRITING_FULL_1.every(
        (question) =>
          question.responseKind === "essay" &&
          question.rubricDimensions?.length === 4,
      ),
    ).toBe(true);
  });

  it("keeps three complete fixed Speaking flows", () => {
    expect(IELTS_SPEAKING_PAPERS).toHaveLength(3);
    expect(
      IELTS_SPEAKING_PAPERS.every(
        (paper) =>
          paper.prompts.filter((prompt) => prompt.part === 1).length === 4 &&
          paper.prompts.filter((prompt) => prompt.part === 2).length === 1 &&
          paper.prompts.filter((prompt) => prompt.part === 3).length === 4,
      ),
    ).toBe(true);
  });
});
