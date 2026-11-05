import { PrismaClient } from "@prisma/client";
import { spawn } from "node:child_process";

// Explicit loopback fixture service only; never load application .env.
const adminUrl = new URL(process.env.LOCAL_TEST_POSTGRES_URL ?? "postgresql://postgres:postgres@127.0.0.1:5433/postgres");
if (!["localhost", "127.0.0.1"].includes(adminUrl.hostname) || adminUrl.pathname !== "/postgres") throw Error("Only loopback test PostgreSQL is permitted");
const databaseName = `qiaoshen_membership_${Date.now()}_test`;
const target = new URL(adminUrl); target.pathname = `/${databaseName}`;
const admin = new PrismaClient({ datasources: { db: { url: adminUrl.toString() } }, log: [] });
function run(args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { env, stdio: "inherit", windowsHide: true });
    child.once("error", reject); child.once("exit", code => code === 0 ? resolve() : reject(Error(`Fixture process exited ${code}`)));
  });
}
let created = false;
try {
  await admin.$executeRawUnsafe(`CREATE DATABASE "${databaseName}"`); created = true;
  const env = { ...process.env, DATABASE_URL: target.toString(), MEMBERSHIP_TEST_DATABASE_URL: target.toString(), DATA_RETENTION_ENABLED: "false", TRIAL_PROGRAM_ENABLED: "false" };
  await run(["node_modules/prisma/build/index.js", "migrate", "deploy"], env);
  await run(["node_modules/vitest/vitest.mjs", "run", "tests/unit/membership-postgres.test.ts", "--reporter=dot"], env);
} finally {
  if (created) {
    if (target.hostname !== adminUrl.hostname || target.pathname !== `/${databaseName}` || !/^qiaoshen_membership_\d+_test$/.test(databaseName)) throw Error("Unsafe fixture cleanup target");
    await admin.$executeRawUnsafe(`DROP DATABASE "${databaseName}" WITH (FORCE)`);
    console.log("[membership] removed only the disposable fixture database");
  }
  await admin.$disconnect();
}
