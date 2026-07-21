import type { MCQOptionKey, MCQQuestion } from "@/lib/tests/questions/types";

const KEYS = ["A", "B", "C", "D", "E"] as const;

export function calibrateTaraModule(questions: MCQQuestion[], paperId: string): MCQQuestion[] {
  return questions.map((question, index) => {
    const correct = question.options.find((option) => option.key === question.answer);
    const others = question.options.filter((option) => option.key !== question.answer);
    if (!correct || question.options.length !== 5) return question;
    const targetIndex = index % 5;
    others.splice(targetIndex, 0, correct);
    return {
      ...question,
      id: `${paperId}-${String(index + 1).padStart(2, "0")}`,
      difficulty: index < 4 ? 1 : index < 16 ? 2 : 3,
      options: others.map((option, optionIndex) => ({ ...option, key: KEYS[optionIndex] })),
      answer: KEYS[targetIndex] as MCQOptionKey,
    };
  });
}
