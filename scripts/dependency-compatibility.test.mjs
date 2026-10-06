import { createRequire } from "node:module";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRequire = createRequire(import.meta.url);
const prismaRequire = createRequire(projectRequire.resolve("prisma/config"));
const configPath = prismaRequire.resolve("@prisma/config");
const configRequire = createRequire(configPath);

describe("patched Prisma config dependency compatibility", () => {
  it("loads a real Prisma config without changing schema or migrations", async () => {
    const { loadConfigFromFile } = configRequire(configPath);
    const loaded = await loadConfigFromFile({
      configFile: path.resolve("tests/fixtures/prisma-security.config.ts"),
      configRoot: process.cwd(),
    });
    expect(loaded.error).toBeUndefined();
    expect(loaded.config.schema).toBe(path.resolve("prisma/schema.prisma"));
    expect(loaded.config.migrations.path).toBe(path.resolve("prisma/migrations"));
  });

  it("retains the plain-object merger and handles circular inputs safely", async () => {
    const { deepmerge } = configRequire("deepmerge-ts");
    expect(deepmerge({ nested: { schema: "schema.prisma" } }, {
      nested: { migrations: "migrations" },
    })).toEqual({ nested: { schema: "schema.prisma", migrations: "migrations" } });
    const circular = { schema: "schema.prisma" };
    circular.self = circular;
    const merged = deepmerge(circular, { schema: "patched.prisma" });
    expect(merged.schema).toBe("patched.prisma");
    expect(merged.self).toBe(merged);
  });
});
