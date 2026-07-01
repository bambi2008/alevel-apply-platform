"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

type Role = "STUDENT" | "ADMIN" | "MENTOR";
const ROLES: Role[] = ["STUDENT", "ADMIN", "MENTOR"];

/** 校验当前用户为管理员，返回其 id；否则抛错。 */
async function requireAdmin(): Promise<string> {
  const session = await auth();
  const u = session?.user as { id?: string; role?: string } | undefined;
  if (u?.role !== "ADMIN" || !u.id) throw new Error("forbidden");
  return u.id;
}

/** 当前用户是否管理员（供页面/布局判断，不抛错）。 */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return (session?.user as { role?: string } | undefined)?.role === "ADMIN";
}

export interface AdminStats {
  users: number;
  admins: number;
  applications: number;
  offers: number;
  documents: number;
  statements: number;
  tasks: number;
  examSessions: number;
  universities: number;
  programs: number;
}

export async function getAdminStatsAction(): Promise<AdminStats> {
  await requireAdmin();
  const [
    users,
    admins,
    applications,
    offers,
    documents,
    statements,
    tasks,
    examSessions,
    universities,
    programs,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: "ADMIN" } }),
    db.application.count(),
    db.offer.count(),
    db.document.count(),
    db.personalStatement.count(),
    db.task.count(),
    db.examSession.count(),
    db.university.count(),
    db.program.count(),
  ]);
  return {
    users,
    admins,
    applications,
    offers,
    documents,
    statements,
    tasks,
    examSessions,
    universities,
    programs,
  };
}

export interface AdminUserRow {
  id: string;
  email: string | null;
  phone: string | null;
  role: string;
  createdAt: string;
  hasProfile: boolean;
  applications: number;
}

export async function listUsersAction(): Promise<AdminUserRow[]> {
  await requireAdmin();
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      profile: { select: { id: true, _count: { select: { applications: true } } } },
    },
  });
  return users.map((u) => ({
    id: u.id,
    email: u.email,
    phone: u.phone,
    role: u.role,
    createdAt: u.createdAt.toISOString().slice(0, 10),
    hasProfile: !!u.profile,
    applications: u.profile?._count.applications ?? 0,
  }));
}

export async function setUserRoleAction(
  userId: string,
  role: string
): Promise<{ ok: boolean; error?: string }> {
  const actorId = await requireAdmin();
  if (!ROLES.includes(role as Role)) return { ok: false, error: "invalid_role" };

  // 不允许把自己从管理员降级（避免误锁死后台）
  if (userId === actorId && role !== "ADMIN") {
    return { ok: false, error: "cannot_demote_self" };
  }

  await db.user.update({ where: { id: userId }, data: { role: role as Role } });
  await db.auditLog.create({
    data: {
      actorId,
      action: "USER_ROLE_CHANGE",
      entity: "User",
      entityId: userId,
      meta: { role },
    },
  });
  return { ok: true };
}
