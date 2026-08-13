import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { loadCommandCenter, ownedApplication } from "@/lib/applications/command-center-server";

const schema = z.object({
  documentId: z.string().nullable().optional(),
  status: z.enum(["MISSING", "READY", "NEEDS_UPDATE", "WAIVED"]).optional(),
  notes: z.string().trim().max(500).nullable().optional(),
  dueDate: z.string().date().nullable().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; materialId: string }> }) {
  const session = await auth();
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, materialId } = await params;
  if (!await ownedApplication(uid, id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const material = await db.applicationMaterial.findFirst({ where: { id: materialId, applicationId: id } });
  if (!material) return NextResponse.json({ error: "Material not found" }, { status: 404 });
  let status = parsed.data.status;
  if (parsed.data.status === "WAIVED" && material.required) return NextResponse.json({ error: "Required material cannot be waived" }, { status: 409 });
  if (parsed.data.documentId) {
    const document = await db.document.findFirst({ where: { id: parsed.data.documentId, ownerId: uid } });
    if (!document) return NextResponse.json({ error: "Document not found" }, { status: 404 });
    if (material.acceptedTypes.length && !material.acceptedTypes.includes(document.type)) return NextResponse.json({ error: "Document type not accepted" }, { status: 409 });
    status = document.validUntil && document.validUntil < new Date() ? "NEEDS_UPDATE" : "READY";
  }
  if (parsed.data.documentId === null) status = "MISSING";
  await db.applicationMaterial.update({
    where: { id: materialId },
    data: { documentId: parsed.data.documentId, status, notes: parsed.data.notes, dueDate: parsed.data.dueDate ? new Date(`${parsed.data.dueDate}T00:00:00Z`) : parsed.data.dueDate },
  });
  if (parsed.data.documentId) await db.applicationDocument.upsert({
    where: { applicationId_documentId: { applicationId: id, documentId: parsed.data.documentId } },
    create: { applicationId: id, documentId: parsed.data.documentId }, update: {},
  });
  return NextResponse.json(await loadCommandCenter(uid, id));
}
