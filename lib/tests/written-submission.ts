export type WrittenSubmission = {
  version: 1;
  paperId: string;
  startedAt: number;
  timeUsedSec: number;
  works: Record<string, Record<string, string>>;
};
export const writtenSubmissionKey = (paperId: string) => `qiaoshen:written-submission:${paperId}:v1`;

// A submitted answer must remain recoverable even after its exam timer expires.
export function parseWrittenSubmission(raw: string | null, paperId: string, questionIds: string[]): WrittenSubmission | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as WrittenSubmission;
    if (value.version !== 1 || value.paperId !== paperId || !Number.isFinite(value.startedAt)
      || value.startedAt <= 0 || !Number.isFinite(value.timeUsedSec) || value.timeUsedSec < 0
      || !value.works || typeof value.works !== "object" || Array.isArray(value.works)) return null;
    for (const [id, work] of Object.entries(value.works)) {
      if (!questionIds.includes(id) || !work || typeof work !== "object" || Array.isArray(work)
        || !Object.values(work).every(text => typeof text === "string")) return null;
    }
    return value;
  } catch { return null; }
}
