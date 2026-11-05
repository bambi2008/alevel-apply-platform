import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { withExactSession } from "@/lib/tests/exact-scores";

/** Legacy client-computed scores are no longer accepted. Existing records remain
 * readable; new reports are created by the locked study-attempt transaction. */
export async function POST() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  return NextResponse.json({ error: userId ? "server_submission_required" : "unauthenticated" }, {
    status: userId ? 409 : 401,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const testId = req.nextUrl.searchParams.get("testId") ?? undefined;

  const profile = await db.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) return NextResponse.json([]);

  const sessions = await db.examSession.findMany({
    where: {
      studentId: profile.id,
      ...(testId ? { testId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      testId: true,
      mode: true,
      totalEarned: true,
      totalEarnedExact: true,
      totalMax: true,
      timeUsedSec: true,
      paperId: true,
      presetId: true,
      completedAt: true,
      createdAt: true,
      _count: { select: { answers: true } },
    },
  });

  return NextResponse.json(sessions.map(withExactSession));
}
