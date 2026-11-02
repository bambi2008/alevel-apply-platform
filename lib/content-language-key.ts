/** Stable presentation key. Collision checks belong to the offline export, not grading. */
export function contentLanguageKey(source: string): string {
  let a = 2166136261, b = 5381;
  for (let i = 0; i < source.length; i++) {
    a = Math.imul(a ^ source.charCodeAt(i), 16777619);
    b = Math.imul(b, 33) ^ source.charCodeAt(i);
  }
  return `${(a >>> 0).toString(16)}:${(b >>> 0).toString(16)}:${source.length}`;
}

export const HAS_HAN = /[\u3400-\u9fff]/u;

/** These strings drive routing, matching, scoring, or response parsing. Never translate. */
export const CONTENT_STRUCTURAL_FIELDS = new Set([
  "id", "testId", "topicId", "subjectId", "subjectIds", "category", "type", "key",
  "answer", "matrixAnswer", "responseMode", "scoringMode", "responseKind", "formatType",
  "signals", "pressure", "discipline", "value", "url", "registrationUrl", "officialSampleUrl",
  "studentWork", "work", "feedback", "transcript",
]);
