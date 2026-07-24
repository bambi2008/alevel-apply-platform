import { z } from "zod";
import type { MCQOptionKey, Question, QuestionDifficulty } from "@/lib/tests/questions/types";
import { findSemanticRisks } from "@/lib/tests/audit/semantic";
import { findTeachingRisks } from "@/lib/tests/audit/teaching";

export const WORKFLOW_STAGES = ["DRAFT", "SUBJECT_REVIEW", "TEACHING_REVIEW", "APPROVED"] as const;
export type WorkflowStage = (typeof WORKFLOW_STAGES)[number];
export type SourceType = "ORIGINAL" | "OFFICIAL" | "ADAPTED";
export type RightsStatus = "OWNED" | "LICENSED" | "LINK_ONLY" | "RESTRICTED" | "UNKNOWN";

const optionKeySchema = z.enum(["A", "B", "C", "D", "E", "F", "G", "H"]);
const difficultySchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
const optionSchema = z.object({ key: optionKeySchema, text: z.string().min(1) });
const mcqSchema = z.object({
  id: z.string().min(3).max(120),
  type: z.literal("mcq"),
  testId: z.string().min(1),
  topicId: z.string().min(1),
  difficulty: difficultySchema,
  marks: z.number().int().positive(),
  question: z.string().min(1),
  options: z.array(optionSchema).min(2).max(8),
  answer: optionKeySchema,
  solution: z.string().min(1),
  hint: z.string().optional(),
  context: z.string().optional(),
  optionExplanations: z.record(z.string()).optional(),
});
const longPartSchema = z.object({
  label: z.string().min(1),
  marks: z.number().int().positive(),
  question: z.string().min(1),
  solutionOutline: z.string().min(1),
  hint: z.string().optional(),
});
const rubricDimensionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  maxMarks: z.number().int().positive(),
  description: z.string().min(1),
});
const longSchema = z.object({
  id: z.string().min(3).max(120),
  type: z.literal("long"),
  testId: z.string().min(1),
  topicId: z.string().min(1),
  difficulty: difficultySchema,
  totalMarks: z.number().int().positive(),
  context: z.string().optional(),
  parts: z.array(longPartSchema).min(1),
  fullSolution: z.string().min(1),
  responseKind: z.enum(["structured", "essay"]).optional(),
  essayPrompts: z.array(z.object({ id: z.string().min(1), title: z.string().min(1) })).optional(),
  recommendedWords: z.tuple([z.number().int().positive(), z.number().int().positive()]).optional(),
  maxWords: z.number().int().positive().optional(),
  rubricDimensions: z.array(rubricDimensionSchema).optional(),
});
export const authoredQuestionSchema = z.discriminatedUnion("type", [mcqSchema, longSchema]);

const sourceSchema = z.object({
  type: z.enum(["ORIGINAL", "OFFICIAL", "ADAPTED"]),
  title: z.string().min(1),
  url: z.string().url().optional().or(z.literal("")),
  year: z.number().int().min(1900).max(2100).optional(),
  rights: z.enum(["OWNED", "LICENSED", "LINK_ONLY", "RESTRICTED", "UNKNOWN"]),
  note: z.string().optional(),
});
const reviewSchema = z.object({
  stage: z.enum(WORKFLOW_STAGES),
  subjectReviewer: z.string().optional(),
  teachingReviewer: z.string().optional(),
  note: z.string().optional(),
  updatedAt: z.string().datetime(),
});
export const questionDraftSchema = z.object({
  schemaVersion: z.literal(1),
  draftId: z.string().min(3),
  version: z.number().int().positive(),
  question: authoredQuestionSchema,
  source: sourceSchema,
  review: reviewSchema,
  createdAt: z.string().datetime(),
  previousQuestion: authoredQuestionSchema.optional(),
});

export type AuthoredQuestion = z.infer<typeof authoredQuestionSchema>;
export type QuestionDraft = z.infer<typeof questionDraftSchema>;

export interface AuthoringIssue {
  code: string;
  severity: "critical" | "warning" | "info";
  message: string;
  field?: string;
}

export interface DraftDiff {
  field: string;
  before: string;
  after: string;
}

