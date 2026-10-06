import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { readFileSync } from "node:fs";
import { getMockPapersForTest } from "../mock-papers";
import { getReleasedPracticeQuestions } from "../practice-banks";
import { LIMITED_TRAINING_TEST_IDS, paperPresentation, trainingPresentationViolations, examTrainingActionLabel } from "../syllabus-release";
import { topicDistributionIssues } from "./index";
import { ExamScopeNote } from "../../../components/exam-scope-note";
import type { MCQQuestion } from "../questions/types";

describe("enforced limited-training contract", () => {
  it.each(LIMITED_TRAINING_TEST_IDS)("%s has visible disclosure and no full-exam action",testId=>{
    expect(examTrainingActionLabel(testId)).toMatch(/计时训练/);
    const html=renderToStaticMarkup(createElement(ExamScopeNote,{testId}));
    expect(html).toContain('role="note"');
    expect(html.indexOf("非全真考试")).toBeLessThan(html.indexOf("<details"));
    expect(html).toContain("不代表完整考纲覆盖或官方难度");
    for(const p of getMockPapersForTest(testId)) {
      const shown=paperPresentation(p);
      expect(trainingPresentationViolations(p,shown)).toEqual([]);
      expect(shown.title).not.toMatch(/全真|完整|Full Mock/i);
      expect(shown.formatType).toBe("extension");
      expect(shown.instructions?.join(" ")).toContain("不代表官方成绩");
      expect(shown.modules).toBe(p.modules);
    }
  });
  it("blocks every presentation escape, not merely known warning IDs",()=>{
    for(const id of LIMITED_TRAINING_TEST_IDS) {
      const p=getMockPapersForTest(id)[0], shown=paperPresentation(p);
      for(const bad of [
        {...shown,title:"全真模拟考试"},{...shown,titleEn:"Full official mock"},
        {...shown,formatType:"current" as const},{...shown,description:""},
        {...shown,instructions:[]},{...shown,modules:[]},{...shown,testId:"tmua"},
      ]) expect(trainingPresentationViolations(p,bad).length,id).toBeGreaterThan(0);
    }
  });
  it("wires actual student routes to the shared enforced presentation",()=>{
    const root=process.cwd();
    const detail=readFileSync(`${root}/app/[locale]/tests/[testId]/page.tsx`,"utf8");
    const paper=readFileSync(`${root}/app/[locale]/tests/[testId]/paper/[paperId]/page.tsx`,"utf8");
    const catalogue=readFileSync(`${root}/app/[locale]/tests/[testId]/mock/page.tsx`,"utf8");
    expect(detail).toContain("examTrainingActionLabel(test.id)");
    expect(detail).toContain("<ExamScopeNote testId={test.id}");
    expect(paper).toContain("const presentation = paperPresentation(paper)");
    expect(paper).toContain("<WrittenPaperRunner paper={presentation}");
    expect(paper).toContain("<ObjectiveExamRunner paper={presentation");
    const objective=readFileSync(`${root}/components/objective-exam-runner.tsx`,"utf8");
    expect(objective).toContain('aria-label="训练限制"');
    expect(objective).toContain("paper.instructions?.map");
    expect(objective).toContain('isLimitedTrainingTest(paper.testId) ? "开始训练"');
    expect(catalogue).toContain("paperTrainingTitle(p)");
    expect(catalogue).toContain("<ExamScopeNote testId={testId}");
    const frame=readFileSync(`${root}/components/core-route-frame.tsx`,"utf8");
    expect(frame).toContain('mock: "计时训练"');
    expect(frame).not.toContain('mock: "完整模考"');
    const cli=readFileSync(`${root}/scripts/audit-question-bank.ts`,"utf8");
    expect(cli).toContain("report.totals.critical > 0 || report.totals.warning > 0");
  });
});

describe("module-comparable distribution audit",()=>{
  const base=getReleasedPracticeQuestions("esat")[0] as MCQQuestion;
  const rows=(prefix:string,topic:string,n:number)=>Array.from({length:n},(_,i)=>({...base,id:`esat-boundary-${prefix}-fixture-${i}`,topicId:topic}));
  it("does not compare a whole Math 1 module against individual physics topics",()=>{
    const qs=[...rows("m1","esat-math1",30),...rows("p","esat-phys1",4),...rows("p","esat-phys2",4)];
    expect(topicDistributionIssues("esat",["esat-math1","esat-phys1","esat-phys2"],qs)).toEqual([]);
  });
  it("still blocks skew inside a module at the unchanged threshold",()=>{
    const qs=[...rows("p","esat-phys1",9),...rows("p","esat-phys2",2)];
    expect(topicDistributionIssues("esat",["esat-phys1","esat-phys2"],qs)).toEqual([expect.objectContaining({code:"TOPIC_IMBALANCE",severity:"warning"})]);
    expect(topicDistributionIssues("esat",["esat-phys1","esat-phys2"],[...rows("p","esat-phys1",8),...rows("p","esat-phys2",2)])).toEqual([]);
  });
  it("preserves the non-ESAT factor-three threshold",()=>{
    const qs=[...rows("p","bpho-mechanics",10),...rows("p","bpho-modern",3)].map(q=>({...q,testId:"bpho"}));
    expect(topicDistributionIssues("bpho",["bpho-mechanics","bpho-modern"],qs)).toHaveLength(1);
  });
});
