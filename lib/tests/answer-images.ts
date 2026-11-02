export const MAX_ANSWER_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_ANSWER_IMAGES_PER_PART = 4;

export interface AnswerImageRef {
  id: string;
  url: string;
  fileName: string;
  width: number;
  height: number;
  size: number;
}

export type AnswerImagesByPart = Record<string, AnswerImageRef[]>;
export type AnswerImagesByQuestion = Record<string, AnswerImagesByPart>;

export function hasAnswerContent(text: string, images: AnswerImageRef[]) {
  return text.trim().length > 0 || images.length > 0;
}

/** Reserved UI metadata is not an answer. A real photo reference is. */
export function hasWrittenResponse(work: unknown): boolean {
  if (!work || typeof work !== "object" || Array.isArray(work)) return false;
  return Object.entries(work).some(([key, value]) => {
    if (typeof value !== "string") return false;
    if (!key.startsWith("__")) return value.trim().length > 0;
    if (key !== "__answerImageIds") return false;
    try {
      const images: unknown = JSON.parse(value);
      return !!images && typeof images === "object" && !Array.isArray(images)
        && Object.values(images).some(ids => Array.isArray(ids) && ids.some(id => typeof id === "string" && id.trim().length > 0));
    } catch { return false; }
  });
}