export interface PaperBlueprint {
  testId: string;
  title: string;
  questionCount: number;
  mcqOnly: boolean;
  difficulty: { 1: number; 2: number; 3: number };
  topicIds: string[];
}

export interface PaperCandidate {
  id: string;
  testId: string;
  topicId: string;
  difficulty: QuestionDifficulty;
  type: Question["type"];
  answer?: MCQOptionKey;
}

export interface PaperPlan {
  selected: PaperCandidate[];
  topicCounts: Record<string, number>;
  difficultyCounts: Record<1 | 2 | 3, number>;
  answerCounts: Record<string, number>;
  issues: AuthoringIssue[];
}

const NEXT_STAGE: Record<WorkflowStage, WorkflowStage | null> = {
  DRAFT: "SUBJECT_REVIEW",
  SUBJECT_REVIEW: "TEACHING_REVIEW",
  TEACHING_REVIEW: "APPROVED",
  APPROVED: null,
};

function normalizedQuestion(question: AuthoredQuestion): Question {
  return question as Question;
}

function formatValue(value: unknown): string {
  if (value === undefined) return "未设置";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function flatten(value: unknown, prefix = "", result: Record<string, unknown> = {}) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => flatten(item, `${prefix}[${index}]`, result));
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      flatten(item, prefix ? `${prefix}.${key}` : key, result);
    }
  } else {
    result[prefix] = value;
  }
  return result;
}

export function createBlankDraft(testId: string, topicId: string, now = new Date()): QuestionDraft {
  const stamp = now.toISOString();
  return {
    schemaVersion: 1,
    draftId: `draft-${now.getTime()}`,
    version: 1,
    question: {
      id: `${testId}-draft-${now.getTime()}`,
      type: "mcq",
      testId,
      topicId,
      difficulty: 2,
      marks: 1,
      question: "",
      options: [
        { key: "A", text: "" },
        { key: "B", text: "" },
        { key: "C", text: "" },
        { key: "D", text: "" },
      ],
      answer: "A",
      solution: "",
    },
    source: { type: "ORIGINAL", title: "桥申原创题", rights: "OWNED" },
    review: { stage: "DRAFT", updatedAt: stamp },
    createdAt: stamp,
  };
}

