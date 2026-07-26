import path from "node:path";
import {
  composeInvocation,
  nextState,
  parseArgs,
  readEnvFile,
  readReleaseState,
  run,
  validateReleaseName,
  waitForServiceHealth,
  withDeploymentLock,
  writeReleaseState,
} from "./deployment-common.mjs";

const { values, flags } = parseArgs(process.argv.slice(2));
if (!flags.has("confirm")) {
  throw new Error("Deployment changes running services; pass --confirm");
}

const release = validateReleaseName(values.release);
const envFile = values["env-file"] ?? ".env.production";
const composeFiles = values.composeFiles ?? ["compose.production.yml"];
const stateDir = path.resolve(values["state-dir"] ?? ".deploy/production");
const image = values.image ?? `qiaoshen-app:${release}`;
const healthTimeout = Number(values["health-timeout"] ?? 180) * 1_000;
if (!Number.isFinite(healthTimeout) || healthTimeout < 10_000) {
  throw new Error("--health-timeout must be at least 10 seconds");
}

const composeArgs = composeInvocation({ envFile, composeFiles });
const fileEnvironment = await readEnvFile(envFile);

await withDeploymentLock(stateDir, async () => {
  const state = await readReleaseState(stateDir);
  const previousImage = state.current?.image;
  const releaseEnv = {
    ...process.env,
    ...fileEnvironment,
    APP_IMAGE: image,
    APP_ENV_FILE: envFile,
  };

  console.log(`[deploy] validating compose configuration for ${release}`);
  await run("docker", [...composeArgs, "config", "--quiet"], { env: releaseEnv });

  if (!flags.has("no-build")) {
    console.log(`[deploy] building immutable image ${image}`);
    await run("docker", [...composeArgs, "build", "app"], { env: releaseEnv });
  } else {
    await run("docker", ["image", "inspect", image], { env: releaseEnv, capture: true });
  }
  const imageId = await run(
    "docker",
    ["image", "inspect", "--format", "{{.Id}}", image],
    { env: releaseEnv, capture: true },
  );
  const releaseRecord = {
    release,
    image,
    imageId,
    deployedAt: new Date().toISOString(),
  };

  await run(
    "docker",
    [...composeArgs, "run", "--rm", "--no-deps", "app", "pnpm", "preflight:production"],
    { env: releaseEnv },
  );

  const existingApp = await run(
    "docker",
    [...composeArgs, "ps", "--quiet", "app"],
    { env: releaseEnv, capture: true },
  );
  if (existingApp && !flags.has("skip-backup")) {
    const backupEnv = {
      ...releaseEnv,
      APP_IMAGE: previousImage ?? process.env.APP_IMAGE ?? "qiaoshen-app:local",
    };
    console.log("[deploy] creating encrypted pre-deployment backup");
    await run(
      "docker",
      [...composeArgs, "run", "--rm", "backup", "node", "scripts/backup-production.mjs"],
      { env: backupEnv },
    );
  }

  console.log("[deploy] applying forward-only database migrations");
  await run("docker", [...composeArgs, "up", "-d", "postgres"], { env: releaseEnv });
  await run(
    "docker",
    [...composeArgs, "run", "--rm", "app", "pnpm", "exec", "prisma", "migrate", "deploy"],
    { env: releaseEnv },
  );

  try {
    console.log(`[deploy] switching services to ${image}`);
    await run("docker", [...composeArgs, "up", "-d", "--no-build"], { env: releaseEnv });
    await waitForServiceHealth(composeArgs, releaseEnv, healthTimeout);
  } catch (error) {
    if (!previousImage) throw error;
    console.error(`[deploy] release unhealthy; automatically returning to ${previousImage}`);
    const rollbackEnv = { ...releaseEnv, APP_IMAGE: previousImage };
    await run("docker", [...composeArgs, "up", "-d", "--no-build"], { env: rollbackEnv });
    await waitForServiceHealth(composeArgs, rollbackEnv, healthTimeout);
    throw new AggregateError([error], `Release ${release} failed and application image was rolled back`);
  }

  await writeReleaseState(stateDir, nextState(state, releaseRecord));
  console.log(`[deploy] release ${release} is healthy`);
});
