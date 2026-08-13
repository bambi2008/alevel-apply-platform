import type { GradeRequest } from "./grading";

export interface GradingBenchmark {
  id: string;
  purpose: "blank" | "method-credit" | "unsupported-claim" | "essay-rubric";
  request: GradeRequest;
  expectedScore: { min: number; max: number };
  examinerNote: string;
}

export const GRADING_BENCHMARKS: GradingBenchmark[] = [
  {
    id: "blank-structured",
    purpose: "blank",
    request: {
      questionId: "benchmark-blank",
      testId: "bmo",
      parts: [{ label: "(i)", question: "Prove the claim.", marks: 6, solutionOutline: "State and prove the invariant.", studentWork: "" }],
      fullSolution: "A complete invariant proof.",
    },
    expectedScore: { min: 0, max: 0 },
    examinerNote: "空白作答必须确定性记零，且不调用模型。",
  },
  {
    id: "valid-alternative-method",
    purpose: "method-credit",
    request: {
      questionId: "benchmark-alternative",
      testId: "step",
      parts: [{
        label: "(i)",
        question: "Evaluate the limit.",
        marks: 8,
        solutionOutline: "Reference solution uses a Taylor expansion.",
        studentWork: "Apply l'Hopital twice; the transformed numerator and denominator have the same non-zero limit, hence the answer is 1.",
      }],
      fullSolution: "Taylor expansion gives the limit 1.",
    },
    expectedScore: { min: 6, max: 8 },
    examinerNote: "有效替代方法应获得方法分和结论分，不能因不同于参考解而压分。",
  },
  {
    id: "unsupported-final-answer",
    purpose: "unsupported-claim",
    request: {
      questionId: "benchmark-unsupported",
      testId: "bpho",
      parts: [{
        label: "(i)",
        question: "Find the launch speed and justify your answer.",
        marks: 6,
        solutionOutline: "Resolve energy terms, substitute values and include units.",
        studentWork: "The answer is 12 m/s.",
      }],
      fullSolution: "Energy conservation with substitution gives 12 m/s.",
    },
    expectedScore: { min: 1, max: 2 },
    examinerNote: "最终数值正确但没有方法，不能获得主要过程分。",
  },
  {
    id: "essay-balanced-reasoning",
    purpose: "essay-rubric",
    request: {
      questionId: "benchmark-essay",
      testId: "lnat",
      responseKind: "essay",
      questionContext: "Should public protest ever be restricted?",
      parts: [{
        label: "Essay",
        question: "Write a reasoned response.",
        marks: 10,
        solutionOutline: "Clear thesis, serious objection, evaluation and coherent expression.",
        studentWork: "Restrictions can be justified only where a specific and imminent harm is shown. The strongest objection is that officials may define harm to silence dissent. A narrow test, independent review and a short time limit answer part of that concern, although no safeguard removes it entirely.",
      }],
      rubricDimensions: [
        { id: "reasoning", label: "Reasoning", maxMarks: 4, description: "Develop and evaluate a defensible argument." },
        { id: "organisation", label: "Organisation", maxMarks: 3, description: "Structure the response coherently." },
        { id: "expression", label: "Expression", maxMarks: 3, description: "Use precise and controlled language." },
      ],
      fullSolution: "Formative rubric only; no single model position.",
    },
    expectedScore: { min: 7, max: 10 },
    examinerNote: "立场本身不影响得分，应按推理、结构与表达分别评价。",
  },
];
