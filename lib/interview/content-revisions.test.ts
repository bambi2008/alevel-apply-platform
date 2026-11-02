import { describe, expect, it } from "vitest";
import katex from "katex";
import { INTERVIEW_QUESTIONS as originals } from "./questions";
import { INTERVIEW_QUESTIONS as current } from "./index";
import { reviseInterviewQuestion } from "./content-revisions";
import { contentText } from "../content-language";

describe("reviewed interview prompt and formula revisions", () => {
  it("keeps the original bank immutable and creates seven stable revised identities", () => {
    expect(current).toHaveLength(65);
    expect(current.filter(q => q.id.endsWith("-rev20261026"))).toHaveLength(7);
    expect(originals.find(q => q.id === "int-maths-1")?.prompt).toContain("一黑一白");
    expect(current.find(q => q.id === "int-maths-1-rev20261026")?.prompt).not.toContain("一黑一白");
    for (const q of originals) expect(reviseInterviewQuestion(reviseInterviewQuestion(q))).toEqual(reviseInterviewQuestion(q));
  });
  it("renders every corrected formula and translated formula without control-character corruption", () => {
    for (const q of current.filter(q => q.id.endsWith("-rev20261026"))) {
      for (const text of [q.prompt, q.approach, ...(q.followUps ?? [])]) {
        expect(text).not.toMatch(/[\u0000-\u0008\u000b-\u001f\t]/u);
        for (const version of [text, contentText(text, "en")]) {
          for (const match of version.matchAll(/\$([^$]+)\$/g)) {
            expect(() => katex.renderToString(match[1], { throwOnError: true }), `${q.id}: ${match[1]}`).not.toThrow();
          }
        }
      }
    }
    const iteration = current.find(q => q.id === "int-maths-6-rev20261026")!;
    expect(iteration.prompt).toContain("\\tfrac12");
    expect(iteration.approach).toContain("\\sqrt6");
    expect(iteration.followUps?.[1]).toContain("\\sqrt6");
    expect(contentText(iteration.prompt, "en")).toContain("\\tfrac12");
    expect(2.5).toBeGreaterThan(Math.sqrt(6));
    expect(49 / 20).toBeGreaterThan(Math.sqrt(6));
  });
});
