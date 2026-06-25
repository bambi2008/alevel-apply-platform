// 本地开发用嵌入式 Postgres。单独终端运行：pnpm db:start
// 数据持久化在 ./.pgdata（已 gitignore）。连接串：
//   postgresql://postgres:postgres@localhost:5433/alevel
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";
import path from "node:path";

const databaseDir = path.join(process.cwd(), ".pgdata");
const DB_NAME = "alevel";

const pg = new EmbeddedPostgres({
  databaseDir,
  user: "postgres",
  password: "postgres",
  port: 5433,
  persistent: true,
});

const firstRun = !existsSync(databaseDir);

async function main() {
  if (firstRun) {
    console.log("[pg] 初始化数据目录（首次，运行 initdb）…");
    await pg.initialise();
  }
  await pg.start();
  console.log("[pg] Postgres 已启动：localhost:5433");

  try {
    await pg.createDatabase(DB_NAME);
    console.log(`[pg] 已创建数据库 ${DB_NAME}`);
  } catch (e) {
    console.log(`[pg] 数据库 ${DB_NAME} 已存在（跳过）`);
  }

  console.log("[pg] DATABASE_URL=postgresql://postgres:postgres@localhost:5433/alevel");
  console.log("[pg] 保持运行中… 按 Ctrl+C 停止");
}

async function shutdown() {
  console.log("\n[pg] 正在停止…");
  try { await pg.stop(); } catch {}
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

main().catch((e) => {
  console.error("[pg] 启动失败：", e);
  process.exit(1);
});
