import type { MockPaper } from "./mock-papers";
import { isLimitedTrainingTest, paperPresentation } from "./syllabus-release";
import { localizeStaticContent } from "../content-language";

import { EXAM_SCOPE_NOTES_EN } from './scope-notes-en';
export { EXAM_SCOPE_NOTES_EN } from './scope-notes-en';

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
