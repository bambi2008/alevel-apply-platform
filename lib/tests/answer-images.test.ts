import { describe, expect, it } from "vitest";
import { hasAnswerContent, hasWrittenResponse } from "./answer-images";

describe("answer image state", () => {
  it("does not count metadata, empty photo maps or selected essay prompts as work", () => {
    for (const work of [null, [], {}, { __selectedPrompt: "essay-1" }, { __answerImageIds: "{}" }, { __answerImageIds: '{"a":[]}' }, { __answerImageIds: "bad json" }, { a: " ", __answerImageIds: "[]" }]) expect(hasWrittenResponse(work)).toBe(false);
    expect(hasWrittenResponse({ a: "Proof" })).toBe(true);
    expect(hasWrittenResponse({ a: "", __answerImageIds: '{"a":["photo-1"]}' })).toBe(true);
  });
  it("counts either typed text or a photo as an answer", () => {
    expect(hasAnswerContent("  ", [])).toBe(false);
    expect(hasAnswerContent("x = 2", [])).toBe(true);
    expect(hasAnswerContent("", [{
      id: "image-1",
      url: "/api/answer-images/image-1",
      fileName: "answer.jpg",
      width: 1200,
      height: 1600,
      size: 120000,
    }])).toBe(true);
  });
});
