import { createHash, timingSafeEqual } from "node:crypto";
import type { PaymentChannel, PaymentInstruction, PaymentNotification, PaymentProvider, ProviderOrder } from "./provider";

const endpoint = "https://newapi.mbd.pub/release";
type Scalar = string | number;
const tradeNumber = /^qs[a-f0-9]{28}$/;
const chargeNumber = /^[a-zA-Z0-9_-]{1,100}$/;

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function integer(value: unknown): number | null {
  if (typeof value !== "number" && (typeof value !== "string" || !/^\d+$/.test(value))) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= 0 ? number : null;
}

function payway(value: unknown): PaymentChannel | undefined {
  const number = integer(value);
  return number === 1 ? "wechat" : number === 2 ? "alipay" : undefined;
}

export function mianbaoduoSign(parameters: Record<string, Scalar>, secret: string) {
  const encoded = Object.keys(parameters).filter(key => key !== "sign" && parameters[key] !== "")
    .sort().map(key => `${key}=${parameters[key]}`).join("&");
  return createHash("md5").update(`${encoded}&key=${secret}`, "utf8").digest("hex");
}

function verifies(parameters: Record<string, unknown>, sign: unknown, secret: string) {
  if (typeof sign !== "string" || !/^[a-f0-9]{32}$/i.test(sign)) return false;
  const signedFields = Object.entries(parameters).filter(([key, value]) => key !== "sign" && value !== null && value !== undefined);
  if (signedFields.some(([, value]) => typeof value !== "string" && typeof value !== "number")) return false;
  const expected = mianbaoduoSign(Object.fromEntries(signedFields) as Record<string, Scalar>, secret);
  return timingSafeEqual(Buffer.from(sign, "hex"), Buffer.from(expected, "hex"));
}

function decodeAttribute(value: string) {
  return value.replace(/&(?:amp|quot|apos|lt|gt|#39|#x27);/gi, entity => ({
    "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">", "&#39;": "'", "&#x27;": "'",
  })[entity.toLowerCase()] ?? entity);
}

function attribute(tag: string, name: string) {
  const match = new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i").exec(tag);
  return match ? decodeAttribute(match[1] ?? match[2]) : undefined;
}

/** Rebuild a narrow native form. Provider HTML and scripts never reach the DOM. */
export function alipayInstruction(body: string): PaymentInstruction {
  if (body.length > 65_536) throw Error("provider_form_invalid");
  const form = /<form\b[^>]*>([\s\S]*?)<\/form\s*>/i.exec(body);
  const action = form && attribute(form[0].slice(0, form[0].indexOf(">") + 1), "action");
  if (!action) throw Error("provider_form_invalid");
  const destination = new URL(action);
  if (destination.origin !== "https://openapi.alipay.com" || destination.pathname !== "/gateway.do" || destination.username || destination.password) throw Error("provider_form_invalid");
  const fields: Array<{ name: string; value: string }> = [];
  const inputTag = /<input\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;
  for (const match of form[1].matchAll(inputTag)) {
    if (attribute(match[0], "type")?.toLowerCase() !== "hidden") continue;
    const name = attribute(match[0], "name"), value = attribute(match[0], "value");
    if (!name || !/^[a-z_]{1,40}$/.test(name) || value === undefined || fields.some(field => field.name === name)) throw Error("provider_form_invalid");
    fields.push({ name, value });
  }
  if (fields.length > 30 || !fields.some(field => field.name === "method" && field.value === "alipay.trade.wap.pay")
    || !["biz_content", "sign"].every(name => fields.some(field => field.name === name && field.value))) throw Error("provider_form_invalid");
  return { channel: "alipay", action: destination.href, fields };
}

export class MianbaoduoProvider implements PaymentProvider {
  constructor(private appId: string, private secret: string, private transport: typeof fetch = fetch) {}

