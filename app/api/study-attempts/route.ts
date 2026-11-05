import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { boundedJson, privateNoStore, sameOriginWrite } from "@/lib/security/json-request";
import { consumePersistentRateLimit, rateLimitKey } from "@/lib/security/rate-limit";
import { startAttemptSchema, startStudyAttempt, StudyAccessError } from "@/lib/tests/study-attempts";

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401, headers: privateNoStore });
  const originError = sameOriginWrite(request);
  if (originError) return originError;
  const body = await boundedJson(request, 8192);
  if (!body.ok) return body.response;
  const parsed = startAttemptSchema.safeParse(body.value);
  if (!parsed.success) return NextResponse.json({ error: "invalid_body" }, { status: 400, headers: privateNoStore });
  const limit = await consumePersistentRateLimit(rateLimitKey("study-attempt-start", userId), { limit: 30, windowMs: 3_600_000 });
  if (!limit.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { ...privateNoStore, "Retry-After": String(limit.retryAfterSeconds) } });
  try { return NextResponse.json(await startStudyAttempt(userId, parsed.data), { status: 201, headers: privateNoStore }); }
  catch (error) {
    if (error instanceof StudyAccessError) return NextResponse.json({ error: error.code }, { status: error.status, headers: privateNoStore });
    throw error;
  }
}
