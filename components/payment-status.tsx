"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

type Status = {
  id: string; status: "pending" | "paid" | "failed" | "closed"; amountFen: number;
  membershipEndsAt: string | null; canRecover: boolean;
};

export function PaymentStatus({ initial, en }: { initial: Status; en: boolean }) {
  const [order, setOrder] = useState(initial);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (initial.status !== "pending") return;
    const controller = new AbortController();
    const until = Date.now() + 15 * 60_000;
    let timeout: ReturnType<typeof setTimeout>;
    let requestedRecovery = false;
    const url = `/api/pay/orders/${encodeURIComponent(initial.id)}`;
    async function read() {
      try {
        const response = await fetch(url, { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw Error("read_failed");
        const latest: Status = await response.json();
        if (controller.signal.aborted) return;
        setOrder(latest);
        setError(false);
        if (latest.status !== "pending") return;
        if (latest.canRecover && !requestedRecovery) {
          requestedRecovery = true;
          await fetch(url, { method: "POST", signal: controller.signal });
        }
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
      if (!controller.signal.aborted && Date.now() < until) timeout = setTimeout(() => void read(), 5_000);
    }
    void read();
    return () => { controller.abort(); clearTimeout(timeout); };
  }, [initial.id, initial.status]);

  const expiry = order.membershipEndsAt
    ? new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(order.membershipEndsAt))
    : null;
  return <section className="mx-auto max-w-2xl px-5 py-12">
    <h1 className="text-3xl font-semibold">{en ? "Order status" : "订单状态"}</h1>
    <p className="mt-4 text-lg" role="status">{order.status === "paid"
      ? expiry ? (en ? `Payment confirmed. Exam Season Pass active until ${expiry} (Beijing time).` : `支付成功，考季卡已开通至 ${expiry}（北京时间）。`)
        : (en ? "Payment confirmed. Please contact us about access." : "付款已确认，请联系桥申查询权益。")
      : order.status === "pending" ? (en ? "Confirming your payment…" : "正在确认付款…")
      : (en ? "This checkout did not complete." : "本次付款流程未完成。")}</p>
    {error && <p className="mt-3 text-sm" role="alert">{en ? "Could not refresh. Reload to check again." : "暂时无法刷新状态，请重新加载页面。"}</p>}
    <p className="mt-3 text-sm">¥{order.amountFen / 100}</p>
    <Link href={order.status === "paid" ? "/account" : "/purchase"} className="mt-5 inline-block text-sm underline">{en ? "Back to QiaoShen" : "返回桥申"}</Link>
  </section>;
}
