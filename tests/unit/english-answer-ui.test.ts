import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
const locale = vi.hoisted(() => ({ value: "en" }));
vi.mock("next-intl", () => ({ useLocale: () => locale.value }));
import { HandwrittenAnswerInput } from "../../components/handwritten-answer-input";
import { ExamScopeNote } from "../../components/exam-scope-note";
import { englishPaperPresentation, EXAM_SCOPE_NOTES_EN } from "../../lib/tests/english-presentation";
import { getMockPapersForTest } from "../../lib/tests/mock-papers";
import { LIMITED_TRAINING_TEST_IDS } from "../../lib/tests/syllabus-release";

describe("English answer controls and retained scope disclosures", () => {
  it.each(["en", "zh-CN"])("keeps typed work untouched and desktop photo selection accessible in %s", value => {
    locale.value = value;
    const work = "我的原始答案 x=2";
    const html = renderToStaticMarkup(createElement(HandwrittenAnswerInput, {
      value: work, onChange: () => {}, images: [], onImagesChange: () => {}, contextKey: "local-fixture",
    }));
    expect(html).toContain(work);
    expect(html).not.toContain('capture="environment"');
    expect(html).toContain('accept="image/jpeg,image/png,image/webp"');
    expect(html).toContain(value === "en" ? "Choose images" : "选图片");
    expect(html).toContain(value === "en" ? "Optional notes" : "补充文字（可选）");
    expect(html).toContain("min-h-11");
  });
  it("supplies English scope notes for all thirteen exams without weakening limitations", () => {
    expect(Object.keys(EXAM_SCOPE_NOTES_EN)).toHaveLength(13);
    for (const testId of Object.keys(EXAM_SCOPE_NOTES_EN)) {
      const html = renderToStaticMarkup(createElement(ExamScopeNote, { testId, locale: "en" }));
      expect(html).not.toMatch(/[\u3400-\u9fff]/u);
      expect(html).toContain("not official questions");
      if ((LIMITED_TRAINING_TEST_IDS as readonly string[]).includes(testId)) {
        expect(html).toContain("Not a full examination");
        for (const paper of getMockPapersForTest(testId)) {
          const shown = englishPaperPresentation(paper, "en");
          expect(shown.id).toBe(paper.id);
          expect(shown.title).not.toMatch(/full mock|official mock/i);
          expect(shown.description).toBe(EXAM_SCOPE_NOTES_EN[testId]);
          expect(shown.instructions?.join(" ")).toContain("Scores are not official results");
          expect(shown.modules.map(m => [m.id, m.durationSec, m.questions.map(q => q.id)]))
            .toEqual(paper.modules.map(m => [m.id, m.durationSec, m.questions.map(q => q.id)]));
        }
      }
    }
  });
});
