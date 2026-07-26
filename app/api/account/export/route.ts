import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phone: true,
      email: true,
      role: true,
      locale: true,
      createdAt: true,
      updatedAt: true,
      consents: true,
      documents: {
        select: {
          id: true,
          type: true,
          fileName: true,
          mime: true,
          size: true,
          version: true,
          validUntil: true,
          createdAt: true,
        },
      },
      notifications: true,
      notificationPreference: true,
      studentProjects: true,
      applicationPreps: true,
      profile: {
        include: {
          subjects: true,
          testScores: true,
          applications: {
            include: {
              offer: true,
              documents: true,
              materials: true,
              references: true,
            },
          },
          statements: true,
          tasks: true,
          studyGoals: true,
          studyTasks: true,
          shortlistItems: true,
          examSessions: {
            include: { answers: true },
          },
          backgroundItems: true,
        },
      },
    },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const payload = {
    exportedAt: new Date().toISOString(),
    formatVersion: 1,
    user,
  };
  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="qiaoshen-data-${new Date().toISOString().slice(0, 10)}.json"`,
      "cache-control": "private, no-store",
    },
  });
}
