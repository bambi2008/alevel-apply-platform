// 认证冒烟测试：建 demo 用户 + 验证 bcrypt 凭据校验（authorize 核心逻辑）。
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();
const email = "demo@bridge.test";
const pw = "demo123";

const hash = await bcrypt.hash(pw, 10);
await db.user.upsert({
  where: { email },
  update: { passwordHash: hash },
  create: { email, passwordHash: hash, role: "STUDENT" },
});
const u = await db.user.findUnique({ where: { email } });
console.log("user:", u.email, "role:", u.role);
console.log("verify correct pw:", await bcrypt.compare(pw, u.passwordHash));
console.log("verify wrong   pw:", await bcrypt.compare("wrong", u.passwordHash));
await db.$disconnect();
