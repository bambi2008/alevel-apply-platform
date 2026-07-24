import type { Question } from "@/lib/tests/questions/types";

export interface SemanticRisk {
  code: "AMBIGUOUS_CORRECT_OPTION" | "ANSWER_SOLUTION_CONFLICT" | "DRAFT_REASONING";
  severity: "critical" | "warning";
  message: string;
}

function solutionText(question: Question): string {
  if (question.type === "mcq") return question.solution;
  return [
    question.fullSolution,
    ...question.parts.map((part) => part.solutionOutline),
  ].join("\n");
}

const ambiguousAnswerPatterns = [
  /\bboth\s+(?:options?\s+)?[A-H]\s+and\s+[A-H]\s+(?:are|is)\s+(?:correct|equivalent|identical)/i,
  /\baccept either\b/i,
  /\bnone of (?:the )?(?:listed )?(?:options|[A-H](?:\s*[–-]\s*[A-H])?)\s+(?:matches|is correct)/i,
];

const answerConflictPatterns = [
  /\bclosest answer\b/i,
  /\banswer key shows\b/i,
  /\bcorrect answer is\b.{0,80}\b(?:but|however)\b/i,
  /\bpoorly set question\b/i,
  /\bre-?stated with corrected conditions\b/i,
  /\buse that definition\b/i,
  /\bquestion may intend\b/i,
  /\bi(?:'|’)ll correct the question\b/i,
  /\bthe bound should be\b/i,
  /\bthese are not generally equal\b/i,
];

const draftReasoningPatterns = [
  /\b(?:hmm|recompute|re-?examining|reconsider|recheck)\b/i,
  /\bwait(?:\s*[:—-]|\s+the|\s+let|\s+i|\s+this|\s+re)/i,
  /\blet me (?:redo|recheck|reconsider|compute|think|state|use)\b/i,
  /\bthis approach is wrong\b/i,
];

export function findSemanticRisks(question: Question): SemanticRisk[] {
  const text = solutionText(question);
  const risks: SemanticRisk[] = [];
  if (ambiguousAnswerPatterns.some((pattern) => pattern.test(text))) {
    risks.push({
      code: "AMBIGUOUS_CORRECT_OPTION",
      severity: "critical",
      message: "解析表明存在多个正确选项或没有可选正确答案。",
    });
  }
  if (answerConflictPatterns.some((pattern) => pattern.test(text))) {
    risks.push({
      code: "ANSWER_SOLUTION_CONFLICT",
      severity: "critical",
      message: "解析表明题干、答案键或计算结果彼此冲突。",
    });
  }
  if (draftReasoningPatterns.some((pattern) => pattern.test(text))) {
    risks.push({
      code: "DRAFT_REASONING",
      severity: "warning",
      message: "解析仍含自我纠错或未整理的推理草稿。",
    });
  }
  return risks;
}
