import { createHash } from "node:crypto";

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

export function resetRateLimitsForTests() {
  if (process.env.NODE_ENV === "test") {
    store.buckets.clear();
    store.operations = 0;
  }
}
