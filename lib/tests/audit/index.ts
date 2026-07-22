import { ADMISSIONS_TESTS } from "@/lib/tests";
import { getKnowledgeByTopicId } from "@/lib/tests/knowledge";
import { getMockPapersForTest } from "@/lib/tests/mock-papers";
import { BMO_QUESTIONS } from "@/lib/tests/questions/bmo";
import { BPHO_QUESTIONS } from "@/lib/tests/questions/bpho";
import { ESAT_QUESTIONS } from "@/lib/tests/questions/esat";
import { LNAT_QUESTIONS } from "@/lib/tests/questions/lnat";
import { MAT_QUESTIONS } from "@/lib/tests/questions/mat";
import { PAT_QUESTIONS } from "@/lib/tests/questions/pat";
import { STEP_QUESTIONS } from "@/lib/tests/questions/step";
import { TARA_QUESTIONS } from "@/lib/tests/questions/tara";
import { TMUA_QUESTIONS } from "@/lib/tests/questions/tmua";
import { UCAT_QUESTIONS } from "@/lib/tests/questions/ucat";
import type { Question } from "@/lib/tests/questions/types";

export type AuditSeverity = "critical" | "warning" | "info";

export interface AuditIssue {
  code: string;
  severity: AuditSeverity;
  message: string;
  testId?: string;
  topicId?: string;
  questionId?: string;
}

export interface DifficultyCounts {
  1: number;
  2: number;
  3: number;
}

export interface TopicAuditSummary {
  id: string;
  title: string;
  questions: number;
  mcq: number;
  long: number;
  difficulty: DifficultyCounts;
  hasKnowledge: boolean;
}

export interface TestAuditSummary {
  id: string;
  abbr: string;
  category: string;
  questions: number;
  mcq: number;
  long: number;
  difficulty: DifficultyCounts;
  topicsCovered: number;
  topicsTotal: number;
  mockPapers: number;
  mockQuestionSlots: number;
  mockLongSlots: number;
  fixedWrittenPapers: number;
  issues: { critical: number; warning: number; info: number };
  topics: TopicAuditSummary[];
}

export interface QuestionBankAuditReport {
  totals: {
    tests: number;
    questions: number;
    mcq: number;
    long: number;
    mockPapers: number;
    mockQuestionSlots: number;
    topicsCovered: number;
    topicsTotal: number;
    critical: number;
    warning: number;
    info: number;
  };
  tests: TestAuditSummary[];
  issues: AuditIssue[];
}

const QUESTION_BANKS: Record<string, Question[]> = {
  mat: MAT_QUESTIONS,
  pat: PAT_QUESTIONS,
  step: STEP_QUESTIONS,
  esat: ESAT_QUESTIONS,
  tmua: TMUA_QUESTIONS,
  tara: TARA_QUESTIONS,
  lnat: LNAT_QUESTIONS,
  bmo: BMO_QUESTIONS,
  bpho: BPHO_QUESTIONS,
  ucat: UCAT_QUESTIONS,
};

const FORMAT_RULES: Record<string, { needsWrittenPractice: boolean; needsFixedWrittenPaper: boolean }> = {
  mat: { needsWrittenPractice: true, needsFixedWrittenPaper: true },
  // PAT ended in 2025 and its final official format was objective; written sets are extension work only.
  pat: { needsWrittenPractice: false, needsFixedWrittenPaper: false },
  step: { needsWrittenPractice: true, needsFixedWrittenPaper: true },
  esat: { needsWrittenPractice: false, needsFixedWrittenPaper: false },
  tmua: { needsWrittenPractice: false, needsFixedWrittenPaper: false },
  tara: { needsWrittenPractice: true, needsFixedWrittenPaper: true },
  lnat: { needsWrittenPractice: true, needsFixedWrittenPaper: true },
  bmo: { needsWrittenPractice: true, needsFixedWrittenPaper: true },
  bpho: { needsWrittenPractice: true, needsFixedWrittenPaper: true },
  ucat: { needsWrittenPractice: false, needsFixedWrittenPaper: false },
};

function difficultyCounts(questions: Question[]): DifficultyCounts {
  return {
    1: questions.filter((question) => question.difficulty === 1).length,
    2: questions.filter((question) => question.difficulty === 2).length,
    3: questions.filter((question) => question.difficulty === 3).length,
  };
}

