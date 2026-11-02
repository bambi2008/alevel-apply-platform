import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
vi.mock("next-intl/server", () => ({ setRequestLocale: vi.fn() }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NOT_FOUND"); } }));
vi.mock("../../components/practice-session", () => ({ PracticeSession: () => null }));
import Page from "../../app/[locale]/tests/[testId]/practice/page";
import { getReleasedPracticeQuestions, mergeReleasedPracticeQuestions } from "../../lib/tests/practice-banks";
import { assessSyllabusCandidate, matchesExamModule } from "../../lib/tests/syllabus-policy";
import type { Question } from "../../lib/tests/questions/types";

describe("exam-selected practice payload", () => {
  it.each(["caie9709", "esat", "step", "tmua"])("preserves released identities/keys/marks/modules for %s", async testId => {
    const source = getReleasedPracticeQuestions(testId);
    const shown = await Page({ params: Promise.resolve({ testId, locale: "en" }) });
    const questions: Question[] = shown.props.questions;
    expect(questions.map(q => [q.id, q.type === "mcq" ? q.answer : q.parts.map(p => p.marks)]))
      .toEqual(source.map(q => [q.id, q.type === "mcq" ? q.answer : q.parts.map(p => p.marks)]));
    expect(questions.every(q => q.testId === testId)).toBe(true);
    for (const q of source) expect(shown.props.questionModules[q.id]).toBe(assessSyllabusCandidate(q).module);
    for (const examModule of testId === "esat" ? ["math1", "math2", "physics", "chemistry", "biology"] : ["step2", "step3"]) {
      const ids = questions.filter(q => testId === "esat" ? shown.props.questionModules[q.id] === examModule
        : testId !== "step" || examModule === "step3" || shown.props.questionModules[q.id] === "step2").map(q => q.id);
      expect(ids).toEqual(source.filter(q => matchesExamModule(q, examModule)).map(q => q.id));
    }
    expect(mergeReleasedPracticeQuestions(testId, source)).toEqual(source);
    expect(mergeReleasedPracticeQuestions(testId, source.map(q => ({ ...q, difficulty: q.difficulty === 1 ? 2 : 1 })))).toEqual(source);
    expect(JSON.stringify(shown.props.questions)).not.toMatch(/[\u3400-\u9fff]/);
  });
  it("retains Chinese originals and rejects unknown exams", async () => {
    const page = await Page({ params: Promise.resolve({ testId: "esat", locale: "zh-CN" }) });
    expect(page.props.questions).toBe(getReleasedPracticeQuestions("esat"));
    await expect(Page({ params: Promise.resolve({ testId: "missing", locale: "en" }) })).rejects.toThrow("NOT_FOUND");
  });
  it("keeps the full bank and translation corpus outside the interactive view", () => {
    const source = readFileSync("components/practice-session.tsx", "utf8");
    expect(source).not.toMatch(/getReleasedPracticeQuestions|mergeReleasedPracticeQuestions|localizeStaticContent|from ["']@\/lib\/content-language["']|from ["']@\/lib\/tests\/syllabus-policy["']/);
    expect(source).toContain('import type { AdmissionsTest }');
  });
});
