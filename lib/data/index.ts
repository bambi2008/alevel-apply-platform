// 数据访问层：由 PostgreSQL（Prisma）支撑。页面只调这些函数，与存储实现解耦。
import { db } from "@/lib/db";
import type {
  Program,
  ProgramWithUniversity,
  Region,
  University,
  SubjectRequirement,
  IeltsSubscores,
} from "./types";

type UniRow = {
  id: string; name: string; nameZh: string | null; region: "UK" | "HK";
  city: string | null; league: string | null; qsRankWorld: number | null; website: string | null;
};
type ProgRow = {
  id: string; universityId: string; name: string; nameZh: string | null;
  field: string | null;
  degreeType: string | null; applyRoute: "UCAS" | "HK_DIRECT";
  annualTuitionGbp: number | null; annualTuitionHkd: number | null;
  alevelOfferTypical: string | null; alevelOfferMinimum: string | null;
  requiredSubjects: unknown; excludedSubjects: string[];
  ieltsOverall: number | null; ieltsSubscores: unknown;
  admissionsTest: string | null; interviewRequired: boolean | null;
};

function mapUni(u: UniRow): University {
  return {
    id: u.id,
    name: u.name,
    nameZh: u.nameZh ?? u.name,
    region: u.region,
    city: u.city ?? "",
    league: u.league ?? undefined,
    qsRankWorld: u.qsRankWorld ?? undefined,
    website: u.website ?? undefined,
  };
}

function mapProgram(p: ProgRow): Program {
  return {
    id: p.id,
    universityId: p.universityId,
    name: p.name,
    nameZh: p.nameZh ?? p.name,
    field: p.field ?? undefined,
    degreeType: p.degreeType ?? undefined,
    applyRoute: p.applyRoute,
    annualTuitionGbp: p.annualTuitionGbp ?? undefined,
    annualTuitionHkd: p.annualTuitionHkd ?? undefined,
    alevelOfferTypical: p.alevelOfferTypical ?? undefined,
    alevelOfferMinimum: p.alevelOfferMinimum ?? undefined,
    requiredSubjects: (p.requiredSubjects as SubjectRequirement[] | null) ?? undefined,
    excludedSubjects: p.excludedSubjects ?? undefined,
    ielts: p.ieltsOverall ?? undefined,
    ieltsSubscores: (p.ieltsSubscores as IeltsSubscores | null) ?? undefined,
    admissionsTest: p.admissionsTest ?? undefined,
    interviewRequired: p.interviewRequired ?? undefined,
  };
}

export async function getUniversities(region?: Region): Promise<University[]> {
  const us = await db.university.findMany({
    where: region ? { region } : {},
    orderBy: { qsRankWorld: "asc" },
  });
  return us.map((u) => mapUni(u as UniRow));
}

export async function getUniversity(id: string): Promise<University | null> {
  const u = await db.university.findUnique({ where: { id } });
  return u ? mapUni(u as UniRow) : null;
}

export async function getPrograms(opts?: { region?: Region; q?: string }): Promise<ProgramWithUniversity[]> {
  const ps = await db.program.findMany({
    where: opts?.region ? { university: { region: opts.region } } : {},
    include: { university: true },
    orderBy: { university: { qsRankWorld: "asc" } },
  });
  let list: ProgramWithUniversity[] = ps.map((p) => ({
    ...mapProgram(p as ProgRow),
    university: mapUni(p.university as UniRow),
  }));
  if (opts?.q) {
    const q = opts.q.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameZh.includes(opts.q!) ||
        p.university.name.toLowerCase().includes(q) ||
        p.university.nameZh.includes(opts.q!),
    );
  }
  return list;
}

export async function getProgram(id: string): Promise<ProgramWithUniversity | null> {
  const p = await db.program.findUnique({ where: { id }, include: { university: true } });
  if (!p) return null;
  return { ...mapProgram(p as ProgRow), university: mapUni(p.university as UniRow) };
}
