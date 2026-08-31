import { describe, expect, it } from "vitest";
import katex from "katex";
import { CAIE9709_P3_CANDIDATE_TARGETED_QUESTIONS as revised } from "./caie9709-remediation";
import { CAIE9709_P3_CANDIDATE_TARGETED_QUESTIONS as legacy } from "./caie9709-candidate-targeted";
import { CAIE9709_QUESTIONS } from "./caie9709";
import { CAIE9709_P3_ARCHIVED_PAPERS, CAIE9709_P3_WRITTEN_PAPERS } from "../mock-papers/caie9709-p3-written-papers";
import { getMockPaper, getMockPapersForTest, getAllMockQuestions } from "../mock-papers";

const s = String.raw;
const q = (paper: number, slot: number) => revised[paper * 11 + slot - 1];
const solution = (paper: number, slot: number, text: string) => expect(q(paper, slot).fullSolution).toContain(text);
const derivative = (f: (x: number) => number, x: number) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
// Independent numerical quadrature, not the antiderivatives used in the answer key.
function integrate(f: (x: number) => number, a: number, b: number) {
  const n = 4096, h = (b - a) / n;
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * f(a + i * h);
  return sum * h / 3;
}
const dot = (a: number[], b: number[]) => a.reduce((v, x, i) => v + x * b[i], 0);
const sub = (a: number[], b: number[]) => a.map((v, i) => v - b[i]);
const mag = (a: number[]) => Math.sqrt(dot(a, a));
const distLine = (p: number[], a: number[], u: number[]) => {
  const v = sub(p, a), t = dot(v, u) / dot(u, u);
  return { t, foot: a.map((x, i) => x + t * u[i]), distance: Math.sqrt(dot(v, v) - dot(v, u) ** 2 / dot(u, u)) };
};