export function validateDraft(input: unknown): { draft?: QuestionDraft; issues: AuthoringIssue[] } {
  const parsed = questionDraftSchema.safeParse(input);
  if (!parsed.success) {
    return {
      issues: parsed.error.issues.map((issue) => ({
        code: "SCHEMA_ERROR",
        severity: "critical",
        field: issue.path.join("."),
        message: issue.code === "too_small" ? "此字段不能为空或未达到最低要求。" : issue.message,
      })),
    };
  }
  const draft = parsed.data;
  const question = normalizedQuestion(draft.question);
  const issues: AuthoringIssue[] = [];

  if (question.type === "mcq") {
    const keys = question.options.map((option) => option.key);
    if (!keys.includes(question.answer)) {
      issues.push({ code: "ANSWER_NOT_IN_OPTIONS", severity: "critical", field: "question.answer", message: "正确答案不在选项中。" });
    }
    if (new Set(keys).size !== keys.length) {
      issues.push({ code: "DUPLICATE_OPTION_KEY", severity: "critical", field: "question.options", message: "选项字母重复。" });
    }
    const normalizedOptions = question.options.map((option) => option.text.trim().toLowerCase());
    if (new Set(normalizedOptions).size !== normalizedOptions.length) {
      issues.push({ code: "DUPLICATE_OPTION_TEXT", severity: "critical", field: "question.options", message: "选项文本重复。" });
    }
    issues.push(...findTeachingRisks(question).map((issue) => ({ ...issue, field: "question.optionExplanations" })));
  } else {
    const partMarks = question.parts.reduce((sum, part) => sum + part.marks, 0);
    if (partMarks !== question.totalMarks) {
      issues.push({ code: "LONG_MARKS_MISMATCH", severity: "critical", field: "question.totalMarks", message: `小问合计 ${partMarks} 分，与总分 ${question.totalMarks} 不一致。` });
    }
    if (question.responseKind === "essay") {
      if (!question.essayPrompts?.length) {
        issues.push({ code: "MISSING_ESSAY_PROMPTS", severity: "critical", field: "question.essayPrompts", message: "Essay 题缺少可选写作题目。" });
      }
      if (!question.rubricDimensions?.length) {
        issues.push({ code: "MISSING_ESSAY_RUBRIC", severity: "critical", field: "question.rubricDimensions", message: "Essay 题缺少评分维度。" });
      }
      const rubricMarks = question.rubricDimensions?.reduce((sum, item) => sum + item.maxMarks, 0) ?? 0;
      if (question.rubricDimensions?.length && rubricMarks !== question.totalMarks) {
        issues.push({ code: "ESSAY_RUBRIC_MARKS_MISMATCH", severity: "critical", field: "question.rubricDimensions", message: `评分维度合计 ${rubricMarks} 分，与总分 ${question.totalMarks} 不一致。` });
      }
      if (question.recommendedWords && question.recommendedWords[0] > question.recommendedWords[1]) {
        issues.push({ code: "INVALID_WORD_RANGE", severity: "critical", field: "question.recommendedWords", message: "建议字数下限不能高于上限。" });
      }
    }
  }

  issues.push(...findSemanticRisks(question).map((issue) => ({ ...issue, field: "question" })));

  if (!["OWNED", "LICENSED"].includes(draft.source.rights)) {
    issues.push({
      code: "RIGHTS_NOT_CLEARED",
      severity: "critical",
      field: "source.rights",
      message: "来源权利未获许可，只能保留为研究材料，不能进入发布包。",
    });
  }
  if (draft.source.type === "OFFICIAL" && !draft.source.url) {
    issues.push({ code: "MISSING_SOURCE_URL", severity: "warning", field: "source.url", message: "官方题应记录可核验的来源链接。" });
  }
  if (draft.review.stage === "APPROVED") {
    if (!draft.review.subjectReviewer?.trim()) {
      issues.push({ code: "MISSING_SUBJECT_REVIEWER", severity: "critical", field: "review.subjectReviewer", message: "缺少学科审核人。" });
    }
    if (!draft.review.teachingReviewer?.trim()) {
      issues.push({ code: "MISSING_TEACHING_REVIEWER", severity: "critical", field: "review.teachingReviewer", message: "缺少教学审核人。" });
    }
  }
  return { draft, issues };
}

export function advanceDraft(
  draft: QuestionDraft,
  reviewer: string,
  now = new Date(),
): { draft: QuestionDraft; issues: AuthoringIssue[] } {
  const validation = validateDraft(draft);
  const blockers = validation.issues.filter((issue) => issue.severity === "critical");
  if (blockers.length > 0) return { draft, issues: blockers };
  const next = NEXT_STAGE[draft.review.stage];
  if (!next) return { draft, issues: [] };
  const review = {
    ...draft.review,
    stage: next,
    updatedAt: now.toISOString(),
    ...(draft.review.stage === "SUBJECT_REVIEW" ? { subjectReviewer: reviewer.trim() } : {}),
    ...(draft.review.stage === "TEACHING_REVIEW" ? { teachingReviewer: reviewer.trim() } : {}),
  };
  const nextDraft = { ...draft, version: draft.version + 1, review } as QuestionDraft;
  return { draft: nextDraft, issues: validateDraft(nextDraft).issues };
}

