import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getQuestionById } from "@/lib/tests/lookup";
import { feedbackQuestionKey } from "@/lib/tests/question-feedback";
import { privateNoStore } from "@/lib/security/json-request";

/** Historical per-question feedback remains readable by its owner. New feedback
 * belongs to a completed exam session and uses /api/study-feedback/:sessionId. */
export async function GET(request: NextRequest) {
  const userId = (await auth())?.user.id;
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401, headers: privateNoStore });
  const id = request.nextUrl.searchParams.get("questionId");
  const testId = request.nextUrl.searchParams.get("testId");
  const question = id && id.length <= 120 ? getQuestionById(id) : undefined;
  if (!question || question.testId !== testId) return NextResponse.json({ error: "unknown_question" }, { status: 400, headers: privateNoStore });
  const rows = await db.questionFeedback.findMany({ where: { userId, testId, questionKey: feedbackQuestionKey(question) }, select: { kind: true } });
  return NextResponse.json({ kinds: rows.map(row => row.kind) }, { headers: privateNoStore });
}

export async function POST() {
  const userId = (await auth())?.user.id;
  return userId
    ? NextResponse.json({ error: "session_feedback_required" }, { status: 410, headers: privateNoStore })
    : NextResponse.json({ error: "unauthenticated" }, { status: 401, headers: privateNoStore });
}
