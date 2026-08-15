const baseUrl = (process.env.BASE_URL ?? process.env.APP_ORIGIN ?? "https://beta.qiaoshenedu.com").replace(/\/$/, "");
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS ?? 15_000);

const routes = [
  "/zh-CN",
  "/zh-CN/tests",
  "/zh-CN/background",
  "/zh-CN/interview",
  "/zh-CN/statements",
];

async function request(path) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(`${baseUrl}${path}`, {
      redirect: "manual",
      signal: controller.signal,
      headers: { "user-agent": "qiaoshen-core-beta-smoke/1.0" },
    });
  } finally {
    clearTimeout(timeout);
  }
}

function requireStatus(label, response, predicate) {
  if (!predicate(response.status)) {
    throw new Error(`${label} returned HTTP ${response.status}`);
  }
  console.log(`[core-beta] ${label}: ${response.status}`);
}

const health = await request("/api/health");
requireStatus("health", health, (status) => status === 200);
const healthBody = await health.json();
if (healthBody.status !== "ok") throw new Error(`health status is ${healthBody.status ?? "missing"}`);

for (const route of routes) {
  const response = await request(route);
  requireStatus(route, response, (status) => status >= 200 && status < 400);
}

console.log(`[core-beta] smoke passed for ${baseUrl}`);
