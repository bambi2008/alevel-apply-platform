import { createHash } from "node:crypto";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStorage } from "@/lib/storage";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME = new Set(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]);
const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx"]);
function hashToken(token: string) { return createHash("sha256").update(token).digest("hex"); }

async function requestRecord(token: string) {
  return db.recommendationRequest.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { application: { include: { student: true, program: { include: { university: true } } } } },
  });
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const record = await requestRecord(token);
  if (!record) return NextResponse.json({ error: "Invalid link" }, { status: 404 });
  if (record.status === "PENDING" && record.expiresAt < new Date()) {
    await db.recommendationRequest.update({ where: { id: record.id }, data: { status: "EXPIRED" } });
    record.status = "EXPIRED";
  }
  return NextResponse.json({
    status: record.status, recommenderName: record.recommenderName, message: record.message,
    expiresAt: record.expiresAt, studentName: record.application.student.fullName,
    program: { name: record.application.program.name, nameZh: record.application.program.nameZh, university: record.application.program.university.name, universityZh: record.application.program.university.nameZh },
  });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const record = await requestRecord(token);
  if (!record) return NextResponse.json({ error: "Invalid link" }, { status: 404 });
  if (record.status !== "PENDING" || record.expiresAt < new Date()) return NextResponse.json({ error: "Link is not active" }, { status: 410 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "File too large" }, { status: 413 });
  if (!ALLOWED_MIME.has(file.type) || !ALLOWED_EXTENSIONS.has(path.extname(file.name).toLowerCase())) return NextResponse.json({ error: "Only PDF, DOC and DOCX are accepted" }, { status: 415 });
  const stored = await getStorage().put({ body: Buffer.from(await file.arrayBuffer()), fileName: file.name, mime: file.type });
  try {
    await db.$transaction(async (tx) => {
      const claimed = await tx.recommendationRequest.updateMany({ where: { id: record.id, status: "PENDING", expiresAt: { gt: new Date() } }, data: { status: "SUBMITTED", submittedAt: new Date() } });
      if (claimed.count !== 1) throw new Error("LINK_ALREADY_USED");
      const document = await tx.document.create({ data: { ownerId: record.application.student.userId, type: "OTHER", fileKey: stored.key, fileName: stored.fileName, mime: stored.mime, size: stored.size } });
      await tx.recommendationRequest.update({ where: { id: record.id }, data: { documentId: document.id } });
      if (record.materialId) await tx.applicationMaterial.update({ where: { id: record.materialId }, data: { documentId: document.id, status: "READY" } });
      await tx.applicationDocument.upsert({ where: { applicationId_documentId: { applicationId: record.applicationId, documentId: document.id } }, create: { applicationId: record.applicationId, documentId: document.id }, update: {} });
      await tx.auditLog.create({ data: { action: "RECOMMENDATION_UPLOADED", entity: "Application", entityId: record.applicationId, meta: { requestId: record.id } } });
    });
  } catch {
    await getStorage().delete(stored.key).catch(() => undefined);
    return NextResponse.json({ error: "Link is not active" }, { status: 410 });
  }
  return NextResponse.json({ ok: true });
}
