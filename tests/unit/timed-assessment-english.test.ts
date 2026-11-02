import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
const locale = vi.hoisted(() => ({ value: "en" }));
vi.mock("next-intl", () => ({ useLocale: () => locale.value }));
import { TimedAssessmentSimulator } from "@/components/interview/cambridge-assessment-simulator";
import { CAMBRIDGE_ASSESSMENT_FLOWS } from "@/lib/interview/cambridge-assessment-flows";
import { HK_INTERVIEW_FLOWS } from "@/lib/interview/hk-interview-flows";
import { getQuestionsBySubject } from "@/lib/interview";
import { localizeStaticContent } from "@/lib/content-language";
import dictionary from "@/data/ui-copy-en.json";

describe("fixed assessment English presentation", () => {
  it("covers every static control, including preparation and result states", () => {
    const source = readFileSync("components/interview/cambridge-assessment-simulator.tsx", "utf8");
    for (const match of source.matchAll(/\bt\("([^"]+)"/g)) {
      expect(Object.hasOwn(dictionary, match[1]), match[1]).toBe(true);
    }
    expect(source).toContain('aria-label={t("准备笔记")}');
    expect(source).toContain('aria-label={t("作答内容")}');
    // Personal notes, responses and feedback are displayed verbatim, not dictionary inputs.
    expect(source).not.toMatch(/(?:contentText|localizeStaticContent)\((?:notes|answer|feedback|responses)/);
  });
  it.each([...CAMBRIDGE_ASSESSMENT_FLOWS, ...HK_INTERVIEW_FLOWS])("renders $subjectId in English without changing identity or timings", flow => {
    locale.value = "en";
    const snapshot = JSON.stringify(flow);
    const questions = localizeStaticContent(getQuestionsBySubject(flow.subjectId), "en");
    const html = renderToStaticMarkup(createElement(TimedAssessmentSimulator, { flow, subjectName: flow.subjectId, questions }));
    expect(html).toContain("Start the assessment");
    expect(html).toContain(`About ${Math.round(flow.tasks.reduce((n, t) => n + t.preparationSec + t.responseSec, 0) / 60)} minutes`);
    expect(html).not.toMatch(/[\u3400-\u9fff]/u);
    expect(JSON.stringify(flow)).toBe(snapshot);
  });
  it("retains the Chinese overview", () => {
    locale.value = "zh-CN";
    const flow = CAMBRIDGE_ASSESSMENT_FLOWS[0];
    const html = renderToStaticMarkup(createElement(TimedAssessmentSimulator, { flow, subjectName: flow.subjectId, questions: getQuestionsBySubject(flow.subjectId) }));
    expect(html).toContain(flow.title);
    expect(html).toContain("开始固定流程");
  });
});
