import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { alipayInstruction, MianbaoduoProvider, mianbaoduoSign } from "@/lib/payments/mianbaoduo";
import { paymentOffer } from "@/lib/payments/config";

describe("payment adapter boundaries", () => {
  it("signs scalar fields using ASCII key order and ignores empty fields", () => {
    expect(mianbaoduoSign({ out_trade_no: "qs01", amount_total: 39900, app_id: "sample", sign: "ignored", empty: "" }, "test"))
      .toBe(createHash("md5").update("amount_total=39900&app_id=sample&out_trade_no=qs01&key=test").digest("hex"));
  });

  it("rejects an invalid supplied webhook signature and sends no order query", () => {
    const transport = vi.fn();
    const provider = new MianbaoduoProvider("fixture", "fixture", transport);
    expect(provider.verifyNotification({ type: "charge_succeeded", data: { amount: 1, sign: "invalid" } })).toBe(false);
    expect(transport).not.toHaveBeenCalled();
  });

  it("reconstructs a native Alipay form without provider HTML or script", () => {
    const valid = "<form method='POST' action='https://openapi.alipay.com/gateway.do?charset=UTF-8'><input type='hidden' name='method' value='alipay.trade.wap.pay'/><input type='hidden' name='biz_content' value='{&quot;id&quot;:1}'/><input type='hidden' name='sign' value='sample'/></form><script>bad()</script>";
    expect(alipayInstruction(valid)).toEqual({ channel: "alipay", action: "https://openapi.alipay.com/gateway.do?charset=UTF-8",
      fields: [{ name: "method", value: "alipay.trade.wap.pay" }, { name: "biz_content", value: '{"id":1}' }, { name: "sign", value: "sample" }] });
    expect(() => alipayInstruction(valid.replace("openapi.alipay.com", "openapi.alipay.com.invalid"))).toThrow("provider_form_invalid");
  });

  it("requires enabled payments, allowlisted admin and an explicit amount for test checkout", () => {
    const admin = { role: "ADMIN", email: "admin@example.test" };
    expect(paymentOffer(admin).enabled).toBe(false);
    const env = { ...process.env, PAYMENTS_ENABLED: "true", PAYMENTS_ADMIN_ONLY: "true", PAYMENT_PROVIDER: "mianbaoduo",
      PAYMENT_TEST_AMOUNT_FEN: "2", ADMIN_EMAILS: admin.email, MBD_APP_ID: "fixture", MBD_APP_KEY: "fixture", APP_ORIGIN: "https://example.test" };
    expect(paymentOffer(admin, env)).toMatchObject({ enabled: true, priceFen: 2, testPayment: true });
    expect(paymentOffer({ ...admin, role: "STUDENT" }, env).enabled).toBe(false);
    expect(paymentOffer(admin, { ...env, PAYMENTS_ENABLED: "false" }).enabled).toBe(false);
    expect(paymentOffer(admin, { ...env, PAYMENTS_ADMIN_ONLY: "false" })).toMatchObject({ enabled: true, priceFen: 39900, testPayment: false });
  });
});
