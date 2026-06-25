// Mock 院校/专业数据（参考样例，需人工核验官方来源后方可上线）。
// 切换到真实 DB 时，本文件由 seed 灌入 DB（见 prisma/seed.ts、lib/data/index.ts）。
import type { University, Program } from "./types";

export const mockUniversities: University[] = [
  { id: "ox", name: "University of Oxford", nameZh: "牛津大学", region: "UK", city: "Oxford", league: "Russell Group", qsRankWorld: 3, website: "https://www.ox.ac.uk" },
  { id: "cam", name: "University of Cambridge", nameZh: "剑桥大学", region: "UK", city: "Cambridge", league: "Russell Group", qsRankWorld: 5, website: "https://www.cam.ac.uk" },
  { id: "ic", name: "Imperial College London", nameZh: "帝国理工学院", region: "UK", city: "London", league: "Russell Group", qsRankWorld: 8, website: "https://www.imperial.ac.uk" },
  { id: "ucl", name: "University College London", nameZh: "伦敦大学学院", region: "UK", city: "London", league: "Russell Group", qsRankWorld: 9, website: "https://www.ucl.ac.uk" },
  { id: "ed", name: "University of Edinburgh", nameZh: "爱丁堡大学", region: "UK", city: "Edinburgh", league: "Russell Group", qsRankWorld: 22, website: "https://www.ed.ac.uk" },
  { id: "man", name: "University of Manchester", nameZh: "曼彻斯特大学", region: "UK", city: "Manchester", league: "Russell Group", qsRankWorld: 34, website: "https://www.manchester.ac.uk" },
  { id: "lse", name: "London School of Economics", nameZh: "伦敦政治经济学院", region: "UK", city: "London", league: "Russell Group", qsRankWorld: 50, website: "https://www.lse.ac.uk" },
  { id: "bristol", name: "University of Bristol", nameZh: "布里斯托大学", region: "UK", city: "Bristol", league: "Russell Group", qsRankWorld: 54, website: "https://www.bristol.ac.uk" },
  { id: "soton", name: "University of Southampton", nameZh: "南安普顿大学", region: "UK", city: "Southampton", league: "Russell Group", qsRankWorld: 80, website: "https://www.southampton.ac.uk" },
  { id: "hku", name: "The University of Hong Kong", nameZh: "香港大学", region: "HK", city: "Hong Kong", league: "HK UGC 8", qsRankWorld: 17, website: "https://www.hku.hk" },
  { id: "hkust", name: "The Hong Kong University of Science and Technology", nameZh: "香港科技大学", region: "HK", city: "Hong Kong", league: "HK UGC 8", qsRankWorld: 40, website: "https://www.hkust.edu.hk" },
  { id: "cuhk", name: "The Chinese University of Hong Kong", nameZh: "香港中文大学", region: "HK", city: "Hong Kong", league: "HK UGC 8", qsRankWorld: 47, website: "https://www.cuhk.edu.hk" },
];

const M = (subject: string, minGrade = "A") => ({ subject, minGrade });

