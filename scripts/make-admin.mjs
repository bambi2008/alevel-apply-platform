// 把指定账号设为管理员（一次性）。
// 用法：  node scripts/make-admin.mjs <邮箱或手机号>
// 例如：  node scripts/make-admin.mjs you@example.com
//        node scripts/make-admin.mjs 13800138000
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const arg = (process.argv[2] || "").trim();

if (!arg) {
  console.error("用法: node scripts/make-admin.mjs <邮箱或手机号>");
  process.exit(1);
}

const where = arg.includes("@")
  ? { email: arg.toLowerCase() }
  : { phone: arg };

const user = await db.user.findFirst({ where });
if (!user) {
  console.error(`未找到用户：${arg}（请先在网站上用该账号注册/登录一次）`);
  await db.$disconnect();
  process.exit(1);
}

await db.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
console.log(`✓ 已将 ${arg} 设为管理员（ADMIN）。刷新页面后即可在右上角看到「管理后台」入口。`);
await db.$disconnect();
