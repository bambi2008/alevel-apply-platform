import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const m = vi.hoisted(() => ({ auth: vi.fn(), access: vi.fn(), published: vi.fn(), create: vi.fn() }));
vi.mock("@/auth", () => ({ auth: m.auth }));
vi.mock("@/lib/db", () => ({ db: { examSession: { create: m.create } } }));
vi.mock("@/lib/membership/access", () => ({ membershipAccess: m.access }));
vi.mock("@/lib/tests/published-server", () => ({ getPublishedQuestionsForTest: m.published }));
import { POST } from "../../app/api/exam-sessions/route";
import { GET } from "../../app/api/question-bank/route";
beforeEach(() => {
  vi.resetAllMocks(); m.auth.mockResolvedValue({ user: { id: "owner" } }); m.access.mockResolvedValue({ active: true });
  m.published.mockResolvedValue([{ id: "q", type: "mcq", testId: "tmua", topicId: "algebra", difficulty: 2, marks: 1, question: "Find x.", options: [{ key: "A", text: "1" }, { key: "B", text: "2" }], answer: "B", solution: "PRIVATE_MARK_SCHEME", hint: "PRIVATE_HINT" }]);
});
describe("legacy bypass closure", () => {
  it("closes the legacy write endpoint without creating a history record", async () => {
    expect((await POST()).status).toBe(409);
    expect(m.create).not.toHaveBeenCalled();
  });
  it("does not read the legacy bank for an anonymous or expired account", async () => {
    const request = new NextRequest("https://example.test/api/question-bank?testId=tmua");
    m.auth.mockResolvedValue(null); expect((await GET(request)).status).toBe(401);
    m.auth.mockResolvedValue({ user: { id: "owner" } }); m.access.mockResolvedValue({ active: false });
    expect((await GET(request)).status).toBe(402); expect(m.published).not.toHaveBeenCalled();
  });
  it("returns no reference answers or hints even to an active member on the old endpoint", async () => {
    const response = await GET(new NextRequest("https://example.test/api/question-bank?testId=tmua"));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    const body = JSON.stringify(await response.json());
    expect(body).not.toContain("PRIVATE_"); expect(body).not.toContain('"answer":');
  });
});
