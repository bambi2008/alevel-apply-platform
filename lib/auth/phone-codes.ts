// 手机验证码存储（数据库版）。
// 存于 PhoneCode 表，可跨进程重启与多实例存活。
// 逻辑不变：6 位码、5 分钟有效、60 秒重发冷却、一次性消费。

import { db } from "@/lib/db";

const CODE_TTL_MS = 5 * 60 * 1000; // 验证码有效期 5 分钟
const RESEND_COOLDOWN_MS = 60 * 1000; // 重发冷却 60 秒

/** 生成 6 位数字验证码（纯函数）。 */
export function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** 是否可以发送（冷却期内不可重发）。 */
export async function canSend(phone: string): Promise<boolean> {
  const e = await db.phoneCode.findUnique({ where: { phone } });
  if (!e) return true;
  return Date.now() - e.lastSentAt.getTime() >= RESEND_COOLDOWN_MS;
}

/** 距离可再次发送还需多少秒（0 表示现在即可）。 */
export async function cooldownRemaining(phone: string): Promise<number> {
  const e = await db.phoneCode.findUnique({ where: { phone } });
  if (!e) return 0;
  const left = RESEND_COOLDOWN_MS - (Date.now() - e.lastSentAt.getTime());
  return left > 0 ? Math.ceil(left / 1000) : 0;
}

/** 保存新验证码（重发即覆盖）。 */
export async function saveCode(phone: string, code: string): Promise<void> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CODE_TTL_MS);
  await db.phoneCode.upsert({
    where: { phone },
    update: { code, expiresAt, lastSentAt: now },
    create: { phone, code, expiresAt, lastSentAt: now },
  });
}

/**
 * 校验验证码。成功即消费（一次性删除）。
 * 返回 true 表示通过。
 */
export async function verifyCode(phone: string, code: string): Promise<boolean> {
  const e = await db.phoneCode.findUnique({ where: { phone } });
  if (!e) return false;
  // 过期或不匹配
  if (Date.now() > e.expiresAt.getTime()) {
    await db.phoneCode.delete({ where: { phone } }).catch(() => {});
    return false;
  }
  if (e.code !== code) return false;
  // 一次性消费
  await db.phoneCode.delete({ where: { phone } }).catch(() => {});
  return true;
}
