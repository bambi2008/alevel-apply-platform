import { STEP_QUESTIONS } from "@/lib/tests/questions/step";
import type { LongQuestion } from "@/lib/tests/questions/types";

function select(paper: number, ids: string[]): LongQuestion[] {
  return ids.map((id, index) => {
    const question = STEP_QUESTIONS.find(
      (item): item is LongQuestion => item.id === id && item.type === "long"
    );
    if (!question) throw new Error(`Missing STEP written-paper question: ${id}`);
    return { ...question, id: `step-written-${paper}-${String(index + 1).padStart(2, "0")}` };
  });
}

export const STEP_WRITTEN_1 = select(1, [
  "step-001", "step-002", "step-003", "step-004",
  "step-006", "step-008", "step-009", "step-011",
  "step-010", "step-025", "step-007", "step-024",
]);

export const STEP_WRITTEN_2 = select(2, [
  "step-012", "step-013", "step-014", "step-017",
  "step-018", "step-019", "step-020", "step-021",
  "step-031", "step-032", "step-033", "step-034",
]);

export const STEP_WRITTEN_3 = select(3, [
  "step-022", "step-023", "step-026", "step-027",
  "step-028", "step-029", "step-030", "step-038",
  "step-042", "step-043", "step-044", "step-045",
]);

export const STEP_WRITTEN_4 = select(4, [
  "step-005", "step-015", "step-016", "step-035",
  "step-036", "step-039", "step-040", "step-041",
  "step-054", "step-055", "step-057", "step-058",
]);
