import { existsSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { runStudyRetention } from "../lib/data-retention";
import { getStorage } from "../lib/storage";

async function main() {
  // Explicit operational/test connection settings take precedence; never pull
  // an unrelated .env database into a supplied fixture run.
  if (!process.env.DATABASE_URL) {
    const file = [".env.local", ".env"].find(existsSync);
    if (file) process.loadEnvFile(file);
  }
  const apply = process.argv.includes("--apply");
  const client = new PrismaClient({ log: [] });
  try {
    const counts = await runStudyRetention({ client, storage: getStorage(), dryRun: !apply });
    // Counts only: never identifiers, content, object keys or environment values.
    console.log(JSON.stringify({ task: "study-retention", mode: apply ? "apply" : "dry-run", ...counts }));
    if (counts.failedImages) process.exitCode = 1;
  } finally { await client.$disconnect(); }
}
main().catch(() => { console.error(JSON.stringify({ task: "study-retention", status: "failed" })); process.exitCode = 1; });
