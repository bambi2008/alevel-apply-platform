import type { MCQQuestion } from "./questions/types";

export function encodeMatrixAnswer(values: Array<"yes" | "no" | undefined>) {
  return values.map((value) => value === "yes" ? "Y" : value === "no" ? "N" : "-").join("");
}

export function decodeMatrixAnswer(value: string | undefined, length: number): Array<"yes" | "no" | undefined> {
  return Array.from({ length }, (_, index) => value?.[index] === "Y" ? "yes" : value?.[index] === "N" ? "no" : undefined);
}

export function isObjectiveAnswerComplete(question: MCQQuestion, selected: string | undefined) {
  if (question.responseMode !== "matrix") return Boolean(selected);
  return Boolean(selected && selected.length === question.statements?.length && !selected.includes("-"));
}

export function scoreObjectiveAnswer(question: MCQQuestion, selected: string | undefined) {
  if (question.responseMode === "matrix") {
    const expected = encodeMatrixAnswer(question.matrixAnswer ?? []);
    if (!isObjectiveAnswerComplete(question, selected)) return { earned: 0, max: 2, correct: false };
    const matches = [...expected].filter((value, index) => value === selected?.[index]).length;
    return { earned: matches === expected.length ? 2 : matches === expected.length - 1 ? 1 : 0, max: 2, correct: matches === expected.length };
  }

  if (selected === question.answer) return { earned: 1, max: 1, correct: true };
  if (question.scoringMode === "adjacent" && selected) {
    const selectedIndex = question.options.findIndex((option) => option.key === selected);
    const answerIndex = question.options.findIndex((option) => option.key === question.answer);
    if (Math.abs(selectedIndex - answerIndex) === 1) return { earned: 0.5, max: 1, correct: false };
  }
  return { earned: 0, max: 1, correct: false };
}

export function estimateUcatScaledScore(earned: number, max: number) {
  if (max <= 0) return 300;
  return Math.round((300 + 600 * Math.max(0, Math.min(1, earned / max))) / 10) * 10;
}

export function estimateSjtBand(earned: number, max: number): 1 | 2 | 3 | 4 {
  const ratio = max > 0 ? earned / max : 0;
  if (ratio >= 0.8) return 1;
  if (ratio >= 0.65) return 2;
  if (ratio >= 0.5) return 3;
  return 4;
}
