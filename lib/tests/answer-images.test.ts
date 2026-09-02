import { describe, expect, it } from "vitest";
import { hasAnswerContent } from "./answer-images";

describe("answer image state", () => {
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
