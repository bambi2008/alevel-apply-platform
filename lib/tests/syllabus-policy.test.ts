import { describe,expect,it } from "vitest";
import { assessSyllabusCandidate,OFFICIAL_SYLLABUS_SOURCES,syllabusFingerprint } from "./syllabus-policy";
import { TMUA_QUESTIONS } from "./questions/tmua";
import { ESAT_QUESTIONS } from "./questions/esat";
import { CAIE9709_QUESTIONS } from "./questions/caie9709";
import { MAT_QUESTIONS } from "./questions/mat";
describe("official content boundaries",()=>{
  it("registers all thirteen public exams",()=>expect(Object.keys(OFFICIAL_SYLLABUS_SOURCES)).toHaveLength(13));
  it("quarantines the old ESAT complex/vector/matrix banks instead of trusting their topic names",()=>{
    expect(ESAT_QUESTIONS.filter(q=>["esat-math2a","esat-math2b"].includes(q.topicId)).every(q=>!assessSyllabusCandidate(q).allowed)).toBe(true);
  });
  it("rejects the reported TMUA leakage and permits basic power calculus",()=>{
    for (const id of ["tmua-r2-c04","tmua-r3-c09"]) expect(assessSyllabusCandidate(TMUA_QUESTIONS.find(q=>q.id===id)!).allowed,id).toBe(false);
    expect(assessSyllabusCandidate(TMUA_QUESTIONS.find(q=>q.id==="tmua-calc-01")!).allowed).toBe(true);
    expect(TMUA_QUESTIONS.filter(q=>/variance|covariance|random variable|expected value/i.test(q.question)).every(q=>!assessSyllabusCandidate(q).allowed)).toBe(true);
  });
  it("retains revised P3 while refusing question relabelling across exams",()=>{
    expect(CAIE9709_QUESTIONS.every(q=>assessSyllabusCandidate(q).allowed)).toBe(true);
    expect(assessSyllabusCandidate({...TMUA_QUESTIONS[0],testId:"esat"}).allowed).toBe(false);
  });
  it("snapshots answer and solution edits as well as prompts",()=>{
    const q=TMUA_QUESTIONS[0];
    expect(syllabusFingerprint({...q,solution:q.solution+" updated"})).not.toBe(syllabusFingerprint(q));
    expect(syllabusFingerprint({...q,answer:q.answer==="A"?"B":"A"})).not.toBe(syllabusFingerprint(q));
  });
  it("rejects MAT logarithmic calculus while allowing legal power working with a log distractor",()=>{
    const logDerivative=MAT_QUESTIONS.find(q=>q.type==="mcq" && q.question.includes("x^x"));
    expect(logDerivative).toBeTruthy();
    expect(assessSyllabusCandidate(logDerivative!).allowed).toBe(false);
    const logArea=MAT_QUESTIONS.find(q=>q.type==="long" && q.parts.some(p=>p.solutionOutline.includes("\\ln2-")));
    expect(logArea).toBeTruthy();
    expect(assessSyllabusCandidate(logArea!).allowed).toBe(false);
    const parametric=MAT_QUESTIONS.find(q=>q.type==="mcq" && q.question.includes("x=t^2"));
    expect(parametric).toBeTruthy();
    expect(assessSyllabusCandidate(parametric!).allowed).toBe(false);
    const base=MAT_QUESTIONS.find(q=>q.type==="mcq")!;
    const power={...base,type:"mcq" as const,topicId:"mat-calc",question:"Differentiate $y=x^3$.",solution:"The power rule gives $3x^2$.",marks:1,
      options:[{key:"A" as const,text:"$3x^2$"},{key:"B" as const,text:"$3x$"},{key:"C" as const,text:"$x^2$"},{key:"D" as const,text:"$\\ln 2$"}],answer:"A" as const};
    expect(assessSyllabusCandidate(power).allowed).toBe(true);
    expect(assessSyllabusCandidate({...power,question:"Differentiate $y=e^{2x}$.",solution:"The derivative is $2e^{2x}$."}).allowed).toBe(true);
  });
});
