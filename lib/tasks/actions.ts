"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import type { TaskItem, TaskStatus } from "./store";

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

function toItem(t: {
  id: string;
  title: string;
  category: string | null;
  dueDate: Date | null;
  status: string;
  createdAt: Date;
}): TaskItem {
  return {
    id: t.id,
    title: t.title,
    category: t.category,
    dueDate: t.dueDate ? t.dueDate.toISOString().slice(0, 10) : null,
    status: t.status as TaskStatus,
    createdAt: t.createdAt.getTime(),
  };
}

export async function listTasksAction(): Promise<{
  authed: boolean;
  items: TaskItem[];
}> {
  const userId = await currentUserId();
  if (!userId) return { authed: false, items: [] };
  const pid = await profileId(userId);
  if (!pid) return { authed: true, items: [] };
  const rows = await db.task.findMany({
    where: { studentId: pid },
    orderBy: { createdAt: "asc" },
  });
  return { authed: true, items: rows.map(toItem) };
}

export async function addTaskAction(input: {
  title: string;
  category?: string | null;
  dueDate?: string | null;
}): Promise<{ authed: boolean }> {
  const userId = await currentUserId();
  if (!userId) return { authed: false };
  const pid = await ensureProfileId(userId);
  await db.task.create({
    data: {
      studentId: pid,
      title: input.title,
      category: input.category ?? null,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      status: "TODO",
    },
  });
  return { authed: true };
}

export async function updateTaskAction(
  id: string,
  patch: { title?: string; category?: string | null; dueDate?: string | null; status?: TaskStatus }
): Promise<{ authed: boolean }> {
  const userId = await currentUserId();
  if (!userId) return { authed: false };
  const pid = await profileId(userId);
  if (!pid) return { authed: true };
  // 仅允许更新属于自己的任务
  const owned = await db.task.findFirst({
    where: { id, studentId: pid },
    select: { id: true },
  });
  if (!owned) return { authed: true };

  const data: {
    title?: string;
    category?: string | null;
    dueDate?: Date | null;
    status?: TaskStatus;
  } = {};
  if (patch.title !== undefined) data.title = patch.title;
  if (patch.category !== undefined) data.category = patch.category;
  if (patch.dueDate !== undefined)
    data.dueDate = patch.dueDate ? new Date(patch.dueDate) : null;
  if (patch.status !== undefined) data.status = patch.status;

  await db.task.update({ where: { id }, data });
  return { authed: true };
}

export async function deleteTaskAction(id: string): Promise<{ authed: boolean }> {
  const userId = await currentUserId();
  if (!userId) return { authed: false };
  const pid = await profileId(userId);
  if (!pid) return { authed: true };
  await db.task.deleteMany({ where: { id, studentId: pid } });
  return { authed: true };
}
