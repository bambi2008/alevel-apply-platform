import { describe, expect, it } from "vitest";
import {
  BETA_COHORT,
  classifyRegistrationInvite,
  createInviteCode,
  hashInviteCode,
  normalizeInviteCode,
  parseInviteEmails,
} from "@/lib/beta/invites";

describe("beta invite helpers", () => {
  it("normalizes display formatting before hashing", () => {
    expect(normalizeInviteCode(" qs-ab12c-de345 ")).toBe("QSAB12CDE345");
    expect(hashInviteCode("QS-AB12C-DE345")).toBe(hashInviteCode("qs ab12c de345"));
  });

  it("creates readable codes without ambiguous characters", () => {
    expect(createInviteCode()).toMatch(/^QS-[23456789A-HJ-NP-Z]{5}-[23456789A-HJ-NP-Z]{5}$/);
  });

  it("normalizes and deduplicates a pasted email list", () => {
    expect(parseInviteEmails(" A@EXAMPLE.COM\nb@example.com; a@example.com ")).toEqual([
      "a@example.com",
      "b@example.com",
    ]);
  });

  it("recognizes a consumed invite as an existing registered account", () => {
    expect(classifyRegistrationInvite({
      email: "student@example.com",
      cohort: BETA_COHORT,
      status: "USED",
      expiresAt: null,
      usedByUserId: "user-1",
    }, "student@example.com", "user-1")).toBe("EXISTS");
  });

  it("does not disclose an account for a mismatched or unrelated consumed invite", () => {
    const invite = {
      email: "student@example.com",
      cohort: BETA_COHORT,
      status: "USED" as const,
      expiresAt: null,
      usedByUserId: "user-1",
    };
    expect(classifyRegistrationInvite(invite, "other@example.com", "user-1")).toBe("INVALID");
    expect(classifyRegistrationInvite(invite, "student@example.com", "user-2")).toBe("INVALID");
  });
});
