import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getStorage } from "@/lib/storage";

export const runtime = "nodejs";

async function ownedImage(id: string) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return { userId: null, image: null };
  const image = await db.answerImage.findFirst({ where: { id, ownerId: userId } });
  return { userId, image };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const found = await ownedImage(id);
  if (!found.userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  if (!found.image) return NextResponse.json({ error: "not_found" }, { status: 404 });
  try {
    const bytes = await getStorage().get(found.image.fileKey);
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": found.image.mime,
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(found.image.fileName)}`,
        "Cache-Control": "private, max-age=300, must-revalidate",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  } catch {
    return NextResponse.json({ error: "read_failed" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const found = await ownedImage(id);
  if (!found.userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  if (!found.image) return NextResponse.json({ error: "not_found" }, { status: 404 });
  await getStorage().delete(found.image.fileKey).catch(() => undefined);
  await db.answerImage.delete({ where: { id: found.image.id } });
  return NextResponse.json({ ok: true });
}
