import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "@prisma/client";

const m = vi.hoisted(() => ({
  findUser: vi.fn(), createUser: vi.fn(), execute: vi.fn(), event: vi.fn(),
  invite: vi.fn(), participant: vi.fn(), transaction: vi.fn(),
  signIn: vi.fn(), hash: vi.fn(), limit: vi.fn(),
}));
vi.mock("@/lib/db", () => ({ db: { $transaction: m.transaction } }));
vi.mock("bcryptjs", () => ({ default: { hash: m.hash } }));
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/auth", () => ({ AuthError: class extends Error {}, signIn: m.signIn, signOut: vi.fn() }));
vi.mock("@/lib/security/rate-limit", () => ({
  clientIp: () => "192.0.2.1", rateLimitKey: (scope: string) => scope,
  consumePersistentRateLimit: m.limit,
}));
import { registerAction } from "../../lib/auth/actions";

function form(overrides: Record<string, string | null | undefined> = {}) {
  const data = new FormData();
  const values = {
    email: "  SelfSignUp@Example.test ", password: "StrongTestPassword2026",
    intendedUniversities: "University of Cambridge", intendedMajors: "Mathematics",
    privacyConsent: "on", termsConsent: "on", locale: "en", ...overrides,
  };
  for (const [key, value] of Object.entries(values)) if (value != null) data.set(key, value);
  return data;
}

beforeEach(() => {
  vi.resetAllMocks();
  m.findUser.mockResolvedValue(null);
  m.createUser.mockResolvedValue({ id: "new-student", profile: { id: "new-profile" } });
  m.hash.mockResolvedValue("hashed-password");
  m.limit.mockResolvedValue({ allowed: true });
  m.transaction.mockImplementation(async (callback) => callback({
    user: { findUnique: m.findUser, create: m.createUser },
    $executeRaw: m.execute, learningEvent: { create: m.event },
    // Must remain unused: self-registration must not spend old cohort places.
    betaInvite: { findUnique: m.invite, count: m.invite, updateMany: m.invite },
    betaParticipant: { create: m.participant },
  }));
});

describe("open email self-registration", () => {
  it("registers without an invitation and without reading or altering the 20-person cohort", async () => {
    await expect(registerAction({}, form())).resolves.toEqual({});
    expect(m.invite).not.toHaveBeenCalled();
    expect(m.participant).not.toHaveBeenCalled();
    expect(m.createUser).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({
      email: "selfsignup@example.test", passwordHash: "hashed-password", role: "STUDENT",
      profile: { create: { intendedMajors: ["Mathematics"] } },
    }) }));
    expect(m.execute).toHaveBeenCalledOnce();
    expect(m.event).toHaveBeenCalledWith({ data: { studentId: "new-profile", type: "REGISTERED", eventKey: "registered:new-student" } });
    expect(m.signIn).toHaveBeenCalledWith("credentials", { email: "selfsignup@example.test", password: "StrongTestPassword2026", redirectTo: "/en" });
  });
  it("does not trust a supplied role or consume an old invite sent by a stale form", async () => {
    await registerAction({}, form({ inviteCode: "EXPIRED-IGNORED", role: "ADMIN", locale: "https://example.invalid" }));
    expect(m.createUser.mock.calls[0][0].data.role).toBe("STUDENT");
    expect(m.invite).not.toHaveBeenCalled();
    expect(m.signIn.mock.calls[0][1].redirectTo).toBe("/zh-CN");
  });
  it.each(["privacyConsent", "termsConsent"])("requires %s before a database write", async (key) => {
    expect(await registerAction({}, form({ [key]: null }))).toEqual({ error: "CONSENT_REQUIRED" });
    expect(m.transaction).not.toHaveBeenCalled();
  });
  it.each([{ password: "short" }, { intendedUniversities: "" }, { intendedMajors: "" }, { email: "not-email" }])("rejects invalid registration input %j", async (override) => {
    expect(await registerAction({}, form(override))).toEqual({ error: "INVALID" });
    expect(m.hash).not.toHaveBeenCalled();
    expect(m.transaction).not.toHaveBeenCalled();
  });
  it("keeps AI data processing opt-in, recording only expressly selected consents", async () => {
    await registerAction({}, form());
    expect(m.createUser.mock.calls[0][0].data.consents.create.map((c: { type: string }) => c.type)).toEqual(["PRIVACY_PIPL", "TERMS"]);
    m.createUser.mockClear();
    await registerAction({}, form({ guardian: "on", crossBorderConsent: "on" }));
    expect(m.createUser.mock.calls[0][0].data.consents.create.map((c: { type: string }) => c.type)).toEqual(["PRIVACY_PIPL", "TERMS", "GUARDIAN", "CROSS_BORDER"]);
  });
  it("preserves existing accounts", async () => {
    m.findUser.mockResolvedValue({ id: "existing-student" });
    expect(await registerAction({}, form())).toEqual({ error: "EXISTS" });
    expect(m.createUser).not.toHaveBeenCalled();
    expect(m.signIn).not.toHaveBeenCalled();
  });
  it("uses the database unique constraint to reject simultaneous registration of the same email", async () => {
    m.transaction.mockRejectedValue(new Prisma.PrismaClientKnownRequestError("duplicate", { code: "P2002", clientVersion: "6", meta: { target: ["email"] } }));
    expect(await registerAction({}, form())).toEqual({ error: "EXISTS" });
    expect(m.signIn).not.toHaveBeenCalled();
  });
  it("does not mask unrelated database failures", async () => {
    m.transaction.mockRejectedValue(new Error("database unavailable"));
    await expect(registerAction({}, form())).rejects.toThrow("database unavailable");
    expect(m.signIn).not.toHaveBeenCalled();
  });
  it("limits email rotation from one IP before hashing or creating accounts", async () => {
    m.limit.mockResolvedValueOnce({ allowed: false });
    expect(await registerAction({}, form())).toEqual({ error: "RATE_LIMITED" });
    expect(m.limit).toHaveBeenCalledWith("registration-ip", { limit: 10, windowMs: 3600000 });
    expect(m.hash).not.toHaveBeenCalled();
  });
  it("also retains the separate email registration limiter", async () => {
    m.limit.mockResolvedValueOnce({ allowed: true }).mockResolvedValueOnce({ allowed: false });
    expect(await registerAction({}, form())).toEqual({ error: "RATE_LIMITED" });
    expect(m.limit).toHaveBeenLastCalledWith("registration", { limit: 5, windowMs: 3600000 });
    expect(m.transaction).not.toHaveBeenCalled();
  });
});
