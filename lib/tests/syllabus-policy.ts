import type { Question } from "./questions/types";

export const SYLLABUS_VERSION = "2026-10-06";
export type ExamModule = "math1" | "math2" | "physics" | "chemistry" | "biology" | "paper1" | "paper2" | "step2" | "step3" | "practice";
export interface SyllabusDecision { allowed: boolean; reason: string; module: ExamModule; references: string[] }

export const OFFICIAL_SYLLABUS_SOURCES: Record<string, string> = {
  esat: "https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/03165424/ESAT_Content_Specification.pdf",
  tmua: "https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/03165619/TMUA_Content_Specification.pdf",
  tara: "https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/06/08142350/TARA_Content_Specification.pdf",
  caie9709: "https://www.cambridgeinternational.org/Images/697427-2026-2027-syllabus.pdf",
  step: "https://www.ocr.org.uk/Images/696329-step-specification-2026.pdf",
  mat: "https://www.maths.ox.ac.uk/system/files/attachments/syllabus_1.pdf",
  pat: "https://www.physics.ox.ac.uk/study/undergraduates/how-apply/engineering-and-science-admissions-test-esat/pat-past-papers",
  ucat: "https://www.ucat.ac.uk/about-ucat/test-format-and-scoring/",
  lnat: "https://lnat.ac.uk/what-is-lnat/",
  ielts: "https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test",
  bmo: "https://ukmt.org.uk/senior-challenges/british-maths-olympiad-round-1",
  bpho: "https://www.bpho.org.uk/",
  csat: "https://www.undergraduate.study.cam.ac.uk/courses/computer-science-ba-hons-meng",
};

export function syllabusText(q: Question): string {
  return q.type === "mcq"
    ? [q.context, q.question, q.solution, q.hint, ...q.options.map(o => o.text), ...Object.values(q.optionExplanations ?? {})].join(" ")
    : [q.context, ...q.parts.flatMap(p => [p.question,p.solutionOutline,p.hint]), q.fullSolution, ...(q.essayPrompts?.map(p => p.title) ?? [])].join(" ");
}

// Content snapshot, not a cryptographic signature or a replacement for subject review.
// A changed prompt, option, answer, solution, topic or module invalidates its release approval.
export function syllabusFingerprint(q: Question): string {
  const text = JSON.stringify(q);
  let a = 2166136261, b = 5381;
  for (let i = 0; i < text.length; i++) { a = Math.imul(a ^ text.charCodeAt(i),16777619); b = Math.imul(b,33) ^ text.charCodeAt(i); }
  return `${(a>>>0).toString(16)}:${(b>>>0).toString(16)}:${text.length}`;
}

