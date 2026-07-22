import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { addUtcDays } from "@/lib/study/dates";
import { ownedApplication } from "@/lib/applications/command-center-server";

const createSchema = z.object({
  recommenderName: z.string().trim().min(1).max(100),
  recommenderEmail: z.string().trim().email().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional(),
  expiresDays: z.number().int().min(1).max(60).default(14),
});

function hashToken(token: string) { return createHash("sha256").update(token).digest("hex"); }

async function currentUserId() {
  const session = await auth();
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const uid = await currentUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!await ownedApplication(uid, id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const material = await db.applicationMaterial.findUnique({ where: { applicationId_key: { applicationId: id, key: "reference" } } });
  if (!material) return NextResponse.json({ error: "This application does not require a reference" }, { status: 409 });
  await db.recommendationRequest.updateMany({ where: { applicationId: id, materialId: material.id, status: "PENDING" }, data: { status: "REVOKED" } });
  const token = randomBytes(32).toString("base64url");
  const record = await db.recommendationRequest.create({
    data: {
      applicationId: id, materialId: material.id,
      recommenderName: parsed.data.recommenderName,
      recommenderEmail: parsed.data.recommenderEmail || null,
      message: parsed.data.message || null,
      expiresAt: addUtcDays(new Date(), parsed.data.expiresDays), tokenHash: hashToken(token),
    },
    select: { id: true, expiresAt: true },
  });
  return NextResponse.json({ ...record, url: `${request.nextUrl.origin}/zh-CN/reference/${token}` }, { status: 201 });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const uid = await currentUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!await ownedApplication(uid, id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const input = await request.json() as { requestId?: string };
  if (!input.requestId) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  await db.recommendationRequest.updateMany({ where: { id: input.requestId, applicationId: id, status: "PENDING" }, data: { status: "REVOKED" } });
  return NextResponse.json({ ok: true });
}
