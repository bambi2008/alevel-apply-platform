import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";

const CODE_TTL_MS = 5 * 60_000;
const RESEND_COOLDOWN_MS = 60_000;

export function generateCode(): string {
  return String(randomInt(100000, 1_000_000));
}

function codePepper(): string {
  const pepper = process.env.PHONE_CODE_PEPPER || process.env.AUTH_SECRET;
  if (pepper) return pepper;
  if (process.env.NODE_ENV === "production") {
    throw new Error("PHONE_CODE_PEPPER or AUTH_SECRET is required");
  }
  return "development-only-phone-code-pepper";
}

export function hashPhoneCode(phone: string, code: string): string {
  return createHmac("sha256", codePepper())
    .update(`${phone}:${code}`, "utf8")
    .digest("hex");
}

function equalHash(first: string, second: string): boolean {
  const a = Buffer.from(first, "hex");
  const b = Buffer.from(second, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function canSend(phone: string): Promise<boolean> {
  const entry = await db.phoneCode.findUnique({ where: { phone } });
  return !entry || Date.now() - entry.lastSentAt.getTime() >= RESEND_COOLDOWN_MS;
}

export async function cooldownRemaining(phone: string): Promise<number> {
  const entry = await db.phoneCode.findUnique({ where: { phone } });
  if (!entry) return 0;
  const remaining = RESEND_COOLDOWN_MS - (Date.now() - entry.lastSentAt.getTime());
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}

export async function saveCode(phone: string, code: string): Promise<void> {
  const now = new Date();
  const codeHash = hashPhoneCode(phone, code);
  await db.phoneCode.upsert({
    where: { phone },
    update: {
      codeHash,
      attempts: 0,
      expiresAt: new Date(now.getTime() + CODE_TTL_MS),
      lastSentAt: now,
    },
    create: {
      phone,
      codeHash,
      attempts: 0,
      expiresAt: new Date(now.getTime() + CODE_TTL_MS),
      lastSentAt: now,
    },
  });
}

export async function verifyCode(phone: string, code: string): Promise<boolean> {
  const entry = await db.phoneCode.findUnique({ where: { phone } });
  if (!entry) return false;
  if (Date.now() > entry.expiresAt.getTime() || entry.attempts >= 5) {
    await db.phoneCode.delete({ where: { phone } }).catch(() => {});
    return false;
  }

  const expected = hashPhoneCode(phone, code);
  if (!equalHash(entry.codeHash, expected)) {
    await db.phoneCode.update({
      where: { phone },
      data: { attempts: { increment: 1 } },
    }).catch(() => {});
    return false;
  }

  const consumed = await db.phoneCode.deleteMany({
    where: {
      phone,
      codeHash: expected,
      expiresAt: { gt: new Date() },
      attempts: { lt: 5 },
    },
  });
  return consumed.count === 1;
}
