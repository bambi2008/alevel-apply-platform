import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
const locale = vi.hoisted(() => ({ value: "en" }));
vi.mock("next-intl", () => ({ useLocale: () => locale.value }));
vi.mock("@/i18n/navigation", () => ({ Link: "a" }));
import { DiagnosisSummary, QuestionDiagnosis } from "../../components/exam-diagnosis";
import { HandwritingRecognitionNote } from "../../components/handwriting-recognition-note";
import { GradingTrustPanel } from "../../components/grading-trust-panel";
import { ExamReliabilityStatus } from "../../components/exam-reliability-status";
import { AiPracticeNotice } from "../../components/ai-practice-notice";
import { buildSessionDiagnosis, optionReview, type DiagnosisObservation } from "../../lib/tests/diagnosis";
import { diagnosisEvidence } from "../../lib/tests/diagnosis-presentation";
import type { LongQuestion, MCQQuestion } from "../../lib/tests/questions/types";

const mcq: MCQQuestion = {
  id: "result-fixture", type: "mcq", testId: "tmua", topicId: "tmua-algebra",
  difficulty: 2, marks: 1, question: "2+2?", options: [{ key: "A", text: "4" }, { key: "B", text: "5" }],
  answer: "A", solution: "2+2=4",
};
const written: LongQuestion = {
  id: "written-fixture", type: "long", testId: "step", topicId: "step-pure1", difficulty: 3,
  totalMarks: 10, parts: [{ label: "a", marks: 10, question: "Prove the claim.", solutionOutline: "Induction." }],
  fullSolution: "Induction.",
};
const observations: DiagnosisObservation[] = [
  { question: mcq, selected: "A", earned: 1, max: 1 },
  { question: mcq, selected: "A", earned: 1, max: 1, flagged: true },
  { question: mcq, earned: 0, max: 1 },
  { question: mcq, selected: "B", earned: 0, max: 1, timeSpentSec: 2.5 },
  { question: mcq, selected: "B", firstSelected: "A", earned: 0, max: 1 },
  { question: mcq, selected: "B", earned: 0, max: 1, visits: 3 },
  { question: mcq, selected: "B", earned: 0, max: 1 },
  { question: written, work: { a: "Base case." }, earned: 5, max: 10 },
  { question: written, work: { a: "Base case." }, earned: 2, max: 10, feedback: [{ keyStepsMissing: ["inductive step"] }] },
  { question: written, earned: 0, max: 10 },
  { question: written, work: { a: "Proof." }, earned: 10, max: 10 },
  { question: written, work: { a: "Start." }, earned: 2, max: 10 },
  { question: mcq, selected: "B", earned: 0.5, max: 1 },
];

describe("localized results without rewriting student work", () => {
  it("discloses AI marking limitations in both locales", () => {
    locale.value = "en";
    expect(renderToStaticMarkup(createElement(AiPracticeNotice))).toContain("AI feedback is for practice only and is not human or official marking.");
    locale.value = "zh-CN";
    expect(renderToStaticMarkup(createElement(AiPracticeNotice))).toContain("AI 反馈仅供练习参考，不是人工或官方评分。");
  });
  it("localizes fallback option reviews while retaining authored explanations and keys", () => {
    expect(optionReview(mcq, "A", "en").title).toBe("Correct option");
    expect(optionReview(mcq, "B", "en").detail).toContain("A, the worked solution");
    expect(JSON.stringify(optionReview(mcq, "B", "en"))).not.toMatch(/[\u3400-\u9fff]/u);
    expect(optionReview(mcq, "B").title).toBe("干扰项");
    expect(optionReview({ ...mcq, optionExplanations: { B: "作者原文 x=4" } }, "B", "en").detail).toBe("作者原文 x=4");
  });
  it("renders every diagnosis code, recommendations and numeric evidence in English", () => {
    locale.value = "en";
    const summary = buildSessionDiagnosis(observations);
    expect(new Set(summary.answers.map(answer => answer.code)).size).toBe(9);
    const before = JSON.stringify(summary);
    const html = renderToStaticMarkup(createElement(DiagnosisSummary, { diagnosis: summary }));
    expect(html).toContain("What to practise next");
    expect(html).not.toMatch(/[\u3400-\u9fff]/u);
    summary.answers.forEach((diagnosis, index) => {
      const detail = renderToStaticMarkup(createElement(QuestionDiagnosis, { diagnosis, question: observations[index].question }));
      expect(detail).not.toMatch(/[\u3400-\u9fff]/u);
    });
    expect(JSON.stringify(summary)).toBe(before);
    expect(diagnosisEvidence(summary.answers[3].evidence, "en")).toContain("2.5 seconds");
    expect(diagnosisEvidence(summary.answers[12].evidence, "en")).toContain("0.5/1");
    locale.value = "zh-CN";
    expect(renderToStaticMarkup(createElement(DiagnosisSummary, { diagnosis: summary }))).toContain("本次错因诊断");
  });

  it("translates recognition labels but preserves the transcript and uncertain symbols verbatim", () => {
    locale.value = "en";
    const review = { parts: [{ label: "a", transcript: "原始手写答案 x²=4", confidence: "low" as const, unclear: ["符号 ±"], imageCount: 2 }] };
    const before = JSON.stringify(review);
    const html = renderToStaticMarkup(createElement(HandwritingRecognitionNote, { review }));
    expect(html).toContain("Read 2 handwritten images");
    expect(html).toContain("Low confidence");
    expect(html).toContain("Please check:");
    expect(html).toContain("原始手写答案 x²=4");
    expect(html).toContain("符号 ±");
    expect(JSON.stringify(review)).toBe(before);
    expect(diagnosisEvidence("评分反馈指出缺少：保留原话等步骤。", "en")).toBe("The feedback identifies missing steps: 保留原话 (and other steps).");
    expect(diagnosisEvidence("自定义学生记录", "en")).toBe("自定义学生记录");
    expect(diagnosisEvidence("已获得 50% 的过程分，但论证尚未闭合。", "zh-CN")).toBe("已获得 50% 的过程分，但论证尚未闭合。");
  });

  it.each(["deterministic-empty", "single-pass", "dual-pass", "dual-pass-adjudicated"] as const)("localizes %s trust labels and retains grading rationale", method => {
    locale.value = "en";
    const html = renderToStaticMarkup(createElement(GradingTrustPanel, { assessment: {
      method, confidence: "low", reviewStatus: "review-recommended", scoreDelta: 2,
      passScores: [5, 7], agreementRate: 80, rationale: "Original grading rationale.",
    } }));
    expect(html).toContain("Review recommended");
    expect(html).toContain("5 / 7");
    expect(html).toContain("Difference 2");
    expect(html).toContain("80%");
    expect(html).toContain("Original grading rationale.");
    expect(html).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it("announces offline persistence in the selected locale without an online alert", () => {
    locale.value = "en";
    const html = renderToStaticMarkup(createElement(ExamReliabilityStatus, { online: false }));
    expect(html).toContain('role="status"');
    expect(html).toContain("reconnect before submitting");
    expect(html).not.toMatch(/[\u3400-\u9fff]/u);
    expect(renderToStaticMarkup(createElement(ExamReliabilityStatus, { online: true }))).toBe("");
  });
});
