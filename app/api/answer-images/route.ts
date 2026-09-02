import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  MAX_ANSWER_IMAGE_BYTES,
  validateAnswerImageUpload,
} from "@/lib/security/answer-images";
import { getStorage } from "@/lib/storage";

export const runtime = "nodejs";

function safeContextKey(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text && text.length <= 160 ? text : null;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_form" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "no_file" }, { status: 400 });
  if (file.size > MAX_ANSWER_IMAGE_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  const original = Buffer.from(await file.arrayBuffer());
  const validation = validateAnswerImageUpload(file, original);
  if (!validation.ok) {
    const status = validation.error === "too_large" ? 413 : 415;
    return NextResponse.json({ error: validation.error }, { status });
  }

  let normalized: Buffer;
  let width: number;
  let height: number;
  try {
    const image = sharp(original, { failOn: "warning", limitInputPixels: 40_000_000 })
      .rotate()
      .flatten({ background: "#ffffff" })
      .resize({ width: 2200, height: 2200, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90, chromaSubsampling: "4:4:4" });
    const result = await image.toBuffer({ resolveWithObject: true });
    normalized = result.data;
    width = result.info.width;
    height = result.info.height;
  } catch {
    return NextResponse.json({ error: "invalid_image" }, { status: 415 });
  }

  const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 80) || "answer";
  const storage = getStorage();
  const stored = await storage.put({
    body: normalized,
    fileName: `${baseName}.jpg`,
    mime: "image/jpeg",
  });
  try {
    const answerImage = await db.answerImage.create({
      data: {
        ownerId: userId,
        fileKey: stored.key,
        fileName: stored.fileName,
        mime: "image/jpeg",
        size: stored.size,
        width,
        height,
        contextKey: safeContextKey(form.get("contextKey")),
      },
      select: {
        id: true,
        fileName: true,
        mime: true,
        size: true,
        width: true,
        height: true,
        createdAt: true,
      },
    });
    return NextResponse.json({
      image: {
        ...answerImage,
        url: `/api/answer-images/${answerImage.id}`,
      },
    }, { status: 201 });
  } catch (error) {
    await storage.delete(stored.key).catch(() => undefined);
    throw error;
  }
}
