import { describe, expect, it, vi } from "vitest";
import { probeHealth } from "./monitor-production.mjs";

describe("production health monitor", () => {
  it("accepts a healthy readiness response", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: "ok", release: "release-1" }),
    });
    await expect(probeHealth("https://example.test/api/health", { attempts: 1, fetchImpl })).resolves.toMatchObject({ release: "release-1" });
  });

  it("rejects a degraded response", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ status: "degraded" }),
    });
    await expect(probeHealth("https://example.test/api/health", { attempts: 1, fetchImpl })).rejects.toThrow("503");
  });
});
