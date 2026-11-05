import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const m = vi.hoisted(() => ({ auth: vi.fn(), data: vi.fn() }));
vi.mock("@/auth", () => ({ auth: m.auth }));
vi.mock("@/lib/tests/content-priority-server", () => ({ getContentPriorities: m.data }));
import { GET } from "../../app/api/admin/content-priorities/route";
const admin = { user: { id: "admin", role: "ADMIN", email: "admin@example.test" } };
beforeEach(() => { vi.resetAllMocks(); vi.stubEnv("ADMIN_EMAILS", admin.user.email); m.data.mockResolvedValue({ generatedAt: "2026-10-26T01:00:00Z", windowStart: "2026-09-28T01:00:00Z", windowEnd: "2026-10-26T01:00:00Z", rows: [] }); });
afterEach(() => vi.unstubAllEnvs());
it.each([null, { user: { id: "student", role: "STUDENT" } }, { user: { id: "mentor", role: "MENTOR" } }, { user: { id: "other-admin", role: "ADMIN", email: "other@example.test" } }])("blocks non-admin JSON and CSV %j", async session => {
  m.auth.mockResolvedValue(session);
  for (const suffix of ["", "?format=csv"]) expect((await GET(new NextRequest("http://localhost:3100/api/admin/content-priorities" + suffix))).status).toBe(session ? 403 : 401);
  expect(m.data).not.toHaveBeenCalled();
});
it("allows only an aggregate no-store CSV export for an administrator", async () => {
  m.auth.mockResolvedValue(admin);
  const response = await GET(new NextRequest("http://localhost:3100/api/admin/content-priorities?format=csv"));
  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toContain("text/csv");
  expect(response.headers.get("cache-control")).toContain("no-store");
  expect(await response.text()).not.toMatch(/admin|student|email|userId/);
});
it("does not replace a database failure with an empty successful report", async () => {
  m.auth.mockResolvedValue(admin); m.data.mockRejectedValue(Error("database detail"));
  const response = await GET(new NextRequest("http://localhost:3100/api/admin/content-priorities"));
  expect(response.status).toBe(503); expect(await response.json()).toEqual({ error: "data_unavailable" });
});
