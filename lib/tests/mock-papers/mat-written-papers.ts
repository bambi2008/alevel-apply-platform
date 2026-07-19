import { MAT_QUESTIONS } from "@/lib/tests/questions/mat";
import type { LongQuestion } from "@/lib/tests/questions/types";

function select(paper: number, ids: string[]): LongQuestion[] {
  return ids.map((id, index) => {
    const question = MAT_QUESTIONS.find(
      (item): item is LongQuestion => item.id === id && item.type === "long"
    );
    if (!question) throw new Error(`Missing MAT typed-response question: ${id}`);
    return { ...question, id: `mat-written-${paper}-${String(index + 1).padStart(2, "0")}` };
  });
}

export const MAT_WRITTEN_1 = select(1, ["mat-b-001", "mat-b-004"]);
export const MAT_WRITTEN_2 = select(2, ["mat-b-002", "mat-b-005"]);
export const MAT_WRITTEN_3 = select(3, ["mat-b-003", "mat-b-006"]);
