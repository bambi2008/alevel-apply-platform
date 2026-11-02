import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";

/** 03:00 Asia/Shanghai, using UTC arithmetic independent of host timezone. */
export function nextRetentionRun(now = new Date()) {
  const next = new Date(now);
  next.setUTCHours(19, 0, 0, 0);
  if (next.getTime() <= now.getTime()) next.setUTCDate(next.getUTCDate() + 1);
  return next;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let timer, active;
  const schedule = () => { timer = setTimeout(run, nextRetentionRun().getTime() - Date.now()); };
  const run = () => {
    active = spawn(process.execPath, ["--import", "tsx", "scripts/run-study-retention.ts", "--apply"], { stdio: "inherit", windowsHide: true });
    active.once("error", () => { console.error('{"task":"study-retention","status":"worker-failed"}'); active = undefined; schedule(); });
    active.once("exit", () => { active = undefined; schedule(); });
  };
  const stop = () => { clearTimeout(timer); active?.kill("SIGTERM"); process.exit(0); };
  process.on("SIGTERM", stop); process.on("SIGINT", stop);
  schedule();
}
