import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { loadCommandCenter } from "@/lib/applications/command-center-server";
import { canConfirmSubmission } from "@/lib/applications/readiness";

const patchSchema = z.object({
  feePaid: z.boolean().optional(),
  externalRef: z.string().trim().max(100).nullable().optional(),
  action: z.enum(["start", "submit"]).optional(),
});

async function userId() {
  const session = await auth();
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const uid = await userId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const data = await loadCommandCenter(uid, id);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const uid = await userId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const current = await loadCommandCenter(uid, id);
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const feePaid = parsed.data.feePaid ?? current.application.feePaid;
  if (parsed.data.action === "submit" && !canConfirmSubmission(current.readiness, feePaid)) {
    return NextResponse.json({ error: !current.readiness.canSubmit ? "Materials incomplete" : "Application fee not confirmed", readiness: current.readiness }, { status: 409 });
  }
  await db.$transaction(async (tx) => {
    await tx.application.update({ where: { id }, data: {
      feePaid: parsed.data.feePaid,
      externalRef: parsed.data.externalRef,
      status: parsed.data.action === "start" ? "IN_PROGRESS" : parsed.data.action === "submit" ? "SUBMITTED" : undefined,
      submittedAt: parsed.data.action === "submit" ? new Date() : undefined,
    } });
    if (parsed.data.action === "submit") await tx.auditLog.create({ data: { actorId: uid, action: "APPLICATION_SUBMITTED_CONFIRMED", entity: "Application", entityId: id, meta: { externalRef: parsed.data.externalRef ?? current.application.externalRef } } });
  });
  return NextResponse.json(await loadCommandCenter(uid, id));
}
