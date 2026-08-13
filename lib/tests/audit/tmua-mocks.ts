import { getMockPapersForTest } from "@/lib/tests/mock-papers";
import type { MCQQuestion } from "@/lib/tests/questions/types";

export type TmuaMockAuditSeverity = "critical" | "warning" | "info";

export interface TmuaMockAuditIssue {
  paperId: string;
  moduleId?: string;
  questionId?: string;
  code: string;
  severity: TmuaMockAuditSeverity;
  message: string;
}

export interface TmuaModuleAuditSummary {
  moduleId: string;
  questions: number;
  difficulty: Record<1 | 2 | 3, number>;
  maxOptionCount: number;
  answerKeys: string;
  dominantAnswerShare: number;
  statementCombinationQuestions: number;
  directLogicQuestions: number;
}

export interface TmuaPaperAuditSummary {
  paperId: string;
  modules: TmuaModuleAuditSummary[];
  issueCount: number;
}

export interface TmuaMockAuditReport {
  paperCount: number;
  questionCount: number;
  critical: number;
  warnings: number;
  papers: TmuaPaperAuditSummary[];
  issues: TmuaMockAuditIssue[];
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function difficultyCounts(questions: MCQQuestion[]): Record<1 | 2 | 3, number> {
  return {
    1: questions.filter((question) => question.difficulty === 1).length,
    2: questions.filter((question) => question.difficulty === 2).length,
    3: questions.filter((question) => question.difficulty === 3).length,
  };
}

function dominantAnswerShare(questions: MCQQuestion[]): number {
  const counts = new Map<string, number>();
  for (const question of questions) counts.set(question.answer, (counts.get(question.answer) ?? 0) + 1);
  return questions.length ? Math.max(0, ...counts.values()) / questions.length : 0;
}

function isStatementCombination(question: MCQQuestion): boolean {
  return /\nI\..*\nII\..*\nIII\./s.test(question.question);
}

function isDirectLogicQuestion(question: MCQQuestion): boolean {
  if (isStatementCombination(question)) return false;
  return /\b(negation|converse|contrapositive|necessary|sufficient|counterexample|proof by)\b/i.test(question.question);
}

export function buildTmuaMockAudit(): TmuaMockAuditReport {
  const papers = getMockPapersForTest("tmua");
  const issues: TmuaMockAuditIssue[] = [];
  const seenPrompts = new Map<string, { paperId: string; questionId: string }>();

  const summaries = papers.map<TmuaPaperAuditSummary>((paper) => {
    if (paper.modules.length !== 2) {
      issues.push({ paperId: paper.id, code: "MODULE_COUNT", severity: "critical", message: "TMUA paper must contain Paper 1 and Paper 2." });
    }

    const modules = paper.modules.map<TmuaModuleAuditSummary>((module, moduleIndex) => {
      const questions = module.questions.filter((question): question is MCQQuestion => question.type === "mcq");
      if (questions.length !== 20 || questions.length !== module.questions.length) {
        issues.push({ paperId: paper.id, moduleId: module.id, code: "QUESTION_COUNT", severity: "critical", message: "Each TMUA module must contain 20 MCQs." });
      }
      if (module.durationSec !== 75 * 60) {
        issues.push({ paperId: paper.id, moduleId: module.id, code: "DURATION", severity: "critical", message: "Each TMUA module must last 75 minutes." });
      }

      for (const question of questions) {
        const keys = question.options.map((option) => option.key).join("");
        const expected = "ABCDEFGH".slice(0, question.options.length);
        if (keys !== expected || !keys.includes(question.answer)) {
          issues.push({ paperId: paper.id, moduleId: module.id, questionId: question.id, code: "OPTION_KEYS", severity: "critical", message: "Option keys must be continuous and contain the answer." });
        }
        const optionTexts = question.options.map((option) => normalizeText(option.text));
        if (new Set(optionTexts).size !== optionTexts.length) {
          issues.push({ paperId: paper.id, moduleId: module.id, questionId: question.id, code: "DUPLICATE_DISTRACTOR", severity: "critical", message: "A question contains duplicate option text." });
        }

        const prompt = normalizeText(question.question);
        const existing = seenPrompts.get(prompt);
        if (existing) {
          issues.push({ paperId: paper.id, moduleId: module.id, questionId: question.id, code: "DUPLICATE_PROMPT", severity: "critical", message: `Prompt duplicates ${existing.paperId}/${existing.questionId}.` });
        } else {
          seenPrompts.set(prompt, { paperId: paper.id, questionId: question.id });
        }
      }

      const difficulty = difficultyCounts(questions);
      const answerShare = dominantAnswerShare(questions);
      const maxOptionCount = Math.max(0, ...questions.map((question) => question.options.length));
      const statementCombinationQuestions = questions.filter(isStatementCombination).length;
      const directLogicQuestions = questions.filter(isDirectLogicQuestion).length;

      if (moduleIndex === 0 && difficulty[3] < 6) {
        issues.push({ paperId: paper.id, moduleId: module.id, code: "PAPER1_TOO_EASY", severity: "warning", message: `Paper 1 has only ${difficulty[3]} difficulty-3 questions; target is at least 6.` });
      }
      if (moduleIndex === 1 && difficulty[3] < 8) {
        issues.push({ paperId: paper.id, moduleId: module.id, code: "PAPER2_TOO_EASY", severity: "warning", message: `Paper 2 has only ${difficulty[3]} difficulty-3 questions; target is at least 8.` });
      }
      if (answerShare > 0.5) {
        issues.push({ paperId: paper.id, moduleId: module.id, code: "ANSWER_POSITION_BIAS", severity: "warning", message: `One answer key occupies ${(answerShare * 100).toFixed(0)}% of the module.` });
      }
      if (moduleIndex === 1 && maxOptionCount === 5) {
        issues.push({ paperId: paper.id, moduleId: module.id, code: "NO_EXTENDED_OPTIONS", severity: "warning", message: "Paper 2 has no six-to-eight-option reasoning questions." });
      }
      if (moduleIndex === 1 && directLogicQuestions > 6) {
        issues.push({ paperId: paper.id, moduleId: module.id, code: "DIRECT_LOGIC_OVERUSE", severity: "warning", message: `${directLogicQuestions} questions use isolated logic-definition templates.` });
      }

      return {
        moduleId: module.id,
        questions: questions.length,
        difficulty,
        maxOptionCount,
        answerKeys: questions.map((question) => question.answer).join(""),
        dominantAnswerShare: answerShare,
        statementCombinationQuestions,
        directLogicQuestions,
      };
    });

    return { paperId: paper.id, modules, issueCount: 0 };
  });

  for (const summary of summaries) {
    summary.issueCount = issues.filter((issue) => issue.paperId === summary.paperId).length;
  }

  return {
    paperCount: papers.length,
    questionCount: papers.flatMap((paper) => paper.modules.flatMap((module) => module.questions)).length,
    critical: issues.filter((issue) => issue.severity === "critical").length,
    warnings: issues.filter((issue) => issue.severity === "warning").length,
    papers: summaries,
    issues,
  };
}
