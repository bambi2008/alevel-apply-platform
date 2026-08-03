import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { releaseName } from "@/lib/operations/health";

export type OperationalSeverity = "INFO" | "WARNING" | "CRITICAL";

export type OperationalEventInput = {
  code: string;
  message: string;
  severity: OperationalSeverity;
  source: string;
  meta?: Record<string, unknown>;
};

const lastNotification = new Map<string, number>();
const lastPersistence = new Map<string, number>();
const REDACTED_KEY = /password|secret|token|authorization|cookie|session|key/i;

function safeMeta(value: unknown, key = ""): unknown {
  if (REDACTED_KEY.test(key)) return "[redacted]";
  if (typeof value === "string") return value.slice(0, 500);
  if (typeof value === "number" || typeof value === "boolean" || value === null) return value;
  if (Array.isArray(value)) return value.slice(0, 20).map((item) => safeMeta(item));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .slice(0, 30)
        .map(([childKey, child]) => [childKey, safeMeta(child, childKey)]),
    );
  }
  return String(value);
}

async function notifyWebhook(event: OperationalEventInput) {
  const url = process.env.OPERATIONS_ALERT_WEBHOOK_URL?.trim();
  if (!url) return;
  const fingerprint = `${event.source}:${event.code}`;
  const now = Date.now();
  const throttleMs = Number(process.env.OPERATIONS_ALERT_THROTTLE_MINUTES ?? 15) * 60_000;
  if (now - (lastNotification.get(fingerprint) ?? 0) < throttleMs) return;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5_000);
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const token = process.env.OPERATIONS_ALERT_WEBHOOK_TOKEN?.trim();
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(url, {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        service: "qiaoshen",
        release: releaseName(),
        occurredAt: new Date().toISOString(),
        ...event,
        meta: safeMeta(event.meta ?? {}),
      }),
    });
    if (!response.ok) {
      logger.warn("Operations alert webhook rejected event", { status: response.status, code: event.code });
    } else {
      lastNotification.set(fingerprint, now);
    }
  } catch (error) {
    logger.warn("Operations alert webhook failed", {
      code: event.code,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function reportOperationalEvent(event: OperationalEventInput): Promise<void> {
  const meta = safeMeta({ release: releaseName(), source: event.source, severity: event.severity, ...(event.meta ?? {}) });
  const log = event.severity === "CRITICAL" ? logger.error : event.severity === "WARNING" ? logger.warn : logger.info;
  log(event.message, { code: event.code, source: event.source, severity: event.severity });

  const fingerprint = `${event.source}:${event.code}`;
  const now = Date.now();
  const persistenceThrottleMs = Number(process.env.OPERATIONS_EVENT_THROTTLE_SECONDS ?? 60) * 1_000;
  const tasks: Promise<unknown>[] = [notifyWebhook(event)];
  if (now - (lastPersistence.get(fingerprint) ?? 0) >= persistenceThrottleMs) {
    lastPersistence.set(fingerprint, now);
    tasks.push(db.auditLog.create({
      data: {
        action: `OPERATIONS_${event.severity}`,
        entity: event.source,
        entityId: event.code,
        meta: { message: event.message.slice(0, 500), ...(meta as object) } as Prisma.InputJsonValue,
      },
    }));
  }
  await Promise.allSettled(tasks);
}
