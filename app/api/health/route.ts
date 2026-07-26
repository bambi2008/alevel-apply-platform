import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStorage } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIMEOUT_MS = 4_000;

async function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out`)), TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function GET() {
  const checks = await Promise.allSettled([
    withTimeout(db.$queryRaw`SELECT 1`, "database"),
    withTimeout(Promise.resolve().then(() => getStorage().healthcheck()), "storage"),
  ]);
  const database = checks[0].status === "fulfilled" ? "ok" : "error";
  const storage = checks[1].status === "fulfilled" ? "ok" : "error";
  const healthy = database === "ok" && storage === "ok";

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      checks: { database, storage },
      timestamp: new Date().toISOString(),
    },
    {
      status: healthy ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
