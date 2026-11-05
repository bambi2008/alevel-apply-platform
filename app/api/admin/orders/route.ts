import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { csvCell, orderFilter, paymentAdmin } from "@/lib/payments/admin";
import { privateNoStore } from "@/lib/security/json-request";

export async function GET(request: NextRequest) {
  if (!await paymentAdmin()) return NextResponse.json({ error: "forbidden" }, { status: 403, headers: privateNoStore });
  const query = Object.fromEntries(request.nextUrl.searchParams);
  const en = query.locale === "en";
  const rows = await db.paymentOrder.findMany({
    where: orderFilter(query), orderBy: [{ createdAt: "desc" }, { id: "asc" }], take: 20_001,
    select: { outTradeNo: true, amountFen: true, status: true, payway: true, agreedAt: true, termsVersion: true,
      createdAt: true, paidAt: true, testPayment: true, _count: { select: { complaints: true } } },
  });
  if (rows.length > 20_000) return NextResponse.json({ error: "filter_export_range" }, { status: 413, headers: privateNoStore });
  const header = en ? ["Order", "Amount (fen)", "Status", "Channel", "Agreed (UTC)", "Agreement version", "Created (UTC)", "Paid (UTC)", "Test", "Complaint count"]
    : ["订单号", "金额（分）", "状态", "渠道", "同意时间（UTC）", "协议版本", "创建时间（UTC）", "付款时间（UTC）", "测试单", "投诉数"];
  const body = rows.map(row => [
    row.outTradeNo, row.amountFen, row.status, row.payway, row.agreedAt.toISOString(), row.termsVersion,
    row.createdAt.toISOString(), row.paidAt?.toISOString(), row.testPayment, row._count.complaints,
  ]);
  const csv = "\uFEFF" + [header, ...body].map(line => line.map(csvCell).join(",")).join("\r\n") + "\r\n";
  return new NextResponse(csv, { headers: { ...privateNoStore, "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": 'attachment; filename="qiaoshen-orders.csv"' } });
}
