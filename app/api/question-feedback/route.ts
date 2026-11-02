import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getQuestionById } from "@/lib/tests/lookup";
import { feedbackQuestionKey, QUESTION_FEEDBACK_KINDS, type QuestionFeedbackKind } from "@/lib/tests/question-feedback";
import { consumePersistentRateLimit, rateLimitKey } from "@/lib/security/rate-limit";

const noStore = { "Cache-Control": "private, no-store" };

export async function GET(request: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401, headers: noStore });
  const id = request.nextUrl.searchParams.get("questionId");
  const testId = request.nextUrl.searchParams.get("testId");
  const question = id && id.length <= 120 ? getQuestionById(id) : undefined;
  if (!question || question.testId !== testId) return NextResponse.json({ error: "unknown_question" }, { status: 400 });
  const rows = await db.questionFeedback.findMany({ where: { userId, testId, questionKey: feedbackQuestionKey(question) }, select: { kind: true } });
  return NextResponse.json({ kinds: rows.map(row => row.kind) }, { headers: noStore });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401, headers: noStore });
  const origin = request.headers.get("origin");
  if (!origin || ![request.nextUrl.origin, process.env.APP_ORIGIN].filter(Boolean).includes(origin) || request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "forbidden_origin" }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) return NextResponse.json({ error: "invalid_body" }, { status: 415 });
  const reader = request.body?.getReader();
  if (!reader) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  let size = 0, text = "";
  const decoder = new TextDecoder();
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    size += chunk.value.byteLength;
    if (size > 1024) { await reader.cancel(); return NextResponse.json({ error: "too_large" }, { status: 413 }); }
    text += decoder.decode(chunk.value, { stream: true });
  }
  let body: { testId?: unknown; questionId?: unknown; kind?: unknown };
  try { body = JSON.parse(text + decoder.decode()); } catch { return NextResponse.json({ error: "invalid_body" }, { status: 400 }); }
  if (!body || typeof body !== "object" || typeof body.questionId !== "string" || body.questionId.length > 120 || !QUESTION_FEEDBACK_KINDS.includes(body.kind as QuestionFeedbackKind)) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  const question = getQuestionById(body.questionId);
  if (!question || question.testId !== body.testId) return NextResponse.json({ error: "unknown_question" }, { status: 400 });
  const limit = await consumePersistentRateLimit(rateLimitKey("question-feedback", userId), { limit: 120, windowMs: 3_600_000 });
  if (!limit.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  // createMany skipDuplicates is an atomic ON CONFLICT DO NOTHING. Retrying
  // never refreshes createdAt or extends the one-year retention period.
  await db.questionFeedback.createMany({ data: [{ userId, testId: question.testId, topicId: question.topicId, questionKey: feedbackQuestionKey(question), kind: body.kind as QuestionFeedbackKind }], skipDuplicates: true });
  return NextResponse.json({ recorded: true, kind: body.kind }, { headers: noStore });
}
