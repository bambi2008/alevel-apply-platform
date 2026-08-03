import path from "node:path";
import {
  composeInvocation,
  nextState,
  parseArgs,
  readEnvFile,
  readReleaseState,
  run,
  waitForServiceHealth,
  withDeploymentLock,
  writeReleaseState,
} from "./deployment-common.mjs";

const { values, flags } = parseArgs(process.argv.slice(2));
if (!flags.has("confirm")) throw new Error("Rollback changes running services; pass --confirm");

const envFile = values["env-file"] ?? ".env.production";
const composeFiles = values.composeFiles ?? ["compose.production.yml"];
const stateDir = path.resolve(values["state-dir"] ?? ".deploy/production");
const healthTimeout = Number(values["health-timeout"] ?? 180) * 1_000;
const composeArgs = composeInvocation({ envFile, composeFiles });
const fileEnvironment = await readEnvFile(envFile);

await withDeploymentLock(stateDir, async () => {
  const state = await readReleaseState(stateDir);
  if (!state.current) throw new Error("No deployed release is recorded");

  const target = values.to
    ? state.history.find((item) => item.release === values.to || item.image === values.to)
    : state.previous;
  if (!target) throw new Error("No rollback target is available");
  if (target.image === state.current.image) throw new Error("Rollback target is already active");

  const currentEnv = {
    ...process.env,
    ...fileEnvironment,
    APP_IMAGE: state.current.image,
    APP_ENV_FILE: envFile,
    APP_RELEASE: state.current.release,
  };
  const targetImageId = await run(
    "docker",
    ["image", "inspect", "--format", "{{.Id}}", target.image],
    { env: currentEnv, capture: true },
  );
  if (target.imageId && target.imageId !== targetImageId) {
    throw new Error(`Rollback image tag drift detected for ${target.image}`);
  }
  await run("docker", [...composeArgs, "config", "--quiet"], { env: currentEnv });

  if (!flags.has("skip-backup")) {
    console.log("[rollback] creating encrypted backup before switching code");
    await run(
      "docker",
      [...composeArgs, "run", "--rm", "backup", "node", "scripts/backup-production.mjs"],
      { env: currentEnv },
    );
  }

  const targetEnv = { ...currentEnv, APP_IMAGE: target.image, APP_RELEASE: target.release };
  console.log(`[rollback] switching application from ${state.current.image} to ${target.image}`);
  await run("docker", [...composeArgs, "up", "-d", "--no-build"], { env: targetEnv });
  await waitForServiceHealth(composeArgs, targetEnv, healthTimeout);

  const rollbackRecord = {
    ...target,
    deployedAt: new Date().toISOString(),
    rollbackFrom: state.current.release,
  };
  await writeReleaseState(stateDir, nextState(state, rollbackRecord));
  console.log(`[rollback] ${target.image} is healthy; database schema was not reversed`);
});
