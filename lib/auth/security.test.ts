import { describe, expect, it } from "vitest";
import {
  createOpaqueToken,
  hashOpaqueToken,
  isStrongPassword,
  normalizeEmail,
} from "./security";

describe("account security helpers", () => {
  it("normalizes email addresses", () => {
    expect(normalizeEmail("  Student@Example.COM ")).toBe("student@example.com");
  });

  it("enforces the password length policy", () => {
    expect(isStrongPassword("short123")).toBe(false);
    expect(isStrongPassword("long-enough")).toBe(true);
    expect(isStrongPassword("x".repeat(129))).toBe(false);
  });

  it("creates high-entropy one-way reset tokens", () => {
    const first = createOpaqueToken();
    const second = createOpaqueToken();
    expect(first).not.toBe(second);
    expect(first.length).toBeGreaterThanOrEqual(40);
    expect(hashOpaqueToken(first)).toMatch(/^[a-f0-9]{64}$/);
    expect(hashOpaqueToken(first)).not.toBe(first);
  });
});
