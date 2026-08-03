import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { checkLatestBackup, runHealthChecks } from "./health";

const originalBackupDir = process.env.BACKUP_DIR;
const originalRequireBackups = process.env.REQUIRE_BACKUPS;
const temporaryRoots: string[] = [];

afterEach(async () => {
  process.env.BACKUP_DIR = originalBackupDir;
  process.env.REQUIRE_BACKUPS = originalRequireBackups;
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("operations health checks", () => {
  it("reports dependency status and latency", async () => {
    const result = await runHealthChecks({ database: async () => 1, storage: async () => undefined });
    expect(result.healthy).toBe(true);
    expect(result.checks.database.status).toBe("ok");
    expect(result.checks.storage.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it("degrades without throwing when a dependency fails", async () => {
    const result = await runHealthChecks({
      database: async () => { throw new Error("offline"); },
      storage: async () => undefined,
    });
    expect(result.healthy).toBe(false);
    expect(result.checks.database).toMatchObject({ status: "error", message: "offline" });
  });

  it("detects a recent encrypted backup manifest", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "qiaoshen-health-"));
    temporaryRoots.push(root);
    const backup = path.join(root, "20260803T120000Z");
    await mkdir(backup);
    const now = new Date("2026-08-03T13:00:00.000Z");
    await writeFile(path.join(backup, "manifest.json"), JSON.stringify({ createdAt: "2026-08-03T12:00:00.000Z" }));
    process.env.BACKUP_DIR = root;
    process.env.REQUIRE_BACKUPS = "true";
    await expect(checkLatestBackup(now)).resolves.toMatchObject({ status: "ok", ageHours: 1 });
  });
});
