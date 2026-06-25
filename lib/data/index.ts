// 数据访问层：当前由 mock 数据支撑（DATA_SOURCE=mock）。
// 接入数据库时，把这些函数改为 Prisma 查询（lib/db.ts），页面无需改动。
import { mockPrograms, mockUniversities } from "./mock";
import type { ProgramWithUniversity, Region, University } from "./types";

export async function getUniversities(region?: Region): Promise<University[]> {
  const list = region ? mockUniversities.filter((u) => u.region === region) : mockUniversities;
  return [...list].sort((a, b) => (a.qsRankWorld ?? 9999) - (b.qsRankWorld ?? 9999));
}

export async function getUniversity(id: string): Promise<University | null> {
  return mockUniversities.find((u) => u.id === id) ?? null;
}

function withUniversity(programId?: string): ProgramWithUniversity[] {
  return mockPrograms
    .map((p) => {
      const u = mockUniversities.find((x) => x.id === p.universityId);
      return u ? { ...p, university: u } : null;
    })
    .filter((x): x is ProgramWithUniversity => x !== null)
    .filter((x) => (programId ? x.id === programId : true));
}

export async function getPrograms(opts?: { region?: Region; q?: string }): Promise<ProgramWithUniversity[]> {
  let list = withUniversity();
  if (opts?.region) list = list.filter((p) => p.university.region === opts.region);
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
  return withUniversity(id)[0] ?? null;
}

/** 同步版：供客户端选校页（已内置 mock 数据）使用。 */
export function getAllProgramsSync(): ProgramWithUniversity[] {
  return withUniversity();
}
