import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const m = vi.hoisted(() => ({ auth: vi.fn(), membership: vi.fn(), consent: vi.fn(), limit: vi.fn() }));
vi.mock("@/auth", () => ({ auth: m.auth }));
vi.mock("@/lib/db", () => ({ db: { membership: { findUnique: m.membership }, consent: { findFirst: m.consent } } }));
vi.mock("@/lib/security/rate-limit", () => ({ clientIp: () => "192.0.2.1", rateLimitKey: (...parts: string[]) => parts.join(":"), consumePersistentRateLimit: m.limit }));
import { requireAiAccess } from "../../lib/security/ai-route";
const request = () => new NextRequest("https://example.test/api/ps-coach", { method: "POST", headers: { origin: "https://example.test" } });
beforeEach(() => {
  vi.resetAllMocks(); vi.useFakeTimers(); vi.setSystemTime(new Date("2026-11-03T00:00:00Z"));
  vi.stubEnv("AI_REQUIRES_CROSS_BORDER_CONSENT", "true");
  m.auth.mockResolvedValue({ user: { id: "owner" } });
  m.membership.mockResolvedValue({ plan: "trial", startsAt: new Date("2026-11-01"), endsAt: new Date("2026-11-08") });
  m.consent.mockResolvedValue({ id: "consent" }); m.limit.mockResolvedValue({ allowed: true });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });
describe("shared AI membership and consent enforcement", () => {
  it("does not look up study data or spend a rate-limit entry for anonymous requests", async () => {
    m.auth.mockResolvedValue(null);
    const access = await requireAiAccess(request(), "statement");
    expect(!access.ok && access.response.status).toBe(401);
    expect(m.membership).not.toHaveBeenCalled(); expect(m.limit).not.toHaveBeenCalled();
  });
  it("blocks an expired trial before requesting AI consent or contacting a provider", async () => {
    m.membership.mockResolvedValue({ plan: "trial", startsAt: new Date("2026-10-01"), endsAt: new Date("2026-11-03T00:00:00Z") });
    const access = await requireAiAccess(request(), "statement");
    expect(!access.ok && access.response.status).toBe(402);
    if (!access.ok) expect(await access.response.json()).toEqual({ error: "trial_expired" });
    expect(m.consent).not.toHaveBeenCalled(); expect(m.limit).not.toHaveBeenCalled();
  });
  it("keeps separate AI consent necessary even with paid access", async () => {
    m.consent.mockResolvedValue(null);
    const access = await requireAiAccess(request(), "statement");
    expect(!access.ok && access.response.status).toBe(403);
    if (!access.ok) expect(await access.response.json()).toMatchObject({ consentRequired: true });
    expect(m.limit).not.toHaveBeenCalled();
  });
  it("grants only the authenticated owner after membership, consent and abuse checks", async () => {
    expect(await requireAiAccess(request(), "statement")).toEqual({ ok: true, userId: "owner" });
    expect(m.membership).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: "owner" } }));
    expect(m.limit).toHaveBeenCalledOnce();
  });
});
