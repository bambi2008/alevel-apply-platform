import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getStorage } from "@/lib/storage";

// DELETE /api/documents/[id] —— 删除一份资料（仅归属者）
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const doc = await db.document.findFirst({
    where: { id, ownerId: userId },
  });
  if (!doc) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // 先删存储文件（失败不阻断 DB 记录删除）
  try {
    await getStorage().delete(doc.fileKey);
  } catch {
    /* 存储删除失败仍继续删除数据库记录 */
  }

  await db.document.delete({ where: { id: doc.id } });

  return NextResponse.json({ ok: true });
}
