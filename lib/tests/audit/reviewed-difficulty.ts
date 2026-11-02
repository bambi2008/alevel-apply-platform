import manifest from "@/data/question-bank/calibration-manifest-20261026.json";
import { CALIBRATION_SUFFIX } from "../difficulty-calibration";
import { syllabusFingerprint } from "../syllabus-policy";
import type { MockPaper } from "../mock-papers";

/** Owner-approved calibration supersedes former author-assigned quotas, but
 * only for the exact frozen paper. Changes still require a separate review. */
export function reviewedDifficultyContract(paper: MockPaper): "reviewed" | "drift" | "legacy" {
  const exams = manifest.exams as Record<string, { papers: Record<string, string> }>;
  const expected = exams[paper.testId]?.papers[paper.id];
  if (expected) return syllabusFingerprint(paper as never) === expected ? "reviewed" : "drift";
  return paper.id.endsWith(CALIBRATION_SUFFIX) ? "drift" : "legacy";
}