  private async post(path: string, fields: Record<string, Scalar>) {
    const data = { ...fields, app_id: this.appId };
    const response = await this.transport(`${endpoint}/${path}`, {
      method: "POST", redirect: "error", cache: "no-store", signal: AbortSignal.timeout(10_000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, sign: mianbaoduoSign(data, this.secret) }),
    });
    if (!response.ok) throw Error("provider_unavailable");
    const body = record(await response.json());
    if (!body) throw Error("provider_invalid_response");
    return body;
  }

  async createPayment(order: Parameters<PaymentProvider["createPayment"]>[0]): Promise<PaymentInstruction> {
    const common = { description: "桥申考季卡", out_trade_no: order.outTradeNo, amount_total: order.amountFen };
    if (order.channel === "alipay") {
      const body = await this.post("alipay/pay", { ...common, url: order.returnUrl, callback_url: order.returnUrl });
      if (body.error || typeof body.body !== "string") throw Error("provider_checkout_failed");
      return alipayInstruction(body.body);
    }
    const body = await this.post("wx/prepay", { ...common, channel: "h5" });
    if (body.error || typeof body.h5_url !== "string") throw Error("provider_checkout_failed");
    const url = new URL(body.h5_url);
    if (url.origin !== "https://wx.tenpay.com" || url.username || url.password) throw Error("provider_checkout_failed");
    return { channel: "wechat", url: url.href };
  }

  verifyNotification(payload: unknown) {
    const outer = record(payload), data = record(outer?.data);
    if (!outer || !data) return false;
    if ("sign" in data && !verifies(data, data.sign, this.secret)) return false;
    if ("sign" in outer && !verifies({ ...data, type: outer.type }, outer.sign, this.secret)) return false;
    // Unsigned notifications are documented. Fulfilment always re-queries.
    return true;
  }

  parseNotification(payload: unknown): PaymentNotification | null {
    const outer = record(payload), data = record(outer?.data);
    if (!data || (outer?.type !== "charge_succeeded" && outer?.type !== "complaint")) return null;
    const amountFen = integer(data.amount);
    if (typeof data.out_trade_no !== "string" || !tradeNumber.test(data.out_trade_no) || amountFen === null || amountFen < 1) return null;
    const common = { outTradeNo: data.out_trade_no, amountFen };
    if (outer.type === "complaint") {
      if (typeof data.complaint_detail !== "string" || !data.complaint_detail.trim() || data.complaint_detail.length > 2_000) return null;
      const phone = typeof data.payer_phone === "string" && /^\+?[\d -]{5,25}$/.test(data.payer_phone) ? data.payer_phone : undefined;
      return { ...common, type: "complaint", detail: data.complaint_detail, payerPhone: phone };
    }
    const channel = payway(data.payway);
    if (!channel || typeof data.charge_id !== "string" || !chargeNumber.test(data.charge_id)) return null;
    return { ...common, type: "charge_succeeded", chargeId: data.charge_id, payway: channel };
  }

  async queryOrder(outTradeNo: string): Promise<ProviderOrder | null> {
    if (!tradeNumber.test(outTradeNo)) return null;
    const body = await this.post("main/search_order", { out_trade_no: outTradeNo });
    if (body.error) {
      if (body.error === "找不到该订单") return null;
      throw Error("provider_query_failed");
    }
    const amountFen = integer(body.amount), state = integer(body.state), refundState = integer(body.refund_state);
    const refundAmount = integer(body.refund_amount), channel = payway(body.payway);
    const seconds = integer(body.create_time);
    if (amountFen === null || state === null) throw Error("provider_query_invalid");
    if (state === 0) return null;
    if (refundState === null || refundAmount === null || !channel || typeof body.charge_id !== "string" || !chargeNumber.test(body.charge_id)) throw Error("provider_query_invalid");
    if (body.out_trade_no !== undefined && body.out_trade_no !== outTradeNo) throw Error("provider_query_mismatch");
    return { amountFen, state, refundState, refundAmount, payway: channel, chargeId: body.charge_id,
      paidAt: seconds && seconds < 4_102_444_800 ? new Date(seconds * 1000) : null };
  }
}

export function getPaymentProvider(env = process.env): PaymentProvider | null {
  const appId = env.MBD_APP_ID?.trim(), key = env.MBD_APP_KEY?.trim();
  return env.PAYMENT_PROVIDER === "mianbaoduo" && appId && key ? new MianbaoduoProvider(appId, key) : null;
}
