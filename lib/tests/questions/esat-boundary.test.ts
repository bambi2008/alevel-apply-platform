import { describe,expect,it } from "vitest";
import katex from "katex";
import { ESAT_MATH1_BOUNDARY,ESAT_MATH2_BOUNDARY,ESAT_BOUNDARY_QUESTIONS } from "./esat-boundary";
import { ESAT_BOUNDARY_PAPERS } from "../mock-papers/esat-boundary-papers";
import { paperMeetsBoundary } from "../syllabus-release";
describe("reviewed ESAT module replacements",()=>{
  it("has five separate 27-question five-option modules",()=>{
    expect(ESAT_BOUNDARY_QUESTIONS).toHaveLength(135);
    expect(new Set(ESAT_BOUNDARY_QUESTIONS.map(q=>q.id)).size).toBe(135);
    for(const q of ESAT_BOUNDARY_QUESTIONS) {
      expect(q.options).toHaveLength(5);
      expect(new Set(q.options.map(o=>o.text)).size,q.id).toBe(5);
      expect(q.options.some(o=>o.key===q.answer)).toBe(true);
    }
  });
  it("never introduces calculus or further maths into Mathematics 1",()=>{
    for(const q of ESAT_MATH1_BOUNDARY) expect(q.question).not.toMatch(/derivative|differentiat|\\int|\\log|complex|matrix|binomial theorem|sum to infinity/i);
    expect(ESAT_MATH2_BOUNDARY.some(q=>/\\int/.test(q.question))).toBe(true);
  });
  it("builds all six legal distinct course-dependent triples, not two-module full mocks",()=>{
    expect(ESAT_BOUNDARY_PAPERS).toHaveLength(6);
    expect(ESAT_BOUNDARY_PAPERS.every(paperMeetsBoundary)).toBe(true);
    for(const p of ESAT_BOUNDARY_PAPERS) expect(p.modules.flatMap(m=>m.questions)).toHaveLength(81);
    expect(paperMeetsBoundary({...ESAT_BOUNDARY_PAPERS[0],modules:ESAT_BOUNDARY_PAPERS[0].modules.slice(1)})).toBe(false);
  });
  it("preserves independent numerical answers after option rotation",()=>{
    const expected=[`${Math.round((2*.2+3*.8)/5*100)}%`,`£${96/(1.2*.8)}`,`${10/(40/60)} km/h`,"$9/4$","$3\\sqrt3$","10:12"];
    for(let i=0;i<expected.length;i++) expect(ESAT_MATH1_BOUNDARY[i].options.find(o=>o.key===ESAT_MATH1_BOUNDARY[i].answer)?.text).toBe(expected[i]);
    const prob=ESAT_MATH1_BOUNDARY[24];
    expect(prob.options.find(o=>o.key===prob.answer)?.text).toBe("$3/10$");
  });
  it("contains no old university-physics or molecular-biology prerequisite",()=>{
    expect(ESAT_BOUNDARY_QUESTIONS.map(q=>q.question).join(" ")).not.toMatch(/photoelectric|capacitor|centripetal|Hardy|peptidoglycan|oxidative phosphorylation|promoter|PCR|electron configuration|aldehyde|non.polar/i);
  });
  it("balances answer positions in each released module",()=>{
    for(let i=0;i<5;i++) {
      const bank=ESAT_BOUNDARY_QUESTIONS.slice(i*27,(i+1)*27);
      const counts=Object.values(bank.reduce<Record<string,number>>((n,q)=>{n[q.answer]=(n[q.answer]??0)+1;return n;},{}));
      expect(counts.sort()).toEqual([5,5,5,6,6]);
    }
  });
  it("renders every formula without control characters or KaTeX parse errors",()=>{
    for(const q of ESAT_BOUNDARY_QUESTIONS) for(const text of [q.question,q.solution,...q.options.map(o=>o.text)]) {
      expect(text,q.id).not.toMatch(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/);
      for(const match of text.matchAll(/\$([^$]+)\$/g)) expect(()=>katex.renderToString(match[1],{throwOnError:true}),q.id).not.toThrow();
    }
  });
});
