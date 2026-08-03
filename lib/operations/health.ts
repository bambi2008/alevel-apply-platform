import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import { getStorage } from "@/lib/storage";

export type ServiceCheck = {
  status: "ok" | "error";
  latencyMs: number;
  message?: string;
};

export type BackupCheck = {
  status: "ok" | "stale" | "missing" | "disabled" | "error";
  ageHours: number | null;
  createdAt: string | null;
};

type HealthDependencies = {
  database?: () => Promise<unknown>;
  storage?: () => Promise<unknown>;
  timeoutMs?: number;
};

async function measure(label: string, action: () => Promise<unknown>, timeoutMs: number): Promise<ServiceCheck> {
  const startedAt = performance.now();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      action(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out`)), timeoutMs);
      }),
    ]);
    return { status: "ok", latencyMs: Math.round(performance.now() - startedAt) };
  } catch (error) {
    return {
      status: "error",
      latencyMs: Math.round(performance.now() - startedAt),
      message: error instanceof Error ? error.message : `${label} failed`,
    };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function runHealthChecks(dependencies: HealthDependencies = {}) {
  const timeoutMs = dependencies.timeoutMs ?? 4_000;
  const database = dependencies.database ?? (() => db.$queryRaw`SELECT 1`);
  const storage = dependencies.storage ?? (() => getStorage().healthcheck());
  const [databaseCheck, storageCheck] = await Promise.all([
    measure("database", database, timeoutMs),
    measure("storage", storage, timeoutMs),
  ]);
  return {
    healthy: databaseCheck.status === "ok" && storageCheck.status === "ok",
    checks: { database: databaseCheck, storage: storageCheck },
  };
}

export async function checkLatestBackup(now = new Date()): Promise<BackupCheck> {
  if (process.env.REQUIRE_BACKUPS === "false") {
    return { status: "disabled", ageHours: null, createdAt: null };
  }
  const backupRoot = process.env.BACKUP_DIR;
  if (!backupRoot) return { status: "missing", ageHours: null, createdAt: null };
  try {
    const backups = (await readdir(backupRoot, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory() && /^\d{8}T\d{6}Z$/.test(entry.name))
      .map((entry) => entry.name)
      .sort()
      .reverse();
    if (!backups[0]) return { status: "missing", ageHours: null, createdAt: null };
    const manifest = JSON.parse(await readFile(path.join(backupRoot, backups[0], "manifest.json"), "utf8")) as {
      createdAt?: string;
    };
    const createdAt = manifest.createdAt ? new Date(manifest.createdAt) : null;
    if (!createdAt || Number.isNaN(createdAt.getTime())) {
      return { status: "error", ageHours: null, createdAt: null };
    }
    const ageHours = Math.max(0, (now.getTime() - createdAt.getTime()) / 3_600_000);
    const maxAgeHours = Number(process.env.BACKUP_MAX_AGE_HOURS ?? 30);
    return {
      status: ageHours <= maxAgeHours ? "ok" : "stale",
      ageHours: Math.round(ageHours * 10) / 10,
      createdAt: createdAt.toISOString(),
    };
  } catch {
    return { status: "error", ageHours: null, createdAt: null };
  }
}

export function releaseName() {
  return process.env.APP_RELEASE || process.env.VERCEL_GIT_COMMIT_SHA || "local";
}
