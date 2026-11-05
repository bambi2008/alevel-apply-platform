import type { Question } from "./questions/types";
import type { DeliveredQuestion } from "./delivery-types";

/** Allowlist, rather than deleting known secrets from a spreading object. New
 * authored fields must be reviewed here before they can reach a browser. */
export function questionForDelivery(question: Question): DeliveredQuestion {
  const common = {
    id: question.id, testId: question.testId, topicId: question.topicId,
    difficulty: question.difficulty, context: question.context,
  };
  if (question.type === "mcq") return {
    ...common, type: "mcq", marks: question.marks, question: question.question,
    options: question.options.map(({ key, text }) => ({ key, text })),
    responseMode: question.responseMode, statements: question.statements?.map(({ id, text }) => ({ id, text })),
    scoringMode: question.scoringMode, audioSectionId: question.audioSectionId,
    audioTitle: question.audioTitle, audioScript: question.audioScript,
  };
  return {
    ...common, type: "long", totalMarks: question.totalMarks,
    parts: question.parts.map(({ label, marks, question: prompt }) => ({ label, marks, question: prompt })),
    responseKind: question.responseKind,
    essayPrompts: question.essayPrompts?.map(({ id, title }) => ({ id, title })),
    recommendedWords: question.recommendedWords, maxWords: question.maxWords,
    rubricDimensions: question.rubricDimensions?.map(({ id, label, maxMarks, description }) => ({ id, label, maxMarks, description })),
  };
}
