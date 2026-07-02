"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import type { BackgroundPlanItem, BgStatus } from "./store";

async function currentUserId(): Promise<string | null> {
  const session = await auth();
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

async function ensureProfileId(userId: string): Promise<string> {
  const sp = await db.studentProfile.upsert({
    where: { userId },
    create: { userId },
    update: {},
    select: { id: true },
  });
  return sp.id;
}

async function profileId(userId: string): Promise<string | null> {
  const sp = await db.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  return sp?.id ?? null;
}

function toItem(r: {
  id: string;
  catalogId: string | null;
  title: string;
  category: string;
  field: string | null;
  status: string;
  notes: string | null;
  targetDate: Date | null;
  createdAt: Date;
}): BackgroundPlanItem {
  return {
    id: r.id,
    catalogId: r.catalogId,
    title: r.title,
    category: r.category,
    field: r.field,
    status: r.status as BgStatus,
    notes: r.notes,
    targetDate: r.targetDate ? r.targetDate.toISOString().slice(0, 10) : null,
    createdAt: r.createdAt.getTime(),
  };
}

export async function listBackgroundAction(): Promise<{
  authed: boolean;
  items: BackgroundPlanItem[];
}> {
  const userId = await currentUserId();
  if (!userId) return { authed: false, items: [] };
  const pid = await profileId(userId);
  if (!pid) return { authed: true, items: [] };
  const rows = await db.backgroundItem.findMany({
    where: { studentId: pid },
    orderBy: { createdAt: "asc" },
  });
  return { authed: true, items: rows.map(toItem) };
}

export async function addBackgroundAction(input: {
  catalogId?: string | null;
  title: string;
  category: string;
  field?: string | null;
  targetDate?: string | null;
}): Promise<{ authed: boolean }> {
  const userId = await currentUserId();
  if (!userId) return { authed: false };
  const pid = await ensureProfileId(userId);

  // 从目录添加时去重：同一 catalogId 不重复加入
  if (input.catalogId) {
    const exists = await db.backgroundItem.findFirst({
      where: { studentId: pid, catalogId: input.catalogId },
      select: { id: true },
    });
    if (exists) return { authed: true };
  }

  await db.backgroundItem.create({
    data: {
      studentId: pid,
      catalogId: input.catalogId ?? null,
      title: input.title,
      category: input.category,
      field: input.field ?? null,
      status: "PLANNED",
      targetDate: input.targetDate ? new Date(input.targetDate) : null,
    },
  });
  return { authed: true };
}

export async function updateBackgroundAction(
  id: string,
  patch: { status?: BgStatus; notes?: string | null; targetDate?: string | null }
): Promise<{ authed: boolean }> {
  const userId = await currentUserId();
  if (!userId) return { authed: false };
  const pid = await profileId(userId);
  if (!pid) return { authed: true };
  const owned = await db.backgroundItem.findFirst({
    where: { id, studentId: pid },
    select: { id: true },
  });
  if (!owned) return { authed: true };

  const data: {
    status?: BgStatus;
    notes?: string | null;
    targetDate?: Date | null;
  } = {};
  if (patch.status !== undefined) data.status = patch.status;
  if (patch.notes !== undefined) data.notes = patch.notes;
  if (patch.targetDate !== undefined)
    data.targetDate = patch.targetDate ? new Date(patch.targetDate) : null;

  await db.backgroundItem.update({ where: { id }, data });
  return { authed: true };
}

export async function deleteBackgroundAction(
  id: string
): Promise<{ authed: boolean }> {
  const userId = await currentUserId();
  if (!userId) return { authed: false };
  const pid = await profileId(userId);
  if (!pid) return { authed: true };
  await db.backgroundItem.deleteMany({ where: { id, studentId: pid } });
  return { authed: true };
}

/** 读取当前用户档案（供推荐算法用）。 */
export async function getProfileForRecommendAction(): Promise<{
  intendedMajors: string[];
  subjects: string[];
}> {
  const userId = await currentUserId();
  if (!userId) return { intendedMajors: [], subjects: [] };
  const sp = await db.studentProfile.findUnique({
    where: { userId },
    select: { intendedMajors: true, subjects: { select: { subject: true } } },
  });
  return {
    intendedMajors: sp?.intendedMajors ?? [],
    subjects: (sp?.subjects ?? []).map((s) => s.subject),
  };
}
