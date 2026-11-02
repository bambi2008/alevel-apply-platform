import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getContentPriorities } from "@/lib/tests/content-priority-server";
import { contentPrioritiesCsv } from "@/lib/tests/content-priority";

export async function GET(request: NextRequest) {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  try {
    const snapshot = await getContentPriorities();
    const testId = request.nextUrl.searchParams.get("testId");
    // Filter after scoring: another examination never changes relative scores.
    if (testId) snapshot.rows = snapshot.rows.filter(row => row.testId === testId);
    if (request.nextUrl.searchParams.get("format") === "csv") {
      const date = new Date(snapshot.generatedAt).toLocaleDateString("en-CA", { timeZone: "Asia/Shanghai" });
      return new NextResponse(contentPrioritiesCsv(snapshot, request.nextUrl.searchParams.get("locale") === "en"), {
        headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="question-priorities-${date}.csv"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" },
      });
    }
    return NextResponse.json(snapshot, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    // An unavailable database is not a zero-usage snapshot. No SQL/PII is logged.
    return NextResponse.json({ error: "data_unavailable" }, { status: 503, headers: { "Cache-Control": "private, no-store" } });
  }
}
