"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import type {
  StudentIdeaInputs,
  StudentStructure,
  StudentProgress,
  StudentProjectDTO,
  StudentProjectStatus,
} from "./student-project-types";

async function currentUserId(): Promise<string | null> {
  const session = await auth();
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

type Row = {
  id: string;
  title: string;
  field: string;
  summary: string | null;
  ideaInputs: unknown;
  structure: unknown;
  progress: unknown;
  status: StudentProjectStatus;
  createdAt: Date;
  updatedAt: Date;
};

function toDTO(r: Row): StudentProjectDTO {
  return {
    id: r.id,
    title: r.title,
    field: r.field,
    summary: r.summary,
    ideaInputs: (r.ideaInputs as StudentIdeaInputs) ?? {
      question: "",
      motivation: "",
      method: "",
      variables: "",
    },
    structure: (r.structure as StudentStructure | null) ?? null,
    progress: (r.progress as StudentProgress | null) ?? null,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

// 创建一个自提课题（草稿，尚无结构）
export async function createStudentProject(input: {
  title: string;
  field: string;
  idea: StudentIdeaInputs;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, error: "请先登录" };
  if (!input.title.trim()) return { ok: false, error: "请填写课题标题" };

  const row = await db.studentProject.create({
    data: {
      ownerId: userId,
      title: input.title.trim(),
      field: input.field || "OTHER",
      ideaInputs: input.idea as object,
      status: "DRAFT",
    },
    select: { id: true },
  });
  return { ok: true, id: row.id };
}

// 列出我的自提课题
export async function listMyStudentProjects(): Promise<StudentProjectDTO[]> {
  const userId = await currentUserId();
  if (!userId) return [];
  const rows = await db.studentProject.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map((r) => toDTO(r as Row));
}

// 取单个（校验归属）
export async function getStudentProjectById(
  id: string
): Promise<StudentProjectDTO | null> {
  const userId = await currentUserId();
  if (!userId) return null;
  const row = await db.studentProject.findUnique({ where: { id } });
  if (!row || row.ownerId !== userId) return null;
  return toDTO(row as Row);
}

// 保存 AI 生成/学生编辑后的结构
export async function saveStudentStructure(input: {
  id: string;
  title?: string;
  field?: string;
  summary?: string;
  structure: StudentStructure;
}): Promise<{ ok: boolean; error?: string }> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, error: "请先登录" };
  const row = await db.studentProject.findUnique({
    where: { id: input.id },
    select: { ownerId: true },
  });
  if (!row || row.ownerId !== userId) return { ok: false, error: "无权限" };

  await db.studentProject.update({
    where: { id: input.id },
    data: {
      ...(input.title ? { title: input.title.trim() } : {}),
      ...(input.field ? { field: input.field } : {}),
      ...(input.summary !== undefined ? { summary: input.summary } : {}),
      structure: input.structure as object,
      status: "ACTIVE",
    },
  });
  return { ok: true };
}

// 保存进度
export async function saveStudentProgress(input: {
  id: string;
  progress: StudentProgress;
}): Promise<{ ok: boolean; error?: string }> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, error: "请先登录" };
  const row = await db.studentProject.findUnique({
    where: { id: input.id },
    select: { ownerId: true },
  });
  if (!row || row.ownerId !== userId) return { ok: false, error: "无权限" };

  await db.studentProject.update({
    where: { id: input.id },
    data: { progress: input.progress as object },
  });
  return { ok: true };
}

// 设置状态（如标记完成）
export async function setStudentProjectStatus(input: {
  id: string;
  status: StudentProjectStatus;
}): Promise<{ ok: boolean; error?: string }> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, error: "请先登录" };
  const row = await db.studentProject.findUnique({
    where: { id: input.id },
    select: { ownerId: true },
  });
  if (!row || row.ownerId !== userId) return { ok: false, error: "无权限" };
  await db.studentProject.update({
    where: { id: input.id },
    data: { status: input.status },
  });
  return { ok: true };
}

// 删除
export async function deleteStudentProject(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, error: "请先登录" };
  const row = await db.studentProject.findUnique({
    where: { id },
    select: { ownerId: true },
  });
  if (!row || row.ownerId !== userId) return { ok: false, error: "无权限" };
  await db.studentProject.delete({ where: { id } });
  return { ok: true };
}
