import type { MCQOptionKey, MCQQuestion } from "@/lib/tests/questions/types";

const KEYS = ["A", "B", "C", "D", "E"] as const;

export function balanceEsatAnswers(questions: MCQQuestion[]): MCQQuestion[] {
  return questions.map((question, questionIndex) => {
    const correct = question.options.find((option) => option.key === question.answer);
    if (!correct || question.options.length !== KEYS.length) return question;

    const reordered = question.options.filter((option) => option.key !== question.answer);
    const targetIndex = questionIndex % KEYS.length;
    reordered.splice(targetIndex, 0, correct);

    return {
      ...question,
      options: reordered.map((option, optionIndex) => ({ ...option, key: KEYS[optionIndex] })),
      answer: KEYS[targetIndex] as MCQOptionKey,
    };
  });
}
