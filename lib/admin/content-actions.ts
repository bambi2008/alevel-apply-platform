"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

async function requireAdmin(): Promise<string> {
  const session = await auth();
  const u = session?.user as { id?: string; role?: string } | undefined;
  if (u?.role !== "ADMIN" || !u.id) throw new Error("forbidden");
  return u.id;
}

const REGIONS = ["UK", "HK"] as const;
const FIELDS = ["cs", "ds", "economics", "business", "math", "engineering", "aerospace", "mechanical", "eee", "physics", "law", "medicine", "psychology"];
const DEGREES = ["BA", "BSc", "BEng", "LLB", "MBChB", "OTHER"];
const ROUTES = ["UCAS", "HK_DIRECT"] as const;

async function audit(actorId: string, action: string, entity: string, entityId: string, meta?: object) {
  await db.auditLog.create({ data: { actorId, action, entity, entityId, meta: (meta ?? {}) as never } });
}

// ─────────── 院校 ───────────
export interface AdminUniversityRow {
  id: string;
  name: string;
  nameZh: string | null;
  region: string;
  city: string | null;
  league: string | null;
  qsRankWorld: number | null;
  website: string | null;
  programCount: number;
}

export async function listUniversitiesAdminAction(): Promise<AdminUniversityRow[]> {
  await requireAdmin();
  const rows = await db.university.findMany({
    orderBy: [{ region: "asc" }, { qsRankWorld: "asc" }],
    select: {
      id: true, name: true, nameZh: true, region: true, city: true,
      league: true, qsRankWorld: true, website: true,
      _count: { select: { programs: true } },
    },
  });
  return rows.map((u) => ({
    id: u.id, name: u.name, nameZh: u.nameZh, region: u.region, city: u.city,
    league: u.league, qsRankWorld: u.qsRankWorld, website: u.website,
    programCount: u._count.programs,
  }));
}

export interface UniversityInput {
  id?: string; // 有则更新，无则新建
  name: string;
  nameZh?: string | null;
  region: string;
  city?: string | null;
  league?: string | null;
  qsRankWorld?: number | null;
  website?: string | null;
}

export async function upsertUniversityAction(input: UniversityInput): Promise<{ ok: boolean; error?: string; id?: string }> {
  const actorId = await requireAdmin();
  if (!input.name?.trim()) return { ok: false, error: "name_required" };
  if (!(REGIONS as readonly string[]).includes(input.region)) return { ok: false, error: "bad_region" };

  const data = {
    name: input.name.trim(),
    nameZh: input.nameZh?.trim() || null,
    region: input.region as "UK" | "HK",
    city: input.city?.trim() || null,
    league: input.league?.trim() || null,
    qsRankWorld: input.qsRankWorld ?? null,
    website: input.website?.trim() || null,
  };

  if (input.id) {
    await db.university.update({ where: { id: input.id }, data });
    await audit(actorId, "UNIVERSITY_UPDATE", "University", input.id);
    return { ok: true, id: input.id };
  } else {
    const created = await db.university.create({ data });
    await audit(actorId, "UNIVERSITY_CREATE", "University", created.id);
    return { ok: true, id: created.id };
  }
}

export async function deleteUniversityAction(id: string): Promise<{ ok: boolean; error?: string }> {
  const actorId = await requireAdmin();
  // 若该校任一专业被申请引用，则禁止删除（避免破坏用户申请记录）
  const referenced = await db.application.count({ where: { program: { universityId: id } } });
  if (referenced > 0) return { ok: false, error: "has_applications" };
  await db.program.deleteMany({ where: { universityId: id } });
  await db.university.delete({ where: { id } });
  await audit(actorId, "UNIVERSITY_DELETE", "University", id);
  return { ok: true };
}

// ─────────── 专业 ───────────
export interface AdminProgramRow {
  id: string;
  name: string;
  nameZh: string | null;
  field: string | null;
  degreeType: string | null;
  applyRoute: string;
  annualTuitionGbp: number | null;
  annualTuitionHkd: number | null;
  alevelOfferTypical: string | null;
  ieltsOverall: number | null;
  admissionsTest: string | null;
  interviewRequired: boolean | null;
  coursePageUrl: string | null;
  verifiedAt: string | null;
}

