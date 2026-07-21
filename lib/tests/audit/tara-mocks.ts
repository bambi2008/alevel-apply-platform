import { getMockPapersForTest } from "@/lib/tests/mock-papers";
import { classifyTaraCritical, TARA_CRITICAL_SKILLS, type TaraCriticalSkill } from "@/lib/tests/mock-papers/tara-fixed-critical-papers";
import { TARA_FIXED_PS_SKILLS, type TaraProblemSkill } from "@/lib/tests/mock-papers/tara-fixed-problem-papers";
import type { MCQQuestion } from "@/lib/tests/questions/types";

export interface TaraAuditIssue {
  paperId: string;
  moduleId?: string;
  questionId?: string;
  code: string;
  severity: "critical" | "warning";
  message: string;
}

export interface TaraModuleSummary {
  paperId: string;
  moduleId: string;
  questions: number;
  difficulty: Record<1 | 2 | 3, number>;
  answerCounts: Record<string, number>;
  criticalSkills?: Record<TaraCriticalSkill, number>;
  problemSkills?: Record<TaraProblemSkill, number>;
}

export interface TaraAuditReport {
  objectivePapers: number;
  writtenPapers: number;
  moduleCount: number;
  questionCount: number;
  critical: number;
  warnings: number;
  modules: TaraModuleSummary[];
  issues: TaraAuditIssue[];
}

const ANSWERS = ["A", "B", "C", "D", "E"];
const OFF_SPEC_DIRECT_MATH = /right-angled triangle|hypotenuse|triangle has base|arithmetic sequence|geometric sequence|committee of|fair dice|coin is tossed|prime factor|solve the equation/i;

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function structure(value: string): string {
  return normalize(value).replace(/\d+(?:\.\d+)?/g, "#");
}

function count(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((result, value) => {
    result[value] = (result[value] ?? 0) + 1;
    return result;
  }, {});
}

