import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { privateNoStore } from "@/lib/security/json-request";
import { readStudyAttempt, StudyAccessError } from "@/lib/tests/study-attempts";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ attemptId: string }> }) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401, headers: privateNoStore });
  const { attemptId } = await params;
  if (attemptId.length > 100) return NextResponse.json({ error: "not_found" }, { status: 404, headers: privateNoStore });
  try { return NextResponse.json(await readStudyAttempt(userId, attemptId), { headers: privateNoStore }); }
  catch (error) {
    if (error instanceof StudyAccessError) return NextResponse.json({ error: error.code }, { status: error.status, headers: privateNoStore });
    throw error;
  }
}
