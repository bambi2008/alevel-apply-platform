import { open, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

export function parseArgs(argv) {
  const values = {};
  const flags = new Set();
  const valueOptions = new Set([
    "release",
    "compose-file",
    "env-file",
    "state-dir",
    "image",
    "health-timeout",
    "to",
    "backup-dir",
  ]);
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    if (["confirm", "skip-backup", "no-build", "skip-e2e"].includes(key)) {
      flags.add(key);
      continue;
    }
    if (!valueOptions.has(key)) throw new Error(`Unknown option: --${key}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for --${key}`);
    index += 1;
    if (key === "compose-file") {
      values.composeFiles = [...(values.composeFiles ?? []), value];
    } else {
      values[key] = value;
    }
  }
  return { values, flags };
}

export function validateReleaseName(value) {
  if (!/^[a-z0-9][a-z0-9._-]{0,63}$/i.test(value ?? "")) {
    throw new Error("Release must be 1-64 characters using letters, numbers, dot, underscore or hyphen");
  }
  return value;
}

export function composeInvocation({ envFile, composeFiles }) {
  return [
    "compose",
    "--env-file",
    envFile,
    ...composeFiles.flatMap((file) => ["-f", file]),
  ];
}

export function run(program, args, { env = process.env, capture = false } = {}) {
  return new Promise((resolve, reject) => {
    const stdout = [];
    const requiresCommandShell = process.platform === "win32" && program === "pnpm";
    const child = spawn(program, args, {
      env,
      shell: requiresCommandShell,
      stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit",
    });
    if (capture) child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolve(capture ? Buffer.concat(stdout).toString("utf8").trim() : "");
      else reject(new Error(`${program} ${args.join(" ")} exited with ${code}`));
    });
  });
}

export async function readEnvFile(file) {
  const source = await readFile(file, "utf8");
  const parsed = {};
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    parsed[key] = value;
  }
  return parsed;
}

export async function readReleaseState(stateDir) {
  try {
    return JSON.parse(await readFile(path.join(stateDir, "release-state.json"), "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return { schemaVersion: 1, current: null, previous: null, history: [] };
    throw error;
  }
}

export async function writeReleaseState(stateDir, state) {
  await mkdir(stateDir, { recursive: true });
  const temporary = path.join(stateDir, `.release-state-${process.pid}.tmp`);
  await writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, { flag: "wx" });
  await rename(temporary, path.join(stateDir, "release-state.json"));
}

export async function withDeploymentLock(stateDir, action) {
  await mkdir(stateDir, { recursive: true });
  const lockPath = path.join(stateDir, "deployment.lock");
  let handle;
  try {
    handle = await open(lockPath, "wx");
    await handle.writeFile(`${process.pid}\n`);
  } catch (error) {
    if (error?.code === "EEXIST") throw new Error(`Another deployment is active: ${lockPath}`);
    throw error;
  }
  try {
    return await action();
  } finally {
    await handle.close();
    await rm(lockPath, { force: true });
  }
}

export async function waitForServiceHealth(composeArgs, env, timeoutMs = 180_000) {
  const startedAt = Date.now();
  let lastStatus = "container-not-created";
  while (Date.now() - startedAt < timeoutMs) {
    const containerId = await run(
      "docker",
      [...composeArgs, "ps", "--quiet", "app"],
      { env, capture: true },
    );
    if (containerId) {
      lastStatus = await run(
        "docker",
        ["inspect", "--format", "{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}", containerId],
        { env, capture: true },
      );
      if (lastStatus === "healthy") return;
      if (["unhealthy", "exited", "dead"].includes(lastStatus)) {
        throw new Error(`Application container entered ${lastStatus} state`);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 2_000));
  }
  throw new Error(`Application health check timed out; last status: ${lastStatus}`);
}

export function nextState(state, release) {
  const history = [release, ...(state.history ?? [])]
    .filter((item, index, items) => items.findIndex((candidate) => candidate.image === item.image) === index)
    .slice(0, 20);
  return {
    schemaVersion: 1,
    current: release,
    previous: state.current,
    history,
  };
}
