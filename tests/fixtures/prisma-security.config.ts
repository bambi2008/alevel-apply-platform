import { defineConfig } from "prisma/config";

// Exercises the patched config merger without credentials or database access.
export default defineConfig({
  schema: "../../prisma/schema.prisma",
  migrations: { path: "../../prisma/migrations" },
});
