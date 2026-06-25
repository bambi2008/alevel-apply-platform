/**
 * 种子数据：少量 UK / HK 院校与专业样例（字段对齐 docs/product/02_院校字段表.md）。
 * ⚠️ 注意：以下排名/要求/截止为参考样例，正式上线前必须人工核验官方来源（合规要求）。
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // 幂等（开发用）：先清空院校相关
  await db.program.deleteMany();
  await db.university.deleteMany();

  // ---------------- UK ----------------
  const ucl = await db.university.create({
    data: {
      name: "University College London",
      nameZh: "伦敦大学学院",
      region: "UK",
      city: "London",
      league: "Russell Group",
      qsRankWorld: 9,
      ucasCode: "U",
      ucasInstitutionCode: "U80",
      website: "https://www.ucl.ac.uk",
      admissionsUrl: "https://www.ucl.ac.uk/prospective-students/undergraduate",
      applicationSystem: "UCAS",
      applicationFeeGbp: 28,
      maxChoices: 5,
      deadlineMain: new Date("2026-01-29"),
    },
  });

  const manchester = await db.university.create({
    data: {
      name: "University of Manchester",
      nameZh: "曼彻斯特大学",
      region: "UK",
      city: "Manchester",
      league: "Russell Group",
      qsRankWorld: 34,
      ucasCode: "M",
      ucasInstitutionCode: "M20",
      website: "https://www.manchester.ac.uk",
      applicationSystem: "UCAS",
      applicationFeeGbp: 28,
      maxChoices: 5,
      deadlineMain: new Date("2026-01-29"),
    },
  });

  // ---------------- HK ----------------
  const hku = await db.university.create({
    data: {
      name: "The University of Hong Kong",
      nameZh: "香港大学",
      region: "HK",
      city: "Hong Kong",
      league: "HK UGC 8",
      qsRankWorld: 17,
      website: "https://www.hku.hk",
      admissionsUrl: "https://admissions.hku.hk",
      applicationSystem: "DIRECT",
      applicationPortalUrl: "https://admissions.hku.hk",
      applicationFeeHkd: 450,
      deadlineMain: new Date("2026-02-28"),
    },
  });

  const hkust = await db.university.create({
    data: {
      name: "The Hong Kong University of Science and Technology",
      nameZh: "香港科技大学",
      region: "HK",
      city: "Hong Kong",
      league: "HK UGC 8",
      qsRankWorld: 40,
      website: "https://www.hkust.edu.hk",
      admissionsUrl: "https://join.hkust.edu.hk",
      applicationSystem: "DIRECT",
      applicationPortalUrl: "https://join.hkust.edu.hk",
      applicationFeeHkd: 450,
      deadlineMain: new Date("2026-02-28"),
    },
  });

  await db.program.createMany({
    data: [
      {
        universityId: ucl.id,
        name: "Computer Science BSc",
        nameZh: "计算机科学",
        degreeType: "BSc",
        durationYears: 3,
        applyRoute: "UCAS",
        ucasCourseCode: "G400",
        annualTuitionGbp: 35000,
        alevelOfferTypical: "A*A*A",
        alevelOfferMinimum: "A*AA",
        requiredSubjects: [{ subject: "Mathematics", minGrade: "A" }],
        excludedSubjects: ["General Studies"],
        ieltsOverall: 6.5,
        ieltsSubscores: { writing: 6.0, speaking: 6.0, listening: 6.0, reading: 6.0 },
        admissionsTest: null,
        interviewRequired: false,
        requirementsText: "参考样例，需人工核验官方要求。",
      },
      {
        universityId: manchester.id,
        name: "Economics BSc",
        nameZh: "经济学",
        degreeType: "BSc",
        durationYears: 3,
        applyRoute: "UCAS",
        ucasCourseCode: "L100",
        annualTuitionGbp: 30000,
        alevelOfferTypical: "AAA",
        alevelOfferMinimum: "AAB",
        requiredSubjects: [{ subject: "Mathematics", minGrade: "A" }],
        ieltsOverall: 6.5,
        interviewRequired: false,
        requirementsText: "参考样例，需人工核验官方要求。",
      },
      {
        universityId: hku.id,
        name: "Bachelor of Engineering (Computer Science)",
        nameZh: "工学士（计算机科学）",
        degreeType: "BEng",
        durationYears: 4,
        applyRoute: "HK_DIRECT",
        annualTuitionHkd: 182000,
        alevelOfferTypical: "A*AA",
        alevelOfferMinimum: "AAA",
        requiredSubjects: [{ subject: "Mathematics", minGrade: "A" }],
        ieltsOverall: 6.5,
        interviewRequired: true,
        scholarshipAvailable: true,
        requirementsText: "参考样例，需人工核验官方要求（非本地生直申）。",
      },
      {
        universityId: hkust.id,
        name: "BSc in Data Science and Technology",
        nameZh: "数据科学与技术理学士",
        degreeType: "BSc",
        durationYears: 4,
        applyRoute: "HK_DIRECT",
        annualTuitionHkd: 175000,
        alevelOfferTypical: "AAA",
        alevelOfferMinimum: "AAB",
        requiredSubjects: [{ subject: "Mathematics", minGrade: "A" }],
        ieltsOverall: 6.0,
        interviewRequired: false,
        scholarshipAvailable: true,
        requirementsText: "参考样例，需人工核验官方要求（非本地生直申）。",
      },
    ],
  });

  console.log("Seed done: 4 universities, 4 programs (参考样例数据)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
