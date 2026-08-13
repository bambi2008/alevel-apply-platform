import { randomBytes } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { decryptFile, encryptFile, sha256 } from "./backup-crypto.mjs";

let directory;

afterEach(async () => {
  if (directory) await rm(directory, { recursive: true, force: true });
  directory = undefined;
});

describe("encrypted production backups", () => {
  it("round-trips data without leaving plaintext in the encrypted file", async () => {
    directory = await mkdtemp(path.join(tmpdir(), "qiaoshen-backup-"));
    const source = path.join(directory, "source.dump");
    const encrypted = path.join(directory, "source.dump.enc");
    const restored = path.join(directory, "restored.dump");
    const key = randomBytes(32);
    const content = Buffer.from("student-record-test-payload");
    await writeFile(source, content);

    await encryptFile(source, encrypted, key);
    expect((await readFile(encrypted)).includes(content)).toBe(false);
    expect(await sha256(encrypted)).toMatch(/^[a-f0-9]{64}$/);

    await decryptFile(encrypted, restored, key);
    expect(await readFile(restored)).toEqual(content);
  });

  it("rejects a backup modified after encryption", async () => {
    directory = await mkdtemp(path.join(tmpdir(), "qiaoshen-backup-"));
    const source = path.join(directory, "source.dump");
    const encrypted = path.join(directory, "source.dump.enc");
    const restored = path.join(directory, "restored.dump");
    const key = randomBytes(32);
    await writeFile(source, "sensitive-data");
    await encryptFile(source, encrypted, key);
    const bytes = await readFile(encrypted);
    bytes[25] ^= 0xff;
    await writeFile(encrypted, bytes);

    await expect(decryptFile(encrypted, restored, key)).rejects.toThrow();
  });
});
