import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getQuestionById } from "@/lib/tests/lookup";
import { getQuestionAuditDashboardData } from "@/lib/tests/audit/server";

const requestSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("approve"), questionId: z.string().min(1).max(120), note: z.string().max(500).optional() }),
  z.object({ action: z.literal("dismiss"), questionId: z.string().min(1).max(120), note: z.string().max(500).optional() }),
  z.object({ action: z.literal("rollback"), decisionId: z.string().min(1).max(120), note: z.string().max(500).optional() }),
]);

export async function POST(req: NextRequest) {
  const session = await auth();
  const actor = session?.user as { id?: string; role?: string } | undefined;
  if (actor?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = requestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const body = parsed.data;

  if (body.action === "rollback") {
    const decision = await db.calibrationDecision.findUnique({ where: { id: body.decisionId } });
    if (!decision || decision.status !== "APPROVED") return NextResponse.json({ error: "Approved decision not found" }, { status: 404 });
    const updated = await db.$transaction(async (tx) => {
      const result = await tx.calibrationDecision.update({ where: { id: decision.id }, data: { status: "ROLLED_BACK", note: body.note ?? decision.note } });
      await tx.auditLog.create({ data: { actorId: actor.id, action: "CALIBRATION_ROLLBACK", entity: "Question", entityId: decision.questionId, meta: { decisionId: decision.id } } });
      return result;
    });
    return NextResponse.json({ id: updated.id, status: updated.status });
  }

  const question = getQuestionById(body.questionId);
  if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });
  const dashboard = await getQuestionAuditDashboardData();
  const calibration = dashboard.calibration.find((item) => item.questionId === body.questionId);
  if (!calibration || calibration.status === "insufficient") return NextResponse.json({ error: "Calibration sample is below the release threshold" }, { status: 409 });
  if (body.action === "approve" && calibration.suggestedDifficulty === question.difficulty) return NextResponse.json({ error: "No difficulty change is recommended" }, { status: 409 });

  const status = body.action === "approve" ? "APPROVED" as const : "DISMISSED" as const;
  const decision = await db.$transaction(async (tx) => {
    const result = await tx.calibrationDecision.create({
      data: { questionId: question.id, testId: question.testId, fromDifficulty: question.difficulty, toDifficulty: calibration.suggestedDifficulty, status, metrics: calibration as unknown as Prisma.InputJsonValue, note: body.note, actorId: actor.id },
    });
    await tx.auditLog.create({ data: { actorId: actor.id, action: status === "APPROVED" ? "CALIBRATION_APPROVE" : "CALIBRATION_DISMISS", entity: "Question", entityId: question.id, meta: { decisionId: result.id, from: question.difficulty, to: calibration.suggestedDifficulty } } });
    return result;
  });
  return NextResponse.json({ id: decision.id, status: decision.status }, { status: 201 });
}
