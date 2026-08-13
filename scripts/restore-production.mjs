import { mkdir, readFile, readdir, rename, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
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
if (manifest.schemaVersion !== 1 || manifest.encryption !== "AES-256-GCM") {
  throw new Error("Unsupported backup manifest format");
}
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
const storageRootName = manifest.storage.rootName ?? path.basename(storagePath);
if (
  typeof storageRootName !== "string"
  || path.basename(storageRootName) !== storageRootName
  || !storageRootName
) {
  throw new Error("Backup manifest contains an invalid storage root");
}

const temporary = path.join(tmpdir(), `qiaoshen-restore-${Date.now()}-${process.pid}`);
await mkdir(temporary, { recursive: false });
try {
  const databaseDump = path.join(temporary, "database.dump");
  const storageArchive = path.join(temporary, "storage.tgz");
  await decryptFile(path.join(backupPath, manifest.database.file), databaseDump, key);
  await decryptFile(path.join(backupPath, manifest.storage.file), storageArchive, key);
  await run("pg_restore", ["--list", databaseDump]);
  await run("tar", ["-tzf", storageArchive]);
  if (verifyOnly) {
    console.log(`[restore] verification passed for ${backupPath}`);
  } else {
    await run("pg_restore", ["--clean", "--if-exists", "--no-owner", "--exit-on-error", "--dbname", databaseUrl, databaseDump]);
    await mkdir(storagePath, { recursive: true });
    const transactionName = `.restore-${Date.now()}-${process.pid}`;
    const transactionPath = path.join(storagePath, transactionName);
    const previousStorage = path.join(transactionPath, "previous");
    const extractionPath = path.join(transactionPath, "extracted");
    const restoredEntries = [];
    await mkdir(previousStorage, { recursive: true });
    await mkdir(extractionPath, { recursive: false });
    try {
      await run("tar", ["-xzf", storageArchive, "-C", extractionPath]);
      const currentEntries = (await readdir(storagePath, { withFileTypes: true }))
        .filter((entry) => entry.name !== transactionName);
      for (const entry of currentEntries) {
        await rename(path.join(storagePath, entry.name), path.join(previousStorage, entry.name));
      }
      const extractedStorage = path.join(extractionPath, storageRootName);
      for (const entry of await readdir(extractedStorage, { withFileTypes: true })) {
        await rename(path.join(extractedStorage, entry.name), path.join(storagePath, entry.name));
        restoredEntries.push(entry.name);
      }
      await rm(transactionPath, { recursive: true, force: true });
    } catch (error) {
      for (const entry of restoredEntries) {
        await rm(path.join(storagePath, entry), { recursive: true, force: true });
      }
      try {
        for (const entry of await readdir(previousStorage, { withFileTypes: true })) {
          await rename(path.join(previousStorage, entry.name), path.join(storagePath, entry.name));
        }
      } catch (rollbackError) {
        if (rollbackError?.code !== "ENOENT") throw new AggregateError([error, rollbackError], "Storage restore and rollback both failed");
      }
      await rm(transactionPath, { recursive: true, force: true });
      throw error;
    }
    console.log(`[restore] completed from ${backupPath}`);
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
