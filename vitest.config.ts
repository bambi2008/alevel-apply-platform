import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(process.cwd()),
    },
  },
  test: {
    environment: "node",
    // Exhaustive bank comparisons share a bounded CPU budget with local builds.
    // Keep every assertion and the unit timeout; integration tests declare their budget.
    fileParallelism: false,
    include: [
      "lib/**/*.test.ts",
      "tests/unit/**/*.test.{ts,tsx}",
      "scripts/**/*.test.mjs",
    ],
  },
});
