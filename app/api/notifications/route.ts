import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { syncNotificationsForUser } from "@/lib/notifications/server";

async function currentUserId() {
  const session = await auth();
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

export async function GET(request: NextRequest) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ authenticated: false, items: [], unreadCount: 0 });
  await syncNotificationsForUser(userId);
  const requestedLimit = Number(request.nextUrl.searchParams.get("limit") ?? 50);
  const limit = Math.max(1, Math.min(Number.isFinite(requestedLimit) ? requestedLimit : 50, 100));
  const now = new Date();
  const where = {
    userId,
    dismissedAt: null,
    scheduledFor: { lte: now },
    OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
  };
  const [items, unreadCount] = await Promise.all([
    db.notification.findMany({ where, orderBy: [{ priority: "desc" }, { scheduledFor: "desc" }], take: limit }),
    db.notification.count({ where: { ...where, readAt: null } }),
  ]);
  return NextResponse.json({ authenticated: true, items, unreadCount });
}

export async function PATCH(request: NextRequest) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const input = await request.json() as { action?: string; id?: string };
  const now = new Date();
  if (input.action === "readAll") {
    await db.notification.updateMany({ where: { userId, readAt: null, dismissedAt: null }, data: { readAt: now } });
  } else if (input.id && input.action === "read") {
    await db.notification.updateMany({ where: { id: input.id, userId }, data: { readAt: now } });
  } else if (input.id && input.action === "dismiss") {
    await db.notification.updateMany({ where: { id: input.id, userId }, data: { dismissedAt: now } });
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
