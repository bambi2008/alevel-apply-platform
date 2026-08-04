import { NextRequest, NextResponse } from "next/server";
import { getTestById } from "@/lib/tests";
import { getPublishedQuestionsForTest } from "@/lib/tests/published-server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const testId = request.nextUrl.searchParams.get("testId")?.trim().toLowerCase();
  if (!testId || !getTestById(testId)?.hasQuestionBank) {
    return NextResponse.json({ error: "Unknown test" }, { status: 400 });
  }
  const questions = await getPublishedQuestionsForTest(testId);
  return NextResponse.json({ questions }, { headers: { "Cache-Control": "private, max-age=60" } });
}
