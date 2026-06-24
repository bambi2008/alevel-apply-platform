/**
 * 种子数据：少量 UK / HK 院校与专业样例。
 * ⚠️ 注意：以下入学要求为占位样例，正式上线前必须人工核验官方来源（合规要求）。
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // 幂等：先清空院校相关（开发用）
  await db.program.deleteMany();
  await db.university.deleteMany();

  // ---------------- UK ----------------
  const ucl = await db.university.create({
    data: {
      name: "University College London",
      nameZh: "伦敦大学学院",
      region: "UK",
      city: "London",
      ucasCode: "U80",
      website: "https://www.ucl.ac.uk",
    },
  });

  const manchester = await db.university.create({
    data: {
      name: "University of Manchester",
      nameZh: "曼彻斯特大学",
      region: "UK",
      city: "Manchester",
      ucasCode: "M20",
      website: "https://www.manchester.ac.uk",
    },
  });

  // ---------------- HK ----------------
  const hku = await db.university.create({
    data: {
      name: "The University of Hong Kong",
      nameZh: "香港大学",
      region: "HK",
      city: "Hong Kong",
      website: "https://www.hku.hk",
    },
  });

  const hkust = await db.university.create({
    data: {
      name: "The Hong Kong University of Science and Technology",
      nameZh: "香港科技大学",
      region: "HK",
      city: "Hong Kong",
      website: "https://www.hkust.edu.hk",
    },
  });

  await db.program.createMany({
    data: [
      {
        universityId: ucl.id,
        name: "Computer Science BSc",
        nameZh: "计算机科学",
        degree: "BSc",
        durationYears: 3,
        applyRoute: "UCAS",
        ucasCourseCode: "G400",
        aLevelOffer: "A*AA",
        requiredSubjects: [{ subject: "Mathematics", minGrade: "A" }],
        englishReq: { ielts: 6.5 },
        requirementsText: "样例数据，需人工核验官方要求。",
      },
      {
        universityId: manchester.id,
        name: "Economics BSc",
        nameZh: "经济学",
        degree: "BSc",
        durationYears: 3,
        applyRoute: "UCAS",
        ucasCourseCode: "L100",
        aLevelOffer: "AAA",
        requiredSubjects: [{ subject: "Mathematics", minGrade: "A" }],
        englishReq: { ielts: 6.5 },
        requirementsText: "样例数据，需人工核验官方要求。",
      },
      {
        universityId: hku.id,
        name: "Bachelor of Engineering (Computer Science)",
        nameZh: "工学士（计算机科学）",
        degree: "BEng",
        durationYears: 4,
        applyRoute: "HK_DIRECT",
        aLevelOffer: "AAA",
        requiredSubjects: [{ subject: "Mathematics", minGrade: "A" }],
        englishReq: { ielts: 6.5 },
        requirementsText: "样例数据，需人工核验官方要求（非本地生直申）。",
      },
      {
        universityId: hkust.id,
        name: "BSc in Data Science and Technology",
        nameZh: "数据科学与技术理学士",
        degree: "BSc",
        durationYears: 4,
        applyRoute: "HK_DIRECT",
        aLevelOffer: "AAB",
        requiredSubjects: [{ subject: "Mathematics", minGrade: "A" }],
        englishReq: { ielts: 6.0 },
        requirementsText: "样例数据，需人工核验官方要求（非本地生直申）。",
      },
    ],
  });

  console.log("Seed done: 4 universities, 4 programs (样例数据)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
