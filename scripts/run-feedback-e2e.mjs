import { PrismaClient } from "@prisma/client";
import { spawn } from "node:child_process";
import path from "node:path";

// Never read application .env here. Only an explicit loopback PostgreSQL test
// service may create this uniquely named disposable database.
const adminUrl = new URL(process.env.LOCAL_TEST_POSTGRES_URL ?? "postgresql://postgres:postgres@127.0.0.1:5433/postgres");
if (!["localhost", "127.0.0.1"].includes(adminUrl.hostname) || adminUrl.pathname !== "/postgres") throw Error("Only loopback test PostgreSQL is permitted");
const databaseName = `qiaoshen_feedback_${Date.now()}_e2e`;
if (!/^qiaoshen_feedback_\d+_e2e$/.test(databaseName)) throw Error("Invalid disposable database target");
const targetUrl = new URL(adminUrl); targetUrl.pathname = `/${databaseName}`;
const admin = new PrismaClient({ datasources: { db: { url: adminUrl.toString() } }, log: [] });
function run(args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { env, stdio: "inherit", windowsHide: true });
    child.once("error", reject); child.once("exit", code => code === 0 ? resolve() : reject(Error(`Test process exited ${code}`)));
  });
}
let created = false;
try {
  await admin.$executeRawUnsafe(`CREATE DATABASE "${databaseName}"`); created = true;
  const env = { ...process.env, DATABASE_URL: targetUrl.toString(), REGISTRATION_MODE: "invite", E2E_PORT: "3136", E2E_USE_PRODUCTION: "true", APP_ORIGIN: "http://127.0.0.1:3136", AUTH_SECRET: "feedback-fixture-local-only-not-a-production-secret", NEXT_DIST_DIR: `.next-feedback-e2e-${databaseName}`, NEXT_PUBLIC_PHONE_AUTH_ENABLED: "false", DATA_RETENTION_ENABLED: "false", STORAGE_DRIVER: "local", ALLOW_LOCAL_STORAGE_IN_PRODUCTION: "true", LOCAL_STORAGE_PATH: path.resolve("tmp", databaseName + "-storage") };
  await run(["node_modules/prisma/build/index.js", "migrate", "deploy"], env);
  // Production output has the complete route registry. Do not test against a
  // shared dev cache or mistake cold dynamic-route compilation for an app 404.
  await run(["node_modules/next/dist/bin/next", "build"], env);
  await run(["node_modules/@playwright/test/cli.js", "test", "tests/e2e/question-feedback.spec.ts", "--project=chromium-desktop", "--workers=1"], env);
} finally {
  if (created) {
    // Recheck the exact target immediately before dropping only our fixture DB.
    if (targetUrl.hostname !== adminUrl.hostname || targetUrl.pathname !== `/${databaseName}` || !/^qiaoshen_feedback_\d+_e2e$/.test(databaseName)) throw Error("Unsafe cleanup target");
    await admin.$executeRawUnsafe(`DROP DATABASE "${databaseName}" WITH (FORCE)`);
    console.log("[feedback-e2e] disposable fixture database removed; production untouched");
  }
  await admin.$disconnect();
}
