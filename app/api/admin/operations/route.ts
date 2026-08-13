import { NextResponse } from "next/server";
import { getOperationsDashboardData } from "@/lib/operations/dashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getOperationsDashboardData(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Operations dashboard unavailable" }, { status: 503 });
  }
}
