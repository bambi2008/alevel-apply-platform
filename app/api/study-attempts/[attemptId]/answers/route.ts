import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { boundedJson, privateNoStore, sameOriginWrite } from "@/lib/security/json-request";
import { consumePersistentRateLimit, rateLimitKey } from "@/lib/security/rate-limit";
import { submitAttemptSchema, submitStudyAttempt, StudyAccessError } from "@/lib/tests/study-attempts";

export async function POST(request: NextRequest, { params }: { params: Promise<{ attemptId: string }> }) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401, headers: privateNoStore });
  const originError = sameOriginWrite(request);
  if (originError) return originError;
  const { attemptId } = await params;
  if (attemptId.length > 100) return NextResponse.json({ error: "not_found" }, { status: 404, headers: privateNoStore });
  const body = await boundedJson(request, 256 * 1024);
  if (!body.ok) return body.response;
  const parsed = submitAttemptSchema.safeParse(body.value);
  if (!parsed.success) return NextResponse.json({ error: "invalid_body" }, { status: 400, headers: privateNoStore });
  const limit = await consumePersistentRateLimit(rateLimitKey("study-attempt-answer", userId), { limit: 600, windowMs: 3_600_000 });
  if (!limit.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { ...privateNoStore, "Retry-After": String(limit.retryAfterSeconds) } });
  try { return NextResponse.json(await submitStudyAttempt(userId, attemptId, parsed.data), { headers: privateNoStore }); }
  catch (error) {
    if (error instanceof StudyAccessError) return NextResponse.json({ error: error.code }, { status: error.status, headers: privateNoStore });
    throw error;
  }
}
