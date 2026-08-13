import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { selectAdaptiveQuestions } from "@/lib/tests/adaptive";
import { getTestById } from "@/lib/tests";
import { loadStudentAdaptiveData } from "@/lib/study/adaptive-server";
import { buildRemediationProfile, selectRemediationQuestions } from "@/lib/tests/remediation";

export async function GET(req: NextRequest) {
  const testId = req.nextUrl.searchParams.get("testId") ?? "";
  const test = getTestById(testId);
  if (!test?.hasQuestionBank) return NextResponse.json({ error: "Unknown test" }, { status: 404 });

  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ authenticated: false });

  const student = await db.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!student) return NextResponse.json({ authenticated: true, profile: null });
  const adaptive = await loadStudentAdaptiveData(student.id, testId);
  if (!adaptive) return NextResponse.json({ error: "Unknown test" }, { status: 404 });
  const { profile: adaptiveProfile, observations, practiceQuestions } = adaptive;
  const requestedCount = Number(req.nextUrl.searchParams.get("count") ?? 15);
  const count = Number.isFinite(requestedCount) ? Math.max(1, Math.min(30, Math.round(requestedCount))) : 15;
  const topicId = req.nextUrl.searchParams.get("topicId") ?? undefined;
  const reviewOnly = req.nextUrl.searchParams.get("review") === "1";
  const remediationOnly = req.nextUrl.searchParams.get("remediation") === "1";
  const format = req.nextUrl.searchParams.get("format") ?? "all";
  const questions = practiceQuestions.filter((question) => {
    if (format === "all") return true;
    if (format === "mcq") return question.type === "mcq";
    const shortProof = question.type === "long" && question.id.startsWith("bmo-sp-");
    return format === "short-proof" ? shortProof : format === "long" && question.type === "long" && !shortProof;
  }).map((question) => ({
    id: question.id,
    topicId: question.topicId,
    difficulty: question.difficulty,
    type: question.type,
  }));
  const recommendedQuestionIds = remediationOnly
    ? selectRemediationQuestions({
      profile: buildRemediationProfile({ answers: observations }),
      questions,
      count,
    })
    : selectAdaptiveQuestions({
      questions,
      answers: observations,
      profile: adaptiveProfile,
      count,
      topicId,
      reviewOnly,
    });

  return NextResponse.json({ authenticated: true, ...adaptiveProfile, recommendedQuestionIds });
}
