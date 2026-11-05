import { NextRequest, NextResponse } from "next/server";
import { getTestById } from "@/lib/tests";
import { getPublishedQuestionsForTest } from "@/lib/tests/published-server";
import { auth } from "@/auth";
import { membershipAccess } from "@/lib/membership/access";
import { questionForDelivery } from "@/lib/tests/delivery-projection";
import { privateNoStore } from "@/lib/security/json-request";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401, headers: privateNoStore });
  if (!(await membershipAccess(userId)).active) return NextResponse.json({ error: "membership_required" }, { status: 402, headers: privateNoStore });
  const testId = request.nextUrl.searchParams.get("testId")?.trim().toLowerCase();
  if (!testId || !getTestById(testId)?.hasQuestionBank) {
    return NextResponse.json({ error: "Unknown test" }, { status: 400 });
  }
  const questions = await getPublishedQuestionsForTest(testId);
  return NextResponse.json({ questions: questions.map(questionForDelivery) }, { headers: privateNoStore });
}
