import { LNAT_MOCK_EXPANSIONS } from "@/lib/tests/questions/lnat";
import { toCurrentLnatMcqs } from "@/lib/tests/questions/lnat-current";
import type { MCQQuestion } from "@/lib/tests/questions/types";

const BASE_PATTERN = "CADBBDACACBDBCACADBDACACBDBCACADBDACABDBDB";
const KEYS = ["A", "B", "C", "D"];
const EASY = new Set([0, 5, 10, 15, 21, 26, 31, 37]);
const HARD = new Set([3, 8, 13, 18, 23, 28, 33, 36, 39, 41]);

function patternFor(paperNumber: 2 | 3 | 4 | 5): string {
  const shift = paperNumber - 1;
  return [...BASE_PATTERN].map((key) => KEYS[(KEYS.indexOf(key) + shift) % KEYS.length]).join("");
}

export function buildFullLnatPaper(base: MCQQuestion[], paperNumber: 2 | 3 | 4 | 5): MCQQuestion[] {
  const expansion = LNAT_MOCK_EXPANSIONS[paperNumber].map((question, index) => ({
    ...question,
    id: `lnat-mk${paperNumber}-${String(index + 13).padStart(2, "0")}`,
  }));
  const questions = [...base, ...expansion].map((question, index): MCQQuestion => ({
    ...question,
    difficulty: EASY.has(index) ? 1 : HARD.has(index) ? 3 : 2,
  }));
  return toCurrentLnatMcqs(questions, patternFor(paperNumber), paperNumber);
}
