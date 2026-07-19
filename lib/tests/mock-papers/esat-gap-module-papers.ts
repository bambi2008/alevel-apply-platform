import { ESAT_BIO_QUESTIONS } from "@/lib/tests/questions/esat-bio";
import { ESAT_GAP_FILL_QUESTIONS } from "@/lib/tests/questions/esat-gap-fill";
import type { MCQQuestion } from "@/lib/tests/questions/types";

function topic(topicId: string): MCQQuestion[] {
  return ESAT_GAP_FILL_QUESTIONS.filter((question) => question.topicId === topicId);
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
  ...topic("esat-chem4").slice(0, 14),
  ...topic("esat-chem5").slice(0, 13),
], "esat-gap-chemistry");

export const ESAT_GAP_BIOLOGY_MODULE = clone([
  ...topic("esat-bio4"),
  ...ESAT_BIO_QUESTIONS.slice(0, 7),
], "esat-gap-biology");
