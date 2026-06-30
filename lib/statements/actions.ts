"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import type { UcasPs, UcasPsContent } from "./store";

const KIND = "UK_UCAS_3Q" as const;

async function currentUserId(): Promise<string | null> {
  const session = await auth();
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

export async function getUcasPsAction(): Promise<{
  authed: boolean;
  ps: UcasPs | null;
}> {
  const userId = await currentUserId();
  if (!userId) return { authed: false, ps: null };

  const sp = await db.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!sp) return { authed: true, ps: null };

  const row = await db.personalStatement.findFirst({
    where: { studentId: sp.id, kind: KIND },
  });
  if (!row) return { authed: true, ps: null };

  const c = (row.content as Partial<UcasPsContent>) ?? {};
  return {
    authed: true,
    ps: {
      content: { q1: c.q1 ?? "", q2: c.q2 ?? "", q3: c.q3 ?? "" },
      updatedAt: row.updatedAt.getTime(),
    },
  };
}

export async function saveUcasPsAction(
  content: UcasPsContent
): Promise<{ authed: boolean }> {
  const userId = await currentUserId();
  if (!userId) return { authed: false };

  const sp = await db.studentProfile.upsert({
    where: { userId },
    create: { userId },
    update: {},
    select: { id: true },
  });

  const wordCount =
    (content.q1?.length ?? 0) +
    (content.q2?.length ?? 0) +
    (content.q3?.length ?? 0);

  const existing = await db.personalStatement.findFirst({
    where: { studentId: sp.id, kind: KIND },
    select: { id: true },
  });

  if (existing) {
    await db.personalStatement.update({
      where: { id: existing.id },
      data: { content, wordCount },
    });
  } else {
    await db.personalStatement.create({
      data: { studentId: sp.id, kind: KIND, content, wordCount },
    });
  }
  return { authed: true };
}
