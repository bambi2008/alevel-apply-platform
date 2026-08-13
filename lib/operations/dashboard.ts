import { auth } from "@/auth";
import { db } from "@/lib/db";
import { checkLatestBackup, releaseName, runHealthChecks } from "@/lib/operations/health";

export async function getOperationsDashboardData() {
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (user?.role !== "ADMIN") throw new Error("forbidden");

  const [health, backup] = await Promise.all([runHealthChecks(), checkLatestBackup()]);
  const since = new Date(Date.now() - 24 * 60 * 60 * 1_000);
  const empty = { users: 0, examSessions: 0, operationalEvents: 0 };
  let activity = empty;
  let operationalEvents: Array<Record<string, unknown>> = [];
  let auditLogs: Array<Record<string, unknown>> = [];

  if (health.checks.database.status === "ok") {
    const [users, examSessions, operationalEventCount, events, audits] = await Promise.all([
      db.user.count({ where: { createdAt: { gte: since } } }),
      db.examSession.count({ where: { completedAt: { gte: since } } }),
      db.auditLog.count({ where: { createdAt: { gte: since }, action: { startsWith: "OPERATIONS_" } } }),
      db.auditLog.findMany({
        where: { action: { startsWith: "OPERATIONS_" } },
        orderBy: { createdAt: "desc" },
        take: 30,
        select: { id: true, action: true, entity: true, entityId: true, meta: true, createdAt: true },
      }),
      db.auditLog.findMany({
        where: { NOT: { action: { startsWith: "OPERATIONS_" } } },
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
          id: true,
          action: true,
          entity: true,
          entityId: true,
          meta: true,
          createdAt: true,
          actor: { select: { email: true, phone: true } },
        },
      }),
    ]);
    activity = { users, examSessions, operationalEvents: operationalEventCount };
    operationalEvents = events.map((event) => ({ ...event, createdAt: event.createdAt.toISOString() }));
    auditLogs = audits.map((event) => ({ ...event, createdAt: event.createdAt.toISOString() }));
  }

  return {
    status: health.healthy ? "healthy" : "degraded",
    checkedAt: new Date().toISOString(),
    release: releaseName(),
    uptimeSeconds: Math.round(process.uptime()),
    checks: health.checks,
    backup,
    activity,
    operationalEvents,
    auditLogs,
  };
}

export type OperationsDashboardData = Awaited<ReturnType<typeof getOperationsDashboardData>>;
