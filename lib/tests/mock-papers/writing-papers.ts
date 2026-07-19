import { LNAT_ESSAY_QUESTIONS } from "@/lib/tests/questions/lnat-writing";
import { TARA_WRITING_QUESTIONS } from "@/lib/tests/questions/tara-writing";
import type { LongQuestion } from "@/lib/tests/questions/types";

function clone(question: LongQuestion, paperId: string): LongQuestion {
  return { ...question, id: `${paperId}-01` };
}

export const LNAT_WRITTEN_QUESTIONS = LNAT_ESSAY_QUESTIONS.map((question, index) => clone(question, `lnat-written-${index + 1}`));
export const TARA_WRITTEN_QUESTIONS = TARA_WRITING_QUESTIONS.map((question, index) => clone(question, `tara-written-${index + 1}`));
