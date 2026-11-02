import { z } from "zod";
import updatesData from "@/data/question-bank/practice-updates.json";
import { getTestById } from "@/lib/tests";
import { assessSyllabusCandidate, syllabusFingerprint } from "./syllabus-policy";
import type { Question } from "./questions/types";

const text = z.string().min(1);
const option = z.object({ key: z.enum(["A", "B", "C", "D", "E", "F", "G", "H"]), text });
const common = { id: z.string().min(3).max(100), testId: text, topicId: text, difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]), context: z.string().optional() };
const questionSchema = z.discriminatedUnion("type", [
  z.object({ ...common, type: z.literal("mcq"), marks: z.number().int().positive(), question: text, options: z.array(option).min(2).max(8), answer: z.enum(["A", "B", "C", "D", "E", "F", "G", "H"]), solution: text,
    hint: z.string().optional(), optionExplanations: z.record(z.string(), z.string()).optional(), responseMode: z.enum(["single", "matrix"]).optional(),
    statements: z.array(z.object({ id: text, text })).optional(), matrixAnswer: z.array(z.enum(["yes", "no"])).optional(), scoringMode: z.enum(["exact", "adjacent"]).optional(),
    audioSectionId: text.optional(), audioTitle: text.optional(), audioScript: text.optional() }).strict(),
  z.object({ ...common, type: z.literal("long"), totalMarks: z.number().int().positive(), parts: z.array(z.object({ label: text, marks: z.number().int().positive(), question: text, solutionOutline: text, hint: z.string().optional() })).min(1), fullSolution: text,
    responseKind: z.enum(["structured", "essay"]).optional(), essayPrompts: z.array(z.object({ id: text, title: text })).optional(), recommendedWords: z.tuple([z.number().int().positive(), z.number().int().positive()]).optional(), maxWords: z.number().int().positive().optional(),
    rubricDimensions: z.array(z.object({ id: text, label: text, maxMarks: z.number().int().positive(), description: text })).optional() }).strict(),
]);
const releaseSchema = z.object({
  id: text, testId: text, publishedAt: z.string().datetime(), kind: z.enum(["baseline", "addition", "correction"]), status: z.enum(["draft", "published"]),
  title: text, titleEn: text, summary: text, summaryEn: text,
  subjectReview: text, teachingReview: text, questions: z.array(questionSchema),
  questionFingerprints: z.record(z.string(), z.string()).optional(),
}).strict();
const dataSchema = z.object({ schemaVersion: z.literal(1), releases: z.array(releaseSchema) }).strict();
export type PracticeRelease = z.infer<typeof releaseSchema>;

/** Key order is irrelevant in editor-maintained JSON; content is not. */
export function practiceContentFingerprint(question: unknown): string {
  const canonical = (value: unknown): unknown => Array.isArray(value) ? value.map(canonical)
    : value && typeof value === "object" ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical((value as Record<string, unknown>)[key])])) : value;
  return syllabusFingerprint(canonical(question) as Question);
}

export function validatePracticeUpdates(input: unknown, baseIds: Set<string>): PracticeRelease[] {
  const parsed = dataSchema.parse(input);
  const seenIds = new Set(baseIds), releaseIds = new Set<string>();
  for (const release of parsed.releases) {
    if (releaseIds.has(release.id)) throw Error(`Duplicate practice release: ${release.id}`);
    releaseIds.add(release.id);
    const test = getTestById(release.testId);
    if (!test?.hasQuestionBank) throw Error(`Unknown practice exam: ${release.testId}`);
    if (release.kind !== "addition" && release.questions.length !== 0) throw Error("Only an addition can add questions");
    if (release.kind === "addition" && release.questions.length === 0) throw Error("An addition must contain questions");
    if (release.kind === "addition" && release.subjectReview === release.teachingReview) throw Error("Independent subject and teaching reviews are required");
    for (const question of release.questions as Question[]) {
      if (seenIds.has(question.id)) throw Error(`Existing question ID cannot be overwritten: ${question.id}`);
      seenIds.add(question.id);
      if (question.testId !== test.id || !test.topics.some(topic => topic.id === question.topicId)) throw Error(`Cross-exam or unknown topic: ${question.id}`);
      const syllabus = assessSyllabusCandidate(question);
      if (!syllabus.allowed) throw Error(`Outside reviewed practice scope: ${question.id}`);
      if (question.type === "mcq") {
        if (!question.options.some(o => o.key === question.answer) || new Set(question.options.map(o => o.key)).size !== question.options.length) throw Error(`Invalid answer options: ${question.id}`);
        if (question.responseMode === "matrix" && (!question.statements?.length || question.matrixAnswer?.length !== question.statements.length)) throw Error(`Invalid matrix response: ${question.id}`);
      } else if (question.totalMarks !== question.parts.reduce((n, part) => n + part.marks, 0) || new Set(question.parts.map(part => part.label)).size !== question.parts.length) throw Error(`Invalid written marks/labels: ${question.id}`);
      if (release.status === "published" && release.questionFingerprints?.[question.id] !== practiceContentFingerprint(question)) throw Error(`Practice content review fingerprint missing or changed: ${question.id}`);
    }
  }
  return parsed.releases;
}

export function getPracticeReleaseHistory(testId?: string): Array<Omit<PracticeRelease, "questions" | "questionFingerprints" | "subjectReview" | "teachingReview"> & { addedQuestions: number }> {
  return dataSchema.parse(updatesData).releases.filter(release => release.status === "published" && (!testId || release.testId === testId))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.id.localeCompare(a.id))
    .map(release => ({ id: release.id, testId: release.testId, publishedAt: release.publishedAt, kind: release.kind, status: release.status,
      title: release.title, titleEn: release.titleEn, summary: release.summary, summaryEn: release.summaryEn, addedQuestions: release.questions.length }));
}

export function practiceAdditions(baseIds: Set<string>): Question[] {
  return validatePracticeUpdates(updatesData, baseIds).filter(release => release.status === "published").flatMap(release => release.questions as Question[]);
}