function normalizedPrompt(question: Question): string {
  const source = question.type === "mcq"
    ? question.question
    : `${question.context ?? ""} ${question.essayPrompts?.map((prompt) => prompt.title).join(" ") ?? ""} ${question.parts.map((part) => part.question).join(" ")}`;
  return source
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function countIssues(issues: AuditIssue[], testId: string) {
  const own = issues.filter((issue) => issue.testId === testId);
  return {
    critical: own.filter((issue) => issue.severity === "critical").length,
    warning: own.filter((issue) => issue.severity === "warning").length,
    info: own.filter((issue) => issue.severity === "info").length,
  };
}

function auditQuestion(question: Question, expectedTestId: string, validTopics: Set<string>): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const base = { testId: question.testId, topicId: question.topicId, questionId: question.id };
  if (question.testId !== expectedTestId) {
    issues.push({
      ...base,
      testId: expectedTestId,
      code: "TEST_ID_MISMATCH",
      severity: "critical",
      message: `题目标记为 ${question.testId}，但被收录在 ${expectedTestId} 题库。`,
    });
  }
  if (!validTopics.has(question.topicId)) {
    issues.push({ ...base, code: "UNKNOWN_TOPIC", severity: "critical", message: "题目引用了不存在的知识点。" });
  }
  if (question.type === "mcq") {
    const keys = question.options.map((option) => option.key);
    const expectedKeys = "ABCDEFGH".slice(0, keys.length).split("");
    if (!keys.includes(question.answer)) {
      issues.push({ ...base, code: "ANSWER_NOT_IN_OPTIONS", severity: "critical", message: "正确答案不在选项中。" });
    }
    if (new Set(keys).size !== keys.length) {
      issues.push({ ...base, code: "DUPLICATE_OPTION_KEY", severity: "critical", message: "选项键重复。" });
    }
    if (keys.join("") !== expectedKeys.join("")) {
      issues.push({
        ...base,
        code: "NON_SEQUENTIAL_OPTION_KEYS",
        severity: "critical",
        message: "MCQ option keys must be continuous and start at A.",
      });
    }
    const optionText = question.options.map((option) => option.text.trim().toLowerCase());
    if (new Set(optionText).size !== optionText.length) {
      issues.push({ ...base, code: "DUPLICATE_OPTION_TEXT", severity: "critical", message: "选项文本重复。" });
    }
    if (!question.question.trim() || !question.solution.trim() || question.marks <= 0) {
      issues.push({ ...base, code: "INCOMPLETE_MCQ", severity: "critical", message: "选择题题干、解答或分值不完整。" });
    }
  } else {
    const partMarks = question.parts.reduce((sum, part) => sum + part.marks, 0);
    if (question.parts.length === 0 || partMarks !== question.totalMarks || question.totalMarks <= 0) {
      issues.push({ ...base, code: "INVALID_LONG_MARKS", severity: "critical", message: "书面题分部或总分不一致。" });
    }
    if (!question.fullSolution.trim() || question.parts.some((part) => !part.question.trim() || !part.solutionOutline.trim())) {
      issues.push({ ...base, code: "INCOMPLETE_LONG_SOLUTION", severity: "critical", message: "书面题题干、评分要点或完整解答缺失。" });
    }
    if (question.responseKind === "essay") {
      const rubricMarks = question.rubricDimensions?.reduce((sum, dimension) => sum + dimension.maxMarks, 0) ?? 0;
      if (!question.essayPrompts?.length || !question.maxWords || rubricMarks !== question.totalMarks) {
        issues.push({ ...base, code: "INVALID_ESSAY_FORMAT", severity: "critical", message: "写作题缺少选题、词数上限，或量表分值与总分不一致。" });
      }
    }
  }
  return issues;
}

export function getPrimaryQuestionIndex(): Map<string, Question> {
  return new Map(Object.values(QUESTION_BANKS).flat().map((question) => [question.id, question]));
}

