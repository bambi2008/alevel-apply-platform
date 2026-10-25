import { describe, expect, it } from "vitest";
import katex from "katex";
import { REVIEW_CORRECTIONS, REVIEW_SUFFIX, reviewedQuestion, reviewedPaper, verifyReviewCorrections } from "./review-corrections";
import { getQuestionById } from "./lookup";
import { getMockPaper } from "./mock-papers";
import { assessSyllabusCandidate, syllabusText } from "./syllabus-policy";
import type { LongQuestion, MCQQuestion } from "./questions/types";

const long = (id: string) => REVIEW_CORRECTIONS[id] as LongQuestion;
const mcq = (id: string) => REVIEW_CORRECTIONS[id] as MCQQuestion;
const integrate = (f: (x: number) => number, a: number, b: number, n = 10000) => {
  const h = (b - a) / n;
  let result = f(a) + f(b);
  for (let i = 1; i < n; i++) result += (i % 2 ? 4 : 2) * f(a + i * h);
  return result * h / 3;
};

describe("October content corrections: independent review, not blind JSON import", () => {
  it("freezes 19 reviewed revisions and retains syllabus ownership", () => {
    expect(Object.keys(REVIEW_CORRECTIONS)).toHaveLength(19);
    expect(verifyReviewCorrections).not.toThrow();
    for (const [sourceId, q] of Object.entries(REVIEW_CORRECTIONS)) {
      expect(q.id).toBe(sourceId + REVIEW_SUFFIX);
      expect(assessSyllabusCandidate(q).allowed, q.id).toBe(true);
      if (q.type === "long") expect(q.parts.reduce((sum, p) => sum + p.marks, 0), q.id).toBe(q.totalMarks);
      else expect(q.options.filter((o) => o.key === q.answer)).toHaveLength(1);
      expect(syllabusText(q)).not.toMatch(/wait,|let.s reinterpret|I.ll reframe|This setup doesn.t give oscillation/i);
    }
  });
  it("renders every revised formula without invalid escapes or malformed math", () => {
    for (const q of Object.values(REVIEW_CORRECTIONS)) {
      const text = syllabusText(q);
      expect(text, q.id).not.toMatch(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/);
      for (const match of text.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$/g)) {
        expect(() => katex.renderToString(match[1] ?? match[2], { throwOnError: true }), `${q.id}: ${match[0]}`).not.toThrow();
      }
    }
  });
  it("checks the three intersections and distinct MCQ distractors numerically", () => {
    const h = (x: number) => x * x - 2 ** x;
    expect(h(-1)).toBeGreaterThan(0);
    expect(h(0)).toBeLessThan(0);
    expect(h(2)).toBe(0);
    expect(h(4)).toBe(0);
    expect(mcq("mat-cx-005").answer).toBe("C");
    const sin75 = Math.sin(75 * Math.PI / 180);
    const trig = [(Math.sqrt(6) + Math.sqrt(2)) / 4, (Math.sqrt(6) - Math.sqrt(2)) / 4, (Math.sqrt(3) + 1) / 4, (Math.sqrt(3) - 1) / 4];
    expect(trig.filter((v) => Math.abs(v - sin75) < 1e-10)).toHaveLength(1);
    expect(mcq("mat-a-034").options[2].text).toBe("$\\dfrac{\\sqrt{3}+1}{4}$");
    expect(new Set([5, 7, Math.sqrt(7), Math.sqrt(13), 25]).size).toBe(5);
    expect(new Set([4/13, 17/52, 1/4, 5/13, 15/52]).size).toBe(5);
    expect((4 + 13 - 1) / 52).toBe(4 / 13);
    expect(Math.log(3)/Math.log(2) * Math.log(4)/Math.log(3) * Math.log(8)/Math.log(4)).toBeCloseTo(3, 12);
    expect(mcq("mat-mk1-03").answer).toBe("B");
  });
  it("checks cycloid length/area, drag energy, ellipse area and inequality equality", () => {
    expect(integrate((t) => 2 * Math.sin(t/2), 0, 2*Math.PI)).toBeCloseTo(8, 8);
    expect(integrate((t) => (1-Math.cos(t))**2, 0, 2*Math.PI)).toBeCloseTo(3*Math.PI, 8);
    const g=9.8, k=.2, u=12;
    const height=Math.log(1+k*u*u/g)/(2*k), v=u*Math.sqrt(g/(g+k*u*u));
    expect(Math.log(g/(g-k*v*v))/(2*k)).toBeCloseTo(height, 10);
    expect(v).toBeLessThan(u);
    expect(4*3*2*integrate((t)=>Math.sin(t)**2,0,Math.PI/2)).toBeCloseTo(6*Math.PI,8);
    expect(3*(1/3)*(1-1/3)**2).toBeCloseTo(4/9,12);
    expect(long("step-011").context).toContain("0<\\theta<\\pi/2");
  });
  it("repairs the submitted trigonometric proof and excludes the degenerate chord", () => {
    const theta=3*Math.PI/10;
    expect(2*Math.cos(theta)**2-1).toBeCloseTo(-Math.cos(2*Math.PI/5),12);
    expect(long("step-023").fullSolution).not.toContain("2\\cos^2\\frac{3\\pi}{10}-1");
    expect(long("step-020").parts[3].question).toContain("not the origin");
    const a=3,b=2,t1=.3,t2=.9;
    const p=[a/Math.cos(t1),b*Math.tan(t1)],r=[a/Math.cos(t2),b*Math.tan(t2)];
    const m=(p[1]+r[1])/(p[0]+r[0]);
    expect((r[1]-p[1])/(r[0]-p[0])).toBeCloseTo(b*b/(a*a*m),10);
  });
  it("checks taut/slack periodic motion and CRT construction", () => {
    const l=2, amplitude=3, omega=4;
    const quarter=Math.PI/(2*omega), crossing=2*l/(amplitude*omega);
    expect(4*quarter+2*crossing).toBeCloseTo(2*Math.PI/omega+4*l/(amplitude*omega),12);
    expect(long("step-025").context).toContain("may pass through");
    expect([548%4,549%9,550%25]).toEqual([0,0,0]);
    expect(long("bmo2-nt-004").fullSolution).not.toContain("\\n");
  });
  it("preserves historical objects and revises cloned STEP paper questions", () => {
    const original=getQuestionById("mat-cx-005")!;
    const before=JSON.stringify(original), revised=reviewedQuestion(original) as MCQQuestion;
    expect(revised.id).toBe("mat-cx-005"+REVIEW_SUFFIX);
    expect(revised.answer).toBe("C");
    expect(JSON.stringify(original)).toBe(before);
    expect((original as MCQQuestion).answer).toBe("B");
    const paper=getMockPaper("step2-written-1-boundary")!;
    const snapshot=JSON.stringify(paper), next=reviewedPaper(paper);
    expect(next.id).toBe(paper.id+REVIEW_SUFFIX);
    expect(JSON.stringify(paper)).toBe(snapshot);
    expect(next.modules[0].questions.filter((q)=>q.id.endsWith(REVIEW_SUFFIX))).toHaveLength(12);
  });
  it("retains the current LNAT four-choice pattern when patching generated aliases", () => {
    const q=getMockPaper("lnat-mock-2")!.modules[0].questions[12] as MCQQuestion;
    const revised=reviewedQuestion(q) as MCQQuestion;
    expect(revised.id).toBe("lnat-mk2-13"+REVIEW_SUFFIX);
    expect(revised.options).toEqual(q.options);
    expect(revised.answer).toBe(q.answer);
    expect(revised.options).toHaveLength(4);
    expect(revised.solution).not.toContain("(E)");
  });
});
