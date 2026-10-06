import { describe, expect, it } from "vitest";
import { CAIE9709_QUESTIONS, CAIE9709_P3_ACTIVE_PAPERS, CAIE9709_P3_PREVIOUS_QUESTIONS } from "./caie9709";
import { P3_COEFFICIENT_CASES, P3_PARTIAL_FRACTION_CASES } from "./caie9709-p3-r3";
import { getMockPaper, getMockPapersForTest } from "../mock-papers";
import { CAIE9709_P3_ARCHIVED_PAPERS, getCurrentP3PaperId } from "../mock-papers/caie9709-p3-written-papers";

const text = (q: typeof CAIE9709_QUESTIONS[number]) => [q.context, ...q.parts.map(p => p.question), q.fullSolution].join(" ");
const partText = (q: typeof CAIE9709_QUESTIONS[number]) => q.parts.map(p => p.question).join(" ");
const derivative = (f: (x: number) => number, x: number) => (f(x+1e-5)-f(x-1e-5))/2e-5;
const evalPoly = (coefficients: number[], x: number) => coefficients.reduce((a,c,i) => a+c*x**i,0);
function integrate(f: (x: number) => number, a: number, b: number) {
  const n = 2048, h = (b-a)/n;
  let sum = f(a)+f(b);
  for (let i=1;i<n;i++) sum += (i%2 ? 4:2)*f(a+i*h);
  return sum*h/3;
}
const calculus = CAIE9709_P3_ACTIVE_PAPERS.slice(8).map(p => p.find(q => q.topicId === "caie9709-integration")!);

