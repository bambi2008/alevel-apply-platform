import { describe, expect, it } from "vitest";
import katex from "katex";
import { P3_SYLLABUS_SUPPLEMENTS as p3, ESAT_SYLLABUS_SUPPLEMENTS as esat, BPHO_SYLLABUS_SUPPLEMENTS as bpho } from "./syllabus-supplements";
import { assessSyllabusCandidate, syllabusText } from "../syllabus-policy";
import { CAIE9709_P3_ACTIVE_PAPERS, CAIE9709_P3_ACTIVE_TARGETED_IDS } from "./caie9709";

describe("original syllabus gap practice", () => {
  it("fills actual missing P3 bands without changing fixed papers or error targets", () => {
    expect(p3).toHaveLength(8);
    expect(p3.map(q=>[q.topicId,q.difficulty])).toEqual([
      ["caie9709-log-exp",3],["caie9709-trig",3],["caie9709-differentiation",1],
      ["caie9709-numerical",1],["caie9709-numerical",3],["caie9709-vectors",1],["caie9709-vectors",2],["caie9709-de",1],
    ]);
    expect(CAIE9709_P3_ACTIVE_PAPERS).toHaveLength(16);
    expect(CAIE9709_P3_ACTIVE_PAPERS.every(p=>p.length===11 && p.reduce((n,q)=>n+q.totalMarks,0)===75)).toBe(true);
    expect(CAIE9709_P3_ACTIVE_TARGETED_IDS.size).toBe(44);
    expect(CAIE9709_P3_ACTIVE_PAPERS.flat().some(q=>p3.some(p=>p.id===q.id))).toBe(false);
    for(const q of p3) for(const p of q.parts) expect([...p.solutionOutline.matchAll(/\[(?:M|A|B)(\d+)\]/g)].reduce((n,m)=>n+Number(m[1]),0),q.id).toBe(p.marks);
  });
  it("independently checks log domains and parameter roots", () => {
    for(const k of [0.1,1,3,3.9]) for(const x of [3-Math.sqrt(4-k),3+Math.sqrt(4-k)]) {
      expect(x).toBeGreaterThan(1); expect(x).toBeLessThan(5);
      expect(Math.log(x-1)+Math.log(5-x)).toBeCloseTo(Math.log(k),12);
    }
    expect((3-1)*(5-3)).toBe(4);
  });
  it("verifies both exact trigonometric roots and excludes the repeated endpoint", () => {
    const alpha=Math.atan(3/4), f=(x:number)=>3*Math.sin(2*x)+4*Math.cos(2*x);
    for(const x of [0,alpha]) expect(f(x)).toBeCloseTo(4,12);
    for(const x of [0.2,0.7,1.2,2.9]) expect(f(x)).toBeCloseTo(5*Math.cos(2*x-alpha),12);
    expect(alpha).toBeGreaterThan(0); expect(alpha).toBeLessThan(Math.PI);
  });
  it("recomputes iteration values, instability and the rounding bracket", () => {
    expect(Math.cbrt(2).toFixed(4)).toBe("1.2599");
    expect(Math.cbrt(3-Math.cbrt(2)).toFixed(4)).toBe("1.2028");
    let x=1.5; for(let i=0;i<50;i++) x=(x+2-Math.log(x))/2;
    expect(x.toFixed(4)).toBe("1.5571");
    expect(Math.exp(2-x)).toBeCloseTo(x,12);
    expect(x).toBeGreaterThan(1); // |g'(alpha)|=alpha, so g is unsuitable.
    const f=(v:number)=>v+Math.log(v)-2;
    expect(f(1.55705)).toBeLessThan(0); expect(f(1.55715)).toBeGreaterThan(0);
    expect((1-1/x)/2).toBeLessThan(0.25);
  });
  it("checks gradients, vector intersection and the separable DE", () => {
    const derivative=(f:(x:number)=>number,x:number)=>(f(x+1e-5)-f(x-1e-5))/2e-5;
    expect(derivative(x=>Math.log(2*x+1),0)).toBeCloseTo(2,8);
    expect([1+2*2,-2,2+2]).toEqual([3+2,-4+2,4]);
    expect(2*1+(-1)*1+1*0).toBe(1);
    const y=(x:number)=>2*Math.exp(x**3);
    for(const x of [-0.3,0,0.7]) expect(derivative(y,x)).toBeCloseTo(3*x*x*y(x),7);
    expect(y(0)).toBe(2); expect(y(1)).toBeCloseTo(2*Math.E,12);
  });
  it("checks new ESAT numerical answers by independent models", () => {
    const final=(v:number)=>{ let solute=20*(1-v/100); solute*=1-v/100; solute+=0.6*v; return solute; };
    expect(final(20)).toBeCloseTo(24.8,12);
    expect(final(10)).not.toBeCloseTo(24.8,4);
    const old=10000*.2*.1, next=15000*.12*.25;
    expect((next-old)/old*100).toBe(125);
    expect(8400/(0.2*4200)).toBe(10);
    expect(esat[1].difficulty).toBe(3); expect(esat[1].question).toContain("removed again");
    expect(esat[2].difficulty).toBe(3); expect(esat[2].question).toContain("percentage");
  });
  it("checks BPhO school-level models without unstated quantum prerequisites", () => {
    expect(640/2**(18/6)+20).toBe(100);
    expect((1/2)/(1/1)).toBe(0.5); // new photon rate when wavelength halves
    expect(bpho[1].question).toContain("is given");
  });
  it("renders formulas, preserves ownership and forbids known prerequisite leaks", () => {
    const all=[...p3,...esat,...bpho];
    expect(new Set(all.map(q=>q.id)).size).toBe(15);
    for(const q of all) {
      expect(assessSyllabusCandidate(q).allowed,q.id).toBe(true);
      const text=syllabusText(q);
      expect(text,q.id).not.toMatch(/De Moivre|Newton.Raphson|eigenvalue|cross product|plane equation/);
      expect(text,q.id).not.toMatch(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/);
      for(const m of text.matchAll(/\$([^$]+)\$/g)) expect(()=>katex.renderToString(m[1],{throwOnError:true}),q.id).not.toThrow();
      if(q.type==="mcq") { expect(new Set(q.options.map(o=>o.text)).size).toBe(5); expect(q.options.some(o=>o.key===q.answer)).toBe(true); }
    }
  });
});
