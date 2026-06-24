// 存储适配器接口 + 本地实现。
// 生产环境替换为腾讯 COS / 阿里 OSS 适配器，业务代码不变。

import { promises as fs } from "node:fs";
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
}

/** 开发用：写入项目 .storage 目录。 */
class LocalStorageAdapter implements StorageAdapter {
  private root = path.join(process.cwd(), ".storage");

  private async ensureRoot() {
    await fs.mkdir(this.root, { recursive: true });
  }

  async put({ body, fileName, mime }: PutObjectInput): Promise<StoredObject> {
    await this.ensureRoot();
    const ext = path.extname(fileName);
    const key = `${randomUUID()}${ext}`;
    await fs.writeFile(path.join(this.root, key), body);
    return { key, fileName, mime, size: body.length };
  }

  async get(key: string): Promise<Buffer> {
    return fs.readFile(path.join(this.root, key));
  }

  async delete(key: string): Promise<void> {
    await fs.rm(path.join(this.root, key), { force: true });
  }

  async url(key: string): Promise<string> {
    return `/api/files/${key}`;
  }
}

// 工厂：按 STORAGE_DRIVER 选择适配器（目前仅 local；cos/oss 待实现）。
export function getStorage(): StorageAdapter {
  switch (process.env.STORAGE_DRIVER) {
    // case "cos": return new CosStorageAdapter();
    // case "oss": return new OssStorageAdapter();
    default:
      return new LocalStorageAdapter();
  }
}
