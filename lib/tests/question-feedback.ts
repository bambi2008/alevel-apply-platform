import { createHash } from "node:crypto";
import type { Question } from "./questions/types";

export const QUESTION_FEEDBACK_KINDS = ["ERROR", "TOO_HARD", "MORE_LIKE_THIS"] as const;
export type QuestionFeedbackKind = typeof QUESTION_FEEDBACK_KINDS[number];

/** Identical practice/paper copies share feedback, including shuffled options.
 * Changed prompts are a new question. No user identity enters this content key. */
export function feedbackQuestionKey(question: Question): string {
  const normalize = (text: string | undefined) => (text ?? "").replace(/\s+/g, " ").trim();
  const content = question.type === "mcq"
    ? [normalize(question.context), normalize(question.question), question.options.map(o => normalize(o.text)).sort(), question.statements?.map(s => normalize(s.text)) ?? []]
    : [normalize(question.context), question.parts.map(p => normalize(p.question))];
  return createHash("sha256").update(JSON.stringify([question.testId, question.topicId, question.type, content])).digest("hex");
}
