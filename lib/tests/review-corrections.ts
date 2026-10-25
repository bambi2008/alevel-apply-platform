import corrections from "./questions/review-corrections-20261025.json";
import { MAT_QUESTIONS } from "./questions/mat";
import { STEP_QUESTIONS } from "./questions/step";
import { TMUA_QUESTIONS } from "./questions/tmua";
import { BMO_QUESTIONS } from "./questions/bmo";
import { MAT_MK1_MCQ } from "./mock-papers/mat-mock-1";
import type { Question } from "./questions/types";
import type { MockPaper } from "./mock-papers";
import { syllabusFingerprint } from "./syllabus-policy";

export const REVIEW_SUFFIX = "-rev20261025";
export const REVIEW_CORRECTIONS = corrections as unknown as Record<string, Question>;
// Filled only after independent content/rendering tests, never auto-generated at runtime.
export const REVIEW_CORRECTIONS_HASH = "8dda9adc:6c7bfe82:39020";

const originals = [...MAT_QUESTIONS, ...STEP_QUESTIONS, ...TMUA_QUESTIONS, ...BMO_QUESTIONS, ...MAT_MK1_MCQ];
const stem = (q: Question) => q.type === "mcq" ? q.question : q.context;
const aliases = new Map<string, Question>();
for (const [id, corrected] of Object.entries(REVIEW_CORRECTIONS)) {
  const source = originals.find((q) => q.id === id);
  const sourceStem = source ? stem(source) : stem(corrected);
  if (sourceStem) aliases.set(sourceStem, corrected);
}

/** Fresh IDs only: historical stems, keys, attempts and paper versions stay intact. */
export function reviewedQuestion(original: Question): Question {
  if (original.id.endsWith(REVIEW_SUFFIX)) return original;
  const corrected = REVIEW_CORRECTIONS[original.id] ?? aliases.get(stem(original) ?? "");
  if (!corrected || corrected.testId !== original.testId || corrected.type !== original.type) return original;
  const id = original.id + REVIEW_SUFFIX;
  // LNAT's current four choices are shuffled. Fix its explanation without
  // restoring the submitted JSON's obsolete five choices or answer letters.
  if (original.testId === "lnat" && original.type === "mcq" && corrected.type === "mcq") {
    return { ...original, id, solution: corrected.solution };
  }
  return { ...original, ...corrected, id };
}

export function reviewedPaper(original: MockPaper): MockPaper {
  let changed = false;
  const modules = original.modules.map((module) => ({ ...module, questions: module.questions.map((q) => {
    const next = reviewedQuestion(q);
    changed ||= next !== q;
    return next;
  }) }));
  if (!changed) return original;
  return { ...original, id: original.id + REVIEW_SUFFIX, modules: modules.map((module) => ({
    ...module, questions: module.questions.map((q) => q.id.endsWith(REVIEW_SUFFIX) ? q : { ...q, id: q.id + REVIEW_SUFFIX }),
  })) };
}

export function verifyReviewCorrections(): void {
  const actual = syllabusFingerprint(REVIEW_CORRECTIONS as unknown as Question);
  if (actual !== REVIEW_CORRECTIONS_HASH) throw new Error("Question corrections require a new content review");
}