describe("R2 mathematical and compatibility checks", () => {
  it("separates revised IDs from historical work without deleting old routes", () => {
    expect(new Set(revised.map(x => x.id)).size).toBe(88);
    expect(revised.every(x => !legacy.some(old => old.id === x.id))).toBe(true);
    expect(getMockPapersForTest("caie9709")).toHaveLength(16);
    for (const paper of CAIE9709_P3_ARCHIVED_PAPERS) {
      expect(getMockPaper(paper.id)).toEqual(paper);
      expect(CAIE9709_P3_WRITTEN_PAPERS.some(p => p.id === paper.id)).toBe(false);
      expect(getAllMockQuestions()).toEqual(expect.arrayContaining(paper.modules[0].questions));
    }
  });
  it("replaces 72 prompts, retaining only eight foundations and eight precision exercises", () => {
    const prompt = (item: typeof revised[number]) => [item.context, ...item.parts.map(p => p.question)].join(" ");
    const changed = revised.filter((item, i) => prompt(item) !== prompt(legacy[i]));
    expect(changed).toHaveLength(72);
    revised.forEach((item, i) => {
      if (i % 11 === 2) return;
      for (const part of item.parts) {
        const marks = [...part.solutionOutline.matchAll(/\[(?:M|A|B)(\d+)\]/g)].reduce((sum, m) => sum + Number(m[1]), 0);
        expect(marks, `${item.id} ${part.label}`).toBe(part.marks);
      }
    });
  });
  it("renders every active question/answer formula without swallowed escapes or KaTeX errors", () => {
    for (const item of CAIE9709_QUESTIONS) {
      const text = [item.context, item.fullSolution, ...item.parts.map(p => p.question)].join(" ");
      expect(text, item.id).not.toMatch(/[\x00-\x09\x0B-\x1F]/);
      for (const match of text.matchAll(/\$([^$]+)\$/g)) {
        expect(() => katex.renderToString(match[1], { throwOnError: true, strict: false }), `${item.id}: ${match[1]}`).not.toThrow();
      }
    }
  });

  const integrals: Array<[number, (x: number) => number, number, number, number, string]> = [
    [0, x => (x*x+1)/(x*(x+1)**2), 1, 3, Math.log(3)-0.5, s`\ln3-1/2`],
    [1, x => x*Math.log(x), 1, Math.E, (Math.E**2+1)/4, s`(e^2+1)/4`],
    [2, x => x**3/Math.sqrt(1+x*x), 0, 1, (2-Math.sqrt(2))/3, s`(2-\sqrt2)/3`],
    [3, x => Math.abs((Math.log(x)-1)/x**2), 1, Math.E**2, 2/Math.E-2/Math.E**2, s`2/e-2/e^2`],
    [4, x => (3*x+5)/((x+1)*(x+2)), 0, 2, Math.log(18), s`b=2`],
    [5, x => x*x*Math.exp(2*x), 0, 1, (Math.E**2-1)/4, s`(e^2-1)/4`],
    [6, x => Math.exp(2*x)/(1+Math.exp(x)), 0, Math.log(2), 1-Math.log(1.5), s`1-\ln(3/2)`],
    [7, t => 2*t*t*Math.log(t), 1, Math.E, (4*Math.E**3+2)/9, s`(4e^3+2)/9`],
  ];
  it.each(integrals)("independently integrates paper %i question 8", (i, f, a, b, value, text) => {
    expect(integrate(f,a,b)).toBeCloseTo(value, 6);
    solution(i,8,text);
  });
  const trig: Array<[number, (x:number)=>number, number, number, string]> = [
    [0, x=>Math.sin(x)**3*Math.cos(x)**2, Math.PI/3, 47/480, "47/480"],
    [1, x=>x/Math.cos(x)**2, Math.PI/4, Math.PI/4-Math.log(2)/2, s`\pi/4-\frac12\ln2`],
    [2, x=>1/(1+Math.cos(2*x)), Math.PI/3, Math.sqrt(3)/2, s`\sqrt3/2`],
    [3, x=>Math.sin(x)**2*Math.cos(x)**2, Math.PI/6, Math.PI/48-Math.sqrt(3)/64, s`\pi/48-\sqrt3/64`],
    [4, x=>Math.cos(x)/(2+Math.sin(x))**2, Math.PI/2, 1/6, "1/6"],
    [5, x=>Math.sin(x)/(1+Math.cos(x)**2), Math.PI/2, Math.PI/4, s`\pi/4`],
    [6, x=>Math.abs(Math.cos(2*x)-Math.sin(x)), Math.PI/2, 3*Math.sqrt(3)/2-1, s`3\sqrt3/2-1`],
    [7, x=>(Math.sin(x)+Math.cos(x))/(2+Math.sin(x)-Math.cos(x)), Math.PI/4, Math.log(2), s`\ln2`],
  ];
  it.each(trig)("independently integrates paper %i question 9", (i, f, b, value, text) => {
    expect(integrate(f,0,b)).toBeCloseTo(value,6); solution(i,9,text);
  });
  it("checks secondary exact integrals, volumes and implicit integration limits", () => {
    expect(Math.PI*integrate(x=>(x*Math.log(x))**2,1,Math.E)).toBeCloseTo(Math.PI*(5*Math.E**3-2)/27,6);
    solution(1,8,s`\pi(5e^3-2)/27`);
    expect(2*Math.PI*integrate(t=>t**3*Math.log(t)**2,1,Math.E)).toBeCloseTo(Math.PI*(5*Math.E**4-1)/16,6);
    solution(7,8,s`\pi(5e^4-1)/16`);
    expect(integrate(x=>1/(1+Math.exp(x)),0,Math.log(2))).toBeCloseTo(Math.log(4/3),8);
    solution(6,8,s`1+\ln(8/9)`);
    expect(integrate(x=>Math.sin(x)*Math.cos(x)/(2+Math.sin(x))**2,0,Math.PI/2)).toBeCloseTo(Math.log(1.5)-1/3,8);
    solution(4,9,s`\ln(3/2)-1/3`);
    const a=Math.PI/4+Math.asin(1-Math.sqrt(2));
    expect(a).toBeGreaterThan(0); expect(a).toBeLessThan(Math.PI/4);
    expect(integrate(trig[7][1],0,a)).toBeCloseTo(Math.log(2)/2,8);
  });
  const vectorCases: Array<[number,number[],number[],number[],number,string]> = [
    [0,[0,3,5],[1,-1,2],[2,2,1],Math.sqrt(17),s`\sqrt{17}`],
    [1,[2,0,1],[0,1,0],[1,2,2],5*Math.sqrt(2)/3,s`5\sqrt2/3`],
    [2,[2,3,0],[1,0,1],[1,-1,2],5/Math.sqrt(3),s`5/\sqrt3`],
    [3,[2,5,1],[2,1,-1],[2,1,1],Math.sqrt(14),s`\sqrt{14}`],
    [4,[4,0,3],[1,2,-1],[2,1,1],Math.sqrt(165)/3,s`\sqrt{165}/3`],
    [5,[3,1,0],[1,0,2],[1,2,-1],Math.sqrt(3),s`\sqrt3`],
    [6,[0,4,1],[1,1,0],[2,1,2],Math.sqrt(10),s`\sqrt{10}`],
    [7,[0,0,0],[0,1,2],[2,1,-1],Math.sqrt(29/6),s`\sqrt{29/6}`],
  ];
  it.each(vectorCases)("independently projects paper %i vector points", (i,p,a,u,distance,text) => {
    const check=distLine(p,a,u);
    expect(check.distance).toBeCloseTo(distance,10);
    expect(dot(sub(p,check.foot),u)).toBeCloseTo(0,10);
    solution(i,11,text);
    if(i===2) expect(check.t).toBeLessThan(0);
    if(i===4) { expect(check.t).toBeGreaterThan(0); expect(check.t).toBeLessThan(3); expect(distance).toBeGreaterThan(4); }
  });
  it("checks exact vector areas and both line-circle intersections", () => {
    const coefficients=[4.5,7.5,3*Math.sqrt(6),5*Math.sqrt(6)/2];
    const areas=[9*Math.sqrt(17)/2,25*Math.sqrt(2)/2,15*Math.sqrt(2),5*Math.sqrt(21)];
    coefficients.forEach((v,i)=>expect(v*vectorCases[i][4]).toBeCloseTo(areas[i],9));
    for(const x of [[11/3,7/3,8/3],[-1/3,1/3,-4/3]]) expect(mag(sub(x,[0,4,1]))).toBeCloseTo(Math.sqrt(19),10);
    solution(6,11,s`(-1/3,1/3,-4/3)`);
  });
  const de: Array<[number,(x:number)=>number,(x:number,y:number)=>number,string]> = [
    [0,t=>600/(1+3*Math.exp(-t*Math.log(3)/2)),(_,y)=>Math.log(3)/2*y*(1-y/600),s`P=600/(1+3e^{-t\ln3/2})`],
    [1,t=>18+72*Math.exp(-t*Math.log(2)/5),(_,y)=>-Math.log(2)/5*(y-18),s`k=\ln2/5`],
    [2,x=>-2*Math.sqrt(1+x*x),(x,y)=>x*y/(1+x*x),s`y=-2\sqrt{1+x^2}`],
    [3,t=>(3-t/2)**2,(_,y)=>-Math.sqrt(y),s`0\le t\le6`],
    [5,x=>3-Math.exp(-x),(x,y)=>Math.exp(x)*(3-y)**2,s`y=3-e^{-x}`],
    [6,x=>1-Math.exp(-Math.sin(x)),(x,y)=>(1-y)*Math.cos(x),s`y=1-e^{-\sin x}`],
    [7,t=>8*Math.exp(-t/20),(_,y)=>-y/20,s`S=8e^{-t/20}`],
  ];
  it.each(de)("substitutes paper %i solution into the differential equation", (i, f, rhs, text) => {
    for(const x of [0.2,0.7,1.5]) expect(derivative(f,x)).toBeCloseTo(rhs(x,f(x)),6);
    solution(i,6,text);
  });
  it("checks implicit DE, initial values, thresholds and physical domain", () => {
    expect(de[0][1](0)).toBeCloseTo(150); expect(de[0][1](2)).toBeCloseTo(300); expect(de[0][1](4)).toBeCloseTo(450);
    expect(de[1][1](15)).toBeCloseTo(27);
    expect(de[2][1](2*Math.sqrt(2))).toBeCloseTo(-6);
    expect(de[3][1](6)).toBe(0); expect(derivative(de[3][1],7)).toBeGreaterThan(0);
    // Parameterising x(y) independently checks the implicit solution and its gradient.
    const xy=(y:number)=>Math.sqrt((y**3+3*y-1)/3);
    expect(xy(1)).toBe(1);
    expect(1/derivative(xy,2)).toBeCloseTo(2*Math.sqrt(13/3)/5,8);
    solution(4,6,s`2\sqrt{13/3}/5`);
    expect(de[6][1](20*Math.log(8))).toBeCloseTo(1);
  });
  it("checks all eight binomial expansions via local error order", () => {
    const cases: Array<[(x:number)=>number,(x:number)=>number,string]> = [
      [x=>(1+x)/Math.sqrt(1-2*x),x=>1+2*x+2.5*x*x,"5x^2/2"],
      [x=>1/((1-3*x)*(1+x)),x=>1+2*x+7*x*x,"7x^2"],
      [x=>(1+2*x)/Math.sqrt(1+4*x),x=>1+2*x*x,"6-2a=2"],
      [x=>1/Math.sqrt(4-2*x),x=>0.5+x/8+3*x*x/64,"3x^2/64"],
      [x=>((1+x)**-2-1+2*x)/x**2,x=>3-4*x,"3-4x"],
      [x=>Math.sqrt(1-x)/(1+x),x=>1-1.5*x+11*x*x/8,"11x^2/8"],
      [x=>1/Math.sqrt(1-2*x),x=>1+x+1.5*x*x,"3h^2/2"],
      [x=>1/Math.sqrt(1-2*x)+1/Math.sqrt(1+2*x),x=>2+3*x*x,"2+3x^2"],
    ];
    cases.forEach(([f,p,text],i)=>{ expect(Math.abs(f(0.001)-p(0.001))).toBeLessThan(i===4?6e-6:4e-8); solution(i,1,text); });
  });
  it("checks transformed model parameters against both original observations", () => {
    expect(24*Math.exp(-Math.log(2)*3)).toBeCloseTo(3); solution(0,2,"k=24");
    expect(3/(2*Math.sqrt(2))*8**1.5).toBeCloseTo(24); solution(1,2,s`3/(2\sqrt2)`);
    expect(5*(5-1)**2).toBe(80); solution(2,2,"k=5");
    expect(derivative(x=>7*x*Math.exp(-2*x),0.5)).toBeCloseTo(0); solution(3,2,"7/(2e)");
    expect(20+80*Math.exp(-Math.log(4))).toBeCloseTo(40); solution(4,2,"k=80");
    expect(0.01*(10**0.3)**(40/3)).toBeCloseTo(100); solution(5,2,"40/3");
    expect(1.5*Math.exp(2*Math.log(2)/2)).toBeCloseTo(3); solution(6,2,"k=3/2");
    expect(2*0.5**-3).toBe(16); solution(7,2,"n=3");
  });
  it("checks all eight normal directions and exceptional tangents", () => {
    expect(-5/6*6/5).toBe(-1); solution(0,5,"6/5");
    expect((3-2)/2*-2).toBe(-1); solution(1,5,"y=-2x+3");
    expect(derivative(x=>x*Math.log(x),Math.exp(-1))).toBeCloseTo(0); solution(2,5,"x=e^{-1}");
    expect(-Math.E*(1/Math.E)).toBe(-1); solution(3,5,"x/e");
    expect((4+1)/(4-1)*(-3/5)).toBe(-1); solution(4,5,"-3(x-5/2)/5");
    [0.5,2].forEach(x=>expect(derivative(t=>Math.log(1+t*t),x)).toBeCloseTo(4/5)); solution(5,5,"15/8");
    expect(-6/12*2).toBe(-1); solution(6,5,"y=2x-5");
    expect(derivative(x=>Math.exp(x)/(1+Math.exp(x)),0)*-4).toBeCloseTo(-1); solution(7,5,"-4x");
  });
  it("checks all eight introductory complex-number solutions in Cartesian coordinates", () => {
    const mul=(a:number[],b:number[])=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
    const div=(a:number[],b:number[])=>mul(a,[b[0],-b[1]]).map(x=>x/dot(b,b));
    expect(div([2,1],[1,-2])).toEqual([0,1]); expect(div([-2,1],[1,-2])).toEqual([-0.8,-0.6]);
    solution(0,4,s`-\pi+\tan^{-1}(3/4)`);
    // z^3+z^2-z+15 at z=1+2i; and the real root -3.
    const z=[1,2], z2=mul(z,z), z3=mul(z2,z);
    expect([z3[0]+z2[0]-z[0]+15,z3[1]+z2[1]-z[1]]).toEqual([0,0]);
    solution(1,4,"z^3+z^2-z+15");
    for (const p of [[1,2],[2,1]]) { expect(dot(p,p)).toBe(5); expect(mag(sub(p,[1,0]))).toBe(mag(sub(p,[3,2]))); }
    solution(2,4,"2+i");
    const ratio=div([-Math.sqrt(3),1],[1,-1]);
    expect(Math.atan2(ratio[1],ratio[0])).toBeCloseTo(-11*Math.PI/12); solution(3,4,s`-11\pi/12`);
    const root=[Math.sqrt(13)/2,Math.sqrt(39)/2];
    expect(dot(root,root)).toBeCloseTo(13); expect(Math.atan2(root[1],root[0])).toBeCloseTo(Math.PI/3);
    solution(4,4,s`a=\sqrt{13}/2`);
    expect(div([-2,2],[2,2])).toEqual([0,1]); solution(5,4,"z=2i");
    expect(mul([3,-2],[3,-2])).toEqual([5,-12]); solution(6,4,"3-2i");
    const inverse=div([1,0],[-1.5,1.5*Math.sqrt(3)]);
    expect(inverse[0]).toBeCloseTo(-1/6); expect(inverse[1]).toBeCloseTo(-Math.sqrt(3)/6); solution(7,4,s`-1/6\mp(\sqrt3/6)i`);
  });
  it("checks all eight multi-condition complex-number solutions", () => {
    for(const sign of [-1,1]) {
      const k=2+sign*Math.sqrt(10), x=k/2;
      expect(2*(x-1)**2).toBeCloseTo(5);
      expect(x+x).toBeCloseTo(k);
    }
    solution(0,10,s`k=2\pm\sqrt{10}`);
    // Polynomial coefficients of (z^2 - 2z + 5)^2, independently convolved.
    const coefficients=[1,-2,5], product=[0,0,0,0,0];
    coefficients.forEach((a,i)=>coefficients.forEach((b,j)=>product[i+j]+=a*b));
    expect(product).toEqual([1,-4,14,-20,25]); solution(1,10,"a=14,b=-20");
    expect(Math.atan(0.5)+Math.asin(2/Math.sqrt(5))).toBeCloseTo(Math.PI/2);
    expect(mag(sub([0,1],[2,1]))).toBe(2); solution(2,10,s`=\pi/2`);
    for(const sign of [-1,1]) {
      const p=[-1,sign*2/Math.sqrt(3)];
      expect(mag(sub(p,[1,0]))/mag(sub(p,[-1,0]))).toBeCloseTo(2);
      expect((p[0]+5/3)**2+p[1]**2).toBeCloseTo(16/9);
    }
    solution(3,10,s`1\pm i\sqrt3`);
    expect(Math.sqrt(3)*1.5/2).toBeCloseTo(3*Math.sqrt(3)/4); solution(4,10,s`3\sqrt3/4`);
    const roots=[[2,1],[-1,2]];
    expect(dot(roots[0],roots[1])).toBe(0); expect(mag(roots[0])*mag(roots[1])/2).toBeCloseTo(2.5);
    solution(5,10,"5/2");
    const t=(-1+Math.sqrt(6))/2;
    expect((2+t)**2+3*t*t).toBeCloseTo(9); expect(t).toBeGreaterThan(0); solution(6,10,s`(-1+\sqrt6)/2`);
    for(const angle of [0.2,0.6,1.2]) {
      const radius=2*(Math.cos(angle)+Math.sin(angle));
      const p=[radius*Math.cos(angle),radius*Math.sin(angle)];
      expect(mag(sub(p,[1,1]))).toBeCloseTo(Math.sqrt(2));
      expect(radius).toBeLessThanOrEqual(2*Math.sqrt(2));
    }
    solution(7,10,s`\arg0`); solution(7,10,s`2\sqrt2`);
  });
});
