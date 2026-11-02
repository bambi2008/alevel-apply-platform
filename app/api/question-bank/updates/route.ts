import { NextRequest, NextResponse } from "next/server";
import { getTestById } from "@/lib/tests";
import { getPracticeReleaseHistory } from "@/lib/tests/practice-updates";
export function GET(request: NextRequest) {
  const testId = request.nextUrl.searchParams.get("testId");
  if (!testId || !getTestById(testId)?.hasQuestionBank) return NextResponse.json({ error: "unknown_exam" }, { status: 400 });
  return NextResponse.json({ updates: getPracticeReleaseHistory(testId).slice(0, 3) }, { headers: { "Cache-Control": "public, max-age=60" } });
}
