import { describe, expect, it } from "vitest";
import { IELTS_SPEAKING_PAPERS } from "./speaking-papers";

describe("IELTS Speaking fixed papers", () => {
  it("locks three complete Part 1-3 flows", () => {
    expect(IELTS_SPEAKING_PAPERS).toHaveLength(3);
    for (const paper of IELTS_SPEAKING_PAPERS) {
      expect(paper.prompts).toHaveLength(9);
      expect(paper.prompts.filter((prompt) => prompt.part === 1)).toHaveLength(4);
      expect(paper.prompts.filter((prompt) => prompt.part === 2)).toHaveLength(1);
      expect(paper.prompts.filter((prompt) => prompt.part === 3)).toHaveLength(4);
    }
  });

  it("keeps prompt ids unique and timing consistent", () => {
    const prompts = IELTS_SPEAKING_PAPERS.flatMap((paper) => paper.prompts);
    expect(new Set(prompts.map((prompt) => prompt.id)).size).toBe(prompts.length);
    expect(prompts.every((prompt) => prompt.part !== 2 || prompt.seconds === 120)).toBe(true);
    expect(prompts.every((prompt) => prompt.part !== 1 || prompt.seconds === 45)).toBe(true);
    expect(prompts.every((prompt) => prompt.part !== 3 || prompt.seconds === 75)).toBe(true);
  });
});
