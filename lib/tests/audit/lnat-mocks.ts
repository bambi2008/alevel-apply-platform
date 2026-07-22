import { getMockPapersForTest } from "@/lib/tests/mock-papers";
import { LNAT_QUESTIONS } from "@/lib/tests/questions/lnat";
import type { LongQuestion, MCQQuestion } from "@/lib/tests/questions/types";

export interface LnatAuditIssue {
  paperId: string;
  questionId?: string;
  code: string;
  severity: "critical" | "warning";
  message: string;
}

export interface LnatPaperSummary {
  paperId: string;
  questions: number;
  passages: number;
  passageSplit: string;
  difficulty: Record<1 | 2 | 3, number>;
  answerCounts: Record<string, number>;
  passageWords: { min: number; average: number; max: number };
  questionTypes: Record<LnatQuestionType, number>;
}

export interface LnatAuditReport {
  objectivePapers: number;
  writtenPapers: number;
  practiceQuestions: number;
  questionCount: number;
  critical: number;
  warnings: number;
  papers: LnatPaperSummary[];
  issues: LnatAuditIssue[];
}

const ANSWERS = ["A", "B", "C", "D"];
type LnatQuestionType = "core" | "interpretation" | "evaluation";

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function structure(value: string): string {
  return normalize(value).replace(/\d+(?:\.\d+)?/g, "#");
}

function passageOf(question: string): string {
  const match = question.match(/\*\*Passage\*\*\s*([\s\S]*?)\s*\*\*Question\*\*/i);
  return normalize(match?.[1] ?? "");
}

function questionStem(question: string): string {
  return normalize(question.split(/\*\*Question\*\*/i)[1] ?? question);
}

function wordCount(value: string): number {
  return value.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g)?.length ?? 0;
}

function questionType(question: string): LnatQuestionType {
  const stem = questionStem(question);
  if (/strengthen|weaken|assum|flaw|objection|reasoning|support|challenge/.test(stem)) return "evaluation";
  if (/main point|main conclusion|main argument|best states|overall assessment|central/.test(stem)) return "core";
  return "interpretation";
}

function count(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((result, value) => {
    result[value] = (result[value] ?? 0) + 1;
    return result;
  }, {});
}

function isMcq(question: MCQQuestion | LongQuestion): question is MCQQuestion {
  return question.type === "mcq";
}

