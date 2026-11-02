import { describe, expect, it } from "vitest";
import katex from "katex";
import { CONTENT_CORRECTIONS, CONTENT_REVISION_SUFFIX, reviseCurrentQuestion, verifyContentCorrections } from "./content-revisions";
import { REVIEW_CORRECTIONS, reviewedQuestion } from "./review-corrections";
import { syllabusText } from "./syllabus-policy";
import type { LongQuestion, MCQQuestion } from "./questions/types";
import manifest from "@/data/question-bank/content-manifest-20261026.json";
import { getMockPaper, getMockPapersForTest } from "./mock-papers";
import { getQuestionById } from "./lookup";
import { getReleasedPracticeQuestions } from "./practice-banks";
import { syllabusFingerprint } from "./syllabus-policy";

const corrected = (id: string) => CONTENT_CORRECTIONS.find(entry => entry.corrected.id === id)!.corrected;
const integrate = (f: (x: number) => number, n = 10000) => {
  const h = Math.PI / (2 * n);
  let sum = f(0) + f(Math.PI / 2);
  for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * f(i * h);
  return sum * h / 3;
};

describe("remaining October corrections", () => {
  it("publishes nine fixed correction versions and retains every historical paper", () => {
    expect(manifest.supersededPapers).toHaveLength(9);
    for (const oldId of manifest.supersededPapers) {
      const old = getMockPaper(oldId)!, next = getMockPaper(oldId + CONTENT_REVISION_SUFFIX)!;
      expect(old).toBeDefined(); expect(next).toBeDefined();
      expect(getMockPapersForTest(old.testId).map(paper => paper.id)).not.toContain(oldId);
      expect(getMockPapersForTest(old.testId).some(paper => paper.id === next.id || paper.id === next.id + "-cal20261026")).toBe(true);
      expect(syllabusFingerprint(next as never)).toBe(manifest.paperHashes[next.id as keyof typeof manifest.paperHashes]);
      expect(next.modules.map(module => [module.id, module.durationSec, module.questions.length])).toEqual(old.modules.map(module => [module.id, module.durationSec, module.questions.length]));
      for (const question of next.modules.flatMap(module => module.questions)) {
        expect(question.id).toMatch(/-rev20261026$/);
        expect(getQuestionById(question.id)).toEqual(question);
      }
    }
    expect((getQuestionById("tmua-spec-g17" + CONTENT_REVISION_SUFFIX) as MCQQuestion).answer).toBe("D");
    expect(getReleasedPracticeQuestions("tmua").some(q => q.id === "tmua-spec-g17")).toBe(false);
    expect(getReleasedPracticeQuestions("esat").some(q => q.id === "esat-mk7-m-01" + CONTENT_REVISION_SUFFIX)).toBe(false);
    expect(getQuestionById("lnat-ex-008" + CONTENT_REVISION_SUFFIX)).toBeUndefined();
  });
  it("freezes 23 additional reviewed entries without replacing the previous 19", () => {
    expect(CONTENT_CORRECTIONS).toHaveLength(23);
    expect(verifyContentCorrections).not.toThrow();
    expect(CONTENT_CORRECTIONS.filter(entry => !entry.source).map(entry => entry.corrected.id)).toEqual(["lnat-ex-008"]);
    for (const original of Object.values(REVIEW_CORRECTIONS)) expect(reviseCurrentQuestion(reviewedQuestion(original))).toBe(original);
  });
  it("renders every corrected formula and keeps marks and historical objects intact", () => {
    for (const { source, corrected: q } of CONTENT_CORRECTIONS) {
      for (const match of syllabusText(q).matchAll(/\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$/g)) {
        expect(() => katex.renderToString(match[1] ?? match[2], { throwOnError: true }), `${q.id}: ${match[0]}`).not.toThrow();
      }
      if (!source) continue;
      const snapshot = JSON.stringify(source), next = reviseCurrentQuestion(source);
      expect(next.id).toBe(source.id + CONTENT_REVISION_SUFFIX);
      expect(JSON.stringify(source)).toBe(snapshot);
      expect(next.topicId).toBe(source.topicId);
      expect(next.difficulty).toBe(source.difficulty);
      if (next.type === "long") expect(next.parts.reduce((n, part) => n + part.marks, 0)).toBe(next.totalMarks);
    }
  });
  it("maps shuffled answer options by text rather than an obsolete letter", () => {
    const source = CONTENT_CORRECTIONS.find(entry => entry.corrected.id === "tmua-spec-g17")!.source as MCQQuestion;
    const clone = { ...source, id: "tmua-paper-fixture", options: [...source.options].reverse().map((option, i) => ({ ...option, key: "ABCDE"[i] as MCQQuestion["answer"] })) };
    const next = reviseCurrentQuestion(clone) as MCQQuestion;
    expect(next.options.find(option => option.key === next.answer)?.text).toBe("$\\sqrt{13}$");
    expect(next.answer).not.toBe((corrected("tmua-spec-g17") as MCQQuestion).answer);
  });
  it("enumerates primitive triples and the prime case independently", () => {
    const triples: number[][] = [];
    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
    for (let a = 1; a < 50; a++) for (let b = a + 1; b < 50; b++) {
      const c = Math.sqrt(a * a + b * b);
      if (Number.isInteger(c) && c < 50 && gcd(a, b) === 1) triples.push([a, b, c]);
    }
    expect(triples.sort((a, b) => a[2] - b[2])).toEqual([[3,4,5],[5,12,13],[8,15,17],[7,24,25],[20,21,29],[12,35,37],[9,40,41]]);
    const isPrime = (n: number) => { for (let k = 2; k * k <= n; k++) if (n % k === 0) return false; return n > 1; };
    expect(Array.from({ length: 16 }, (_, i) => i + 1).filter(n => isPrime(n ** 4 + 4 ** n))).toEqual([1]);
    expect((corrected("step-018") as LongQuestion).parts[3].question).toContain("quote without proof");
  });
  it("recomputes conditional probability, centroid distance, radicals and physical ratios", () => {
    const tosses = Array.from({ length: 16 }, (_, i) => i.toString(2).padStart(4, "0").split("1").length - 1);
    expect(tosses.filter(n => n === 2).length / tosses.filter(n => n > 0).length).toBe(2/5);
    expect(Math.hypot(6, 4)/2).toBeCloseTo(Math.sqrt(13), 12);
    expect(Math.abs(8/3+4/3-6)/Math.sqrt(2)).toBeCloseTo(Math.sqrt(2), 12);
    expect(Math.sqrt(75)-Math.sqrt(12)).toBeCloseTo(3*Math.sqrt(3), 12);
    expect(Math.sqrt(50)-Math.sqrt(18)).toBeCloseTo(2*Math.sqrt(2), 12);
    expect(60/1000).toBe(3/50);
    expect(2**(-5/3)).toBeCloseTo(.3149802625, 9);
    expect((1/2)**(24/6)).toBe(1/16);
  });
  it("enumerates dice, divisibility, matching and checks the integral and maximum", () => {
    let sum7 = 0, oneSix = 0, threeSix = 0;
    for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) {
      if (a+b === 7) sum7++;
      if (a === 6 || b === 6) oneSix++;
      for (let c = 1; c <= 6; c++) if ([a,b,c].includes(6)) threeSix++;
    }
    expect([sum7/36, oneSix/36, threeSix/216]).toEqual([1/6, 11/36, 91/216]);
    expect(Array.from({ length: 90 }, (_, i) => i+10).filter(n => n%3 === 0).length/90).toBe(1/3);
    expect(Array.from({ length: 100 }, (_, i) => [Math.floor(i/10), i%10]).filter(([a,b]) => a === b).length/100).toBe(1/10);
    expect(integrate(x => Math.sin(x)**6)).toBeCloseTo(5*Math.PI/32, 10);
    expect(2+2).toBe(Math.sqrt(2*(2**2+2**2)));
  });
  it("keeps standard-form and fully-factorised criteria explicit", () => {
    expect((corrected("tmua-spec-n11") as MCQQuestion).solution).toContain("not in standard form");
    expect((corrected("esat-mk8-m-02") as MCQQuestion).solution).toContain("not in standard form");
    expect((corrected("esat-mk7-m-04") as MCQQuestion).solution).toContain("not fully factorised");
    for (const x of [-3, -1, 0, 2, 5]) expect(2*x*x-8).toBe(2*(x-2)*(x+2));
    expect((corrected("lnat-ex-008") as MCQQuestion).options.find(option => option.key === "B")?.text).toContain("omit facts");
  });
});
