/**
 * 种子数据：从 lib/data/mock 灌入院校与专业（单一数据源）。
 * ⚠️ 入学要求为参考样例，正式上线前必须人工核验官方来源。
 */
import { PrismaClient } from "@prisma/client";
import { mockUniversities, mockPrograms } from "../lib/data/mock";

const db = new PrismaClient();

async function main() {
  await db.program.deleteMany();
  await db.university.deleteMany();

  for (const u of mockUniversities) {
    await db.university.create({
      data: {
        id: u.id,
        name: u.name,
        nameZh: u.nameZh,
        region: u.region,
        city: u.city,
        league: u.league,
        qsRankWorld: u.qsRankWorld,
        website: u.website,
      },
    });
  }

  for (const p of mockPrograms) {
    await db.program.create({
      data: {
        id: p.id,
        universityId: p.universityId,
        name: p.name,
        nameZh: p.nameZh,
        // mock 的 degreeType 是字符串，对应 Prisma DegreeType 枚举（BA/BSc/BEng…）
        degreeType: p.degreeType as never,
        applyRoute: p.applyRoute,
        annualTuitionGbp: p.annualTuitionGbp,
        annualTuitionHkd: p.annualTuitionHkd,
        alevelOfferTypical: p.alevelOfferTypical,
        alevelOfferMinimum: p.alevelOfferMinimum,
        requiredSubjects: (p.requiredSubjects ?? undefined) as never,
        excludedSubjects: p.excludedSubjects ?? [],
        ieltsOverall: p.ielts,
        ieltsSubscores: (p.ieltsSubscores ?? undefined) as never,
        admissionsTest: p.admissionsTest,
        interviewRequired: p.interviewRequired,
      },
    });
  }

  console.log(`Seeded ${mockUniversities.length} universities, ${mockPrograms.length} programs`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
