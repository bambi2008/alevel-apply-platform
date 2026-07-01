// 手机验证码存储（开发版：进程内内存）。
// 说明：开发/单进程可用；生产多实例环境应改为数据库或 Redis 存储（留待接真短信时升级）。
// request-code action 与 auth.ts 的 authorize 引用同一模块 → 共享同一 Map。

interface CodeEntry {
  code: string;
  expiresAt: number; // 毫秒时间戳
  lastSentAt: number;
}

const store = new Map<string, CodeEntry>();

const CODE_TTL_MS = 5 * 60 * 1000; // 验证码有效期 5 分钟
const RESEND_COOLDOWN_MS = 60 * 1000; // 重发冷却 60 秒

/** 生成 6 位数字验证码。 */
export function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** 是否可以发送（冷却期内不可重发）。 */
export function canSend(phone: string): boolean {
  const e = store.get(phone);
  if (!e) return true;
  return Date.now() - e.lastSentAt >= RESEND_COOLDOWN_MS;
}

/** 距离可再次发送还需多少秒（0 表示现在即可）。 */
export function cooldownRemaining(phone: string): number {
  const e = store.get(phone);
  if (!e) return 0;
  const left = RESEND_COOLDOWN_MS - (Date.now() - e.lastSentAt);
  return left > 0 ? Math.ceil(left / 1000) : 0;
}

/** 保存新验证码。 */
export function saveCode(phone: string, code: string): void {
  store.set(phone, {
    code,
    expiresAt: Date.now() + CODE_TTL_MS,
    lastSentAt: Date.now(),
  });
}

/**
 * 校验验证码。成功即消费（一次性）。
 * 返回 true 表示通过。
 */
export function verifyCode(phone: string, code: string): boolean {
  const e = store.get(phone);
  if (!e) return false;
  if (Date.now() > e.expiresAt) {
    store.delete(phone);
    return false;
  }
  if (e.code !== code) return false;
  store.delete(phone); // 一次性消费
  return true;
}
