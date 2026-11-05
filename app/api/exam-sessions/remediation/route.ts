import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getTestById } from "@/lib/tests";
import { buildRemediationProfile } from "@/lib/tests/remediation";
import { loadStudentAdaptiveData } from "@/lib/study/adaptive-server";
import { getQuestionById } from "@/lib/tests/lookup";
import { localizeStaticContent } from "@/lib/content-language";
import { aiResponseLanguage } from "@/lib/ai-response-language";

export async function GET(req: NextRequest) {
  const testId = req.nextUrl.searchParams.get("testId") ?? "";
  const test = getTestById(testId);
  if (!test?.hasQuestionBank) return NextResponse.json({ error: "Unknown test" }, { status: 404 });

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ authenticated: false });

  const student = await db.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!student) {
    return NextResponse.json({
      authenticated: true,
      profile: buildRemediationProfile({ answers: [] }),
    });
  }
  const adaptive = await loadStudentAdaptiveData(student.id, testId);
  if (!adaptive) return NextResponse.json({ error: "Unknown test" }, { status: 404 });
  const profile = buildRemediationProfile({ answers: adaptive.observations });
  const questionPreviews = Object.fromEntries(profile.cases.flatMap(item => {
    const original = getQuestionById(item.questionId);
    if (!original || original.testId !== testId) return [];
    const question = localizeStaticContent(original, aiResponseLanguage(req));
    return [[question.id, question.type === "mcq" ? question.question : question.parts[0]?.question ?? question.id]];
  }));
  return NextResponse.json({
    authenticated: true,
    profile, questionPreviews,
  }, { headers: { "Cache-Control": "private, no-store" } });
}
