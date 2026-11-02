import type { MockPaper } from "./mock-papers";
import { isLimitedTrainingTest, paperPresentation } from "./syllabus-release";
import { localizeStaticContent } from "../content-language";

export const EXAM_SCOPE_NOTES_EN: Record<string, string> = {
  esat: "The five modules are reviewed separately. Math 1 excludes calculus; Math 2 does not require complex numbers, matrices or general differential equations. Combinations reuse module questions and may overlap with topic practice. This is limited preparation, not unseen papers, complete coverage or official difficulty. Choose modules for your intended course.",
  tmua: "Calculus is limited to rational powers and simplified sums or differences. Exponential/trigonometric differentiation, variance, distributions of random variables and induction are not prerequisites. Basic expected frequencies remain in scope.",
  caie9709: "9709 Pure 3 only: no Paper 1, Mechanics or Statistics. Current vectors cover points, lines and the scalar product.",
  step: "STEP 2 and STEP 3 are reviewed separately. Complex numbers and 2×2 matrices may belong to STEP 2; De Moivre's theorem, general complex roots, planes and vector products belong to STEP 3.",
  mat: "Discontinued. Practice is bounded by the final historical syllabus; this is not a current admissions test.",
  pat: "Discontinued. Historical foundation practice only, not a current ESAT bank or a full mock examination.",
  csat: "An additional assessment used by some colleges. Current public sources do not establish this site's paper structure. Preparation only, not a verified current full examination.",
  bpho: "Round 1 and Round 2 must not be mixed. This site provides limited preparation, excludes unverified university-level prerequisites and does not claim official full papers.",
  bmo: "BMO1 requires complete written proofs. Short multiple-choice items are foundation practice, not full BMO1/BMO2 mocks.",
  tara: "Everyday reasoning, basic arithmetic, problem solving and writing; no prior specialist subject knowledge is required.",
  ucat: "Four-module skills practice, without Abstract Reasoning, medical knowledge or advanced mathematics. Original, limited timed practice, not official questions or a complete examination. Platform scores are not official results.",
  lnat: "Reading given passages and writing arguments; no prior legal knowledge is required.",
  ielts: "Language-skills practice, without prior specialist subject knowledge. Synthetic listening audio and platform scores are not official recordings or band scores.",
};

/** Presentation after canonical release checks; never replaces the grading source. */
export function englishPaperPresentation(paper: MockPaper, locale: string): MockPaper {
  const shown = paperPresentation(paper);
  if (locale !== "en") return shown;
  const translated = localizeStaticContent(shown, locale);
  if (isLimitedTrainingTest(paper.testId)) return {
    ...translated, title: shown.titleEn, description: EXAM_SCOPE_NOTES_EN[paper.testId],
    instructions: [
      "Original, limited timed practice: not official questions, a verified full examination or complete syllabus coverage.",
      "Questions may recur across combinations and topic practice. Scores are not official results and difficulty equivalence is not guaranteed.",
      ...(paper.testId === "esat" ? ["No calculator. Each module has its own time limit; time cannot be transferred between modules."] : []),
    ],
  };
  if (["mat", "pat"].includes(paper.testId)) return { ...translated, title: `${paper.testId.toUpperCase()} · Historical practice · ${paper.id}`, description: EXAM_SCOPE_NOTES_EN[paper.testId] };
  if (paper.testId === "tmua") return { ...translated, title: shown.titleEn, description: "Original timed practice based on the published examination structure. Scores are not official results; difficulty equivalence is not guaranteed." };
  return { ...translated, title: shown.titleEn };
}
