import { BMO_LONG_SAMPLE } from "@/lib/tests/questions/bmo-long";
import { BMO2_LONG_SAMPLE } from "@/lib/tests/questions/bmo2-long";
import type { LongQuestion } from "@/lib/tests/questions/types";

const BMO1_LONG_QUESTIONS = [...BMO_LONG_SAMPLE, ...BMO2_LONG_SAMPLE].filter(
  (question) => question.id.startsWith("bmo1-")
);

function select(ids: string[]): LongQuestion[] {
  return ids.map((id) => {
    const question = BMO1_LONG_QUESTIONS.find((item) => item.id === id);
    if (!question) throw new Error(`Missing BMO1 written-paper question: ${id}`);
    return question;
  });
}

export const BMO1_WRITTEN_1 = select([
  "bmo1-nt-002", "bmo1-in-001", "bmo1-ge-001",
  "bmo1-co-003", "bmo1-nt-004", "bmo1-ge-002",
]);

export const BMO1_WRITTEN_2 = select([
  "bmo1-nt-003", "bmo1-in-002", "bmo1-ge-003",
  "bmo1-co-004", "bmo1-al-003", "bmo1-co-006",
]);

export const BMO1_WRITTEN_3 = select([
  "bmo1-nt-005", "bmo1-al-004", "bmo1-ge-005",
  "bmo1-co-005", "bmo1-nt-009", "bmo1-ge-009",
]);
