import { describe, expect, it } from "vitest";
import { parseWrittenSubmission, writtenSubmissionKey } from "./written-submission";

describe("written submission recovery", () => {
  const saved = { version: 1, paperId: "caie9709-p3-written-9-r2", startedAt: 1, timeUsedSec: 6600, works: { q1: { "(a)": "1+2x+5x^2/2", "(b)": "-1/2<x<1/2" }, q11: { "(a)": "AB=2DC" } } };
  it("retains all work after the timed attempt has expired", () => {
    expect(parseWrittenSubmission(JSON.stringify(saved), saved.paperId, ["q1", "q11"])).toEqual(saved);
  });
  it("retains private answer-image references for retrying a submitted paper", () => {
    const withImages = {
      ...saved,
      answerImages: {
        q1: {
          "(a)": [{ id: "image-1", url: "/api/answer-images/image-1", fileName: "answer.jpg", width: 1200, height: 1600, size: 120000 }],
        },
      },
    };
    expect(parseWrittenSubmission(JSON.stringify(withImages), saved.paperId, ["q1", "q11"])).toEqual(withImages);
  });
  it("does not restore an old revision into a new one", () => {
    expect(writtenSubmissionKey(saved.paperId)).not.toBe(writtenSubmissionKey("caie9709-p3-written-9"));
    expect(parseWrittenSubmission(JSON.stringify(saved), "caie9709-p3-written-9", ["q1", "q11"])).toBeNull();
    expect(parseWrittenSubmission(JSON.stringify(saved), saved.paperId, ["different-question"])).toBeNull();
  });
  it.each([null,"{", "null", "[]", JSON.stringify({ ...saved, version: 2 }), JSON.stringify({ ...saved, works: { q1: { a: 42 } } }), JSON.stringify({ ...saved, timeUsedSec: -1 })])("rejects malformed recovery data %s", raw => {
    expect(parseWrittenSubmission(raw, saved.paperId, ["q1","q11"])).toBeNull();
  });
});
