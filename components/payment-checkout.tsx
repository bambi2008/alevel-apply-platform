"use client";

import { useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { PaymentChannel, PaymentInstruction } from "@/lib/payments/provider";

function followInstruction(instruction: PaymentInstruction, returnPath: string) {
  if (instruction.channel === "wechat") {
    // WeChat H5 refreshes the originating page after returning from the app.
    window.history.replaceState(window.history.state, "", returnPath);
    window.location.assign(instruction.url);
    return;
  }
  const form = document.createElement("form");
  form.method = "post";
  form.action = instruction.action;
  for (const field of instruction.fields) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = field.name;
    input.value = field.value;
    form.append(input);
  }
  document.body.append(form);
  HTMLFormElement.prototype.submit.call(form);
}

export function PaymentCheckout({ locale, priceFen, months, termsVersion }: {
  locale: "en" | "zh-CN"; priceFen: number; months: number; termsVersion: string;
}) {
  const en = locale === "en";
  const [agreed, setAgreed] = useState(false);
  const [channel, setChannel] = useState<PaymentChannel>("alipay");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef<string | null>(null);
  const submitting = useRef(false);

  async function buy() {
    if (!agreed || submitting.current) return;
    submitting.current = true;
    setWorking(true);
    setError("");
    requestId.current ??= crypto.randomUUID();
    let leaving = false;
    try {
      const response = await fetch("/api/pay/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agreed, channel, requestId: requestId.current, locale, termsVersion, offer: `${priceFen}:${months}` }),
      });
      const data = await response.json() as { error?: string; returnPath?: string; instruction?: PaymentInstruction };
      if (!response.ok) {
        if (response.status === 502) requestId.current = null;
        setError(data.error ?? "checkout_failed");
        return;
      }
      if (!data.returnPath?.startsWith(`/${locale}/purchase/orders/`)) throw Error("invalid_checkout");
      if (data.instruction) followInstruction(data.instruction, data.returnPath);
      else window.location.assign(data.returnPath);
      leaving = true;
    } catch {
      setError("checkout_failed");
    } finally {
      if (!leaving) { submitting.current = false; setWorking(false); }
    }
  }

  return <form className="mt-5 space-y-5" onSubmit={event => { event.preventDefault(); void buy(); }}>
    <fieldset disabled={working} className="flex flex-wrap gap-4">
      <legend className="mb-2 text-sm font-semibold">{en ? "Payment method" : "付款方式"}</legend>
      <label className="flex min-h-11 items-center gap-2">
        <input type="radio" name="channel" checked={channel === "alipay"} onChange={() => setChannel("alipay")} />
        {en ? "Alipay" : "支付宝"}
      </label>
      <label className="flex min-h-11 items-center gap-2">
        <input type="radio" name="channel" checked={channel === "wechat"} onChange={() => setChannel("wechat")} />
        {en ? "WeChat Pay" : "微信支付"}
      </label>
    </fieldset>
    <div className="flex items-start gap-3">
      <input className="mt-1" id="purchase-agreement" type="checkbox" checked={agreed} disabled={working} onChange={event => setAgreed(event.target.checked)} />
      <div className="text-sm leading-6">
        <label htmlFor="purchase-agreement">{en ? "I have read and agree to the purchase terms and Terms of Service." : "我已阅读并同意《购买须知》和《用户协议》。"}</label>
        <p className="mt-1 flex flex-wrap gap-4">
          <Link href="/purchase/notice" target="_blank" rel="noopener" className="underline">{en ? "Purchase terms" : "购买须知"}</Link>
          <Link href="/terms" target="_blank" rel="noopener" className="underline">{en ? "Terms of Service" : "用户协议"}</Link>
        </p>
      </div>
    </div>
    <button className="btn btn-primary" type="submit" disabled={!agreed || working}>
      {working ? (en ? "Opening payment…" : "正在打开支付…") : en ? `Pay ¥${priceFen / 100}` : `支付 ¥${priceFen / 100}`}
    </button>
    {error && <p className="text-sm text-red-700" role="alert">{error === "offer_changed"
      ? (en ? "The offer or agreement changed. Reload this page to review it." : "价格或协议已更新，请刷新页面确认。")
      : error === "unauthenticated" ? (en ? "Sign in again before paying." : "请重新登录后付款。")
      : (en ? "Payment could not be opened. Check your order status if you already paid." : "暂时无法打开支付。如果你已付款，请先查看订单状态。")}</p>}
  </form>;
}
