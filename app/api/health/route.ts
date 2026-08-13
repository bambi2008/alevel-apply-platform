import { NextResponse } from "next/server";
import { reportOperationalEvent } from "@/lib/operations/events";
import { releaseName, runHealthChecks } from "@/lib/operations/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await runHealthChecks();
  if (!result.healthy) {
    void reportOperationalEvent({
      code: "READINESS_DEGRADED",
      message: "Application readiness check is degraded",
      severity: "CRITICAL",
      source: "health",
      meta: { checks: result.checks },
    });
  }

  return NextResponse.json(
    {
      status: result.healthy ? "ok" : "degraded",
      release: releaseName(),
      uptimeSeconds: Math.round(process.uptime()),
      checks: {
        database: { status: result.checks.database.status, latencyMs: result.checks.database.latencyMs },
        storage: { status: result.checks.storage.status, latencyMs: result.checks.storage.latencyMs },
      },
      timestamp: new Date().toISOString(),
    },
    {
      status: result.healthy ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
