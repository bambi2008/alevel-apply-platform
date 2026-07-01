"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import type { UserProfile, GradeKind } from "./store";
import type { Region } from "@/lib/data/types";

async function currentUserId(): Promise<string | null> {
  const session = await auth();
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

/**
 * 读取登录用户的档案。
 * authed=false 表示未登录（调用方应回退到 localStorage）。
 * authed=true 且 profile=null 表示已登录但尚未建档。
 */
export async function getProfileAction(): Promise<{
  authed: boolean;
  profile: UserProfile | null;
}> {
  const userId = await currentUserId();
  if (!userId) return { authed: false, profile: null };

  const sp = await db.studentProfile.findUnique({
    where: { userId },
    include: { subjects: true, testScores: true },
  });
  if (!sp) return { authed: true, profile: null };

  const ielts = sp.testScores.find((t) => t.type === "IELTS");
  const profile: UserProfile = {
    fullName: sp.fullName ?? undefined,
    school: sp.school ?? undefined,
    intakeYear: sp.intakeYear ?? undefined,
    targetRegions: sp.targetRegions as Region[],
    intendedMajors: sp.intendedMajors,
    subjects: sp.subjects.map((s) => ({
      subject: s.subject,
      grade: s.grade,
      kind: s.kind as GradeKind,
    })),
    ielts: ielts?.overall ?? null,
    ieltsSubscores:
      (ielts?.subscores as UserProfile["ieltsSubscores"]) ?? null,
  };
  return { authed: true, profile };
}

/**
 * 保存登录用户的档案（整体覆盖）。
 * 返回 authed=false 表示未登录（调用方应回退到 localStorage）。
 */
export async function saveProfileAction(
  p: UserProfile
): Promise<{ authed: boolean }> {
  const userId = await currentUserId();
  if (!userId) return { authed: false };

  const sp = await db.studentProfile.upsert({
    where: { userId },
    create: {
      userId,
      fullName: p.fullName ?? null,
      school: p.school ?? null,
      intakeYear: p.intakeYear ?? null,
      targetRegions: p.targetRegions,
      intendedMajors: p.intendedMajors,
    },
    update: {
      fullName: p.fullName ?? null,
      school: p.school ?? null,
      intakeYear: p.intakeYear ?? null,
      targetRegions: p.targetRegions,
      intendedMajors: p.intendedMajors,
    },
  });

  // 科目：整体替换
  await db.aLevelSubject.deleteMany({ where: { profileId: sp.id } });
  const subjects = p.subjects.filter((s) => s.subject && s.grade);
  if (subjects.length) {
    await db.aLevelSubject.createMany({
      data: subjects.map((s) => ({
        profileId: sp.id,
        subject: s.subject,
        grade: s.grade,
        kind: s.kind,
      })),
    });
  }

  // 雅思成绩：整体替换（以 TestScore 中 type=IELTS 存储）
  await db.testScore.deleteMany({
    where: { profileId: sp.id, type: "IELTS" },
  });
  if (p.ielts != null || p.ieltsSubscores) {
    await db.testScore.create({
      data: {
        profileId: sp.id,
        type: "IELTS",
        overall: p.ielts ?? null,
        subscores: p.ieltsSubscores
          ? (p.ieltsSubscores as unknown as Prisma.InputJsonValue)
          : undefined,
      },
    });
  }

  return { authed: true };
}
