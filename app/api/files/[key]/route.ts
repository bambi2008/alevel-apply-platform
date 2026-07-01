import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getStorage } from "@/lib/storage";

// GET /api/files/[key] —— 按存储 key 返回文件字节。
// 仅允许文件归属者本人下载（校验 Document.ownerId == 当前登录用户）。
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const doc = await db.document.findFirst({
    where: { fileKey: key, ownerId: userId },
  });
  if (!doc) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  try {
    const bytes = await getStorage().get(key);
    return new NextResponse(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": doc.mime || "application/octet-stream",
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(
          doc.fileName
        )}`,
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json({ error: "read_failed" }, { status: 500 });
  }
}
