import { execFileSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const needsAsciiDrive = process.platform === "win32" && /[^\x00-\x7f]/.test(cwd);

if (!needsAsciiDrive) {
  await import("./pg-server.mjs");
} else {
  const mappings = execFileSync("subst", [], { encoding: "utf8" });
  const existing = mappings
    .split(/\r?\n/)
    .map((line) => line.match(/^([A-Z]):\\: => (.+)$/i))
    .find((match) => match && path.resolve(match[2]) === path.resolve(cwd));

  let drive = existing?.[1]?.toUpperCase();
  let createdMapping = false;
  if (!drive) {
    drive = "ZYXWVUTSRQP".split("").find((letter) => !existsSync(`${letter}:\\`));
    if (!drive) throw new Error("No free drive letter is available for the local PostgreSQL launcher");
    execFileSync("subst", [`${drive}:`, cwd], { stdio: "inherit" });
    createdMapping = true;
  }

  const child = spawn(process.execPath, ["scripts/pg-server.mjs"], {
    cwd: `${drive}:\\`,
    stdio: "inherit",
    windowsHide: true,
  });
  let cleaned = false;
  const cleanup = () => {
    if (cleaned || !createdMapping) return;
    cleaned = true;
    try {
      execFileSync("subst", [`${drive}:`, "/D"], { stdio: "ignore" });
    } catch {
      // A later launch can safely reuse or replace the mapping.
    }
  };
  const stop = (signal) => {
    if (!child.killed) child.kill(signal);
  };
  process.on("SIGINT", () => stop("SIGINT"));
  process.on("SIGTERM", () => stop("SIGTERM"));
  child.once("error", (error) => {
    cleanup();
    console.error("[pg] failed to launch through an ASCII drive", error);
    process.exit(1);
  });
  child.once("exit", (code) => {
    cleanup();
    process.exit(code ?? 1);
  });
}
