import { afterEach, describe, expect, it, vi } from "vitest";
import { persistExamSession } from "./persist-session";

describe("persistExamSession", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not write an exam session for an anonymous visitor", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(persistExamSession({ testId: "tmua" })).resolves.toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("derives and reuses a stable attempt id for a completed paper", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ user: { id: "student-1" } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: "session-1" }) });
    vi.stubGlobal("fetch", fetchMock);

    const payload = {
      testId: "tmua",
      mode: "paper",
      paperId: "tmua-mock-1",
      startedAt: "2026-07-24T10:00:00.000Z",
      totalEarned: 20,
      totalMax: 40,
      answers: [],
    };

    await expect(persistExamSession(payload)).resolves.toBe("session-1");
    const request = fetchMock.mock.calls[1][1] as RequestInit;
    expect(JSON.parse(request.body as string)).toMatchObject({
      attemptId: "tmua:tmua-mock-1:2026-07-24T10:00:00.000Z",
    });
  });
});
