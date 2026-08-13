import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimitStore = {
  buckets: Map<string, Bucket>;
  operations: number;
};

const globalStore = globalThis as typeof globalThis & {
  __qiaoshenRateLimits?: RateLimitStore;
};

const store = globalStore.__qiaoshenRateLimits ?? {
  buckets: new Map<string, Bucket>(),
  operations: 0,
};

if (process.env.NODE_ENV !== "production") {
  globalStore.__qiaoshenRateLimits = store;
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const candidate = forwarded || headers.get("x-real-ip")?.trim() || "unknown";
  return /^[0-9a-f:.]{2,64}$/i.test(candidate) ? candidate : "unknown";
}

export function rateLimitKey(namespace: string, ...parts: string[]): string {
  const digest = createHash("sha256")
    .update(parts.map((part) => part.trim().toLowerCase()).join("\u0000"))
    .digest("hex");
  return `${namespace}:${digest}`;
}

export function consumeRateLimit(
  key: string,
  options: { limit: number; windowMs: number },
  now = Date.now(),
): RateLimitResult {
  store.operations += 1;
  if (store.operations % 250 === 0 || store.buckets.size > 10_000) {
    for (const [bucketKey, bucket] of store.buckets) {
      if (bucket.resetAt <= now) store.buckets.delete(bucketKey);
    }
  }

  const current = store.buckets.get(key);
  const bucket = !current || current.resetAt <= now
    ? { count: 0, resetAt: now + options.windowMs }
    : current;

  bucket.count += 1;
  store.buckets.set(key, bucket);
  const allowed = bucket.count <= options.limit;

  return {
    allowed,
    remaining: Math.max(0, options.limit - bucket.count),
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

/**
 * Shared PostgreSQL limiter for authentication and AI routes. The in-memory
 * implementation remains available for deterministic unit tests and as a
 * development fallback before a local migration has been applied.
 */
export async function consumePersistentRateLimit(
  key: string,
  options: { limit: number; windowMs: number },
  now = new Date(),
): Promise<RateLimitResult> {
  if (process.env.NODE_ENV === "test") {
    return consumeRateLimit(key, options, now.getTime());
  }

  const resetAt = new Date(now.getTime() + options.windowMs);
  try {
    const rows = await db.$queryRaw<Array<{ count: number; resetAt: Date }>>(Prisma.sql`
      INSERT INTO "RateLimitBucket" ("key", "count", "resetAt", "updatedAt")
      VALUES (${key}, 1, ${resetAt}, ${now})
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE
          WHEN "RateLimitBucket"."resetAt" <= ${now} THEN 1
          ELSE "RateLimitBucket"."count" + 1
        END,
        "resetAt" = CASE
          WHEN "RateLimitBucket"."resetAt" <= ${now} THEN ${resetAt}
          ELSE "RateLimitBucket"."resetAt"
        END,
        "updatedAt" = ${now}
      RETURNING "count", "resetAt"
    `);
    const bucket = rows[0];
    if (!bucket) throw new Error("Rate limit bucket was not returned");
    return {
      allowed: bucket.count <= options.limit,
      remaining: Math.max(0, options.limit - bucket.count),
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt.getTime() - now.getTime()) / 1000)),
    };
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;
    return consumeRateLimit(key, options, now.getTime());
  }
}

export function resetRateLimitsForTests() {
  if (process.env.NODE_ENV === "test") {
    store.buckets.clear();
    store.operations = 0;
  }
}
