import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isConfiguredAdmin } from "@/lib/admin/allowlist";
import { getQuestionAuditDashboardData } from "@/lib/tests/audit/server";

export async function GET() {
  const session = await auth();
  if (!isConfiguredAdmin(session?.user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(await getQuestionAuditDashboardData());
}
