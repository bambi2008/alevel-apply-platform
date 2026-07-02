import { PrismaClient } from "@prisma/client";
import { mockUniversities, mockPrograms } from "../lib/data/mock";

const db = new PrismaClient();

async function main() {
  for (const u of mockUniversities) {
    const data = {
      name: u.name, nameZh: u.nameZh, region: u.region, city: u.city,
      league: u.league, qsRankWorld: u.qsRankWorld, website: u.website,
    };
    await db.university.upsert({ where: { id: u.id }, update: data, create: { id: u.id, ...data } });
  }
  for (const p of mockPrograms) {
    const data = {
      universityId: p.universityId, name: p.name, nameZh: p.nameZh, field: p.field,
      degreeType: p.degreeType as never, applyRoute: p.applyRoute,
      annualTuitionGbp: p.annualTuitionGbp, annualTuitionHkd: p.annualTuitionHkd,
      alevelOfferTypical: p.alevelOfferTypical, alevelOfferMinimum: p.alevelOfferMinimum,
      requiredSubjects: (p.requiredSubjects ?? undefined) as never,
      excludedSubjects: p.excludedSubjects ?? [],
      ieltsOverall: p.ielts, ieltsSubscores: (p.ieltsSubscores ?? undefined) as never,
      admissionsTest: p.admissionsTest, interviewRequired: p.interviewRequired,
    };
    await db.program.upsert({ where: { id: p.id }, update: data, create: { id: p.id, ...data } });
  }
  console.log(`Seeded/updated ${mockUniversities.length} universities, ${mockPrograms.length} programs`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await db.$disconnect(); });