const reject = (reason: string): SyllabusDecision => ({allowed:false,reason,module:"practice",references:[]});
const accept = (module: ExamModule, ...references: string[]): SyllabusDecision => ({allowed:true,reason:"Mapped to the stated preparation scope",module,references});
const advancedMath = /complex (?:number|root|conjugate)|imaginary unit|De Moivre|Argand|cross product|dot product|scalar product|plane equation|eigenvalue|eigenvector|determinant|matrix|matrices|Taylor|Maclaurin|L['’]H[oô]pital|Newton.?Raphson|partial fractions|integrating factor|second.order differential|separable differential|integration by parts|积分分部|复数|矩阵|叉积|特征值/i;
const advancedCalculus = /first principles|implicit differenti|point of infle[ct]|inflection|inflexion|product rule|quotient rule|chain rule|change.of.base/i;
const nonPowerFunctions = /\\(?:sin|cos|tan|sec|csc|cot|ln)\b|\be\^|\\exp\b|logarithmic differenti|exponential differenti/i;
const moments = /variance|covariance|standard deviation|expected value|expectation|random variable|normal distribution|binomial distribution|Poisson|continuous distribution|\\(?:operatorname|mathrm)\{(?:Var|Cov|E)\}|方差|协方差|期望|随机变量/i;

/** Candidate triage only. Public delivery also requires a frozen release approval. */
export function assessSyllabusCandidate(q: Question): SyllabusDecision {
  if (!OFFICIAL_SYLLABUS_SOURCES[q.testId] || !q.topicId.startsWith(`${q.testId}-`)) return reject("Unknown exam or cross-exam topic ownership");
    const text = syllabusText(q);
  if (q.testId === "esat") {
    if (q.type !== "mcq" || q.options.length !== 5 || q.marks !== 1) return reject("ESAT requires one-mark, five-option MCQs");
    // Former mixed and advanced ESAT banks are not silently promoted by a topic rename.
    if (q.id.startsWith("esat-boundary-m1-")) return accept("math1","M1–M7");
    if (q.id.startsWith("esat-boundary-m2-")) return accept("math2","MM1–MM8");
    if (q.id.startsWith("esat-boundary-p-")) return accept("physics","P1–P7");
    if (q.id.startsWith("esat-boundary-c-")) return accept("chemistry","C1–C17");
    if (q.id.startsWith("esat-boundary-b-")) return accept("biology","B1–B11");
    return reject(advancedMath.test(text) ? "Required method is outside ESAT specification" : "Former ESAT content has no reviewed official module mapping");
  }
  if (q.testId === "tmua") {
    // Unlike ESAT, official TMUA specimens include A-H answer choices. The
    // specification does not impose a uniform five-option format.
    if (q.type !== "mcq" || q.options.length < 2 || q.options.length > 8 || q.marks !== 1) return reject("Invalid TMUA objective question format");
    if (advancedMath.test(text) || moments.test(text) || advancedCalculus.test(text) || /\binduct(?:ion|ive)\b|truth table|\\forall|\\exists|separation of variables|inverse trig|\\arctan|\\arcsin|\\arccos/i.test(text)) return reject("Required mathematics is outside TMUA M/MM/logic scope");
    const requiresCalculus=q.topicId==="tmua-calc" || /differentiat|derivative|\\int|tangent.*curve|gradient.*curve/i.test(text);
    if (requiresCalculus && nonPowerFunctions.test(text)) return reject("TMUA calculus is limited to rational powers and their sums/differences");
    if (/average value/.test(text) && !/average value.*(?:defined|definition)/i.test(text)) return reject("An unprovided average-value formula is not specified");
    if (q.topicId === "tmua-logic") return accept("paper2","Section 2: logic and proof");
    return accept("paper1","Section 1: M1–M7, MM1–MM8");
  }
  if (q.testId === "caie9709") {
    if (q.type !== "long" || !q.id.includes("-r3-")) return reject("Former P3 questions are history-only");
    // R3 method-level checks live in caie9709-p3-r3.test.ts. Explanations may
    // explicitly warn against an obsolete method; matching its name is not proof
    // that the task requires it. A frozen content approval is still mandatory.
    return accept("practice","9709 sections 3.1–3.9");
  }
  if (q.testId === "mat") {
    if (advancedMath.test(text) || /differential equation|integrating factor|\\int[^$]*\\(?:sin|cos|tan|ln)|integration by (?:parts|substitution)|chain rule|product rule|quotient rule/i.test(text)) return reject("Outside the final historical MAT knowledge requirements");
    // Inspect required working, not distractors: a lawful power integral may
    // deliberately offer ln(2) as a wrong option. Conversely, ln in the actual
    // derivative/antiderivative is a real prerequisite leak.
    const working=q.type==="mcq" ? [q.question,q.solution].join(" ")
      : [q.context,...q.parts.flatMap(p=>[p.question,p.solutionOutline]),q.fullSolution].join(" ");
    const calculus=q.topicId==="mat-calc" || /differentiat|derivative|antiderivative|integral|\\int/i.test(working);
    if(calculus && /dy\/dt/.test(working) && /dx\/dt/.test(working))
      return reject("Unprovided parametric differentiation is not a final MAT prerequisite");
    if(calculus && /\\(?:ln|log|sin|cos|tan|sec|csc|cot|arcsin|arccos|arctan)\b|\bln\b|\blogarithm|implicit differenti|parametric differenti|x\^\{?x\}?/i.test(working))
      return reject("Final MAT calculus does not require logarithmic/trigonometric/parametric differentiation or logarithmic antiderivatives");
    return accept("practice","MAT 2025 historical syllabus; not a current admissions exam");
  }
  if (q.testId === "step") {
    if (/eigenvalue|eigenvector|diagonalis|Jordan|Laplace transform|Fourier transform/i.test(text)) return reject("Unprovided university-level method is not a STEP prerequisite");
    if(/De Moivre|roots of unity|nth roots|cross product|vector product|plane equation|Maclaurin|polar coordinates|hyperbolic/i.test(text)) return accept("step3","STEP 2026 Mathematics 3");
    return accept("step2","STEP 2026 Mathematics 1/2");
  }
  if (q.testId === "pat" || q.testId === "csat" || q.testId === "bpho") {
    // PAT is historical; CSAT has no confirmed public current content specification;
    // Olympiad extension tasks must not masquerade as a finite school syllabus.
    if (/eigenvalue|eigenvector|diagonalis|Laplace transform|Fourier transform|general relativity|Schrodinger|quantum field/i.test(text)) return reject("Unprovided university-level prerequisite");
    if(q.testId==="csat" && /Dijkstra|Kruskal|KMP|red.black tree|AVL|NP.complete|Turing machine|halting problem/i.test(text)) return reject("Unprovided specialist computer-science prerequisite");
    if(q.testId==="bpho" && /Lorentz factor|relativistic|time dilation|Carnot|Maxwell.Boltzmann|partition function/i.test(text)) return reject("Unverified advanced physics scope; not released as Round 1");
    return accept("practice",`${q.testId}: bounded preparation only, not verified current full exam content`);
  }
  if (q.testId === "tara" && /differentiat|\\int|complex number|matrix|matrices|quadratic formula|sin\^|\\log|\\ln/i.test(text)) return reject("TARA requires everyday reasoning/basic problem-solving, not advanced subject knowledge");
  if (q.testId === "ucat" && q.topicId === "ucat-qr" && /differentiat|\\int|complex number|matrix|trigonometr/i.test(text)) return reject("UCAT numerical reasoning does not require advanced mathematical techniques");
  if (q.testId === "bmo" && /differentiat|\\int|Taylor|eigenvalue|eigenvector|Laplace/i.test(text)) return reject("Unprovided advanced calculus/linear algebra is not elementary Olympiad preparation");
  return accept("practice",`${q.testId}: reasoning/language/elementary proof scope; supplied passage or task context`);
}

export function matchesExamModule(q:Question,module:string):boolean {
  const decision=assessSyllabusCandidate(q);
  if(!decision.allowed) return false;
  if(q.testId==="esat") return decision.module===module;
  if(q.testId==="step") return module==="step3" || module==="step2" && decision.module==="step2";
  return true;
}
