import { getMockPapersForTest } from "@/lib/tests/mock-papers";
import type { MCQQuestion } from "@/lib/tests/questions/types";

export type EsatAuditSeverity = "critical" | "warning";

export interface EsatAuditIssue {
  paperId: string;
  moduleId?: string;
  questionId?: string;
  code: string;
  severity: EsatAuditSeverity;
  message: string;
}

export interface EsatModuleAuditSummary {
  paperId: string;
  moduleId: string;
  subject: EsatSubject;
  questions: number;
  difficulty: Record<1 | 2 | 3, number>;
  answerCounts: Record<string, number>;
  dominantAnswerShare: number;
  longestAnswerRun: number;
  topicCounts: Record<string, number>;
}

export interface EsatMockAuditReport {
  paperCount: number;
  completePaperCount: number;
  gapPaperCount: number;
  moduleCount: number;
  questionCount: number;
  subjectModules: Record<EsatSubject, number>;
  critical: number;
  warnings: number;
  modules: EsatModuleAuditSummary[];
  issues: EsatAuditIssue[];
}

type EsatSubject = "math" | "physics" | "chemistry" | "biology";

const ANSWER_KEYS = ["A", "B", "C", "D", "E"];
const EXPECTED_SUBJECT_MODULES: Record<EsatSubject, number> = {
  math: 9,
  physics: 8,
  chemistry: 3,
  biology: 3,
};

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function structuralSignature(question: MCQQuestion): string {
  return `${question.topicId}|${normalizeText(question.question).replace(/\d+(?:\.\d+)?/g, "#")}`;
}

function subjectFor(moduleId: string): EsatSubject {
  if (moduleId.includes("math")) return "math";
  if (moduleId.includes("chem")) return "chemistry";
  if (moduleId.includes("bio")) return "biology";
  return "physics";
}

function difficultyCounts(questions: MCQQuestion[]): Record<1 | 2 | 3, number> {
  return {
    1: questions.filter((question) => question.difficulty === 1).length,
    2: questions.filter((question) => question.difficulty === 2).length,
    3: questions.filter((question) => question.difficulty === 3).length,
  };
}

