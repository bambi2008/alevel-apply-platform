import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const m = vi.hoisted(() => ({ auth: vi.fn(), create: vi.fn(), provider: vi.fn(), checkout: vi.fn(), limit: vi.fn() }));
vi.mock("@/auth", () => ({ auth: m.auth }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/payments/mianbaoduo", () => ({ getPaymentProvider: m.provider }));
vi.mock("@/lib/payments/orders", () => ({ createOrder: m.create, publicOrder: (order: unknown) => order }));
vi.mock("@/lib/security/rate-limit", () => ({ rateLimitKey: (...parts: string[]) => parts.join(":"), consumePersistentRateLimit: m.limit }));
import { POST } from "@/app/api/pay/orders/route";
import { PURCHASE_TERMS_VERSION } from "@/lib/payments/config";

const payload = { agreed: true, requestId: "d2b6988f-f907-486a-81fb-871408048c68", termsVersion: PURCHASE_TERMS_VERSION,
  offer: "39900:3", channel: "alipay", locale: "en" };
function request(body: unknown) {
  return new NextRequest("https://example.test/api/pay/orders", { method: "POST", headers: {
    origin: "https://example.test", "content-type": "application/json", "user-agent": "iPhone Mobile",
  }, body: JSON.stringify(body) });
}
beforeEach(() => {
  vi.resetAllMocks();
  for (const [key, value] of Object.entries({ APP_ORIGIN: "https://example.test", PAYMENTS_ENABLED: "true", PAYMENTS_ADMIN_ONLY: "false",
    PAYMENT_PROVIDER: "mianbaoduo", MBD_APP_ID: "fixture", MBD_APP_KEY: "fixture", SEASON_PASS_PRICE_FEN: "39900", SEASON_PASS_MONTHS: "3" })) vi.stubEnv(key, value);
  m.auth.mockResolvedValue({ user: { id: "fixture-user", role: "STUDENT" } });
  m.provider.mockReturnValue({ createPayment: m.checkout });
  m.create.mockResolvedValue({ created: true, order: { id: "fixture-order", amountFen: 39900, outTradeNo: "qs" + "1".repeat(28) } });
  m.checkout.mockResolvedValue({ channel: "alipay", action: "https://openapi.alipay.com/gateway.do", fields: [] });
  m.limit.mockResolvedValue({ allowed: true });
});
afterEach(() => vi.unstubAllEnvs());

describe("checkout server agreement", () => {
  it("requires explicit agreement and rejects an extra client amount", async () => {
    expect((await POST(request({ ...payload, agreed: false }))).status).toBe(400);
    expect((await POST(request({ ...payload, amountFen: 1 }))).status).toBe(400);
    expect(m.create).not.toHaveBeenCalled();
    expect(m.checkout).not.toHaveBeenCalled();
  });
  it("rejects a stale displayed price or agreement version", async () => {
    expect((await POST(request({ ...payload, offer: "1:3" }))).status).toBe(409);
    expect((await POST(request({ ...payload, termsVersion: "old" }))).status).toBe(409);
    expect(m.create).not.toHaveBeenCalled();
  });
  it("cannot create an order while disabled or restricted to admins", async () => {
    vi.stubEnv("PAYMENTS_ENABLED", "false");
    expect((await POST(request(payload))).status).toBe(403);
    vi.stubEnv("PAYMENTS_ENABLED", "true"); vi.stubEnv("PAYMENTS_ADMIN_ONLY", "true");
    expect((await POST(request(payload))).status).toBe(403);
    expect(m.create).not.toHaveBeenCalled();
    expect(m.checkout).not.toHaveBeenCalled();
  });
  it("uses only the stored server amount and a local status URL", async () => {
    expect((await POST(request(payload))).status).toBe(201);
    expect(m.create).toHaveBeenCalledWith(expect.objectContaining({ userId: "fixture-user", priceFen: 39900, months: 3 }));
    expect(m.checkout).toHaveBeenCalledWith(expect.objectContaining({ amountFen: 39900, returnUrl: "https://example.test/en/purchase/orders/fixture-order" }));
  });
});