export function buildQuestionBankAudit(): QuestionBankAuditReport {
  const issues: AuditIssue[] = [];
  const seenIds = new Map<string, string>();
  const seenPrompts = new Map<string, { testId: string; questionId: string }>();

  for (const test of ADMISSIONS_TESTS) {
    const validTopics = new Set(test.topics.map((topic) => topic.id));
    for (const question of QUESTION_BANKS[test.id] ?? []) {
      issues.push(...auditQuestion(question, test.id, validTopics));
      const existingId = seenIds.get(question.id);
      if (existingId) {
        issues.push({
          code: "DUPLICATE_QUESTION_ID", severity: "critical", testId: test.id,
          questionId: question.id, message: `题目 ID 与 ${existingId} 重复。`,
        });
      } else {
        seenIds.set(question.id, `${test.id}/${question.id}`);
      }

      const prompt = normalizedPrompt(question);
      if (prompt.length >= 24) {
        const existingPrompt = seenPrompts.get(`${test.id}:${prompt}`);
        if (existingPrompt) {
          issues.push({
            code: "DUPLICATE_PROMPT", severity: "warning", testId: test.id,
            questionId: question.id, message: `题面与 ${existingPrompt.questionId} 高度重复。`,
          });
        } else {
          seenPrompts.set(`${test.id}:${prompt}`, { testId: test.id, questionId: question.id });
        }
      }
    }
  }

  const tests = ADMISSIONS_TESTS.map<TestAuditSummary>((test) => {
    const questions = QUESTION_BANKS[test.id] ?? [];
    const papers = getMockPapersForTest(test.id);
    const mockQuestions = papers.flatMap((paper) => paper.modules.flatMap((module) => module.questions));
    const topics = test.topics.map<TopicAuditSummary>((topic) => {
      const topicQuestions = questions.filter((question) => question.topicId === topic.id);
      if (topicQuestions.length === 0) {
        issues.push({ code: "EMPTY_TOPIC", severity: "warning", testId: test.id, topicId: topic.id, message: "知识点没有任何练习题。" });
      }
      if (!getKnowledgeByTopicId(topic.id)) {
        issues.push({ code: "MISSING_KNOWLEDGE", severity: "warning", testId: test.id, topicId: topic.id, message: "知识点缺少讲解模块。" });
      }
      const difficulty = difficultyCounts(topicQuestions);
      if (topicQuestions.length >= 10 && Object.values(difficulty).some((count) => count === 0)) {
        issues.push({ code: "MISSING_DIFFICULTY_LEVEL", severity: "warning", testId: test.id, topicId: topic.id, message: "题量充足但缺少某个难度等级。" });
      }
      return {
        id: topic.id,
        title: topic.title,
        questions: topicQuestions.length,
        mcq: topicQuestions.filter((question) => question.type === "mcq").length,
        long: topicQuestions.filter((question) => question.type === "long").length,
        difficulty,
        hasKnowledge: Boolean(getKnowledgeByTopicId(topic.id)),
      };
    });

    const comparableTopicCounts = test.topics
      .map((topic) => questions.filter((question) => question.topicId === topic.id && (question.type !== "long" || question.responseKind !== "essay")).length)
      .filter(Boolean);
    if (comparableTopicCounts.length > 1 && Math.max(...comparableTopicCounts) / Math.min(...comparableTopicCounts) > 3) {
      issues.push({ code: "TOPIC_IMBALANCE", severity: "warning", testId: test.id, message: "最多与最少知识点题量相差超过 3 倍。" });
    }

    const format = FORMAT_RULES[test.id];
    if (format?.needsWrittenPractice && !questions.some((question) => question.type === "long")) {
      issues.push({ code: "MISSING_WRITTEN_PRACTICE", severity: "warning", testId: test.id, message: "考试包含书面作答，但练习题库没有书面题。" });
    }
    const fixedWrittenPapers = papers.filter((paper) => paper.id.includes("written")).length;
    if (format?.needsFixedWrittenPaper && fixedWrittenPapers === 0) {
      issues.push({ code: "MISSING_FIXED_WRITTEN_PAPER", severity: "warning", testId: test.id, message: "考试需要书面作答，但没有固定书面套卷。" });
    }
    if (questions.length >= 30) {
      const difficulty = difficultyCounts(questions);
      if (Object.values(difficulty).some((count) => count === 0)) {
        issues.push({ code: "TEST_DIFFICULTY_SKEW", severity: "warning", testId: test.id, message: "整个考试题库缺少某个难度等级。" });
      }
    }

    return {
      id: test.id,
      abbr: test.abbr,
      category: test.category,
      questions: questions.length,
      mcq: questions.filter((question) => question.type === "mcq").length,
      long: questions.filter((question) => question.type === "long").length,
      difficulty: difficultyCounts(questions),
      topicsCovered: topics.filter((topic) => topic.questions > 0).length,
      topicsTotal: topics.length,
      mockPapers: papers.length,
      mockQuestionSlots: mockQuestions.length,
      mockLongSlots: mockQuestions.filter((question) => question.type === "long").length,
      fixedWrittenPapers,
      issues: { critical: 0, warning: 0, info: 0 },
      topics,
    };
  });

  for (const test of tests) test.issues = countIssues(issues, test.id);
  const total = (severity: AuditSeverity) => issues.filter((issue) => issue.severity === severity).length;
  const severityOrder: Record<AuditSeverity, number> = { critical: 0, warning: 1, info: 2 };
  const sortedIssues = [...issues].sort((a, b) =>
    severityOrder[a.severity] - severityOrder[b.severity]
    || (a.testId ?? "").localeCompare(b.testId ?? "")
    || a.code.localeCompare(b.code)
  );
  return {
    totals: {
      tests: tests.length,
      questions: tests.reduce((sum, test) => sum + test.questions, 0),
      mcq: tests.reduce((sum, test) => sum + test.mcq, 0),
      long: tests.reduce((sum, test) => sum + test.long, 0),
      mockPapers: tests.reduce((sum, test) => sum + test.mockPapers, 0),
      mockQuestionSlots: tests.reduce((sum, test) => sum + test.mockQuestionSlots, 0),
      topicsCovered: tests.reduce((sum, test) => sum + test.topicsCovered, 0),
      topicsTotal: tests.reduce((sum, test) => sum + test.topicsTotal, 0),
      critical: total("critical"),
      warning: total("warning"),
      info: total("info"),
    },
    tests,
    issues: sortedIssues,
  };
}