export function buildTaraMockAudit(): TaraAuditReport {
  const allPapers = getMockPapersForTest("tara");
  const objective = allPapers.filter((paper) => /^tara-mock-\d+$/.test(paper.id));
  const written = allPapers.filter((paper) => /^tara-written-\d+$/.test(paper.id));
  const issues: TaraAuditIssue[] = [];
  const seenIds = new Map<string, string>();
  const seenPrompts = new Map<string, string>();

  if (objective.length !== 6 || written.length !== 3) {
    issues.push({ paperId: "suite", code: "PAPER_INVENTORY", severity: "critical", message: "TARA must contain six objective papers and three fixed writing papers." });
  }

  const modules = objective.flatMap((paper): TaraModuleSummary[] => {
    if (paper.modules.length !== 2) {
      issues.push({ paperId: paper.id, code: "MODULE_COUNT", severity: "critical", message: "Each objective paper must contain CT and PS modules." });
    }
    return paper.modules.map((module) => {
      const questions = module.questions.filter((question): question is MCQQuestion => question.type === "mcq");
      if (questions.length !== 22 || questions.length !== module.questions.length) {
        issues.push({ paperId: paper.id, moduleId: module.id, code: "QUESTION_COUNT", severity: "critical", message: "Each objective module must contain 22 MCQs." });
      }
      if (module.durationSec !== 40 * 60) {
        issues.push({ paperId: paper.id, moduleId: module.id, code: "DURATION", severity: "critical", message: "Each TARA module must last 40 minutes." });
      }

      const moduleStructures = new Map<string, string>();
      for (const question of questions) {
        const keys = question.options.map((option) => option.key).join("");
        if (question.testId !== "tara" || keys !== "ABCDE" || !keys.includes(question.answer)) {
          issues.push({ paperId: paper.id, moduleId: module.id, questionId: question.id, code: "OPTION_SCHEMA", severity: "critical", message: "Question must be a TARA five-option MCQ with a valid answer." });
        }
        const optionTexts = question.options.map((option) => normalize(option.text));
        if (new Set(optionTexts).size !== optionTexts.length) {
          issues.push({ paperId: paper.id, moduleId: module.id, questionId: question.id, code: "DUPLICATE_DISTRACTOR", severity: "critical", message: "Question contains duplicate option text." });
        }
        const existingId = seenIds.get(question.id);
        if (existingId) {
          issues.push({ paperId: paper.id, moduleId: module.id, questionId: question.id, code: "DUPLICATE_ID", severity: "critical", message: `Question ID duplicates ${existingId}.` });
        } else {
          seenIds.set(question.id, `${paper.id}/${module.id}`);
        }
        const prompt = normalize(question.question);
        const existingPrompt = seenPrompts.get(prompt);
        if (existingPrompt) {
          issues.push({ paperId: paper.id, moduleId: module.id, questionId: question.id, code: "DUPLICATE_PROMPT", severity: "critical", message: `Prompt duplicates ${existingPrompt}.` });
        } else {
          seenPrompts.set(prompt, `${paper.id}/${module.id}/${question.id}`);
        }
        const signature = structure(question.question);
        const existingStructure = moduleStructures.get(signature);
        if (existingStructure) {
          issues.push({ paperId: paper.id, moduleId: module.id, questionId: question.id, code: "DUPLICATE_STRUCTURE", severity: "warning", message: `Question repeats the numeric template of ${existingStructure} in the same module.` });
        } else {
          moduleStructures.set(signature, question.id);
        }
        if (module.id === "ps" && OFF_SPEC_DIRECT_MATH.test(question.question)) {
          issues.push({ paperId: paper.id, moduleId: module.id, questionId: question.id, code: "OFF_SPEC_MATH", severity: "warning", message: "Direct mathematics exceeds the official TARA knowledge list." });
        }
      }

      const difficulty = {
        1: questions.filter((question) => question.difficulty === 1).length,
        2: questions.filter((question) => question.difficulty === 2).length,
        3: questions.filter((question) => question.difficulty === 3).length,
      };
      const answerCounts = count(questions.map((question) => question.answer));
      if (difficulty[1] !== 4 || difficulty[2] !== 12 || difficulty[3] !== 6) {
        issues.push({ paperId: paper.id, moduleId: module.id, code: "DIFFICULTY_BALANCE", severity: "warning", message: `Expected 4/12/6 difficulty split; found ${difficulty[1]}/${difficulty[2]}/${difficulty[3]}.` });
      }
      if (answersMismatch(answerCounts)) {
        issues.push({ paperId: paper.id, moduleId: module.id, code: "ANSWER_BALANCE", severity: "warning", message: "Answer positions must have a 5/5/4/4/4 distribution across A-E." });
      }

      if (module.id === "ct") {
        const criticalSkills = count(questions.map(classifyTaraCritical)) as Record<TaraCriticalSkill, number>;
        for (const skill of TARA_CRITICAL_SKILLS) {
          if (!criticalSkills[skill]) {
            issues.push({ paperId: paper.id, moduleId: module.id, code: "CT_SKILL_GAP", severity: "warning", message: `Critical Thinking module is missing ${skill}.` });
          }
        }
        return { paperId: paper.id, moduleId: module.id, questions: questions.length, difficulty, answerCounts, criticalSkills };
      }

      const problemSkills = count(questions.map((question) => TARA_FIXED_PS_SKILLS.get(question.id) ?? "finding-procedures")) as Record<TaraProblemSkill, number>;
      if (problemSkills["relevant-selection"] !== 5 || problemSkills["finding-procedures"] !== 12 || problemSkills["identifying-similarity"] !== 5) {
        issues.push({ paperId: paper.id, moduleId: module.id, code: "PS_SKILL_BALANCE", severity: "warning", message: "Problem Solving module must use the calibrated 5/12/5 skill split." });
      }
      return { paperId: paper.id, moduleId: module.id, questions: questions.length, difficulty, answerCounts, problemSkills };
    });
  });

  for (const paper of written) {
    if (paper.modules.length !== 1 || paper.modules[0].durationSec !== 40 * 60 || paper.modules[0].questions.length !== 1 || paper.modules[0].questions[0].type !== "long") {
      issues.push({ paperId: paper.id, code: "WRITING_STRUCTURE", severity: "critical", message: "Each fixed writing paper must contain one 40-minute writing task." });
    }
  }

  return {
    objectivePapers: objective.length,
    writtenPapers: written.length,
    moduleCount: modules.length,
    questionCount: modules.reduce((total, module) => total + module.questions, 0),
    critical: issues.filter((issue) => issue.severity === "critical").length,
    warnings: issues.filter((issue) => issue.severity === "warning").length,
    modules,
    issues,
  };
}

function answersMismatch(answerCounts: Record<string, number>): boolean {
  return ANSWERS.map((key) => answerCounts[key] ?? 0).sort((a, b) => a - b).join(",") !== "4,4,4,5,5";
}
