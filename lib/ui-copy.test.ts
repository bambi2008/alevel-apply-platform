import { describe, expect, it } from "vitest";
import { uiCopy } from "./ui-copy";
import dictionary from "@/data/ui-copy-en.json";
import { INTERVIEW_SUBJECTS } from "./interview";
import { INTERVIEW_BLURBS_EN, INTERVIEW_GUIDE_EN } from "./interview/presentation";
describe("reviewed bilingual UI copy", () => {
  it("has English-only translations with exactly matching interpolation tokens", () => {
    for (const [source, english] of Object.entries(dictionary)) {
      expect(english.trim()).not.toBe("");
      expect(english).not.toMatch(/[\u4e00-\u9fff]/u);
      expect([...english.matchAll(/\{\d+\}/g)].map(match => match[0]).sort()).toEqual([...source.matchAll(/\{\d+\}/g)].map(match => match[0]).sort());
      expect(uiCopy("zh-CN", source)).toBe(source);
    }
  });
  it("formats translated values without rewriting unknown data or object prototype names", () => {
    expect(uiCopy("en", "最高 {0} 题得分", 6)).toBe("Best 6 question marks");
    expect(uiCopy("en", "constructor")).toBe("constructor");
    expect(uiCopy("en", "a student's own wording")).toBe("a student's own wording");
  });
  it("covers every interview subject and keeps coaching guidance in English", () => {
    for (const subject of INTERVIEW_SUBJECTS) expect(INTERVIEW_BLURBS_EN[subject.id]).toMatch(/[A-Za-z]/);
    expect(INTERVIEW_GUIDE_EN).toHaveLength(5);
    expect(JSON.stringify(INTERVIEW_GUIDE_EN)).not.toMatch(/[\u4e00-\u9fff]/u);
  });
});
