import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "@prisma/client";

const m = vi.hoisted(() => ({
  findUser: vi.fn(), createUser: vi.fn(), execute: vi.fn(), event: vi.fn(),
  invite: vi.fn(), claim: vi.fn(), participant: vi.fn(), transaction: vi.fn(),
  signIn: vi.fn(), hash: vi.fn(), limit: vi.fn(),
  trialClaim: vi.fn(), membership: vi.fn(),
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
afterEach(() => vi.unstubAllEnvs());

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
  vi.stubEnv("REGISTRATION_MODE", "open");
  vi.stubEnv("TRIAL_PROGRAM_ENABLED", "false");
  m.findUser.mockResolvedValue(null);
  m.createUser.mockResolvedValue({ id: "new-student", profile: { id: "new-profile" } });
  m.hash.mockResolvedValue("hashed-password");
  m.limit.mockResolvedValue({ allowed: true });
  m.transaction.mockImplementation(async (callback) => callback({
    user: { findUnique: m.findUser, create: m.createUser },
    $executeRaw: m.execute, learningEvent: { create: m.event },
    // Must remain unused: self-registration must not spend old cohort places.
    betaInvite: { findUnique: m.invite, count: m.invite, updateMany: m.claim },
    betaParticipant: { create: m.participant },
    trialClaim: { createMany: m.trialClaim }, membership: { create: m.membership },
  }));
});

describe("temporary invite registration", () => {
  const available = { id: "invite-1", email: "selfsignup@example.test", cohort: "beta-2026-1", status: "AVAILABLE", expiresAt: null, usedByUserId: null };
  beforeEach(() => { vi.stubEnv("REGISTRATION_MODE", "invite"); m.invite.mockResolvedValue(available); m.claim.mockResolvedValue({ count: 1 }); });
  it("rejects a missing invitation before password hashing or database work", async () => {
    expect(await registerAction({}, form())).toEqual({ error: "INVITE_INVALID" });
    expect(m.hash).not.toHaveBeenCalled();
    expect(m.transaction).not.toHaveBeenCalled();
  });
  it.each([null, { ...available, email: "other@example.test" }, { ...available, expiresAt: new Date(0) }, { ...available, status: "REVOKED" }, { ...available, status: "USED" }])("rejects unavailable or mismatched invitations", async (invite) => {
    m.invite.mockResolvedValue(invite);
    expect(await registerAction({}, form({ inviteCode: "QS-TEST-CODE" }))).toEqual({ error: "INVITE_INVALID" });
    expect(m.createUser).not.toHaveBeenCalled();
    expect(m.claim).not.toHaveBeenCalled();
  });
  it("consumes one valid email-bound invitation without recreating cohort enrollment or a capacity gate", async () => {
    expect(await registerAction({}, form({ inviteCode: "QS-TEST-CODE" }))).toEqual({});
    expect(m.claim).toHaveBeenCalledOnce();
    expect(m.claim.mock.calls[0][0]).toMatchObject({ where: { id: "invite-1", email: "selfsignup@example.test", status: "AVAILABLE", usedByUserId: null }, data: { status: "USED", usedByUserId: "new-student" } });
    expect(m.participant).not.toHaveBeenCalled();
  });
  it("aborts the transaction rather than allowing a double claim", async () => {
    m.claim.mockResolvedValue({ count: 0 });
    expect(await registerAction({}, form({ inviteCode: "QS-TEST-CODE" }))).toEqual({ error: "INVITE_INVALID" });
    expect(m.signIn).not.toHaveBeenCalled();
    expect(m.event).not.toHaveBeenCalled();
  });
});

describe("open email self-registration", () => {
  it("grants the initial seven-day trial inside the account-creation transaction", async () => {
    vi.stubEnv("TRIAL_PROGRAM_ENABLED", "true");
    vi.stubEnv("TRIAL_PROGRAM_ENDED_AT", "");
    vi.stubEnv("TRIAL_DEDUP_SECRET", "dedicated-trial-fixture-only-not-production");
    m.trialClaim.mockResolvedValue({ count: 1 });
    expect(await registerAction({}, form())).toEqual({});
    expect(m.membership).toHaveBeenCalledOnce();
    const data = m.membership.mock.calls[0][0].data;
    expect(data.userId).toBe("new-student");
    expect(data.plan).toBe("trial");
    expect(+data.endsAt - +data.startsAt).toBe(604_800_000);
    expect(JSON.stringify(m.trialClaim.mock.calls)).not.toContain("selfsignup@example.test");
  });
  it("permits re-registration without granting a previously used email another trial", async () => {
    vi.stubEnv("TRIAL_PROGRAM_ENABLED", "true");
    vi.stubEnv("TRIAL_PROGRAM_ENDED_AT", "");
    vi.stubEnv("TRIAL_DEDUP_SECRET", "dedicated-trial-fixture-only-not-production");
    m.trialClaim.mockResolvedValue({ count: 0 });
    expect(await registerAction({}, form())).toEqual({});
    expect(m.membership).not.toHaveBeenCalled();
    expect(m.signIn).toHaveBeenCalledOnce();
  });
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
