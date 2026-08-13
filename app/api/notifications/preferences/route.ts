import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const preferenceSchema = z.object({
  studyEnabled: z.boolean().optional(),
  applicationEnabled: z.boolean().optional(),
  deadlineEnabled: z.boolean().optional(),
  weeklyReportEnabled: z.boolean().optional(),
  emailDigestEnabled: z.boolean().optional(),
});

async function currentUserId() {
  const session = await auth();
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const preferences = await db.notificationPreference.upsert({ where: { userId }, create: { userId }, update: {} });
  return NextResponse.json(preferences);
}

export async function PATCH(request: NextRequest) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = preferenceSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid preferences" }, { status: 400 });
  const preferences = await db.notificationPreference.upsert({
    where: { userId }, create: { userId, ...parsed.data }, update: parsed.data,
  });
  const disabledCategories = [
    !preferences.studyEnabled && "STUDY",
    !preferences.applicationEnabled && "APPLICATION",
    !preferences.deadlineEnabled && "DEADLINE",
    !preferences.weeklyReportEnabled && "REPORT",
  ].filter((value): value is "STUDY" | "APPLICATION" | "DEADLINE" | "REPORT" => !!value);
  if (disabledCategories.length) {
    await db.notification.updateMany({
      where: { userId, category: { in: disabledCategories }, dismissedAt: null }, data: { dismissedAt: new Date() },
    });
  }
  return NextResponse.json(preferences);
}
