export type ProgressKind =
  | "OBJECTIVE_EXAM"
  | "WRITTEN_EXAM"
  | "INTERVIEW_DRILL"
  | "INTERVIEW_PAPER"
  | "CAMBRIDGE_ASSESSMENT"
  | "IELTS_SPEAKING";

export type LearningRecordKind =
  | "INTERVIEW_DRILL"
  | "INTERVIEW_PAPER"
  | "CAMBRIDGE_ASSESSMENT"
  | "IELTS_SPEAKING";

export async function loadRemoteProgress<T>(kind: ProgressKind, resourceId: string): Promise<T | null> {
  try {
    const response = await fetch(`/api/progress?kind=${encodeURIComponent(kind)}&resourceId=${encodeURIComponent(resourceId)}`, { cache: "no-store" });
    if (!response.ok) return null;
    const body = await response.json() as { progress?: { payload?: T } | null };
    return body.progress?.payload ?? null;
  } catch {
    return null;
  }
}

export async function saveRemoteProgress(input: {
  kind: ProgressKind;
  resourceId: string;
  payload: unknown;
  startedAt?: string;
  testId?: string;
  mode?: "diagnostic" | "practice" | "mock" | "paper" | "interview";
}) {
  try {
    await fetch("/api/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      keepalive: true,
    });
  } catch {
    // Local storage remains the offline recovery layer.
  }
}

export async function clearRemoteProgress(kind: ProgressKind, resourceId: string) {
  try {
    await fetch(`/api/progress?kind=${encodeURIComponent(kind)}&resourceId=${encodeURIComponent(resourceId)}`, {
      method: "DELETE",
      keepalive: true,
    });
  } catch {
    // Best effort; expired snapshots are cleaned server-side.
  }
}

export async function loadLearningRecords<T>(kind: LearningRecordKind, subject?: string): Promise<T[]> {
  try {
    const query = new URLSearchParams({ kind });
    if (subject) query.set("subject", subject);
    const response = await fetch(`/api/learning-records?${query}`, { cache: "no-store" });
    if (!response.ok) return [];
    const body = await response.json() as { records?: T[] };
    return body.records ?? [];
  } catch {
    return [];
  }
}

export async function saveLearningRecord(input: {
  kind: LearningRecordKind;
  resourceId: string;
  subject?: string;
  score?: number;
  maxScore?: number;
  weakestSkillId?: string;
  attemptKey: string;
  completedAt?: string;
  payload?: unknown;
}) {
  try {
    await fetch("/api/learning-records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      keepalive: true,
    });
  } catch {
    // The local attempt remains available and can be retried later.
  }
}