describe("P3 R3 method boundaries and linked paper tasks", () => {
  it("keeps every former paper resolvable with its original work and excludes it from new starts", () => {
    expect(CAIE9709_P3_ARCHIVED_PAPERS).toHaveLength(24);
    expect(CAIE9709_P3_PREVIOUS_QUESTIONS.every(q => !CAIE9709_QUESTIONS.some(n => n.id === q.id))).toBe(true);
    const starts = new Set(getMockPapersForTest("caie9709").map(p => p.id));
    for (const p of CAIE9709_P3_ARCHIVED_PAPERS) {
      expect(getMockPaper(p.id)).toEqual(p);
      expect(starts.has(p.id)).toBe(false);
      expect(starts.has(getCurrentP3PaperId(p.id)!)).toBe(true);
    }
    const oldQuestion = getMockPaper("caie9709-p3-written-3")!.modules[0].questions[1];
    const newQuestion = getMockPaper("caie9709-p3-written-3-r3")!.modules[0].questions[1];
    if (oldQuestion.type !== "long" || newQuestion.type !== "long") throw new Error("P3 must use written questions");
    expect(oldQuestion.parts[0].question).toContain("w^3=8i");
    expect(newQuestion.parts[0].question).toContain("square roots");
  });
  it("rejects previously observed out-of-scope required methods throughout the active bank", () => {
    for (const q of CAIE9709_QUESTIONS) {
      expect(text(q),q.id).not.toMatch(/叉积|叉乘|De Moivre|Newton's method|\\times|common perpendicular|plane equation|平面方程/);
      expect(partText(q),q.id).not.toMatch(/Solve \$w\^3|nth roots|roots of unity|shortest distance between.*skew/i);
    }
  });
  it("requires actual drawing and linked methods in all eight revision papers", () => {
    const orders = new Set<string>();
    for (const paper of CAIE9709_P3_ACTIVE_PAPERS.slice(8)) {
      const pf = paper.find(q => /binomial expansions/.test(partText(q)))!;
      expect(partText(pf)).toMatch(/partial fractions/);
      expect(partText(pf)).toMatch(/repeated factor/);
      expect(partText(pf)).toMatch(/interval of validity/);
      const c = paper.find(q => q.topicId === "caie9709-complex")!;
      expect(c.parts).toHaveLength(3);
      expect(partText(c)).toMatch(/Argand diagram/);
      expect(partText(c)).toMatch(/shade|draw the set/i);
      expect(partText(c)).toMatch(/polar|argument/);
      expect(paper.some(q => /factor theorem and remainder theorem/.test(partText(q)))).toBe(true);
      orders.add(paper.map(q => q.topicId).join(","));
      for (const q of paper) for (const p of q.parts) {
        const awarded = [...p.solutionOutline.matchAll(/\[(?:M|A|B)(\d+)\]/g)].reduce((a,m)=>a+Number(m[1]),0);
        expect(awarded,`${q.id} ${p.label}`).toBe(p.marks);
      }
    }
    expect(orders.size).toBeGreaterThan(1);
  });
  it.each(P3_COEFFICIENT_CASES)("verifies polynomial conditions and a unique coefficient solution: %j", ({a,b,c,r,t,remainder}) => {
    const f=(x:number)=>x**3+a*x*x+b*x+c;
    expect(f(r)).toBe(0); expect(f(t)).toBe(remainder);
    expect(r*r*t-t*t*r).not.toBe(0);
  });
  it.each(P3_PARTIAL_FRACTION_CASES)("verifies the rational decomposition and binomial coefficients: %j", ({p,q,u,v,w,numerator,series}) => {
    const f=(x:number)=>evalPoly(numerator,x)/((1-p*x)*(1+q*x)**2);
    for (const x of [-0.02,0,0.03,0.07]) {
      const decomposed=u/(1-p*x)+v/(1+q*x)+w/(1+q*x)**2;
      expect(f(x)).toBeCloseTo(decomposed,12);
    }
    expect(f(0)).toBe(series[0]);
    expect(derivative(f,0)).toBeCloseTo(series[1],6);
    const h=1e-4;
    expect((f(h)-2*f(0)+f(-h))/(2*h*h)).toBeCloseTo(series[2],4);
    const radius=1/Math.max(p,q);
    expect(Math.abs(p*(radius-1e-6))).toBeLessThan(1);
    expect(Math.abs(q*(radius-1e-6))).toBeLessThan(1);
    expect(Math.max(Math.abs(p*radius),Math.abs(q*radius))).toBeCloseTo(1);
  });
  it("checks corrected point-to-line distances by orthogonal projection", () => {
    const cases: Array<[number[],number[],number]> = [
      [[1,0,2],[2,1,-1],Math.sqrt(5)], [[1,2,0],[2,1,1],Math.sqrt(21)/3],
      [[1,1,2],[2,-1,0],Math.sqrt(145)/5], [[2,0,1],[1,2,2],Math.sqrt(29)/3],
    ];
    cases.forEach(([a,b,d],i)=>{
      const dot=(x:number[],y:number[])=>x.reduce((n,v,k)=>n+v*y[k],0);
      const t=dot(a,b)/dot(b,b), v=a.map((x,k)=>x-t*b[k]);
      expect(dot(v,b)).toBeCloseTo(0,12);
      expect(Math.sqrt(dot(v,v))).toBeCloseTo(d,12);
      expect(CAIE9709_P3_ACTIVE_PAPERS[i][10].parts[0].solutionOutline).toContain("\\cdot");
    });
  });
  it("verifies the replacement square roots and supplied fixed-point accuracy", () => {
    for (const [a,b,re,im] of [[Math.sqrt(3),-1,2,-2*Math.sqrt(3)],[1,3,-8,6]]) {
      expect(a*a-b*b).toBeCloseTo(re,12); expect(2*a*b).toBeCloseTo(im,12);
    }
    let x=1.5; for(let n=0;n<100;n++) x=Math.cbrt(5-x);
    expect(x.toFixed(4)).toBe("1.5160");
    const f=(x:number)=>x**3+x-5;
    expect(f(1.51595)).toBeLessThan(0); expect(f(1.51605)).toBeGreaterThan(0);
    expect(CAIE9709_P3_ACTIVE_PAPERS[2][5].parts[1].question).toContain("given iteration");
  });
  it("derives the two perpendicular-tangent equations from actual gradients", () => {
    const cases = [
      { i:3, f:(x:number)=>Math.exp(x), g:(x:number)=>-x*x/6, next:(x:number)=>(x+Math.log(3/x))/2, start:1 },
      { i:5, f:(x:number)=>Math.log(x), g:(x:number)=>Math.exp(-x), next:(x:number)=>Math.exp(-x), start:0.5 },
    ];
    for (const c of cases) {
      let x=c.start; for(let n=0;n<200;n++) x=c.next(x);
      expect(derivative(c.f,x)*derivative(c.g,x)).toBeCloseTo(-1,8);
      const question=CAIE9709_P3_ACTIVE_PAPERS[c.i+8].find(q=>q.topicId==="caie9709-numerical")!;
      expect(question.context).toContain("same positive");
      expect(question.parts[0].solutionOutline).toContain("product");
    }
  });
  it("independently checks the linked complex roots and shaded boundaries", () => {
    const mul=(a:number[],b:number[])=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
    const roots=[{z:[1,2],poly:[15,-1,1,1]},{z:[-1,2],poly:[5,7,3,1]},{z:[2,1],poly:[10,-3,-2,1]}];
    for (const {z,poly} of roots) {
      let p=[0,0], power=[1,0];
      for(const a of poly) { p=p.map((v,k)=>v+a*power[k]); power=mul(power,z); }
      expect(p).toEqual([0,0]);
    }
    expect(mul(mul([1,2],[1,2]),mul([1,2],[1,2]))).toEqual([-7,-24]);
    // Each endpoint is checked against both boundary equations, including the lens and sector.
    for(const p of [[-1,2],[3,2]]) expect(Math.hypot(p[0]-1,p[1]-2)).toBe(2);
    for(const p of [[-2,2],[0,2]]) expect(Math.hypot(p[0]+1,p[1])).toBeCloseTo(Math.sqrt(5));
    for(const p of [[0,0],[2,0]]) {
      expect(Math.hypot(p[0]-1,p[1]-2)).toBeCloseTo(Math.sqrt(5));
      expect(Math.hypot(p[0]-1,p[1]+2)).toBeCloseTo(Math.sqrt(5));
    }
    for(const p of [[4,0],[3,3]]) expect(Math.hypot(p[0]-2,p[1]-1)).toBeCloseTo(Math.sqrt(5));
    const strict=CAIE9709_P3_ACTIVE_PAPERS[10].find(q=>q.topicId==="caie9709-complex")!;
    expect(strict.parts[2].solutionOutline).toContain("excluded");
    const sector=CAIE9709_P3_ACTIVE_PAPERS[15].find(q=>q.topicId==="caie9709-complex")!;
    expect(sector.parts[2].solutionOutline).toContain("argument is undefined");
  });
  const exactIntegrals: Array<[number,(x:number)=>number,number,number,number,string]> = [
    [0,x=>Math.sin(x)**3,0,Math.PI/2,2/3,"2/3"],
    [0,x=>Math.sin(x)**3*Math.cos(x)**2,0,Math.PI/2,2/15,"2/15"],
    [1,x=>Math.cos(x)/Math.sin(x)**3,Math.PI/4,Math.PI/2,0.5,"1/2"],
    [1,x=>1/Math.sin(x)**4,Math.PI/4,Math.PI/2,4/3,"4/3"],
    [2,x=>Math.cos(x)**2,0,Math.PI/3,Math.PI/6+Math.sqrt(3)/8,"\\pi/6+\\sqrt3/8"],
    [2,x=>Math.sin(x)**2,0,Math.PI/3,Math.PI/6-Math.sqrt(3)/8,"\\pi/6-\\sqrt3/8"],
    [3,x=>1/Math.cos(x)**4,0,Math.PI/4,4/3,"4/3"],
    [3,x=>Math.tan(x)**4,0,Math.PI/4,Math.PI/4-2/3,"\\pi/4-2/3"],
    [4,x=>Math.exp(x)*Math.sin(x),0,Math.PI/2,(Math.exp(Math.PI/2)+1)/2,"(e^{\\pi/2}+1)/2"],
    [5,x=>x*x*Math.exp(2*x),0,1,(Math.exp(2)-1)/4,"(e^2-1)/4"],
    [5,x=>(2*x*x+2*x)*Math.exp(2*x),0,1,Math.exp(2),"e^2"],
    [6,x=>Math.cos(x)/(2+Math.sin(x))**2,0,Math.PI/2,1/6,"1/6"],
    [6,x=>Math.sin(x)*Math.cos(x)/(2+Math.sin(x))**2,0,Math.PI/2,Math.log(1.5)-1/3,"\\ln(3/2)-1/3"],
    [7,x=>x*Math.cos(2*x),0,Math.PI/4,Math.PI/8-1/4,"\\pi/8-1/4"],
    [7,x=>x*Math.sin(x)**2,0,Math.PI/4,Math.PI**2/64-Math.PI/16+1/8,"\\pi^2/64-\\pi/16+1/8"],
  ];
  it.each(exactIntegrals)("independently integrates linked calculus case %i", (i,f,a,b,answer,fragment) => {
    expect(integrate(f,a,b)).toBeCloseTo(answer,9);
    expect(calculus[i].fullSolution).toContain(fragment);
  });
});
