import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getTestById } from "@/lib/tests";
import { loadStudentReadiness } from "@/lib/study/readiness-server";

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
  if (!student) return NextResponse.json({ authenticated: true, readiness: null });

  const readiness = await loadStudentReadiness(student.id, testId);
  return NextResponse.json({ authenticated: true, readiness });
}
