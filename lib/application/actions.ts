"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import type { AppPrepRegion } from "@/lib/application/prep-schema";

async function currentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export type PrepData = Record<string, Record<string, unknown>>;

export async function getApplicationPrep(
  region: AppPrepRegion
): Promise<{ authed: boolean; data: PrepData | null; updatedAt: number | null }> {
  const userId = await currentUserId();
  if (!userId) return { authed: false, data: null, updatedAt: null };

  const row = await db.applicationPrep.findUnique({
    where: { ownerId_region: { ownerId: userId, region } },
  });
  if (!row) return { authed: true, data: null, updatedAt: null };
  return {
    authed: true,
    data: (row.data as PrepData) ?? {},
    updatedAt: row.updatedAt.getTime(),
  };
}

export async function saveApplicationPrep(
  region: AppPrepRegion,
  data: PrepData
): Promise<{ authed: boolean }> {
  const userId = await currentUserId();
  if (!userId) return { authed: false };

  const json = data as unknown as Prisma.InputJsonValue;
  await db.applicationPrep.upsert({
    where: { ownerId_region: { ownerId: userId, region } },
    create: { ownerId: userId, region, data: json },
    update: { data: json },
  });
  return { authed: true };
}
