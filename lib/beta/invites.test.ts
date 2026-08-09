import { describe, expect, it } from "vitest";
import {
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
});
