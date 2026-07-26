import { existsSync } from "node:fs";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

if (!process.env.DATABASE_URL) {
  const localEnvFile = [".env.local", ".env"].find(existsSync);
  if (localEnvFile) process.loadEnvFile(localEnvFile);
}

const port = Number(process.env.E2E_PORT ?? 3130);
const localBaseUrl = `http://127.0.0.1:${port}`;
const baseURL = process.env.E2E_BASE_URL ?? localBaseUrl;

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: process.env.CI
    ? "test-results/e2e"
    : path.join(process.env.TEMP ?? "C:\\tmp", "qiaoshen-playwright-results"),
  fullyParallel: false,
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 1 : 0,
  timeout: 90_000,
  expect: {
    timeout: 15_000,
  },
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium-mobile",
      testMatch: /public-readiness\.spec\.ts/,
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `node node_modules/next/dist/bin/next dev -p ${port}`,
        url: `${localBaseUrl}/api/health`,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        env: {
          APP_ORIGIN: localBaseUrl,
          AUTH_SECRET:
            process.env.AUTH_SECRET ??
            "local-e2e-secret-with-more-than-thirty-two-characters",
          DATABASE_URL:
            process.env.DATABASE_URL ??
            "postgresql://postgres:postgres@127.0.0.1:5432/alevel_apply",
          STORAGE_DRIVER: "local",
          LOCAL_STORAGE_PATH: path.join(process.cwd(), ".storage-e2e"),
          NEXT_PUBLIC_PHONE_AUTH_ENABLED: "false",
          AI_REQUIRES_CROSS_BORDER_CONSENT: "true",
        },
      },
});
