import { beforeEach, describe, expect, it } from "vitest";
import {
  clientIp,
  consumeRateLimit,
  rateLimitKey,
  resetRateLimitsForTests,
} from "./rate-limit";

describe("rate limiting", () => {
  beforeEach(() => resetRateLimitsForTests());

  it("blocks requests beyond the configured limit and resets after the window", () => {
    const options = { limit: 2, windowMs: 1_000 };
    expect(consumeRateLimit("test", options, 1_000).allowed).toBe(true);
    expect(consumeRateLimit("test", options, 1_100).allowed).toBe(true);
    expect(consumeRateLimit("test", options, 1_200).allowed).toBe(false);
    expect(consumeRateLimit("test", options, 2_001).allowed).toBe(true);
  });

  it("does not retain email or phone identifiers in a key", () => {
    const key = rateLimitKey("login", "student@example.com", "13800138000");
    expect(key).not.toContain("student");
    expect(key).not.toContain("13800138000");
  });

  it("reads the first trusted proxy address and rejects malformed values", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "203.0.113.8, 10.0.0.2" }))).toBe("203.0.113.8");
    expect(clientIp(new Headers({ "x-forwarded-for": "malformed ip" }))).toBe("unknown");
  });
});
