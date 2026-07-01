import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getStorage } from "@/lib/storage";

const DOC_TYPES = [
  "TRANSCRIPT",
  "PASSPORT",
  "PREDICTED_GRADES",
  "IELTS",
  "TOEFL",
  "CERTIFICATE",
  "PHOTO",
  "OTHER",
] as const;
type DocType = (typeof DOC_TYPES)[number];

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

async function currentUserId(): Promise<string | null> {
  const session = await auth();
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

// GET /api/documents —— 列出当前用户的资料
export async function GET() {
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const docs = await db.document.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      fileKey: true,
      fileName: true,
      mime: true,
      size: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ documents: docs });
}

// POST /api/documents —— 上传一个文件（multipart/form-data: file, type）
export async function POST(req: NextRequest) {
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "invalid_form" }, { status: 400 });
  }

  const file = form.get("file");
  const typeRaw = String(form.get("type") || "OTHER");
  const type: DocType = (DOC_TYPES as readonly string[]).includes(typeRaw)
    ? (typeRaw as DocType)
    : "OTHER";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "empty_file" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const stored = await getStorage().put({
    body: buffer,
    fileName: file.name,
    mime: file.type || undefined,
  });

  const doc = await db.document.create({
    data: {
      ownerId: userId,
      type,
      fileKey: stored.key,
      fileName: stored.fileName,
      mime: stored.mime ?? null,
      size: stored.size,
    },
    select: {
      id: true,
      type: true,
      fileKey: true,
      fileName: true,
      mime: true,
      size: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ document: doc }, { status: 201 });
}
