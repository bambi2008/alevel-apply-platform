import revisionData from "@/data/question-bank/corrections-20261026.json";
import type { Question, MCQQuestion } from "./questions/types";
import type { MockPaper } from "./mock-papers";
import { syllabusFingerprint } from "./syllabus-policy";

export const CONTENT_REVISION_SUFFIX = "-rev20261026";
export const CONTENT_CORRECTIONS = revisionData.entries as unknown as Array<{ source: Question | null; corrected: Question }>;
export const CONTENT_CORRECTIONS_HASH = "7568ef11:ed59d89d:36863";

const normalized = (text: string | undefined) => (text ?? "").replace(/\s+/g, " ").trim();
/** Match a complete prompt, not merely a shared passage/context. */
export const questionPromptIdentity = (q: Question) => JSON.stringify([q.testId, q.type, normalized(q.context),
  q.type === "mcq" ? normalized(q.question) : q.parts.map(part => [part.label, normalized(part.question)])]);
const candidates = new Map(CONTENT_CORRECTIONS.filter(entry => entry.source)
  .map(entry => [questionPromptIdentity(entry.source!), entry]));

export function verifyContentCorrections(): void {
  if (syllabusFingerprint(revisionData as unknown as Question) !== CONTENT_CORRECTIONS_HASH) throw Error("Content revisions require a new review");
}

/** Correct only approved current inputs; never mutate a historical object. */
export function reviseCurrentQuestion(original: Question): Question {
  if (original.id.endsWith(CONTENT_REVISION_SUFFIX)) return original;
  const entry = candidates.get(questionPromptIdentity(original));
  if (!entry?.source) return original;
  const { source, corrected } = entry;
  const id = original.id + CONTENT_REVISION_SUFFIX;
  if (source.type === "mcq" && corrected.type === "mcq" && original.type === "mcq") {
    // Current papers may shuffle answer letters. Map by source option TEXT,
    // then update that option's text/key; never paste an old answer letter.
    let options: MCQQuestion["options"];
    let answer: MCQQuestion["answer"];
    if (source.options.length === corrected.options.length && original.options.length === source.options.length) {
      const mapped = original.options.map(option => {
        const old = source.options.find(item => normalized(item.text) === normalized(option.text));
        const next = corrected.options.find(item => item.key === old?.key);
        if (!old || !next) throw Error(`Unreviewed option mapping: ${original.id}`);
        return { option: { ...option, text: next.text }, correct: old.key === corrected.answer };
      });
      if (mapped.filter(item => item.correct).length !== 1) throw Error(`Ambiguous revised answer: ${original.id}`);
      options = mapped.map(item => item.option);
      answer = mapped.find(item => item.correct)!.option.key;
    } else {
      // Retain the current four-choice LNAT structure if its old input had five.
      const correctText = corrected.options.find(option => option.key === corrected.answer)?.text;
      const matches = original.options.filter(option => normalized(option.text) === normalized(correctText));
      if (matches.length !== 1) throw Error(`Missing current answer option: ${original.id}`);
      options = original.options;
      answer = matches[0].key;
    }
    return { ...original, id, question: corrected.question, options, answer, solution: corrected.solution,
      ...(corrected.hint ? { hint: corrected.hint } : {}) };
  }
  if (source.type === "long" && corrected.type === "long" && original.type === "long") {
    if (original.totalMarks !== corrected.totalMarks || original.parts.some((part, index) => part.marks !== corrected.parts[index]?.marks)) throw Error(`Unreviewed mark allocation: ${original.id}`);
    return { ...original, id, context: corrected.context, parts: corrected.parts, fullSolution: corrected.fullSolution };
  }
  throw Error(`Cross-format content revision: ${original.id}`);
}

export function reviseCurrentPaper(original: MockPaper): MockPaper {
  let changed = false;
  const modules = original.modules.map(module => ({ ...module, questions: module.questions.map(question => {
    const next = reviseCurrentQuestion(question);
    changed ||= next !== question;
    return next;
  }) }));
  if (!changed) return original;
  return { ...original, id: original.id + CONTENT_REVISION_SUFFIX, modules: modules.map(module => ({ ...module,
    questions: module.questions.map(question => question.id.endsWith(CONTENT_REVISION_SUFFIX) ? question : { ...question, id: question.id + CONTENT_REVISION_SUFFIX }),
  })) };
}
