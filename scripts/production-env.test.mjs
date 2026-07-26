import { describe, expect, it } from "vitest";
import { validateProductionEnv } from "./production-env.mjs";

const valid = {
  DATABASE_URL: "postgresql://qiaoshen:encoded-password@postgres:5432/qiaoshen",
  AUTH_SECRET: "a-production-secret-that-is-long-enough",
  APP_ORIGIN: "https://apply.example.com",
  STORAGE_DRIVER: "local",
  LOCAL_STORAGE_PATH: "/app/.storage",
  ALLOW_LOCAL_STORAGE_IN_PRODUCTION: "true",
  BACKUP_DIR: "/backups",
  BACKUP_ENCRYPTION_KEY: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
  REQUIRE_BACKUPS: "true",
};

describe("production environment validation", () => {
  it("accepts a complete single-host configuration", () => {
    expect(validateProductionEnv(valid).errors).toEqual([]);
  });

  it("rejects HTTP, weak secrets and unencrypted external databases", () => {
    const result = validateProductionEnv({
      ...valid,
      APP_ORIGIN: "http://apply.example.com",
      AUTH_SECRET: "short",
      DATABASE_URL: "postgresql://user:password@database.example.com/app",
    });
    expect(result.errors).toEqual(expect.arrayContaining([
      "APP_ORIGIN must use https",
      "AUTH_SECRET must be a non-placeholder value with at least 32 characters",
      "External DATABASE_URL must require TLS via sslmode=require or stronger",
    ]));
  });

  it("rejects nested storage and backup paths", () => {
    const result = validateProductionEnv({
      ...valid,
      BACKUP_DIR: "/app/.storage/backups",
    });
    expect(result.errors).toContain("BACKUP_DIR and LOCAL_STORAGE_PATH must be separate, non-nested paths");
  });
});
