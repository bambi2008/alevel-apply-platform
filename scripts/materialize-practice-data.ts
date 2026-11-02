/** One-time, lossless mechanical extraction; never alters the mock registry.
 * Exclusive writes refuse to overwrite an edited data release. */
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { REVIEWED_PRACTICE_SOURCES, getReleasedPracticeQuestions } from "../lib/tests/practice-banks";
import { getMockPapersForTest } from "../lib/tests/mock-papers";
import { syllabusFingerprint } from "../lib/tests/syllabus-policy";

async function main() {
  const base = REVIEWED_PRACTICE_SOURCES;
  const manifest = { schemaVersion: 1, capturedAt: "2026-10-26", exams: Object.fromEntries(Object.entries(base).map(([id, questions]) => [id, {
    rawCount: questions.length, rawFingerprint: syllabusFingerprint({ questions } as never),
    releasedCount: getReleasedPracticeQuestions(id).length, releasedFingerprint: syllabusFingerprint({ questions: getReleasedPracticeQuestions(id) } as never),
    papers: Object.fromEntries(getMockPapersForTest(id).map(paper => [paper.id, syllabusFingerprint(paper as never)])),
  }])) };
  const updates = { schemaVersion: 1, releases: Object.keys(base).map(testId => ({
    id: `${testId}-practice-baseline-20261026`, testId, publishedAt: "2026-10-25T16:00:00Z", kind: "baseline", status: "published",
    title: "专项练习题库数据化", titleEn: "Practice-bank data baseline",
    summary: "现有已审核专项练习建立数据文件基线，未新增题目，未改动模考。",
    summaryEn: "Existing reviewed practice content moved to data files. No questions added and no mocks changed.",
    subjectReview: "existing-reviewed-release", teachingReview: "existing-reviewed-release", questions: [],
  })) };
  for (const [file, data] of [["practice-base.json", base], ["practice-baseline.json", manifest], ["practice-updates.json", updates]] as const) {
    await writeFile(resolve("data/question-bank", file), JSON.stringify(data, null, 2) + "\n", { flag: "wx" });
  }
  console.log(JSON.stringify({ exams: Object.keys(base).length, rawQuestions: Object.values(base).reduce((n, bank) => n + bank.length, 0), releasedQuestions: Object.values(manifest.exams).reduce((n, exam) => n + exam.releasedCount, 0), papers: Object.values(manifest.exams).reduce((n, exam) => n + Object.keys(exam.papers).length, 0) }));
}
void main();
