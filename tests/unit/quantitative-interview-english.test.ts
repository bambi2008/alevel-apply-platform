import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
const locale = vi.hoisted(() => ({ value: "en" }));
vi.mock("next-intl", () => ({ useLocale: () => locale.value }));
import { QuantitativeInterviewSimulator } from "@/components/interview/quantitative-interview-simulator";
import { QuantitativeInterviewPaperSimulator } from "@/components/interview/quantitative-interview-paper-simulator";
import { getQuantitativeDrills, QUANTITATIVE_INTERVIEW_SUBJECTS, scoreQuantitativeResponse } from "@/lib/interview/quantitative-interview";
import { getQuantitativeInterviewPapers } from "@/lib/interview/quantitative-interview-papers";
import { localizeStaticContent } from "@/lib/content-language";
import { presentInterviewReview } from "@/lib/interview/review-presentation";
import dictionary from "@/data/ui-copy-en.json";

describe("quantitative interview English presentation", () => {
  it.each([...QUANTITATIVE_INTERVIEW_SUBJECTS])("renders %s drill and fixed-set introductions without Chinese", subjectName => {
    locale.value = "en";
    const drills = localizeStaticContent(getQuantitativeDrills(subjectName), "en");
    const papers = localizeStaticContent(getQuantitativeInterviewPapers(subjectName), "en");
    const snapshot = JSON.stringify({ drills, papers });
    const drillHtml = renderToStaticMarkup(createElement(QuantitativeInterviewSimulator, { subjectName, drills }));
    const paperHtml = renderToStaticMarkup(createElement(QuantitativeInterviewPaperSimulator, { subjectName, papers }));
    expect(drillHtml).toContain("Start a random question");
    expect(paperHtml).toContain("Fixed quantitative interview practice sets");
    expect(drillHtml + paperHtml).not.toMatch(/[\u3400-\u9fff]/u);
    expect(JSON.stringify({ drills, papers })).toBe(snapshot);
  });
  it("keeps scores, flags and personal evidence exact, translating only owned metadata", () => {
    const drill = getQuantitativeDrills("maths")[0];
    for (const work of ["", "我假设变量为 x，因为先用公式 x=2，然后代入得 3，单位 m/s。检查范围和数量级合理。My original wording."]) {
      const raw = scoreQuantitativeResponse(drill, work, "如果条件改变，重新调整边界，因为模型不同。My follow-up.").review;
      const snapshot = JSON.stringify(raw);
      const shown = presentInterviewReview(raw, "en");
      expect(shown.total).toBe(raw.total);
      expect(shown.max).toBe(raw.max);
      expect(shown.weakest.id).toBe(raw.weakest.id);
      for (const [i, skill] of shown.skills.entries()) {
        expect([skill.id, skill.passed, skill.partial, skill.evidence]).toEqual([raw.skills[i].id, raw.skills[i].passed, raw.skills[i].partial, raw.skills[i].evidence]);
        expect(skill.evidence).toBe(raw.skills[i].evidence);
        expect(JSON.stringify({ ...skill, evidence: [] })).not.toMatch(/[\u3400-\u9fff]/u);
      }
      expect(JSON.stringify(raw)).toBe(snapshot);
      expect(presentInterviewReview(raw, "zh-CN")).toBe(raw);
    }
  });
  it("covers preparation and result controls in both quantitative components", () => {
    for (const file of ["quantitative-interview-simulator", "quantitative-interview-paper-simulator"]) {
      const source = readFileSync(`components/interview/${file}.tsx`, "utf8");
      for (const match of source.matchAll(/\bui\("([^"]+)"/g)) expect(Object.hasOwn(dictionary, match[1]), match[1]).toBe(true);
      expect(source).not.toMatch(/\bui\((?:response|followUpResponse|feedback|skill\.evidence\[0\])/);
    }
  });
});
