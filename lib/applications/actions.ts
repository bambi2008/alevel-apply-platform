"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import type { ApplicationItem, AppStatus, OfferInfo } from "./store";

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

export async function listApplicationsAction(): Promise<{
  authed: boolean;
  items: ApplicationItem[];
}> {
  const userId = await currentUserId();
  if (!userId) return { authed: false, items: [] };
  const pid = await profileId(userId);
  if (!pid) return { authed: true, items: [] };

  const apps = await db.application.findMany({
    where: { studentId: pid },
    include: { offer: true },
    orderBy: { createdAt: "asc" },
  });

  const items: ApplicationItem[] = apps.map((a) => ({
    id: a.id,
    programId: a.programId,
    addedAt: a.createdAt.getTime(),
    status: a.status as AppStatus,
    offer: a.offer
      ? {
          type: a.offer.type as OfferInfo["type"],
          conditions: a.offer.conditions ?? undefined,
          decision: (a.offer.decision ?? undefined) as OfferInfo["decision"],
        }
      : undefined,
  }));
  return { authed: true, items };
}

export async function hasApplicationAction(
  programId: string
): Promise<{ authed: boolean; has: boolean }> {
  const userId = await currentUserId();
  if (!userId) return { authed: false, has: false };
  const pid = await profileId(userId);
  if (!pid) return { authed: true, has: false };
  const a = await db.application.findFirst({
    where: { studentId: pid, programId },
    select: { id: true },
  });
  return { authed: true, has: !!a };
}

export async function addApplicationAction(
  programId: string
): Promise<{ authed: boolean }> {
  const userId = await currentUserId();
  if (!userId) return { authed: false };
  const pid = await ensureProfileId(userId);

  const existing = await db.application.findFirst({
    where: { studentId: pid, programId },
    select: { id: true },
  });
  if (existing) return { authed: true };

  // choiceType 由课程申请路径推导
  const program = await db.program.findUnique({
    where: { id: programId },
    select: { applyRoute: true },
  });
  const choiceType =
    program?.applyRoute === "HK_DIRECT" ? "HK_DIRECT" : "UCAS_CHOICE";

  await db.application.create({
    data: { studentId: pid, programId, choiceType, status: "PLANNING" },
  });
  return { authed: true };
}

export async function removeApplicationAction(
  programId: string
): Promise<{ authed: boolean }> {
  const userId = await currentUserId();
  if (!userId) return { authed: false };
  const pid = await profileId(userId);
  if (!pid) return { authed: true };
  await db.application.deleteMany({ where: { studentId: pid, programId } });
  return { authed: true };
}

export async function updateApplicationAction(
  programId: string,
  patch: Partial<ApplicationItem>
): Promise<{ authed: boolean }> {
  const userId = await currentUserId();
  if (!userId) return { authed: false };
  const pid = await profileId(userId);
  if (!pid) return { authed: true };

  const app = await db.application.findFirst({
    where: { studentId: pid, programId },
    select: { id: true },
  });
  if (!app) return { authed: true };

  if (patch.status) {
    await db.application.update({
      where: { id: app.id },
      data: { status: patch.status },
    });
  }

  if ("offer" in patch) {
    const o = patch.offer;
    const hasAny = o && (o.type || o.decision || o.conditions);
    if (hasAny) {
      const type = o!.type ?? "CONDITIONAL";
      await db.offer.upsert({
        where: { applicationId: app.id },
        create: {
          applicationId: app.id,
          type,
          conditions: o!.conditions ?? null,
          decision: o!.decision ?? null,
        },
        update: {
          type,
          conditions: o!.conditions ?? null,
          decision: o!.decision ?? null,
        },
      });
    } else {
      await db.offer.deleteMany({ where: { applicationId: app.id } });
    }
  }

  return { authed: true };
}
