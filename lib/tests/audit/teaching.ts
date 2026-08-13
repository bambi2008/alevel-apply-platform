import type { MCQQuestion } from "@/lib/tests/questions/types";

export interface TeachingRisk {
  code: "EMPTY_OPTION_EXPLANATION" | "INCOMPLETE_OPTION_EXPLANATIONS";
  severity: "critical" | "warning";
  message: string;
}

export function findTeachingRisks(question: MCQQuestion): TeachingRisk[] {
  if (!question.optionExplanations) return [];
  const explanations = question.optionExplanations;
  const risks: TeachingRisk[] = [];
  if (Object.values(explanations).some((value) => !value?.trim())) {
    risks.push({
      code: "EMPTY_OPTION_EXPLANATION",
      severity: "critical",
      message: "逐选项解析包含空内容。",
    });
  }
  const missing = question.options.filter((option) => !explanations[option.key]?.trim());
  if (missing.length > 0) {
    risks.push({
      code: "INCOMPLETE_OPTION_EXPLANATIONS",
      severity: "warning",
      message: `逐选项解析缺少 ${missing.map((option) => option.key).join("、")}。`,
    });
  }
  return risks;
}
