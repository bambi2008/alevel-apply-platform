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
