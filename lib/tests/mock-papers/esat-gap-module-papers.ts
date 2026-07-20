import { ESAT_GAP_FILL_QUESTIONS } from "@/lib/tests/questions/esat-gap-fill";
import type { MCQQuestion } from "@/lib/tests/questions/types";

function topic(topicId: string): MCQQuestion[] {
  return ESAT_GAP_FILL_QUESTIONS.filter(
    (question) => question.topicId === topicId && question.id.startsWith("esat-gap-new-")
  );
}

function difficulty(topicId: string, level: 1 | 2 | 3, count: number): MCQQuestion[] {
  return topic(topicId).filter((question) => question.difficulty === level).slice(0, count);
}

function clone(questions: MCQQuestion[], paperId: string): MCQQuestion[] {
  return questions.map((question, index) => ({
    ...question,
    id: `${paperId}-${String(index + 1).padStart(2, "0")}`,
  }));
}

export const ESAT_GAP_PHYSICS_MODULE = clone([
  ...topic("esat-phys4").slice(0, 7),
  ...topic("esat-phys5").slice(0, 7),
  ...topic("esat-phys6").slice(0, 7),
  ...topic("esat-phys7").slice(0, 6),
], "esat-gap-physics");

export const ESAT_GAP_CHEMISTRY_MODULE = clone([
  ...topic("esat-chem4"),
  ...difficulty("esat-chem5", 1, 3),
  ...difficulty("esat-chem5", 2, 5),
  ...difficulty("esat-chem5", 3, 5),
], "esat-gap-chemistry");

export const ESAT_GAP_BIOLOGY_MODULE = clone([
  ...topic("esat-bio4").slice(0, 27),
], "esat-gap-biology");
