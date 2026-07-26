import { mkdir, readFile, rename, rm } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { decryptFile, sha256 } from "./backup-crypto.mjs";

function run(program, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(program, args, { stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`${program} exited with ${code}`)));
  });
}

const backupPath = path.resolve(process.argv[2] ?? "");
const confirm = process.argv.includes("--confirm");
const verifyOnly = process.argv.includes("--verify-only");
const databaseUrl = process.env.DATABASE_URL;
const storagePath = process.env.LOCAL_STORAGE_PATH;
const key = Buffer.from(process.env.BACKUP_ENCRYPTION_KEY ?? "", "base64");
if (!process.argv[2] || !databaseUrl || !storagePath || key.length !== 32) {
  throw new Error("Usage: restore-production.mjs <backup-directory> --verify-only|--confirm, with DATABASE_URL, LOCAL_STORAGE_PATH and BACKUP_ENCRYPTION_KEY");
}
if (!verifyOnly && !confirm) throw new Error("Restore is destructive; pass --confirm");
if (!path.isAbsolute(storagePath)) throw new Error("LOCAL_STORAGE_PATH must be absolute");

const manifest = JSON.parse(await readFile(path.join(backupPath, "manifest.json"), "utf8"));
for (const item of [manifest.database, manifest.storage]) {
  if (
    !item
    || typeof item.file !== "string"
    || path.basename(item.file) !== item.file
    || !/^[a-z0-9.-]+$/i.test(item.file)
    || !/^[a-f0-9]{64}$/.test(item.sha256)
  ) {
    throw new Error("Backup manifest contains an invalid file entry");
  }
  const file = path.join(backupPath, item.file);
  if (await sha256(file) !== item.sha256) throw new Error(`Backup checksum failed: ${item.file}`);
}

const temporary = path.join(path.dirname(storagePath), `.restore-${Date.now()}-${process.pid}`);
await mkdir(temporary, { recursive: false });
try {
  const databaseDump = path.join(temporary, "database.dump");
  const storageArchive = path.join(temporary, "storage.tgz");
  await decryptFile(path.join(backupPath, manifest.database.file), databaseDump, key);
  await decryptFile(path.join(backupPath, manifest.storage.file), storageArchive, key);
  if (verifyOnly) {
    console.log(`[restore] verification passed for ${backupPath}`);
  } else {
    await run("pg_restore", ["--clean", "--if-exists", "--no-owner", "--dbname", databaseUrl, databaseDump]);
    const previousStorage = `${storagePath}.pre-restore-${Date.now()}`;
    let movedExisting = false;
    try {
      await rename(storagePath, previousStorage);
      movedExisting = true;
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
    try {
      await run("tar", ["-xzf", storageArchive, "-C", path.dirname(storagePath)]);
      if (movedExisting) await rm(previousStorage, { recursive: true, force: true });
    } catch (error) {
      await rm(storagePath, { recursive: true, force: true });
      if (movedExisting) await rename(previousStorage, storagePath);
      throw error;
    }
    console.log(`[restore] completed from ${backupPath}`);
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
