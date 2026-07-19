import type { EssayRubricDimension, LongQuestion } from "./types";

const LNAT_RUBRIC: EssayRubricDimension[] = [
  { id: "thesis", label: "立场与回应", maxMarks: 4, description: "直接回应所选问题，建立明确、可持续辩护的中心立场。" },
  { id: "reasoning", label: "论证质量", maxMarks: 6, description: "理由相关且有逻辑推进，能识别假设、权衡原则与实际后果。" },
  { id: "counterargument", label: "反方处理", maxMarks: 4, description: "公平呈现最强反方观点，并作出有针对性的回应或限定。" },
  { id: "structure", label: "结构与结论", maxMarks: 3, description: "段落组织清楚，结论由前文推出，而非简单重复立场。" },
  { id: "expression", label: "英文表达", maxMarks: 3, description: "表达简洁、准确、正式，避免空泛修辞、重复和无关材料。" },
];

const PAPERS = [
  ["Should public authorities be allowed to use facial-recognition technology in public spaces?", "Should voting in national elections be compulsory?", "Is a substantial tax on inherited wealth justified?"],
  ["Should knowingly spreading false information on matters of public importance be a criminal offence?", "Are juries better than judges at deciding whether a defendant is guilty?", "When, if ever, is civil disobedience justified?"],
  ["Should universities restrict speech that members of their community regard as seriously harmful?", "Should access to legal representation be funded by the state in all serious cases?", "Should the primary purpose of imprisonment be rehabilitation rather than punishment?"],
] as const;

export const LNAT_ESSAY_QUESTIONS: LongQuestion[] = PAPERS.map((prompts, index) => ({
  id: `lnat-essay-${index + 1}`,
  type: "long",
  testId: "lnat",
  topicId: "lnat-essay",
  difficulty: 3,
  totalMarks: 20,
  responseKind: "essay",
  essayPrompts: prompts.map((title, promptIndex) => ({ id: String.fromCharCode(65 + promptIndex), title })),
  recommendedWords: [500, 600],
  maxWords: 750,
  rubricDimensions: LNAT_RUBRIC,
  context: "Choose ONE of the three questions. Write a reasoned and substantiated argument that justifies your answer and reaches a clear conclusion. Subject-specific knowledge is not required.",
  parts: [{ label: "Essay", marks: 20, question: "Answer one selected question in clear, concise English.", solutionOutline: LNAT_RUBRIC.map((item) => `${item.label} (${item.maxMarks}): ${item.description}`).join("\n") }],
  fullSolution: "There is no single model answer. A strong response defines contested terms, states a clear position, develops connected reasons, tests that position against a serious counterargument, and reaches a proportionate conclusion. Assessment rewards the quality and economy of the argument rather than agreement with its viewpoint.",
}));
