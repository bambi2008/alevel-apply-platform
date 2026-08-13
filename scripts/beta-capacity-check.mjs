import { performance } from "node:perf_hooks";

const baseUrl = (process.env.BASE_URL || "http://127.0.0.1:3100").replace(/\/$/, "");
const virtualUsers = Number(process.env.BETA_VIRTUAL_USERS || 50);
const concurrency = Number(process.env.BETA_CONCURRENCY || 20);
const maxP95Ms = Number(process.env.BETA_MAX_P95_MS || 3500);
const cookie = process.env.BETA_CAPACITY_COOKIE;
const routes = ["/api/health", "/zh-CN/tests", "/zh-CN/tests/tmua"];

if (!Number.isInteger(virtualUsers) || virtualUsers < 1 || virtualUsers > 500) {
  throw new Error("BETA_VIRTUAL_USERS must be an integer between 1 and 500");
}
if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > virtualUsers) {
  throw new Error("BETA_CONCURRENCY must be between 1 and BETA_VIRTUAL_USERS");
}

const results = [];
let nextUser = 0;

async function request(path, user) {
  const started = performance.now();
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: {
        "user-agent": `qiaoshen-beta-capacity/${user}`,
        ...(cookie ? { cookie } : {}),
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
    await response.arrayBuffer();
    results.push({ path, status: response.status, ms: performance.now() - started });
  } catch (error) {
    results.push({ path, status: 0, ms: performance.now() - started, error: error instanceof Error ? error.message : String(error) });
  }
}

async function worker() {
  while (nextUser < virtualUsers) {
    const user = nextUser++;
    for (const path of routes) await request(path, user);
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));

const ordered = results.map((result) => result.ms).sort((a, b) => a - b);
const percentile = (fraction) => ordered[Math.min(ordered.length - 1, Math.ceil(ordered.length * fraction) - 1)] || 0;
const failures = results.filter((result) => result.status < 200 || result.status >= 400);
const summary = {
  baseUrl,
  virtualUsers,
  concurrency,
  requests: results.length,
  failures: failures.length,
  p50Ms: Math.round(percentile(0.5)),
  p95Ms: Math.round(percentile(0.95)),
  p99Ms: Math.round(percentile(0.99)),
};

console.log(JSON.stringify(summary, null, 2));
if (failures.length) {
  console.error("First failures:", failures.slice(0, 5));
}
if (failures.length > 0 || summary.p95Ms > maxP95Ms) {
  console.error(`Beta capacity gate failed: require 0 failures and p95 <= ${maxP95Ms}ms`);
  process.exit(1);
}
console.log("Beta capacity gate passed");
