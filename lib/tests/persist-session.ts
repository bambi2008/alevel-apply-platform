export async function persistExamSession(payload: unknown): Promise<string | null> {
  try {
    const body = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
    const startedAt = typeof body.startedAt === "string" ? body.startedAt : undefined;
    const testId = typeof body.testId === "string" ? body.testId : undefined;
    const scopeId = typeof body.paperId === "string"
      ? body.paperId
      : typeof body.presetId === "string"
        ? body.presetId
        : typeof body.mode === "string"
          ? body.mode
          : "session";
    const attemptId = typeof body.attemptId === "string"
      ? body.attemptId
      : testId && startedAt
        ? `${testId}:${scopeId}:${startedAt}`
        : undefined;
    const authResponse = await fetch("/api/auth/session", { cache: "no-store" });
    if (!authResponse.ok) return null;
    const session = await authResponse.json() as { user?: unknown } | null;
    if (!session?.user) return null;

    const response = await fetch("/api/exam-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, attemptId }),
    });
    if (!response.ok) return null;
    const saved = await response.json() as { id?: string };
    return saved.id ?? null;
  } catch {
    return null;
  }
}
