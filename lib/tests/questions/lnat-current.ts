import type { MCQQuestion } from "./types";

const CURRENT_KEYS = ["A", "B", "C", "D"] as const;
const DEFAULT_PATTERN = "BDACCADB";

export function toCurrentLnatMcqs(
  questions: MCQQuestion[],
  answerPattern = DEFAULT_PATTERN,
  seed = 0
): MCQQuestion[] {
  if (!answerPattern || [...answerPattern].some((key) => !CURRENT_KEYS.includes(key as (typeof CURRENT_KEYS)[number]))) {
    throw new Error("LNAT answer pattern must contain only A-D.");
  }

  return questions.map((question, index) => {
    const correct = question.options.find((option) => option.key === question.answer);
    if (!correct) throw new Error(`${question.id}: correct option is missing.`);
    const distractors = question.options.filter((option) => option.key !== question.answer);
    if (distractors.length < 3) throw new Error(`${question.id}: LNAT requires at least three distractors.`);

    const rotated = distractors.map((_, distractorIndex) => distractors[(distractorIndex + index + seed) % distractors.length]);
    const selected = rotated.slice(0, 3);
    const targetKey = answerPattern[(index + seed) % answerPattern.length] as (typeof CURRENT_KEYS)[number];
    const targetIndex = CURRENT_KEYS.indexOf(targetKey);
    selected.splice(targetIndex, 0, correct);

    return {
      ...question,
      options: selected.map((option, optionIndex) => ({ ...option, key: CURRENT_KEYS[optionIndex] })),
      answer: targetKey,
    };
  });
}
