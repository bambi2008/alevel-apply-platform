import { afterEach, describe, expect, it, vi } from "vitest";
import type { Prisma } from "@prisma/client";
import { addBeijingCalendarMonths, isMembershipActive, seasonPassWindow, trialWindow } from "../../lib/membership/policy";
import { grantRegistrationTrial, trialClaimPurgeDue, trialEmailDigest } from "../../lib/membership/trial";

afterEach(() => vi.unstubAllEnvs());
const secret = "local-fixture-dedup-secret-not-for-deployment";
const now = new Date("2026-01-30T18:20:30.123Z"); // Beijing Jan 31

describe("membership time and expiry", () => {
  it.each([
    ["2026-01-30T18:20:30.123Z", 3, "2026-04-29T18:20:30.123Z"],
    ["2023-11-29T18:00:00Z", 3, "2024-02-28T18:00:00.000Z"],
    ["2024-11-29T18:00:00Z", 3, "2025-02-27T18:00:00.000Z"],
    ["2026-12-31T15:59:59Z", 3, "2027-03-31T15:59:59.000Z"],
  ])("clamps Beijing calendar months for %s", (date, months, expected) => {
    expect(addBeijingCalendarMonths(new Date(date), months).toISOString()).toBe(expected);
  });
  it("grants exactly seven 24-hour periods and expires at the precise boundary", () => {
    const window = trialWindow(now);
    expect(+window.endsAt - +now).toBe(604_800_000);
    expect(isMembershipActive(window, new Date(+now - 1))).toBe(false);
    expect(isMembershipActive(window, now)).toBe(true);
    expect(isMembershipActive(window, new Date(+window.endsAt - 1))).toBe(true);
    expect(isMembershipActive(window, window.endsAt)).toBe(false);
  });
  it("extends an unexpired membership, keeping its start time", () => {
    const current = { ...trialWindow(now), plan: "season_pass" };
    const renewed = seasonPassWindow(current, new Date(+now + 1), 3);
    expect(renewed.startsAt).toEqual(now);
    expect(renewed.endsAt).toEqual(addBeijingCalendarMonths(current.endsAt, 3));
    expect(seasonPassWindow(current, current.endsAt, 3).startsAt).toEqual(current.endsAt);
    expect(seasonPassWindow({ ...current, plan: "trial" }, new Date(+now + 1), 3).endsAt).toEqual(renewed.endsAt);
  });
  it("rejects invalid dates and durations rather than creating an invalid grant", () => {
    expect(() => addBeijingCalendarMonths(new Date(NaN), 3)).toThrow();
    for (const months of [0, -1, 1.5, 37, NaN]) expect(() => addBeijingCalendarMonths(now, months)).toThrow();
  });
});

describe("purpose-limited trial claims", () => {
  it("normalizes case and whitespace but does not conflate distinct email addresses", () => {
    const digest = trialEmailDigest("  Learner@Example.test ", secret);
    expect(digest).toMatch(/^[a-f0-9]{64}$/);
    expect(digest).toBe(trialEmailDigest("learner@example.test", secret));
    expect(digest).not.toBe(trialEmailDigest("learner+other@example.test", secret));
    expect(digest).not.toBe(trialEmailDigest("learner@example.test", secret + "other"));
    expect(digest).not.toContain("learner");
  });
  it.each(["", "short", "change-me-to-a-longer-secret-placeholder"])("fails closed without a dedicated usable secret", key => {
    expect(() => trialEmailDigest("learner@example.test", key)).toThrow("TRIAL_DEDUP_SECRET");
  });
  it("grants only the transaction that inserts a claim and never refreshes an old claim", async () => {
    vi.stubEnv("TRIAL_PROGRAM_ENABLED", "true");
    vi.stubEnv("TRIAL_PROGRAM_ENDED_AT", "");
    vi.stubEnv("TRIAL_DEDUP_SECRET", secret);
    const createMany = vi.fn().mockResolvedValueOnce({ count: 1 }).mockResolvedValue({ count: 0 });
    const create = vi.fn();
    const tx = { trialClaim: { createMany }, membership: { create } } as unknown as Prisma.TransactionClient;
    expect(await grantRegistrationTrial(tx, "u1", "learner@example.test", now)).toBe(true);
    expect(await grantRegistrationTrial(tx, "u2", "learner@example.test", new Date(+now + 999))).toBe(false);
    expect(create).toHaveBeenCalledOnce();
    expect(createMany.mock.calls[0][0]).toEqual({ data: [{ emailDigest: trialEmailDigest("learner@example.test", secret), claimedAt: now }], skipDuplicates: true });
    expect(create).toHaveBeenCalledWith({ data: { userId: "u1", plan: "trial", ...trialWindow(now) } });
  });
  it("does not grant after a recorded programme end and only purges after explicitly stopping", async () => {
    vi.stubEnv("TRIAL_PROGRAM_ENABLED", "true");
    vi.stubEnv("TRIAL_PROGRAM_ENDED_AT", "2026-01-01T00:00:00Z");
    expect(await grantRegistrationTrial({} as Prisma.TransactionClient, "u", "learner@example.test", now)).toBe(false);
    expect(trialClaimPurgeDue({ TRIAL_PROGRAM_ENABLED: "true", TRIAL_PROGRAM_ENDED_AT: "2026-01-01" }, now)).toBe(false);
    expect(trialClaimPurgeDue({ TRIAL_PROGRAM_ENABLED: "false", TRIAL_PROGRAM_ENDED_AT: "2026-01-01" }, now)).toBe(true);
    expect(trialClaimPurgeDue({ TRIAL_PROGRAM_ENABLED: "false", TRIAL_PROGRAM_ENDED_AT: "2027-01-01" }, now)).toBe(false);
    expect(trialClaimPurgeDue({ TRIAL_PROGRAM_ENABLED: "false", TRIAL_PROGRAM_ENDED_AT: "invalid" }, now)).toBe(false);
    expect(trialClaimPurgeDue({ TRIAL_PROGRAM_ENABLED: "false" }, now)).toBe(false);
  });
});
