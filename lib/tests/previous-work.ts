import type { AnswerImageRef } from "./answer-images";
import type { DeliveredQuestion, SubmittedAnswer } from "./delivery-types";
import { loadRemoteProgress } from "@/lib/learning/client";

function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function usable(value: unknown, paperId: string, key: "scopeId" | "paperId") {
  const item = object(value);
  const savedAt = item.savedAt;
  return item[key] === paperId && typeof savedAt === "number" && Number.isFinite(savedAt)
    && Date.now() - savedAt >= 0 && Date.now() - savedAt < 365 * 86_400_000 ? item : null;
}

export async function loadPreviousPaperWork(paperId: string) {
  // These server snapshots are scoped to the signed-in account. Old shared
  // browser keys did not include account identity and are not imported.
  const [objective, written] = await Promise.all([
    loadRemoteProgress<unknown>("OBJECTIVE_EXAM", paperId),
    loadRemoteProgress<unknown>("WRITTEN_EXAM", paperId),
  ]);
  const options = usable(objective, paperId, "paperId");
  const workbook = usable(written, paperId, "scopeId");
  if (!options && !workbook) return null;
  const payload = object(workbook?.payload);
  return { selections: object(options?.answers), works: object(payload.works), images: object(payload.answerImages) };
}

function previousImages(value: unknown): AnswerImageRef[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 4).flatMap(entry => {
    const row = object(entry);
    const id = row.id;
    if (typeof id !== "string" || !/^[a-zA-Z0-9_-]{1,64}$/.test(id)) return [];
    return [{ id, url: `/api/answer-images/${encodeURIComponent(id)}`,
      fileName: typeof row.fileName === "string" ? row.fileName.slice(0, 80) : "Photo",
      width: typeof row.width === "number" && row.width > 0 && row.width < 10_000 ? row.width : 100,
      height: typeof row.height === "number" && row.height > 0 && row.height < 10_000 ? row.height : 100,
      size: typeof row.size === "number" && row.size > 0 ? row.size : 0 }];
  });
}

export function projectPreviousPaperWork(questions: DeliveredQuestion[], draft: NonNullable<Awaited<ReturnType<typeof loadPreviousPaperWork>>>) {
  const answers: Record<string, SubmittedAnswer> = {};
  const images: Record<string, Record<string, AnswerImageRef[]>> = {};
  for (const question of questions) {
    if (question.type === "mcq") {
      const selected = draft.selections[question.id];
      if (typeof selected === "string" && (question.responseMode === "matrix"
        ? selected.length === question.statements?.length && /^[YN-]+$/.test(selected)
        : question.options.some(option => option.key === selected))) answers[question.id] = { questionId: question.id, selected };
      continue;
    }
    const notes = object(draft.works[question.id]);
    const pictures = object(draft.images[question.id]);
    const work: Record<string, string> = {};
    const answerImageIds: Record<string, string[]> = {};
    let importedPhotos = 0;
    for (const part of question.parts) {
      const note = notes[part.label];
      if (typeof note === "string") work[part.label] = note.slice(0, 30_000);
      if (question.responseKind === "essay") continue;
      const restored = previousImages(pictures[part.label]).slice(0, 8 - importedPhotos);
      if (!restored.length) continue;
      importedPhotos += restored.length;
      images[question.id] ??= {};
      images[question.id][part.label] = restored;
      answerImageIds[part.label] = restored.map(image => image.id);
    }
    const selectedPromptId = question.essayPrompts?.find(prompt => prompt.id === notes.__selectedPrompt)?.id;
    if (Object.keys(work).length || importedPhotos) answers[question.id] = { questionId: question.id, work, answerImageIds, selectedPromptId };
  }
  return { answers, images };
}
