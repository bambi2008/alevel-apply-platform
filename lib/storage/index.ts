// 存储适配器接口 + 本地实现。
// 生产环境替换为腾讯 COS / 阿里 OSS 适配器，业务代码不变。

import { constants, promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export interface PutObjectInput {
  body: Buffer;
  fileName: string;
  mime?: string;
}

export interface StoredObject {
  key: string;
  fileName: string;
  mime?: string;
  size: number;
}

export interface StorageAdapter {
  put(input: PutObjectInput): Promise<StoredObject>;
  get(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  /** 返回可访问的 URL（本地为相对路径；云端为签名 URL）。 */
  url(key: string): Promise<string>;
  healthcheck(): Promise<void>;
}

/** 开发用：写入项目 .storage 目录。 */
class LocalStorageAdapter implements StorageAdapter {
  private root = process.env.LOCAL_STORAGE_PATH
    ? path.resolve(process.env.LOCAL_STORAGE_PATH)
    : path.join(process.cwd(), ".storage");

  private async ensureRoot() {
    await fs.mkdir(this.root, { recursive: true });
  }

  private objectPath(key: string) {
    if (!/^[0-9a-f-]{36}(?:\.[a-z0-9]{1,10})?$/i.test(key)) throw new Error("Invalid storage key");
    return path.join(this.root, key);
  }

  async put({ body, fileName, mime }: PutObjectInput): Promise<StoredObject> {
    await this.ensureRoot();
    const ext = path.extname(fileName);
    const key = `${randomUUID()}${ext}`;
    await fs.writeFile(this.objectPath(key), body, { flag: "wx" });
    return { key, fileName, mime, size: body.length };
  }

  async get(key: string): Promise<Buffer> {
    return fs.readFile(this.objectPath(key));
  }

  async delete(key: string): Promise<void> {
    await fs.rm(this.objectPath(key), { force: true });
  }

  async url(key: string): Promise<string> {
    return `/api/files/${key}`;
  }

  async healthcheck(): Promise<void> {
    await this.ensureRoot();
    await fs.access(this.root, constants.R_OK | constants.W_OK);
  }
}

// 工厂：按 STORAGE_DRIVER 选择适配器（目前仅 local；cos/oss 待实现）。
export function getStorage(): StorageAdapter {
  switch (process.env.STORAGE_DRIVER) {
    case undefined:
    case "":
      if (process.env.NODE_ENV === "production") throw new Error("STORAGE_DRIVER is required in production");
      return new LocalStorageAdapter();
    case "local":
      if (process.env.NODE_ENV === "production" && process.env.ALLOW_LOCAL_STORAGE_IN_PRODUCTION !== "true") {
        throw new Error("Local production storage is not explicitly enabled");
      }
      return new LocalStorageAdapter();
    default:
      throw new Error(`Unsupported storage driver: ${process.env.STORAGE_DRIVER}`);
  }
}
