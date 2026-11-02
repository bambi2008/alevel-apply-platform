import { spawn } from "node:child_process";

function command(program, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(program, args, { stdio: "inherit", shell: process.platform === "win32" });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`${program} exited with ${code}`)));
  });
}

await command(process.execPath, ["scripts/check-production-env.mjs"]);
await command("pnpm", ["exec", "prisma", "migrate", "deploy"]);

const server = spawn("pnpm", ["start"], { stdio: "inherit", shell: process.platform === "win32" });
// Runtime worker is deliberately not executed by builds or local verification.
// The first purge occurs at the next daily schedule, never during deployment.
const retention = process.env.DATA_RETENTION_ENABLED === "false" ? null
  : spawn(process.execPath, ["scripts/study-retention-worker.mjs"], { stdio: "inherit", windowsHide: true });
const stop = (signal) => {
  if (!server.killed) server.kill(signal);
  retention?.kill(signal);
};
process.on("SIGTERM", () => stop("SIGTERM"));
process.on("SIGINT", () => stop("SIGINT"));
server.once("exit", (code) => { retention?.kill("SIGTERM"); process.exit(code ?? 1); });
