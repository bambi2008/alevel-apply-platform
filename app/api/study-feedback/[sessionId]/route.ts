import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { boundedJson, privateNoStore, sameOriginWrite } from "@/lib/security/json-request";
import { consumePersistentRateLimit, rateLimitKey } from "@/lib/security/rate-limit";

type Context = { params: Promise<{ sessionId: string }> };
const schema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("ERROR"),
    questionId: z.string().min(1).max(120).optional(),
    reason: z.enum(["PROMPT", "ANSWER", "SOLUTION", "DISPLAY", "OTHER"]),
  }).strict(),
  z.object({ kind: z.literal("TOO_HARD") }).strict(),
  z.object({ kind: z.literal("MORE_LIKE_THIS") }).strict(),
]);

function respond(value: unknown, status = 200) {
  return NextResponse.json(value, { status, headers: privateNoStore });
}

async function owner(context: Context) {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) return { error: respond({ error: "unauthenticated" }, 401) } as const;
  const { sessionId } = await context.params;
  const owned = sessionId.length <= 100 && await db.examSession.findFirst({
    where: { id: sessionId, completedAt: { lte: new Date() }, student: { userId } },
    select: { id: true },
  });
  if (!owned) return { error: respond({ error: "not_found" }, 404) } as const;
  return { userId, sessionId };
}

export async function GET(_request: NextRequest, context: Context) {
  const access = await owner(context);
  if (access.error) return access.error;
  const rows = await db.studySessionFeedback.findMany({
    where: { sessionId: access.sessionId }, select: { kind: true },
  });
  return respond({ kinds: rows.map(row => row.kind) });
}

export async function POST(request: NextRequest, context: Context) {
  const originError = sameOriginWrite(request);
  if (originError) return originError;
  const access = await owner(context);
  if (access.error) return access.error;
  const body = await boundedJson(request, 1024);
  if (!body.ok) return body.response;
  const parsed = schema.safeParse(body.value);
  if (!parsed.success) return respond({ error: "invalid_body" }, 400);
  const limit = await consumePersistentRateLimit(rateLimitKey("study-feedback", access.userId), { limit: 120, windowMs: 3_600_000 });
  if (!limit.allowed) return respond({ error: "rate_limited" }, 429);
  const input = parsed.data;
  if (input.kind === "ERROR" && input.questionId && !await db.examAnswer.findFirst({
    where: { sessionId: access.sessionId, questionId: input.questionId }, select: { id: true },
  })) return respond({ error: "invalid_question" }, 400);
  await db.studySessionFeedback.createMany({
    data: [{ sessionId: access.sessionId, ...input }],
    skipDuplicates: true,
  });
  return respond({ recorded: true, kind: input.kind });
}
