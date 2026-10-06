import { describe,expect,it } from "vitest";
import { ADMISSIONS_TESTS,getTestById } from "./index";
import { getMockPaper,getMockPapersForTest,getRegisteredMockPapersForTest } from "./mock-papers";
import { getReleasedPracticeQuestions,isReleasedPublishedQuestion,mergeReleasedPracticeQuestions,REVIEWED_PRACTICE_SOURCES } from "./practice-banks";
import { isReleasedPaper,releasedPracticeBank,paperPresentation,EXAM_SCOPE_NOTES } from "./syllabus-release";
import { assessSyllabusCandidate,matchesExamModule,syllabusText } from "./syllabus-policy";
import { getQuestionById,getPracticeQuestionsForTest } from "./lookup";
import { getKnowledgeByTopicId } from "./knowledge";
import type { MCQQuestion } from "./questions/types";

describe("all-exam public syllabus gates",()=>{
  it.each(ADMISSIONS_TESTS.filter(t=>t.hasQuestionBank).map(t=>t.id))("%s retains a nonempty practice bank and fixed catalogue without cross-exam questions",testId=>{
    const bank=getReleasedPracticeQuestions(testId),papers=getMockPapersForTest(testId);
    expect(bank.length).toBeGreaterThan(0);
    expect(papers.length).toBeGreaterThan(0);
    expect(bank).toBe(getPracticeQuestionsForTest(testId));
    for(const q of bank) {
      expect(q.testId).toBe(testId);
      expect(assessSyllabusCandidate(q).allowed,q.id).toBe(true);
      expect(getQuestionById(q.id)).toEqual(q);
      expect(getTestById(testId)?.topics.some(t=>t.id===q.topicId),q.id).toBe(true);
    }
    for(const p of papers) {
      expect(isReleasedPaper(p),p.id).toBe(true);
      expect(getMockPaper(p.id)).toBe(p);
      for(const q of p.modules.flatMap(m=>m.questions)) expect(q.testId).toBe(testId);
    }
  });
  it("retains exact counts for reviewed ESAT triples and P3 written papers",()=>{
    const esat=getMockPapersForTest("esat");
    expect(esat).toHaveLength(6);
    for(const p of esat) expect(p.modules.map(m=>[m.questions.length,m.durationSec])).toEqual([[27,2400],[27,2400],[27,2400]]);
    expect(getReleasedPracticeQuestions("caie9709")).toHaveLength(184);
    expect(getMockPapersForTest("caie9709")).toHaveLength(16);
  });
  it("does not re-display unverified current-format claims from historical descriptions",()=>{
    for(const testId of ["mat","pat","esat","bpho","csat","ielts"]) for(const p of getMockPapersForTest(testId)) {
      const shown=paperPresentation(p);
      expect(shown.id).toBe(p.id);
      expect(shown.modules).toBe(p.modules);
      expect(shown.description).toBe(EXAM_SCOPE_NOTES[testId]);
      expect(shown.title).toMatch(/历史训练|范围训练/);
      expect(isReleasedPaper(p)).toBe(true);
    }
  });
  it("keeps ESAT practice within one selected module, and STEP 2 free of STEP 3 methods",()=>{
    const bank=getReleasedPracticeQuestions("esat");
    for(const [examModule,count] of [["math1",29],["math2",27],["physics",28],["chemistry",28],["biology",28]] as const)
      expect(bank.filter(q=>matchesExamModule(q,examModule))).toHaveLength(count);
    const m1=bank.filter(q=>matchesExamModule(q,"math1"));
    expect(m1.map(q=>q.type==="mcq"?q.question:"").join(" ")).not.toMatch(/differentiat|derivative|\\int/);
    const step2=getReleasedPracticeQuestions("step").filter(q=>matchesExamModule(q,"step2"));
    expect(step2.map(syllabusText).join(" ")).not.toMatch(/De Moivre|roots of unity|cross product|Maclaurin|plane equation/i);
  });
  it("blocks modified/new database content and changed banks or papers until separately reviewed",()=>{
    const bank=REVIEWED_PRACTICE_SOURCES.esat;
    const q=bank[0] as MCQQuestion;
    const changed={...q,question:q.question+" Use eigenvalues."};
    expect(releasedPracticeBank("esat",[changed,...bank.slice(1)])).toEqual([]);
    expect(isReleasedPublishedQuestion("esat",changed)).toBe(false);
    expect(isReleasedPublishedQuestion("esat",{...q,id:"unreviewed-new-id"})).toBe(false);
    expect(mergeReleasedPracticeQuestions("esat",[changed])[0]).toEqual(q);
    const paper=getMockPapersForTest("esat")[0];
    expect(isReleasedPaper({...paper,description:paper.description+" changed"})).toBe(false);
  });
  it("preserves original quarantined question IDs and paper lookup for history",()=>{
    for(const id of ["esat","tmua","step","bmo","bpho"]) {
      const old=getRegisteredMockPapersForTest(id).find(p=>!isReleasedPaper(p));
      expect(old).toBeTruthy();
      expect(getMockPaper(old!.id)).toBe(old);
      for(const q of old!.modules.flatMap(m=>m.questions)) expect(getQuestionById(q.id)).toEqual(q);
    }
  });
  it("removes misleading current ESAT topics and lessons rather than merely renaming them",()=>{
    expect(getTestById("esat")!.topics.map(t=>t.id)).not.toContain("esat-math2a");
    expect(getKnowledgeByTopicId("esat-math2a")).toBeUndefined();
    expect(getKnowledgeByTopicId("esat-math2b")).toBeUndefined();
    const m1=getKnowledgeByTopicId("esat-math1")!;
    expect(JSON.stringify(m1.workedExamples)).not.toMatch(/derivative|differentiat|Argand|eigen|matrix/i);
    expect(getTestById("esat")!.studyPlan.map(p=>p.tasks.join(" ")).join(" ")).not.toContain("双模块");
  });
});
