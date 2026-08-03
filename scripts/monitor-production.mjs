import { pathToFileURL } from "node:url";

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function probeHealth(url, { attempts = 3, timeoutMs = 8_000, fetchImpl = fetch } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(url, { signal: controller.signal, headers: { Accept: "application/json" } });
      const body = await response.json();
      if (!response.ok || body.status !== "ok") {
        throw new Error(`health endpoint returned ${response.status} (${body.status ?? "unknown"})`);
      }
      return body;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await wait(2_000);
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("health probe failed");
}

async function sendFailureAlert(error, healthUrl) {
  const webhookUrl = process.env.OPERATIONS_ALERT_WEBHOOK_URL?.trim();
  if (!webhookUrl) return;
  const headers = { "Content-Type": "application/json" };
  if (process.env.OPERATIONS_ALERT_WEBHOOK_TOKEN) {
    headers.Authorization = `Bearer ${process.env.OPERATIONS_ALERT_WEBHOOK_TOKEN}`;
  }
  await fetch(webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      service: "qiaoshen",
      severity: "CRITICAL",
      source: "external-monitor",
      code: "UPTIME_CHECK_FAILED",
      message: error instanceof Error ? error.message : "Production health check failed",
      healthUrl,
      occurredAt: new Date().toISOString(),
    }),
  });
}

export async function main() {
  const healthUrl = process.env.MONITOR_HEALTH_URL
    || (process.env.APP_ORIGIN ? new URL("/api/health", process.env.APP_ORIGIN).toString() : "");
  if (!healthUrl) throw new Error("MONITOR_HEALTH_URL or APP_ORIGIN is required");
  try {
    const result = await probeHealth(healthUrl);
    console.log(JSON.stringify({ monitor: "ok", healthUrl, release: result.release, checkedAt: new Date().toISOString() }));
  } catch (error) {
    try {
      await sendFailureAlert(error, healthUrl);
    } catch (alertError) {
      console.error(`[monitor] alert delivery failed: ${alertError instanceof Error ? alertError.message : String(alertError)}`);
    }
    throw error;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`[monitor] ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
