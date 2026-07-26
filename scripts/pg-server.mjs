import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";
import path from "node:path";

const databaseDir = process.env.LOCAL_PG_DATA_DIR
  ? path.resolve(process.env.LOCAL_PG_DATA_DIR)
  : path.join(process.cwd(), ".pgdata");
const DB_NAME = "alevel";

const pg = new EmbeddedPostgres({
  databaseDir,
  user: "postgres",
  password: "postgres",
  port: 5433,
  persistent: true,
  initdbFlags: ["--locale=C", "--encoding=UTF8"],
});

const firstRun = !existsSync(databaseDir);

async function main() {
  if (firstRun) {
    console.log("[pg] Initializing the local PostgreSQL data directory...");
    await pg.initialise();
  }
  await pg.start();
  console.log("[pg] PostgreSQL is listening on localhost:5433");

  try {
    await pg.createDatabase(DB_NAME);
    console.log(`[pg] Created database ${DB_NAME}`);
  } catch {
    console.log(`[pg] Database ${DB_NAME} already exists`);
  }

  console.log("[pg] DATABASE_URL=postgresql://postgres:postgres@localhost:5433/alevel");
  console.log("[pg] Press Ctrl+C to stop");
}

async function shutdown() {
  console.log("\n[pg] Stopping...");
  try {
    await pg.stop();
  } catch {
    // Process shutdown should continue even if Postgres has already stopped.
  }
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

main().catch((error) => {
  console.error("[pg] Failed to start", error);
  process.exit(1);
});