export function buildLnatMockAudit(): LnatAuditReport {
  const allPapers = getMockPapersForTest("lnat");
  const objective = allPapers.filter((paper) => /^lnat-mock-\d+$/.test(paper.id));
  const written = allPapers.filter((paper) => /^lnat-written-\d+$/.test(paper.id));
  const issues: LnatAuditIssue[] = [];
  const seenIds = new Map<string, string>();
  const seenPrompts = new Map<string, string>();
  const seenPassages = new Map<string, string>();
  const seenEssayPrompts = new Set<string>();
  const practiceMcqs = LNAT_QUESTIONS.filter(isMcq);

  if (objective.length !== 5 || written.length !== 3) {
    issues.push({ paperId: "suite", code: "PAPER_INVENTORY", severity: "critical", message: "LNAT must contain five objective papers and three fixed writing papers." });
  }

  const papers = objective.map((paper): LnatPaperSummary => {
    if (paper.modules.length !== 1) {
      issues.push({ paperId: paper.id, code: "MODULE_COUNT", severity: "critical", message: "Each LNAT Section A paper must contain one objective module." });
    }
    const module = paper.modules[0];
    const questions = (module?.questions ?? []).filter(isMcq);
    if (questions.length !== 42 || questions.length !== (module?.questions.length ?? 0)) {
      issues.push({ paperId: paper.id, code: "QUESTION_COUNT", severity: "critical", message: `Section A requires 42 MCQs; found ${questions.length}.` });
    }
    if (module?.durationSec !== 95 * 60) {
      issues.push({ paperId: paper.id, code: "DURATION", severity: "critical", message: "Section A must last 95 minutes." });
    }

    const passageGroups = new Map<string, MCQQuestion[]>();
    const localStructures = new Map<string, string>();
    for (const question of questions) {
      const keys = question.options.map((option) => option.key).join("");
      if (question.testId !== "lnat" || keys !== "ABCD" || !keys.includes(question.answer)) {
        issues.push({ paperId: paper.id, questionId: question.id, code: "OPTION_SCHEMA", severity: "critical", message: "Every current-format Section A item must be an LNAT four-option MCQ with a valid answer." });
      }
      if (new Set(question.options.map((option) => normalize(option.text))).size !== question.options.length) {
        issues.push({ paperId: paper.id, questionId: question.id, code: "DUPLICATE_DISTRACTOR", severity: "critical", message: "Question contains duplicate option text." });
      }

      const priorId = seenIds.get(question.id);
      if (priorId) {
        issues.push({ paperId: paper.id, questionId: question.id, code: "DUPLICATE_ID", severity: "critical", message: `Question ID duplicates ${priorId}.` });
      } else {
        seenIds.set(question.id, paper.id);
      }
      const prompt = normalize(question.question);
      const priorPrompt = seenPrompts.get(prompt);
      if (priorPrompt) {
        issues.push({ paperId: paper.id, questionId: question.id, code: "DUPLICATE_PROMPT", severity: "critical", message: `Prompt duplicates ${priorPrompt}.` });
      } else {
        seenPrompts.set(prompt, `${paper.id}/${question.id}`);
      }

      const passage = passageOf(question.question);
      if (!passage) {
        issues.push({ paperId: paper.id, questionId: question.id, code: "MISSING_PASSAGE", severity: "critical", message: "Question is not attached to a marked argumentative passage." });
      } else {
        const group = passageGroups.get(passage) ?? [];
        group.push(question);
        passageGroups.set(passage, group);
      }

      const signature = structure(question.question);
      const priorStructure = localStructures.get(signature);
      if (priorStructure) {
        issues.push({ paperId: paper.id, questionId: question.id, code: "DUPLICATE_STRUCTURE", severity: "warning", message: `Question repeats the structure of ${priorStructure}.` });
      } else {
        localStructures.set(signature, question.id);
      }
    }

    if (passageGroups.size !== 12) {
      issues.push({ paperId: paper.id, code: "PASSAGE_COUNT", severity: "critical", message: `Section A requires 12 passages; found ${passageGroups.size}.` });
    }
    const passageSizes = [...passageGroups.values()].map((group) => group.length).sort((left, right) => left - right);
    if (passageSizes.join(",") !== "3,3,3,3,3,3,4,4,4,4,4,4") {
      issues.push({ paperId: paper.id, code: "PASSAGE_QUESTION_SPLIT", severity: "critical", message: `Expected six 3-question and six 4-question passages; found ${passageSizes.join("/") || "none"}.` });
    }
    for (const passage of passageGroups.keys()) {
      const priorPaper = seenPassages.get(passage);
      if (priorPaper && priorPaper !== paper.id) {
        issues.push({ paperId: paper.id, code: "REUSED_PASSAGE", severity: "critical", message: `Passage is reused from ${priorPaper}.` });
      } else {
        seenPassages.set(passage, paper.id);
      }
    }

    const difficulty = {
      1: questions.filter((question) => question.difficulty === 1).length,
      2: questions.filter((question) => question.difficulty === 2).length,
      3: questions.filter((question) => question.difficulty === 3).length,
    };
    const answerCounts = count(questions.map((question) => question.answer));
    const passageWordCounts = [...passageGroups.keys()].map(wordCount);
    const passageWords = {
      min: Math.min(...passageWordCounts),
      average: Math.round(passageWordCounts.reduce((total, words) => total + words, 0) / passageWordCounts.length),
      max: Math.max(...passageWordCounts),
    };
    const questionTypes = count(questions.map((question) => questionType(question.question))) as Record<LnatQuestionType, number>;
    if (questions.length === 42 && (difficulty[1] < 6 || difficulty[2] < 20 || difficulty[3] < 8)) {
      issues.push({ paperId: paper.id, code: "DIFFICULTY_BALANCE", severity: "warning", message: `A full paper needs a real gradient; found ${difficulty[1]}/${difficulty[2]}/${difficulty[3]}.` });
    }
    if (questions.length === 42 && ANSWERS.some((answer) => (answerCounts[answer] ?? 0) < 10 || (answerCounts[answer] ?? 0) > 11)) {
      issues.push({ paperId: paper.id, code: "ANSWER_BALANCE", severity: "warning", message: "Each answer position should occur 10-11 times across a full paper." });
    }
    if (passageGroups.size === 12 && (passageWords.min < 50 || passageWords.average < 65 || passageWords.max < 75)) {
      issues.push({ paperId: paper.id, code: "PASSAGE_LENGTH", severity: "warning", message: `Passages are too compressed for a full reading paper; found min/average/max ${passageWords.min}/${passageWords.average}/${passageWords.max} words.` });
    }
    if (questions.length === 42 && ((questionTypes.core ?? 0) < 3 || (questionTypes.evaluation ?? 0) < 7 || (questionTypes.interpretation ?? 0) < 20)) {
      issues.push({ paperId: paper.id, code: "QUESTION_TYPE_BALANCE", severity: "warning", message: `Paper needs main-point, interpretation and argument-evaluation coverage; found ${questionTypes.core ?? 0}/${questionTypes.interpretation ?? 0}/${questionTypes.evaluation ?? 0}.` });
    }

    return {
      paperId: paper.id,
      questions: questions.length,
      passages: passageGroups.size,
      passageSplit: passageSizes.join("/"),
      difficulty,
      answerCounts,
      passageWords,
      questionTypes,
    };
  });

  if (practiceMcqs.length !== 31) {
    issues.push({ paperId: "practice", code: "PRACTICE_INVENTORY", severity: "critical", message: `Expected 31 passage-isolated practice MCQs; found ${practiceMcqs.length}.` });
  }
  const practiceIds = new Set<string>();
  const practicePrompts = new Set<string>();
  for (const question of practiceMcqs) {
    const keys = question.options.map((option) => option.key).join("");
    if (keys !== "ABCD" || !keys.includes(question.answer)) {
      issues.push({ paperId: "practice", questionId: question.id, code: "PRACTICE_OPTION_SCHEMA", severity: "critical", message: "Every practice item must use the current A-D option format." });
    }
    const prompt = normalize(question.question);
    if (practiceIds.has(question.id) || practicePrompts.has(prompt)) {
      issues.push({ paperId: "practice", questionId: question.id, code: "PRACTICE_DUPLICATE", severity: "critical", message: "Practice question repeats an ID or prompt." });
    }
    practiceIds.add(question.id);
    practicePrompts.add(prompt);
    const passage = passageOf(question.question);
    if (seenPassages.has(passage)) {
      issues.push({ paperId: "practice", questionId: question.id, code: "PRACTICE_MOCK_PASSAGE_OVERLAP", severity: "critical", message: `Practice passage is already used in ${seenPassages.get(passage)}.` });
    }
  }

  for (const paper of written) {
    const module = paper.modules[0];
    const question = module?.questions[0];
    if (paper.modules.length !== 1 || module?.durationSec !== 40 * 60 || module.questions.length !== 1 || question?.type !== "long") {
      issues.push({ paperId: paper.id, code: "WRITING_STRUCTURE", severity: "critical", message: "Each Section B paper must contain one 40-minute essay task." });
      continue;
    }
    const rubricMarks = question.rubricDimensions?.reduce((total, dimension) => total + dimension.maxMarks, 0) ?? 0;
    if (question.responseKind !== "essay" || question.essayPrompts?.length !== 3 || question.maxWords !== 750 || question.totalMarks !== 20 || rubricMarks !== 20) {
      issues.push({ paperId: paper.id, questionId: question.id, code: "WRITING_FORMAT", severity: "critical", message: "Section B must offer three prompts, a 750-word cap and a 20-point formative rubric." });
    }
    for (const prompt of question.essayPrompts ?? []) {
      const normalized = normalize(prompt.title);
      if (seenEssayPrompts.has(normalized)) {
        issues.push({ paperId: paper.id, questionId: question.id, code: "DUPLICATE_ESSAY_PROMPT", severity: "critical", message: `Essay prompt is duplicated: ${prompt.title}` });
      }
      seenEssayPrompts.add(normalized);
    }
    if (!/no single model answer/i.test(question.fullSolution)) {
      issues.push({ paperId: paper.id, questionId: question.id, code: "WRITING_GUIDANCE", severity: "warning", message: "Essay feedback must make clear that there is no single model answer." });
    }
  }

  return {
    objectivePapers: objective.length,
    writtenPapers: written.length,
    practiceQuestions: practiceMcqs.length,
    questionCount: papers.reduce((total, paper) => total + paper.questions, 0),
    critical: issues.filter((issue) => issue.severity === "critical").length,
    warnings: issues.filter((issue) => issue.severity === "warning").length,
    papers,
    issues,
  };
}