export const mockPrograms: Program[] = [
  // ---- Computer Science / Data Science ----
  { id: "ox-cs", universityId: "ox", name: "Computer Science", nameZh: "计算机科学", field: "cs", degreeType: "BA", applyRoute: "UCAS", annualTuitionGbp: 39740, alevelOfferTypical: "A*AA", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Mathematics")], ielts: 7.0, admissionsTest: "MAT", interviewRequired: true },
  { id: "ic-cs", universityId: "ic", name: "Computing", nameZh: "计算机", field: "cs", degreeType: "BEng", applyRoute: "UCAS", annualTuitionGbp: 41000, alevelOfferTypical: "A*A*A", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Mathematics")], ielts: 6.5 },
  { id: "ucl-cs", universityId: "ucl", name: "Computer Science", nameZh: "计算机科学", field: "cs", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 35000, alevelOfferTypical: "A*A*A", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Mathematics")], excludedSubjects: ["General Studies"], ielts: 6.5 },
  { id: "ed-cs", universityId: "ed", name: "Computer Science", nameZh: "计算机科学", field: "cs", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 34000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAB", requiredSubjects: [M("Mathematics")], ielts: 6.5 },
  { id: "hku-cs", universityId: "hku", name: "Bachelor of Engineering (Computer Science)", nameZh: "工学士（计算机科学）", field: "cs", degreeType: "BEng", applyRoute: "HK_DIRECT", annualTuitionHkd: 182000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Mathematics")], ielts: 6.5, interviewRequired: true },
  { id: "hkust-ds", universityId: "hkust", name: "BSc in Data Science and Technology", nameZh: "数据科学与技术理学士", field: "ds", degreeType: "BSc", applyRoute: "HK_DIRECT", annualTuitionHkd: 175000, alevelOfferTypical: "AAA", alevelOfferMinimum: "AAB", requiredSubjects: [M("Mathematics")], ielts: 6.0 },

  // ---- Economics ----
  { id: "cam-eco", universityId: "cam", name: "Economics", nameZh: "经济学", field: "economics", degreeType: "BA", applyRoute: "UCAS", annualTuitionGbp: 40000, alevelOfferTypical: "A*A*A", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Mathematics")], ielts: 7.5, ieltsSubscores: { listening: 7.0, reading: 7.0, writing: 7.0, speaking: 7.0 }, admissionsTest: "ECAA", interviewRequired: true },
  { id: "ucl-eco", universityId: "ucl", name: "Economics", nameZh: "经济学", field: "economics", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 35000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Mathematics", "A")], ielts: 7.0 },
  { id: "man-eco", universityId: "man", name: "Economics", nameZh: "经济学", field: "economics", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 30000, alevelOfferTypical: "AAA", alevelOfferMinimum: "AAB", requiredSubjects: [M("Mathematics")], ielts: 6.5 },
  { id: "lse-eco", universityId: "lse", name: "Economics", nameZh: "经济学", field: "economics", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 38000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Mathematics", "A")], ielts: 7.0, ieltsSubscores: { listening: 6.5, reading: 6.5, writing: 6.5, speaking: 6.5 } },
  { id: "cuhk-eco", universityId: "cuhk", name: "Bachelor of Social Science in Economics", nameZh: "经济学社会科学学士", field: "economics", degreeType: "BSc", applyRoute: "HK_DIRECT", annualTuitionHkd: 145000, alevelOfferTypical: "AAB", alevelOfferMinimum: "BBB", requiredSubjects: [], ielts: 6.5 },

  // ---- Aerospace / Engineering ----
  { id: "ic-aero", universityId: "ic", name: "Aeronautical Engineering", nameZh: "航空工程", field: "aerospace", degreeType: "BEng", applyRoute: "UCAS", annualTuitionGbp: 41000, alevelOfferTypical: "A*A*A", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 6.5 },
  { id: "bristol-aero", universityId: "bristol", name: "Aerospace Engineering", nameZh: "航空航天工程", field: "aerospace", degreeType: "BEng", applyRoute: "UCAS", annualTuitionGbp: 30000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAB", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 6.5 },
  { id: "soton-aero", universityId: "soton", name: "Aeronautics and Astronautics", nameZh: "航空航天学", field: "aerospace", degreeType: "BEng", applyRoute: "UCAS", annualTuitionGbp: 28000, alevelOfferTypical: "AAB", alevelOfferMinimum: "ABB", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 6.5 },
  { id: "man-aero", universityId: "man", name: "Aerospace Engineering", nameZh: "航空航天工程", field: "aerospace", degreeType: "BEng", applyRoute: "UCAS", annualTuitionGbp: 30000, alevelOfferTypical: "AAA", alevelOfferMinimum: "AAB", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 6.5 },
  { id: "ic-mech", universityId: "ic", name: "Mechanical Engineering", nameZh: "机械工程", field: "mechanical", degreeType: "BEng", applyRoute: "UCAS", annualTuitionGbp: 41000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 6.5 },

  // ---- Maths / Law ----
  { id: "ic-math", universityId: "ic", name: "Mathematics", nameZh: "数学", field: "math", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 39000, alevelOfferTypical: "A*A*A", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Mathematics", "A*")], ielts: 6.5, admissionsTest: "TMUA" },
  { id: "ucl-law", universityId: "ucl", name: "Law", nameZh: "法律", field: "law", degreeType: "LLB", applyRoute: "UCAS", annualTuitionGbp: 34000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [], ielts: 7.5, ieltsSubscores: { listening: 7.0, reading: 7.0, writing: 7.0, speaking: 7.0 }, admissionsTest: "LNAT" },
];
