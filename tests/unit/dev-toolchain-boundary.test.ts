import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { configDefaults } from "vitest/config";
import { createServer, type ViteDevServer } from "vite";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";

describe("development tool security boundaries", () => {
  let root: string;
  let server: ViteDevServer | undefined;
  let origin: string;

  beforeAll(async () => {
    root = await mkdtemp(path.join(tmpdir(), "qiaoshen-vite-security-"));
    await writeFile(path.join(root, "index.html"), "<h1>synthetic public fixture</h1>");
    await writeFile(path.join(root, ".env"), "ONLY_SYNTHETIC_MARKER=not-a-secret");
    server = await createServer({
      configFile: false, root, logLevel: "silent",
      server: { host: "127.0.0.1", port: 0, strictPort: false },
    });
    await server.listen();
    const address = server.httpServer?.address();
    if (!address || typeof address === "string") throw new Error("No loopback test server");
    origin = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await server?.close();
    if (root) {
      if (path.dirname(root) !== tmpdir() || !path.basename(root).startsWith("qiaoshen-vite-security-")) {
        throw new Error("Refusing to remove an unexpected test directory");
      }
      await rm(root, { recursive: true, force: true });
    }
  });

  it("retains ordinary local HTML serving", async () => {
    const response = await fetch(origin);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("synthetic public fixture");
  });

  it.each(["/.env", "/.env?import&raw", "/.env?raw??"])("does not expose denied synthetic files: %s", async target => {
    const response = await fetch(origin + target);
    expect(response.status).toBe(403);
    expect(await response.text()).not.toContain("ONLY_SYNTHETIC_MARKER");
  });

  it("does not grant a foreign web origin access to local responses", async () => {
    const response = await fetch(origin, { headers: { Origin: "https://untrusted.invalid" } });
    expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it("keeps the optional Vitest API server disabled by default", () => {
    expect(configDefaults.api).toBe(false);
  });

  it("preserves ordinary lint-consumer glob and YAML behavior", () => {
    const toolRequire = createRequire(path.join(process.cwd(), "package.json"));
    const eslintRequire = createRequire(toolRequire.resolve("eslint/package.json"));
    const minimatch = eslintRequire("minimatch") as (file: string, pattern: string) => boolean;
    expect(minimatch("tests/unit/example.test.ts", "{lib,tests}/**/*.test.{ts,mjs}")).toBe(true);
    expect(minimatch("public/image.png", "{lib,tests}/**/*.test.{ts,mjs}")).toBe(false);
    const yaml = eslintRequire("js-yaml") as { load: (source: string) => unknown };
    expect(yaml.load("defaults: &base\n  enabled: true\ncopy:\n  <<: *base\n  name: local\n")).toEqual({
      defaults: { enabled: true }, copy: { enabled: true, name: "local" },
    });
  });
});
