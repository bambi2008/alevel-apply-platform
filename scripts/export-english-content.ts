import { createHash } from "node:crypto";
import { ADMISSIONS_TESTS } from "../lib/tests";
import { getReleasedPracticeQuestions } from "../lib/tests/practice-banks";
import { getMockPapersForTest } from "../lib/tests/mock-papers";
import { INTERVIEW_QUESTIONS, INTERVIEW_GUIDE, INTERVIEW_SUBJECTS } from "../lib/interview";
import { QUANTITATIVE_INTERVIEW_DRILLS } from "../lib/interview/quantitative-interview";
import { getQuantitativeInterviewPapers } from "../lib/interview/quantitative-interview-papers";
import { CAMBRIDGE_ASSESSMENT_FLOWS } from "../lib/interview/cambridge-assessment-flows";
import { HK_INTERVIEW_FLOWS } from "../lib/interview/hk-interview-flows";
import { BACKGROUND_CATALOG, BG_FIELDS, BG_CATEGORIES, BG_GROUPS } from "../lib/background/catalog";
import { CONTENT_STRUCTURAL_FIELDS, HAS_HAN, contentLanguageKey } from "../lib/content-language-key";
import uiEnglish from "../data/ui-copy-en.json";
import previousSources from "../data/content-language/source-manifest-20261026.json";

const entries = new Map<string, { key: string; source: string; sha256: string; origins: string[] }>();
function collect(value: unknown, origin: string, field = "") {
  if (CONTENT_STRUCTURAL_FIELDS.has(field)) return;
  if (typeof value === "string" && HAS_HAN.test(value)) {
    const key = contentLanguageKey(value), old = entries.get(key);
    if (old && old.source !== value) throw new Error(`Content-key collision at ${origin}`);
    if (old) { if (old.origins.length < 4) old.origins.push(origin); }
    else entries.set(key, { key, source: value, sha256: createHash("sha256").update(value).digest("hex"), origins: [origin] });
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, `${origin}.${index}`, field));
  else if (value && typeof value === "object") Object.entries(value).forEach(([key, item]) => collect(item, `${origin}.${key}`, key));
}
for (const test of ADMISSIONS_TESTS) {
  collect(test, `exam.${test.id}`);
  collect(getReleasedPracticeQuestions(test.id), `practice.${test.id}`);
  collect(getMockPapersForTest(test.id), `papers.${test.id}`);
}
collect(INTERVIEW_QUESTIONS, "interview.questions");
collect(INTERVIEW_GUIDE, "interview.guide");
collect(INTERVIEW_SUBJECTS, "interview.subjects");
collect(QUANTITATIVE_INTERVIEW_DRILLS, "interview.quantitative");
collect(INTERVIEW_SUBJECTS.flatMap(s => getQuantitativeInterviewPapers(s.id)), "interview.papers");
collect(CAMBRIDGE_ASSESSMENT_FLOWS, "interview.cambridge");
collect(HK_INTERVIEW_FLOWS, "interview.hk");
collect([BACKGROUND_CATALOG, BG_FIELDS, BG_CATEGORIES, BG_GROUPS], "background");
const reviewed = uiEnglish as Record<string, string>;
const all = [...entries.values()].sort((a, b) => a.key.localeCompare(b.key));
const output = {
  version: "2026-10-26", scope: "Current released static learning content only; no accounts, work, uploads, logs, credentials or history records",
  entries: all.map(e => ({ ...e, ...(Object.hasOwn(reviewed, e.source) ? { english: reviewed[e.source] } : {}) })),
};
export const ENGLISH_CONTENT_SOURCES = output;
if (process.argv[1]?.endsWith("export-english-content.ts")) {
const start = Number(process.argv.find(a => a.startsWith("--start="))?.split("=")[1] ?? 0);
const count = Number(process.argv.find(a => a.startsWith("--count="))?.split("=")[1] ?? 0);
console.log(JSON.stringify(process.argv.includes("--delta") ? {
  entries: output.entries.filter(e => !Object.hasOwn(previousSources.sourceHashes, e.key)),
  removed: Object.keys(previousSources.sourceHashes).filter(key => !entries.has(key)),
} : count ? { ...output, total: all.length, entries: output.entries.slice(start, start + count) } : {
  version: output.version, total: all.length, chars: all.reduce((n, e) => n + e.source.length, 0),
  reviewed: output.entries.filter(e => "english" in e).length,
}));
}
