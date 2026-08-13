import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { buildPaperPlan, type PaperCandidate } from "@/lib/tests/authoring";
import { getPracticeQuestionsForTest } from "@/lib/tests/lookup";

const bodySchema = z.object({
  testId: z.string().min(1),
  title: z.string().min(1).max(120),
  questionCount: z.number().int().min(1).max(100),
  mcqOnly: z.boolean(),
  difficulty: z.object({
    1: z.number().int().min(0),
    2: z.number().int().min(0),
    3: z.number().int().min(0),
  }),
  topicIds: z.array(z.string()),
});

export async function POST(request: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid blueprint", issues: parsed.error.issues }, { status: 400 });
  }

  const candidates: PaperCandidate[] = getPracticeQuestionsForTest(parsed.data.testId).map((question) => ({
    id: question.id,
    testId: question.testId,
    topicId: question.topicId,
    difficulty: question.difficulty,
    type: question.type,
    answer: question.type === "mcq" ? question.answer : undefined,
  }));
  return NextResponse.json(buildPaperPlan(candidates, parsed.data));
}
