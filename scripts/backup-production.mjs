import { mkdir, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { encryptFile, sha256 } from "./backup-crypto.mjs";

function run(program, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(program, args, { stdio: "inherit", ...options });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`${program} exited with ${code}`)));
  });
}

function timestamp(date = new Date()) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

const databaseUrl = process.env.DATABASE_URL;
const backupRoot = process.env.BACKUP_DIR;
const storagePath = process.env.LOCAL_STORAGE_PATH;
const key = Buffer.from(process.env.BACKUP_ENCRYPTION_KEY ?? "", "base64");
if (!databaseUrl || !backupRoot || !storagePath || key.length !== 32) {
  throw new Error("DATABASE_URL, BACKUP_DIR, LOCAL_STORAGE_PATH and a 32-byte BACKUP_ENCRYPTION_KEY are required");
}
if (!path.isAbsolute(backupRoot) || !path.isAbsolute(storagePath)) throw new Error("Backup and storage paths must be absolute");
const relativeBackup = path.relative(storagePath, backupRoot);
const relativeStorage = path.relative(backupRoot, storagePath);
if (
  relativeBackup === ""
  || (!relativeBackup.startsWith("..") && !path.isAbsolute(relativeBackup))
  || (!relativeStorage.startsWith("..") && !path.isAbsolute(relativeStorage))
) {
  throw new Error("BACKUP_DIR and LOCAL_STORAGE_PATH must be separate, non-nested paths");
}

await mkdir(backupRoot, { recursive: true });
const id = timestamp();
const staging = path.join(backupRoot, `.staging-${id}-${process.pid}`);
const destination = path.join(backupRoot, id);
await mkdir(staging, { recursive: false });

try {
  const databaseDump = path.join(staging, "database.dump");
  const storageArchive = path.join(staging, "storage.tgz");
  await run("pg_dump", ["--dbname", databaseUrl, "--format=custom", "--no-owner", "--file", databaseDump]);

  const storageParent = path.dirname(storagePath);
  const storageName = path.basename(storagePath);
  await mkdir(storagePath, { recursive: true });
  await run("tar", ["-czf", storageArchive, "-C", storageParent, storageName]);

  const encryptedDatabase = `${databaseDump}.enc`;
  const encryptedStorage = `${storageArchive}.enc`;
  await encryptFile(databaseDump, encryptedDatabase, key);
  await encryptFile(storageArchive, encryptedStorage, key);
  await Promise.all([rm(databaseDump, { force: true }), rm(storageArchive, { force: true })]);

  const manifest = {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    encryption: "AES-256-GCM",
    database: { file: path.basename(encryptedDatabase), sha256: await sha256(encryptedDatabase), size: (await stat(encryptedDatabase)).size },
    storage: { file: path.basename(encryptedStorage), sha256: await sha256(encryptedStorage), size: (await stat(encryptedStorage)).size },
  };
  await writeFile(path.join(staging, "manifest.json"), JSON.stringify(manifest, null, 2), { flag: "wx" });
  await rename(staging, destination);

  const requestedRetention = Number(process.env.BACKUP_RETENTION_COUNT ?? 14);
  const retention = Number.isInteger(requestedRetention) && requestedRetention >= 3
    ? requestedRetention
    : 14;
  const backups = (await readdir(backupRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && /^\d{8}T\d{6}Z$/.test(entry.name))
    .map((entry) => entry.name)
    .sort()
    .reverse();
  for (const expired of backups.slice(retention)) await rm(path.join(backupRoot, expired), { recursive: true, force: true });
  console.log(`[backup] completed ${destination}`);
} catch (error) {
  await rm(staging, { recursive: true, force: true });
  throw error;
}
