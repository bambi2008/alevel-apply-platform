export async function persistExamSession(payload: unknown): Promise<string | null> {
  try {
    const authResponse = await fetch("/api/auth/session", { cache: "no-store" });
    if (!authResponse.ok) return null;
    const session = await authResponse.json() as { user?: unknown } | null;
    if (!session?.user) return null;

    const response = await fetch("/api/exam-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return null;
    const saved = await response.json() as { id?: string };
    return saved.id ?? null;
  } catch {
    return null;
  }
}
