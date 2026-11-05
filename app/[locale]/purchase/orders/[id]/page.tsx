import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { publicOrder } from "@/lib/payments/orders";
import { PaymentStatus } from "@/components/payment-status";

export default async function OrderStatusPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const [{ locale, id }, session] = await Promise.all([params, auth()]);
  if (!session) redirect(`/${locale}/login?next=${encodeURIComponent(`purchase/orders/${id}`)}`);
  const order = id.length <= 100 && await db.paymentOrder.findFirst({ where: { id, userId: session.user.id } });
  if (!order) notFound();
  const initial = publicOrder(order);
  return <PaymentStatus initial={{ ...initial, membershipEndsAt: initial.membershipEndsAt?.toISOString() ?? null }} en={locale === "en"} />;
}