function countBy(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function longestRun(values: string[]): number {
  let longest = 0;
  let current = 0;
  let previous = "";
  for (const value of values) {
    current = value === previous ? current + 1 : 1;
    previous = value;
    longest = Math.max(longest, current);
  }
  return longest;
}

export function buildEsatMockAudit(): EsatMockAuditReport {
  const papers = getMockPapersForTest("esat");
  const completePapers = papers.filter((paper) => /^esat-mock-\d+$/.test(paper.id));
  const gapPapers = papers.filter((paper) => paper.id.startsWith("esat-gap-"));
  const issues: EsatAuditIssue[] = [];
  const seenIds = new Map<string, string>();
  const seenPrompts = new Map<string, string>();
  const seenStructures = new Map<string, string>();

  if (papers.length !== 13 || completePapers.length !== 10 || gapPapers.length !== 3) {
    issues.push({ paperId: "suite", code: "PAPER_INVENTORY", severity: "critical", message: "ESAT must contain ten complete papers and three gap-module papers." });
  }

  const modules = papers.flatMap((paper): EsatModuleAuditSummary[] => {
    const expectedModules = paper.id.startsWith("esat-gap-") ? 1 : 2;
    if (paper.modules.length !== expectedModules) {
      issues.push({ paperId: paper.id, code: "MODULE_COUNT", severity: "critical", message: `Paper must contain ${expectedModules} module(s).` });
    }

    return paper.modules.map((module) => {
      const questions = module.questions.filter((question): question is MCQQuestion => question.type === "mcq");
      if (questions.length !== 27 || questions.length !== module.questions.length) {
        issues.push({ paperId: paper.id, moduleId: module.id, code: "QUESTION_COUNT", severity: "critical", message: "Each ESAT module must contain 27 MCQs." });
      }
      if (module.durationSec !== 40 * 60) {
        issues.push({ paperId: paper.id, moduleId: module.id, code: "DURATION", severity: "critical", message: "Each ESAT module must last 40 minutes." });
      }

      for (const question of questions) {
        if (question.testId !== "esat") {
          issues.push({ paperId: paper.id, moduleId: module.id, questionId: question.id, code: "TEST_ID", severity: "critical", message: "Question testId must be esat." });
        }
        const keys = question.options.map((option) => option.key).join("");
        if (keys !== "ABCDE" || !keys.includes(question.answer)) {
          issues.push({ paperId: paper.id, moduleId: module.id, questionId: question.id, code: "OPTION_KEYS", severity: "critical", message: "Every ESAT question must have continuous A-E options containing the answer." });
        }
        const optionTexts = question.options.map((option) => normalizeText(option.text));
        if (new Set(optionTexts).size !== optionTexts.length) {
          issues.push({ paperId: paper.id, moduleId: module.id, questionId: question.id, code: "DUPLICATE_DISTRACTOR", severity: "critical", message: "Question contains duplicate option text." });
        }

        const existingId = seenIds.get(question.id);
        if (existingId) {
          issues.push({ paperId: paper.id, moduleId: module.id, questionId: question.id, code: "DUPLICATE_ID", severity: "critical", message: `Question ID duplicates ${existingId}.` });
        } else {
          seenIds.set(question.id, `${paper.id}/${module.id}`);
        }
        const prompt = normalizeText(question.question);
        const existingPrompt = seenPrompts.get(prompt);
        if (existingPrompt) {
          issues.push({ paperId: paper.id, moduleId: module.id, questionId: question.id, code: "DUPLICATE_PROMPT", severity: "critical", message: `Prompt duplicates ${existingPrompt}.` });
        } else {
          seenPrompts.set(prompt, `${paper.id}/${module.id}/${question.id}`);
        }
        const signature = structuralSignature(question);
        const existingStructure = seenStructures.get(signature);
        if (existingStructure && !existingPrompt) {
          issues.push({ paperId: paper.id, moduleId: module.id, questionId: question.id, code: "DUPLICATE_STRUCTURE", severity: "warning", message: `Question repeats the numeric template of ${existingStructure}.` });
        } else if (!existingStructure) {
          seenStructures.set(signature, `${paper.id}/${module.id}/${question.id}`);
        }
      }

      const difficulty = difficultyCounts(questions);
      const answerCounts = countBy(questions.map((question) => question.answer));
      const dominantAnswerShare = questions.length ? Math.max(0, ...Object.values(answerCounts)) / questions.length : 0;
      const longestAnswerRun = longestRun(questions.map((question) => question.answer));
      const topicCounts = countBy(questions.map((question) => question.topicId));

      if (difficulty[3] < 4) {
        issues.push({ paperId: paper.id, moduleId: module.id, code: "TOO_FEW_HARD", severity: "warning", message: `Module has only ${difficulty[3]} difficulty-3 questions; target is at least 4.` });
      }
      if (dominantAnswerShare > 0.25 || ANSWER_KEYS.some((key) => !answerCounts[key])) {
        issues.push({ paperId: paper.id, moduleId: module.id, code: "ANSWER_POSITION_BIAS", severity: "warning", message: "Correct-answer positions must cover A-E with no position above 25%." });
      }
      if (longestAnswerRun > 2) {
        issues.push({ paperId: paper.id, moduleId: module.id, code: "ANSWER_RUN", severity: "warning", message: `Module has a run of ${longestAnswerRun} identical answer positions.` });
      }

      return {
        paperId: paper.id,
        moduleId: module.id,
        subject: subjectFor(module.id),
        questions: questions.length,
        difficulty,
        answerCounts,
        dominantAnswerShare,
        longestAnswerRun,
        topicCounts,
      };
    });
  });

  const subjectModules = modules.reduce<Record<EsatSubject, number>>(
    (counts, module) => ({ ...counts, [module.subject]: counts[module.subject] + 1 }),
    { math: 0, physics: 0, chemistry: 0, biology: 0 },
  );
  for (const subject of Object.keys(EXPECTED_SUBJECT_MODULES) as EsatSubject[]) {
    if (subjectModules[subject] !== EXPECTED_SUBJECT_MODULES[subject]) {
      issues.push({ paperId: "suite", code: "SUBJECT_BALANCE", severity: "warning", message: `${subject} must have ${EXPECTED_SUBJECT_MODULES[subject]} modules; found ${subjectModules[subject]}.` });
    }
  }

  const physicsGap = modules.find((module) => module.paperId === "esat-gap-physics-module");
  const chemistryGap = modules.find((module) => module.paperId === "esat-gap-chemistry-module");
  const biologyGap = modules.find((module) => module.paperId === "esat-gap-biology-module");
  const expectedPhysicsTopics = { "esat-phys4": 7, "esat-phys5": 7, "esat-phys6": 7, "esat-phys7": 6 };
  const expectedChemistryTopics = { "esat-chem4": 14, "esat-chem5": 13 };
  if (!physicsGap || JSON.stringify(physicsGap.topicCounts) !== JSON.stringify(expectedPhysicsTopics)) {
    issues.push({ paperId: "esat-gap-physics-module", code: "GAP_TOPIC_BALANCE", severity: "warning", message: "Physics gap module must use the calibrated 7/7/7/6 topic split." });
  }
  if (!chemistryGap || JSON.stringify(chemistryGap.topicCounts) !== JSON.stringify(expectedChemistryTopics)) {
    issues.push({ paperId: "esat-gap-chemistry-module", code: "GAP_TOPIC_BALANCE", severity: "warning", message: "Chemistry gap module must use the calibrated 14/13 topic split." });
  }
  if (!biologyGap || biologyGap.topicCounts["esat-bio4"] !== 27 || Object.keys(biologyGap.topicCounts).length !== 1) {
    issues.push({ paperId: "esat-gap-biology-module", code: "GAP_TOPIC_BALANCE", severity: "warning", message: "Biology gap module must contain 27 independent Biology 4 questions." });
  }

  return {
    paperCount: papers.length,
    completePaperCount: completePapers.length,
    gapPaperCount: gapPapers.length,
    moduleCount: modules.length,
    questionCount: modules.reduce((total, module) => total + module.questions, 0),
    subjectModules,
    critical: issues.filter((issue) => issue.severity === "critical").length,
    warnings: issues.filter((issue) => issue.severity === "warning").length,
    modules,
    issues,
  };
}
