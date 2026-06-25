// Mock 院校/专业数据（参考样例，需人工核验官方来源后方可上线）。
// 切换到真实 DB 时，本文件由 Prisma 查询替代（见 lib/data/index.ts）。
import type { University, Program } from "./types";

export const mockUniversities: University[] = [
  { id: "ox", name: "University of Oxford", nameZh: "牛津大学", region: "UK", city: "Oxford", league: "Russell Group", qsRankWorld: 3, website: "https://www.ox.ac.uk" },
  { id: "cam", name: "University of Cambridge", nameZh: "剑桥大学", region: "UK", city: "Cambridge", league: "Russell Group", qsRankWorld: 5, website: "https://www.cam.ac.uk" },
  { id: "ic", name: "Imperial College London", nameZh: "帝国理工学院", region: "UK", city: "London", league: "Russell Group", qsRankWorld: 8, website: "https://www.imperial.ac.uk" },
  { id: "ucl", name: "University College London", nameZh: "伦敦大学学院", region: "UK", city: "London", league: "Russell Group", qsRankWorld: 9, website: "https://www.ucl.ac.uk" },
  { id: "ed", name: "University of Edinburgh", nameZh: "爱丁堡大学", region: "UK", city: "Edinburgh", league: "Russell Group", qsRankWorld: 22, website: "https://www.ed.ac.uk" },
  { id: "man", name: "University of Manchester", nameZh: "曼彻斯特大学", region: "UK", city: "Manchester", league: "Russell Group", qsRankWorld: 34, website: "https://www.manchester.ac.uk" },
  { id: "lse", name: "London School of Economics", nameZh: "伦敦政治经济学院", region: "UK", city: "London", league: "Russell Group", qsRankWorld: 50, website: "https://www.lse.ac.uk" },
  { id: "hku", name: "The University of Hong Kong", nameZh: "香港大学", region: "HK", city: "Hong Kong", league: "HK UGC 8", qsRankWorld: 17, website: "https://www.hku.hk" },
  { id: "hkust", name: "The Hong Kong University of Science and Technology", nameZh: "香港科技大学", region: "HK", city: "Hong Kong", league: "HK UGC 8", qsRankWorld: 40, website: "https://www.hkust.edu.hk" },
  { id: "cuhk", name: "The Chinese University of Hong Kong", nameZh: "香港中文大学", region: "HK", city: "Hong Kong", league: "HK UGC 8", qsRankWorld: 47, website: "https://www.cuhk.edu.hk" },
];

const M = (subject: string, minGrade = "A") => ({ subject, minGrade });

export const mockPrograms: Program[] = [
  { id: "ox-cs", universityId: "ox", name: "Computer Science", nameZh: "计算机科学", degreeType: "BA", applyRoute: "UCAS", annualTuitionGbp: 39740, alevelOfferTypical: "A*AA", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Mathematics")], ielts: 7.0, admissionsTest: "MAT", interviewRequired: true },
  { id: "cam-eco", universityId: "cam", name: "Economics", nameZh: "经济学", degreeType: "BA", applyRoute: "UCAS", annualTuitionGbp: 40000, alevelOfferTypical: "A*A*A", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Mathematics")], ielts: 7.5, admissionsTest: "ECAA", interviewRequired: true },
  { id: "ic-cs", universityId: "ic", name: "Computing", nameZh: "计算机", degreeType: "BEng", applyRoute: "UCAS", annualTuitionGbp: 41000, alevelOfferTypical: "A*A*A", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Mathematics")], ielts: 6.5 },
  { id: "ucl-cs", universityId: "ucl", name: "Computer Science", nameZh: "计算机科学", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 35000, alevelOfferTypical: "A*A*A", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Mathematics")], excludedSubjects: ["General Studies"], ielts: 6.5 },
  { id: "ucl-eco", universityId: "ucl", name: "Economics", nameZh: "经济学", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 35000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Mathematics", "A")], ielts: 7.0 },
  { id: "ed-cs", universityId: "ed", name: "Computer Science", nameZh: "计算机科学", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 34000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAB", requiredSubjects: [M("Mathematics")], ielts: 6.5 },
  { id: "man-eco", universityId: "man", name: "Economics", nameZh: "经济学", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 30000, alevelOfferTypical: "AAA", alevelOfferMinimum: "AAB", requiredSubjects: [M("Mathematics")], ielts: 6.5 },
  { id: "lse-eco", universityId: "lse", name: "Economics", nameZh: "经济学", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 38000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Mathematics", "A")], ielts: 7.0 },
  { id: "hku-cs", universityId: "hku", name: "Bachelor of Engineering (Computer Science)", nameZh: "工学士（计算机科学）", degreeType: "BEng", applyRoute: "HK_DIRECT", annualTuitionHkd: 182000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Mathematics")], ielts: 6.5, interviewRequired: true },
  { id: "hkust-ds", universityId: "hkust", name: "BSc in Data Science and Technology", nameZh: "数据科学与技术理学士", degreeType: "BSc", applyRoute: "HK_DIRECT", annualTuitionHkd: 175000, alevelOfferTypical: "AAA", alevelOfferMinimum: "AAB", requiredSubjects: [M("Mathematics")], ielts: 6.0 },
  { id: "cuhk-eco", universityId: "cuhk", name: "Bachelor of Social Science in Economics", nameZh: "经济学社会科学学士", degreeType: "BSc", applyRoute: "HK_DIRECT", annualTuitionHkd: 145000, alevelOfferTypical: "AAB", alevelOfferMinimum: "BBB", requiredSubjects: [], ielts: 6.5 },
];