export async function listProgramsAdminAction(universityId: string): Promise<AdminProgramRow[]> {
  await requireAdmin();
  const rows = await db.program.findMany({
    where: { universityId },
    orderBy: { name: "asc" },
    select: {
      id: true, name: true, nameZh: true, field: true, degreeType: true, applyRoute: true,
      annualTuitionGbp: true, annualTuitionHkd: true, alevelOfferTypical: true,
      ieltsOverall: true, admissionsTest: true, interviewRequired: true,
      coursePageUrl: true, verifiedAt: true,
    },
  });
  return rows.map((p) => ({
    ...p,
    verifiedAt: p.verifiedAt ? p.verifiedAt.toISOString().slice(0, 10) : null,
  }));
}

export interface ProgramInput {
  id?: string;
  universityId: string;
  name: string;
  nameZh?: string | null;
  field?: string | null;
  degreeType?: string | null;
  applyRoute: string;
  annualTuitionGbp?: number | null;
  annualTuitionHkd?: number | null;
  alevelOfferTypical?: string | null;
  alevelOfferMinimum?: string | null;
  ieltsOverall?: number | null;
  admissionsTest?: string | null;
  interviewRequired?: boolean | null;
  coursePageUrl?: string | null;
  markVerified?: boolean; // 勾选后把 verifiedAt 设为当前时间
}

export async function upsertProgramAction(input: ProgramInput): Promise<{ ok: boolean; error?: string; id?: string }> {
  const actorId = await requireAdmin();
  if (!input.name?.trim()) return { ok: false, error: "name_required" };
  if (!(ROUTES as readonly string[]).includes(input.applyRoute)) return { ok: false, error: "bad_route" };
  if (input.field && !FIELDS.includes(input.field)) return { ok: false, error: "bad_field" };
  if (input.degreeType && !DEGREES.includes(input.degreeType)) return { ok: false, error: "bad_degree" };

  const uni = await db.university.findUnique({ where: { id: input.universityId }, select: { id: true } });
  if (!uni) return { ok: false, error: "university_not_found" };

  const data = {
    universityId: input.universityId,
    name: input.name.trim(),
    nameZh: input.nameZh?.trim() || null,
    field: input.field || null,
    degreeType: (input.degreeType || null) as never,
    applyRoute: input.applyRoute as "UCAS" | "HK_DIRECT",
    annualTuitionGbp: input.annualTuitionGbp ?? null,
    annualTuitionHkd: input.annualTuitionHkd ?? null,
    alevelOfferTypical: input.alevelOfferTypical?.trim() || null,
    alevelOfferMinimum: input.alevelOfferMinimum?.trim() || null,
    ieltsOverall: input.ieltsOverall ?? null,
    admissionsTest: input.admissionsTest?.trim() || null,
    interviewRequired: input.interviewRequired ?? null,
    coursePageUrl: input.coursePageUrl?.trim() || null,
    ...(input.markVerified ? { verifiedAt: new Date() } : {}),
  };

  if (input.id) {
    await db.program.update({ where: { id: input.id }, data });
    await audit(actorId, "PROGRAM_UPDATE", "Program", input.id);
    return { ok: true, id: input.id };
  } else {
    const created = await db.program.create({ data });
    await audit(actorId, "PROGRAM_CREATE", "Program", created.id);
    return { ok: true, id: created.id };
  }
}

export async function deleteProgramAction(id: string): Promise<{ ok: boolean; error?: string }> {
  const actorId = await requireAdmin();
  const referenced = await db.application.count({ where: { programId: id } });
  if (referenced > 0) return { ok: false, error: "has_applications" };
  await db.program.delete({ where: { id } });
  await audit(actorId, "PROGRAM_DELETE", "Program", id);
  return { ok: true };
}
