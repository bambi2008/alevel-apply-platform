"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import type { ModuleProgress } from "./index";

async function currentUserId(): Promise<string | null> {
  const session = await auth();
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

export async function getGuideProgressAction(): Promise<{
  authed: boolean;
  progress: ModuleProgress[];
}> {
  const userId = await currentUserId();
  if (!userId) return { authed: false, progress: [] };

  const sp = await db.studentProfile.findUnique({
    where: { userId },
    select: { guideProgress: true },
  });
  const progress = (sp?.guideProgress as ModuleProgress[] | null) ?? [];
  return { authed: true, progress };
}

export async function saveGuideProgressAction(
  data: ModuleProgress[]
): Promise<{ authed: boolean }> {
  const userId = await currentUserId();
  if (!userId) return { authed: false };

  await db.studentProfile.upsert({
    where: { userId },
    create: { userId, guideProgress: data },
    update: { guideProgress: data },
  });
  return { authed: true };
}
