import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getQuestionAuditDashboardData } from "@/lib/tests/audit/server";

export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(await getQuestionAuditDashboardData());
}
