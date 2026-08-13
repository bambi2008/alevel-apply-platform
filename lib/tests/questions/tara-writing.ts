import type { EssayRubricDimension, LongQuestion } from "./types";

const TARA_RUBRIC: EssayRubricDimension[] = [
  { id: "interpretation", label: "命题解释", maxMarks: 4, description: "准确解释命题含义、范围和关键概念，不偷换为更容易回应的版本。" },
  { id: "objection", label: "反对论证", maxMarks: 5, description: "提出完整、有理由支持且直接针对原命题的反论证。" },
  { id: "evaluation", label: "权衡与立场", maxMarks: 5, description: "比较支持与反对理由，说明认同程度及适用条件。" },
  { id: "organisation", label: "选择与组织", maxMarks: 3, description: "在 750 词内选择最重要观点，结构清楚且结论连贯。" },
  { id: "expression", label: "准确表达", maxMarks: 3, description: "英文简洁、准确、有效，概念和例子服务于推理。" },
];

const PAPERS = [
  ["Universities should give priority to subjects that produce measurable economic benefits.", "Public decisions are more legitimate when made by experts rather than elected representatives.", "Technological convenience usually comes at the cost of personal freedom."],
  ["Individuals should not be blamed for choices that are harmful only when many people make them.", "Competition is the most effective way to motivate people to improve.", "Preserving the past prevents society from preparing for the future."],
  ["Anonymity is essential for honest public debate.", "Unequal outcomes are acceptable whenever the rules are fair.", "Institutions should act only on established evidence, not on precaution."],
] as const;

export const TARA_WRITING_QUESTIONS: LongQuestion[] = PAPERS.map((prompts, index) => ({
  id: `tara-writing-${index + 1}`,
  type: "long",
  testId: "tara",
  topicId: "tara-writing",
  difficulty: 3,
  totalMarks: 20,
  responseKind: "essay",
  essayPrompts: prompts.map((title, promptIndex) => ({ id: String.fromCharCode(65 + promptIndex), title })),
  recommendedWords: [450, 650],
  maxWords: 750,
  rubricDimensions: TARA_RUBRIC,
  context: "Choose ONE statement. Explain what the statement means, give a reasoned argument against it, and discuss the extent to which you agree with it.",
  parts: [{ label: "Writing", marks: 20, question: "Respond to all three elements of the task for your selected statement.", solutionOutline: TARA_RUBRIC.map((item) => `${item.label} (${item.maxMarks}): ${item.description}`).join("\n") }],
  fullSolution: "There is no single model response and the official TARA Writing Task is unscored. For formative review, a strong answer explains the proposition precisely, constructs a serious argument against it, then weighs competing considerations to state a qualified degree of agreement. Ideas should be selected and organised carefully within the 750-word limit.",
}));
