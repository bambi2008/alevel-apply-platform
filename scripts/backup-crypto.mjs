import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import { open, stat, writeFile } from "node:fs/promises";
import { pipeline } from "node:stream/promises";

const MAGIC = Buffer.from("QSBKUP01");

export async function sha256(file) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest("hex");
}

export async function encryptFile(source, destination, key) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const output = createWriteStream(destination, { flags: "wx" });
  output.write(MAGIC);
  output.write(iv);
  await pipeline(createReadStream(source), cipher, output);
  await writeFile(destination, cipher.getAuthTag(), { flag: "a" });
}

export async function decryptFile(source, destination, key) {
  const size = (await stat(source)).size;
  if (size <= MAGIC.length + 12 + 16) throw new Error(`Encrypted file is truncated: ${source}`);
  const header = Buffer.alloc(MAGIC.length + 12);
  const sourceHandle = await open(source, "r");
  try {
    await sourceHandle.read(header, 0, header.length, 0);
    if (!timingSafeEqual(header.subarray(0, MAGIC.length), MAGIC)) {
      throw new Error(`Invalid backup magic: ${source}`);
    }
    const tag = Buffer.alloc(16);
    await sourceHandle.read(tag, 0, tag.length, size - tag.length);
    const decipher = createDecipheriv("aes-256-gcm", key, header.subarray(MAGIC.length));
    decipher.setAuthTag(tag);
    await pipeline(
      createReadStream(source, { start: header.length, end: size - tag.length - 1 }),
      decipher,
      createWriteStream(destination, { flags: "wx" }),
    );
  } finally {
    await sourceHandle.close();
  }
}
