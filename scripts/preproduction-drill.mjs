import { readdir } from "node:fs/promises";
import path from "node:path";
import {
  composeInvocation,
  parseArgs,
  readEnvFile,
  readReleaseState,
  run,
  validateReleaseName,
} from "./deployment-common.mjs";

const { values, flags } = parseArgs(process.argv.slice(2));
const envFile = values["env-file"] ?? ".env.preproduction";
const composeFiles = values.composeFiles ?? [
  "compose.production.yml",
  "compose.preproduction.yml",
];
const stateDir = path.resolve(values["state-dir"] ?? ".deploy/preproduction");
const release = validateReleaseName(
  values.release ?? `drill-${new Date().toISOString().replace(/\D/g, "").slice(0, 14)}`,
);
const backupHostDir = path.resolve(values["backup-dir"] ?? "backups-preproduction");
const environment = await readEnvFile(envFile);
const composeArgs = composeInvocation({ envFile, composeFiles });

const deployArgs = [
  "scripts/deploy-release.mjs",
  "--release",
  release,
  "--env-file",
  envFile,
  "--state-dir",
  stateDir,
  "--confirm",
  ...composeFiles.flatMap((file) => ["--compose-file", file]),
];
if (flags.has("no-build")) deployArgs.push("--no-build");
if (flags.has("skip-backup")) deployArgs.push("--skip-backup");

console.log(`[drill] deploying isolated preproduction release ${release}`);
await run(process.execPath, deployArgs, {
  env: { ...process.env, ...environment },
});

const state = await readReleaseState(stateDir);
const drillEnv = {
  ...process.env,
  ...environment,
  APP_IMAGE: state.current.image,
  APP_ENV_FILE: envFile,
};

console.log("[drill] creating post-deployment encrypted backup");
await run(
  "docker",
  [...composeArgs, "run", "--rm", "backup", "node", "scripts/backup-production.mjs"],
  { env: drillEnv },
);

const backups = (await readdir(backupHostDir, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^\d{8}T\d{6}Z$/.test(entry.name))
  .map((entry) => entry.name)
  .sort()
  .reverse();
const latestBackup = backups[0];
if (!latestBackup) throw new Error(`No completed backup found in ${backupHostDir}`);

console.log(`[drill] verifying encrypted backup ${latestBackup}`);
await run(
  "docker",
  [
    ...composeArgs,
    "run",
    "--rm",
    "backup",
    "node",
    "scripts/restore-production.mjs",
    `/backups/${latestBackup}`,
    "--verify-only",
  ],
  { env: drillEnv },
);

console.log("[drill] restoring into disposable PostgreSQL and storage");
const profiledComposeArgs = [
  "compose",
  "--profile",
  "restore-drill",
  ...composeArgs.slice(1),
];
await run(
  "docker",
  [...profiledComposeArgs, "up", "-d", "restore-db"],
  { env: drillEnv },
);
try {
  let ready = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      await run(
        "docker",
        [
          ...profiledComposeArgs,
          "exec",
          "-T",
          "restore-db",
          "pg_isready",
          "-U",
          environment.POSTGRES_USER,
          "-d",
          environment.POSTGRES_DB,
        ],
        { env: drillEnv, capture: true },
      );
      ready = true;
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1_000));
    }
  }
  if (!ready) throw new Error("Disposable restore database did not become ready");

  const restoreUrl = new URL(environment.DATABASE_URL);
  restoreUrl.hostname = "restore-db";
  restoreUrl.port = "5432";
  const restoreEnv = {
    ...drillEnv,
    DATABASE_URL: restoreUrl.toString(),
    LOCAL_STORAGE_PATH: "/tmp/restore-storage",
  };
  await run(
    "docker",
    [
      ...profiledComposeArgs,
      "run",
      "--rm",
      "-e",
      "DATABASE_URL",
      "-e",
      "LOCAL_STORAGE_PATH",
      "app",
      "node",
      "scripts/restore-production.mjs",
      `/backups/${latestBackup}`,
      "--confirm",
    ],
    { env: restoreEnv },
  );

  const migrationCount = Number(await run(
    "docker",
    [
      ...profiledComposeArgs,
      "exec",
      "-T",
      "restore-db",
      "psql",
      "-U",
      environment.POSTGRES_USER,
      "-d",
      environment.POSTGRES_DB,
      "-tAc",
      'SELECT count(*) FROM "_prisma_migrations";',
    ],
    { env: drillEnv, capture: true },
  ));
  if (!Number.isInteger(migrationCount) || migrationCount < 1) {
    throw new Error("Restored database does not contain migration history");
  }
  console.log(`[drill] disposable restore contains ${migrationCount} applied migrations`);
} finally {
  await run(
    "docker",
    [...profiledComposeArgs, "rm", "-sf", "restore-db"],
    { env: drillEnv },
  );
}

if (!flags.has("skip-e2e")) {
  const baseUrl = environment.APP_ORIGIN;
  const hostDatabaseUrl = new URL(environment.DATABASE_URL);
  hostDatabaseUrl.hostname = "127.0.0.1";
  hostDatabaseUrl.port = environment.PREPRODUCTION_DB_PORT ?? "5434";
  console.log(`[drill] running browser acceptance suite against ${baseUrl}`);
  await run(
    "pnpm",
    ["test:e2e"],
    {
      env: {
        ...process.env,
        E2E_BASE_URL: baseUrl,
        DATABASE_URL: hostDatabaseUrl.toString(),
      },
    },
  );
}

console.log(`[drill] passed for release ${release}; backup ${latestBackup} is restorable`);
