import { describe, expect, it } from "vitest";
import {
  buildEmptyGradeResponse,
  buildGradeResponse,
  needsAdjudication,
  normalizeGradePass,
  type GradeRequest,
} from "./grading";
import { GRADING_BENCHMARKS } from "./grading-benchmarks";

const request: GradeRequest = {
  questionId: "bmo-1",
  testId: "bmo",
  parts: [
    { label: "(i)", question: "Prove it.", marks: 4, solutionOutline: "State the invariant; apply it.", studentWork: "The parity is invariant." },
    { label: "(ii)", question: "Conclude.", marks: 6, solutionOutline: "Compute the initial parity; conclude.", studentWork: "The final value is odd." },
  ],
  fullSolution: "Use parity.",
};

function pass(first: number, second: number) {
  return normalizeGradePass(request, {
    perPart: [
      { label: "(i)", earned: first, feedback: "方法正确。", keyStepsFound: ["不变量"], evidence: [{ criterion: "不变量", status: "met", quote: "parity is invariant", marksAwarded: first }] },
      { label: "(ii)", earned: second, feedback: "结论基本正确。", keyStepsMissing: ["初始奇偶性"] },
    ],
    overallFeedback: "论证方向正确。",
  });
}

describe("trusted written grading", () => {
  it("clamps model scores and normalizes evidence", () => {
    const normalized = normalizeGradePass(request, {
      perPart: [
        { label: "(i)", earned: 99, feedback: "ok", evidence: [{ criterion: "不变量", status: "met", quote: "parity", marksAwarded: 99 }] },
      ],
    });
    expect(normalized.perPart[0].earned).toBe(4);
    expect(normalized.perPart[0].evidence[0]).toMatchObject({ criterion: "不变量", marksAwarded: 4 });
    expect(normalized.perPart[1].earned).toBe(0);
  });

  it("handles blank work deterministically without an AI score", () => {
    const blank = buildEmptyGradeResponse({
      ...request,
      parts: request.parts.map((part) => ({ ...part, studentWork: " " })),
    });
    expect(blank.totalEarned).toBe(0);
    expect(blank.assessment).toMatchObject({ method: "deterministic-empty", confidence: "high" });
  });

  it("accepts close independent scores and exposes agreement", () => {
    const response = buildGradeResponse(request, [pass(3, 5), pass(3, 4)]);
    expect(needsAdjudication(request, [pass(3, 5), pass(3, 4)])).toBe(false);
    expect(response.assessment).toMatchObject({ method: "dual-pass", confidence: "medium", scoreDelta: 1 });
    expect(response.totalEarned).toBe(8);
  });

  it("requires adjudication for material per-part disagreement", () => {
    const first = pass(4, 6);
    const second = pass(1, 3);
    const adjudicated = pass(3, 5);
    expect(needsAdjudication(request, [first, second])).toBe(true);
    const response = buildGradeResponse(request, [first, second], adjudicated);
    expect(response.totalEarned).toBe(8);
    expect(response.assessment).toMatchObject({
      method: "dual-pass-adjudicated",
      confidence: "low",
      reviewStatus: "review-recommended",
    });
  });

  it("keeps a diverse, internally valid calibration benchmark set", () => {
    expect(new Set(GRADING_BENCHMARKS.map((item) => item.id)).size).toBe(GRADING_BENCHMARKS.length);
    expect(new Set(GRADING_BENCHMARKS.map((item) => item.purpose)).size).toBe(4);
    for (const benchmark of GRADING_BENCHMARKS) {
      const maximum = benchmark.request.responseKind === "essay"
        ? benchmark.request.rubricDimensions?.reduce((sum, item) => sum + item.maxMarks, 0) ?? 0
        : benchmark.request.parts.reduce((sum, item) => sum + item.marks, 0);
      expect(benchmark.expectedScore.min).toBeGreaterThanOrEqual(0);
      expect(benchmark.expectedScore.max).toBeLessThanOrEqual(maximum);
      expect(benchmark.expectedScore.min).toBeLessThanOrEqual(benchmark.expectedScore.max);
    }
  });
});