export function diffQuestionDraft(draft: QuestionDraft): DraftDiff[] {
  if (!draft.previousQuestion) return [];
  const before = flatten(draft.previousQuestion);
  const after = flatten(draft.question);
  return [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .filter((field) => formatValue(before[field]) !== formatValue(after[field]))
    .map((field) => ({ field, before: formatValue(before[field]), after: formatValue(after[field]) }));
}

export function createReleasePackage(drafts: QuestionDraft[]) {
  const issues = drafts.flatMap((draft) => validateDraft(draft).issues.map((issue) => ({
    ...issue,
    field: `${draft.draftId}:${issue.field ?? "draft"}`,
  })));
  for (const draft of drafts) {
    if (draft.review.stage !== "APPROVED") {
      issues.push({
        code: "DRAFT_NOT_APPROVED",
        severity: "critical",
        field: `${draft.draftId}:review.stage`,
        message: "只有完成双重审核的题目可以发布。",
      });
    }
  }
  return {
    schemaVersion: 1 as const,
    generatedAt: new Date().toISOString(),
    questions: drafts.map((draft) => draft.question),
    sources: Object.fromEntries(drafts.map((draft) => [draft.question.id, draft.source])),
    reviews: Object.fromEntries(drafts.map((draft) => [draft.question.id, draft.review])),
    issues,
    releasable: issues.every((issue) => issue.severity === "info"),
  };
}

function stableRank(id: string) {
  let hash = 0;
  for (const character of id) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return Math.abs(hash);
}

export function buildPaperPlan(candidates: PaperCandidate[], blueprint: PaperBlueprint): PaperPlan {
  const issues: AuthoringIssue[] = [];
  const requestedDifficultyCount = blueprint.difficulty[1] + blueprint.difficulty[2] + blueprint.difficulty[3];
  if (requestedDifficultyCount !== blueprint.questionCount) {
    issues.push({
      code: "INVALID_DIFFICULTY_TARGET",
      severity: "critical",
      message: `难度目标合计 ${requestedDifficultyCount}，应等于题量 ${blueprint.questionCount}。`,
    });
  }
  const pool = candidates
    .filter((question) => question.testId === blueprint.testId)
    .filter((question) => !blueprint.mcqOnly || question.type === "mcq")
    .filter((question) => blueprint.topicIds.length === 0 || blueprint.topicIds.includes(question.topicId));
  const selected: PaperCandidate[] = [];
  const used = new Set<string>();
  const topicCounts: Record<string, number> = {};
  const answerCounts: Record<string, number> = {};

  for (const difficulty of [1, 2, 3] as const) {
    const ranked = pool
      .filter((question) => question.difficulty === difficulty)
      .sort((a, b) => (topicCounts[a.topicId] ?? 0) - (topicCounts[b.topicId] ?? 0) || stableRank(a.id) - stableRank(b.id));
    for (const question of ranked) {
      if (selected.filter((item) => item.difficulty === difficulty).length >= blueprint.difficulty[difficulty]) break;
      if (used.has(question.id)) continue;
      selected.push(question);
      used.add(question.id);
      topicCounts[question.topicId] = (topicCounts[question.topicId] ?? 0) + 1;
      if (question.answer) answerCounts[question.answer] = (answerCounts[question.answer] ?? 0) + 1;
    }
  }
  if (selected.length < blueprint.questionCount) {
    for (const question of [...pool].sort((a, b) => stableRank(a.id) - stableRank(b.id))) {
      if (used.has(question.id)) continue;
      selected.push(question);
      used.add(question.id);
      topicCounts[question.topicId] = (topicCounts[question.topicId] ?? 0) + 1;
      if (question.answer) answerCounts[question.answer] = (answerCounts[question.answer] ?? 0) + 1;
      if (selected.length === blueprint.questionCount) break;
    }
  }

  const difficultyCounts = {
    1: selected.filter((question) => question.difficulty === 1).length,
    2: selected.filter((question) => question.difficulty === 2).length,
    3: selected.filter((question) => question.difficulty === 3).length,
  };
  if (selected.length < blueprint.questionCount) {
    issues.push({ code: "INSUFFICIENT_QUESTIONS", severity: "critical", message: `只能选出 ${selected.length}/${blueprint.questionCount} 道题。` });
  }
  for (const difficulty of [1, 2, 3] as const) {
    if (difficultyCounts[difficulty] < blueprint.difficulty[difficulty]) {
      issues.push({ code: "DIFFICULTY_TARGET_MISSED", severity: "warning", message: `难度 ${difficulty} 缺少 ${blueprint.difficulty[difficulty] - difficultyCounts[difficulty]} 道题。` });
    }
  }
  const mcqCount = selected.filter((question) => question.type === "mcq").length;
  if (mcqCount >= 8 && Object.values(answerCounts).some((count) => count / mcqCount > 0.4)) {
    issues.push({ code: "ANSWER_POSITION_SKEW", severity: "warning", message: "某一答案位置超过客观题的 40%。" });
  }

  return { selected, topicCounts, difficultyCounts, answerCounts, issues };
}
