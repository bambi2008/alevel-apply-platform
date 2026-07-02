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

  // ═══════════ 扩充专业（参考样例，上线前须核验官方来源）═══════════

  // ---- 牛津大学 ----
  { id: "ox-math", universityId: "ox", name: "Mathematics", nameZh: "数学", field: "math", degreeType: "BA", applyRoute: "UCAS", annualTuitionGbp: 39740, alevelOfferTypical: "A*A*A", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Mathematics", "A*")], ielts: 7.0, admissionsTest: "MAT", interviewRequired: true },
  { id: "ox-phys", universityId: "ox", name: "Physics", nameZh: "物理", field: "physics", degreeType: "OTHER", applyRoute: "UCAS", annualTuitionGbp: 39740, alevelOfferTypical: "A*AA", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 7.0, admissionsTest: "PAT", interviewRequired: true },
  { id: "ox-eng", universityId: "ox", name: "Engineering Science", nameZh: "工程科学", field: "engineering", degreeType: "BEng", applyRoute: "UCAS", annualTuitionGbp: 39740, alevelOfferTypical: "A*A*A", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 7.0, admissionsTest: "PAT", interviewRequired: true },
  { id: "ox-em", universityId: "ox", name: "Economics and Management", nameZh: "经济与管理", field: "economics", degreeType: "BA", applyRoute: "UCAS", annualTuitionGbp: 39740, alevelOfferTypical: "A*AA", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Mathematics")], ielts: 7.5, admissionsTest: "TSA", interviewRequired: true },
  { id: "ox-law", universityId: "ox", name: "Jurisprudence (Law)", nameZh: "法学", field: "law", degreeType: "BA", applyRoute: "UCAS", annualTuitionGbp: 39740, alevelOfferTypical: "AAA", alevelOfferMinimum: "AAA", requiredSubjects: [], ielts: 7.5, admissionsTest: "LNAT", interviewRequired: true },
  { id: "ox-med", universityId: "ox", name: "Medicine", nameZh: "医学", field: "medicine", degreeType: "MBChB", applyRoute: "UCAS", annualTuitionGbp: 39740, alevelOfferTypical: "A*AA", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Chemistry"), M("Biology")], ielts: 7.5, admissionsTest: "UCAT", interviewRequired: true },

  // ---- 剑桥大学 ----
  { id: "cam-cs", universityId: "cam", name: "Computer Science", nameZh: "计算机科学", field: "cs", degreeType: "BA", applyRoute: "UCAS", annualTuitionGbp: 40000, alevelOfferTypical: "A*A*A", alevelOfferMinimum: "A*A*A", requiredSubjects: [M("Mathematics", "A*")], ielts: 7.5, admissionsTest: "ESAT", interviewRequired: true },
  { id: "cam-math", universityId: "cam", name: "Mathematics", nameZh: "数学", field: "math", degreeType: "BA", applyRoute: "UCAS", annualTuitionGbp: 40000, alevelOfferTypical: "A*A*A", alevelOfferMinimum: "A*A*A", requiredSubjects: [M("Mathematics", "A*"), M("Further Mathematics", "A")], ielts: 7.5, admissionsTest: "STEP", interviewRequired: true },
  { id: "cam-natsci", universityId: "cam", name: "Natural Sciences", nameZh: "自然科学", field: "physics", degreeType: "BA", applyRoute: "UCAS", annualTuitionGbp: 40000, alevelOfferTypical: "A*A*A", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 7.5, admissionsTest: "ESAT", interviewRequired: true },
  { id: "cam-eng", universityId: "cam", name: "Engineering", nameZh: "工程", field: "engineering", degreeType: "BEng", applyRoute: "UCAS", annualTuitionGbp: 40000, alevelOfferTypical: "A*A*A", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 7.5, admissionsTest: "ESAT", interviewRequired: true },
  { id: "cam-law", universityId: "cam", name: "Law", nameZh: "法学", field: "law", degreeType: "BA", applyRoute: "UCAS", annualTuitionGbp: 40000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "A*AA", requiredSubjects: [], ielts: 7.5, admissionsTest: "LNAT", interviewRequired: true },
  { id: "cam-med", universityId: "cam", name: "Medicine", nameZh: "医学", field: "medicine", degreeType: "MBChB", applyRoute: "UCAS", annualTuitionGbp: 63990, alevelOfferTypical: "A*A*A", alevelOfferMinimum: "A*A*A", requiredSubjects: [M("Chemistry"), M("Biology")], ielts: 7.5, admissionsTest: "UCAT", interviewRequired: true },

  // ---- 帝国理工学院 ----
  { id: "ic-phys", universityId: "ic", name: "Physics", nameZh: "物理", field: "physics", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 41000, alevelOfferTypical: "A*A*A", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 7.0 },
  { id: "ic-eee", universityId: "ic", name: "Electrical and Electronic Engineering", nameZh: "电子电气工程", field: "eee", degreeType: "BEng", applyRoute: "UCAS", annualTuitionGbp: 41000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 6.5 },
  { id: "ic-cheng", universityId: "ic", name: "Chemical Engineering", nameZh: "化学工程", field: "engineering", degreeType: "BEng", applyRoute: "UCAS", annualTuitionGbp: 41000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Mathematics"), M("Chemistry")], ielts: 6.5 },
  { id: "ic-med", universityId: "ic", name: "Medicine", nameZh: "医学", field: "medicine", degreeType: "MBChB", applyRoute: "UCAS", annualTuitionGbp: 50400, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Chemistry"), M("Biology")], ielts: 7.0, admissionsTest: "UCAT", interviewRequired: true },

  // ---- 伦敦大学学院 UCL ----
  { id: "ucl-math", universityId: "ucl", name: "Mathematics", nameZh: "数学", field: "math", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 35000, alevelOfferTypical: "A*A*A", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Mathematics", "A*")], ielts: 6.5 },
  { id: "ucl-phys", universityId: "ucl", name: "Physics", nameZh: "物理", field: "physics", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 35000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 6.5 },
  { id: "ucl-mech", universityId: "ucl", name: "Mechanical Engineering", nameZh: "机械工程", field: "mechanical", degreeType: "BEng", applyRoute: "UCAS", annualTuitionGbp: 35000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 6.5 },
  { id: "ucl-psych", universityId: "ucl", name: "Psychology", nameZh: "心理学", field: "psychology", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 35000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [], ielts: 7.0 },
  { id: "ucl-med", universityId: "ucl", name: "Medicine", nameZh: "医学", field: "medicine", degreeType: "MBChB", applyRoute: "UCAS", annualTuitionGbp: 47000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Chemistry"), M("Biology")], ielts: 7.5, admissionsTest: "UCAT", interviewRequired: true },

  // ---- 爱丁堡大学 ----
  { id: "ed-math", universityId: "ed", name: "Mathematics", nameZh: "数学", field: "math", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 34000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAB", requiredSubjects: [M("Mathematics", "A*")], ielts: 6.5 },
  { id: "ed-eco", universityId: "ed", name: "Economics", nameZh: "经济学", field: "economics", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 34000, alevelOfferTypical: "AAA", alevelOfferMinimum: "AAB", requiredSubjects: [M("Mathematics")], ielts: 7.0 },
  { id: "ed-eng", universityId: "ed", name: "Mechanical Engineering", nameZh: "机械工程", field: "mechanical", degreeType: "BEng", applyRoute: "UCAS", annualTuitionGbp: 34000, alevelOfferTypical: "AAA", alevelOfferMinimum: "AAB", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 6.5 },
  { id: "ed-law", universityId: "ed", name: "Law (LLB)", nameZh: "法学", field: "law", degreeType: "LLB", applyRoute: "UCAS", annualTuitionGbp: 26000, alevelOfferTypical: "AAA", alevelOfferMinimum: "AAB", requiredSubjects: [], ielts: 7.0 },
  { id: "ed-psych", universityId: "ed", name: "Psychology", nameZh: "心理学", field: "psychology", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 34000, alevelOfferTypical: "AAA", alevelOfferMinimum: "AAB", requiredSubjects: [], ielts: 7.0 },

  // ---- 曼彻斯特大学 ----
  { id: "man-cs", universityId: "man", name: "Computer Science", nameZh: "计算机科学", field: "cs", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 33000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Mathematics")], ielts: 6.5 },
  { id: "man-eee", universityId: "man", name: "Electrical and Electronic Engineering", nameZh: "电子电气工程", field: "eee", degreeType: "BEng", applyRoute: "UCAS", annualTuitionGbp: 33000, alevelOfferTypical: "AAA", alevelOfferMinimum: "AAB", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 6.5 },
  { id: "man-mech", universityId: "man", name: "Mechanical Engineering", nameZh: "机械工程", field: "mechanical", degreeType: "BEng", applyRoute: "UCAS", annualTuitionGbp: 33000, alevelOfferTypical: "AAA", alevelOfferMinimum: "AAB", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 6.5 },
  { id: "man-law", universityId: "man", name: "Law (LLB)", nameZh: "法学", field: "law", degreeType: "LLB", applyRoute: "UCAS", annualTuitionGbp: 28000, alevelOfferTypical: "AAA", alevelOfferMinimum: "AAB", requiredSubjects: [], ielts: 7.0 },

  // ---- 伦敦政治经济学院 LSE ----
  { id: "lse-math", universityId: "lse", name: "Mathematics with Economics", nameZh: "数学与经济学", field: "math", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 38000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Mathematics", "A*")], ielts: 7.0 },
  { id: "lse-mgmt", universityId: "lse", name: "Management", nameZh: "管理学", field: "business", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 27000, alevelOfferTypical: "AAB", alevelOfferMinimum: "AAB", requiredSubjects: [], ielts: 7.0 },
  { id: "lse-fin", universityId: "lse", name: "Finance", nameZh: "金融", field: "business", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 27000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Mathematics")], ielts: 7.0 },
  { id: "lse-law", universityId: "lse", name: "Law (LLB)", nameZh: "法学", field: "law", degreeType: "LLB", applyRoute: "UCAS", annualTuitionGbp: 27000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [], ielts: 7.0, admissionsTest: "LNAT" },

  // ---- 布里斯托大学 ----
  { id: "bristol-cs", universityId: "bristol", name: "Computer Science", nameZh: "计算机科学", field: "cs", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 30000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Mathematics")], ielts: 6.5 },
  { id: "bristol-eco", universityId: "bristol", name: "Economics", nameZh: "经济学", field: "economics", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 27000, alevelOfferTypical: "AAA", alevelOfferMinimum: "AAB", requiredSubjects: [M("Mathematics")], ielts: 6.5 },
  { id: "bristol-mech", universityId: "bristol", name: "Mechanical Engineering", nameZh: "机械工程", field: "mechanical", degreeType: "BEng", applyRoute: "UCAS", annualTuitionGbp: 30000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAB", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 6.5 },
  { id: "bristol-law", universityId: "bristol", name: "Law (LLB)", nameZh: "法学", field: "law", degreeType: "LLB", applyRoute: "UCAS", annualTuitionGbp: 27000, alevelOfferTypical: "AAA", alevelOfferMinimum: "AAB", requiredSubjects: [], ielts: 7.0 },

  // ---- 南安普顿大学 ----
  { id: "soton-cs", universityId: "soton", name: "Computer Science", nameZh: "计算机科学", field: "cs", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 27000, alevelOfferTypical: "AAA", alevelOfferMinimum: "AAB", requiredSubjects: [M("Mathematics")], ielts: 6.5 },
  { id: "soton-eee", universityId: "soton", name: "Electronic Engineering", nameZh: "电子工程", field: "eee", degreeType: "BEng", applyRoute: "UCAS", annualTuitionGbp: 27000, alevelOfferTypical: "AAB", alevelOfferMinimum: "ABB", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 6.5 },
  { id: "soton-mech", universityId: "soton", name: "Mechanical Engineering", nameZh: "机械工程", field: "mechanical", degreeType: "BEng", applyRoute: "UCAS", annualTuitionGbp: 27000, alevelOfferTypical: "AAB", alevelOfferMinimum: "ABB", requiredSubjects: [M("Mathematics"), M("Physics")], ielts: 6.5 },
  { id: "soton-eco", universityId: "soton", name: "Economics", nameZh: "经济学", field: "economics", degreeType: "BSc", applyRoute: "UCAS", annualTuitionGbp: 25000, alevelOfferTypical: "AAB", alevelOfferMinimum: "ABB", requiredSubjects: [M("Mathematics")], ielts: 6.5 },

  // ---- 香港大学 HKU ----
  { id: "hku-bba", universityId: "hku", name: "Bachelor of Business Administration", nameZh: "工商管理学士", field: "business", degreeType: "BSc", applyRoute: "HK_DIRECT", annualTuitionHkd: 182000, alevelOfferTypical: "AAA", alevelOfferMinimum: "AAB", requiredSubjects: [], ielts: 6.5, interviewRequired: true },
  { id: "hku-law", universityId: "hku", name: "Bachelor of Laws (LLB)", nameZh: "法学士", field: "law", degreeType: "LLB", applyRoute: "HK_DIRECT", annualTuitionHkd: 182000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [], ielts: 7.0, interviewRequired: true },
  { id: "hku-med", universityId: "hku", name: "Bachelor of Medicine and Surgery (MBBS)", nameZh: "内外全科医学士", field: "medicine", degreeType: "MBChB", applyRoute: "HK_DIRECT", annualTuitionHkd: 182000, alevelOfferTypical: "A*A*A", alevelOfferMinimum: "A*AA", requiredSubjects: [M("Chemistry"), M("Biology")], ielts: 7.0, interviewRequired: true },
  { id: "hku-eng", universityId: "hku", name: "Bachelor of Engineering", nameZh: "工学士", field: "engineering", degreeType: "BEng", applyRoute: "HK_DIRECT", annualTuitionHkd: 182000, alevelOfferTypical: "AAB", alevelOfferMinimum: "ABB", requiredSubjects: [M("Mathematics")], ielts: 6.5 },

  // ---- 香港科技大学 HKUST ----
  { id: "hkust-cs", universityId: "hkust", name: "BSc in Computer Science", nameZh: "计算机科学理学士", field: "cs", degreeType: "BSc", applyRoute: "HK_DIRECT", annualTuitionHkd: 175000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Mathematics")], ielts: 6.0 },
  { id: "hkust-eco", universityId: "hkust", name: "BSc in Economics", nameZh: "经济学理学士", field: "economics", degreeType: "BSc", applyRoute: "HK_DIRECT", annualTuitionHkd: 175000, alevelOfferTypical: "AAB", alevelOfferMinimum: "ABB", requiredSubjects: [M("Mathematics")], ielts: 6.0 },
  { id: "hkust-bba", universityId: "hkust", name: "BBA in Global Business", nameZh: "环球商业管理学士", field: "business", degreeType: "BSc", applyRoute: "HK_DIRECT", annualTuitionHkd: 175000, alevelOfferTypical: "AAA", alevelOfferMinimum: "AAB", requiredSubjects: [], ielts: 6.5 },
  { id: "hkust-math", universityId: "hkust", name: "BSc in Mathematics", nameZh: "数学理学士", field: "math", degreeType: "BSc", applyRoute: "HK_DIRECT", annualTuitionHkd: 175000, alevelOfferTypical: "AAB", alevelOfferMinimum: "ABB", requiredSubjects: [M("Mathematics", "A")], ielts: 6.0 },

  // ---- 香港中文大学 CUHK ----
  { id: "cuhk-cs", universityId: "cuhk", name: "BSc in Computer Science", nameZh: "计算机科学理学士", field: "cs", degreeType: "BSc", applyRoute: "HK_DIRECT", annualTuitionHkd: 145000, alevelOfferTypical: "AAB", alevelOfferMinimum: "ABB", requiredSubjects: [M("Mathematics")], ielts: 6.5 },
  { id: "cuhk-bba", universityId: "cuhk", name: "Bachelor of Business Administration", nameZh: "工商管理学士", field: "business", degreeType: "BSc", applyRoute: "HK_DIRECT", annualTuitionHkd: 145000, alevelOfferTypical: "AAB", alevelOfferMinimum: "ABB", requiredSubjects: [], ielts: 6.5 },
  { id: "cuhk-math", universityId: "cuhk", name: "BSc in Mathematics", nameZh: "数学理学士", field: "math", degreeType: "BSc", applyRoute: "HK_DIRECT", annualTuitionHkd: 145000, alevelOfferTypical: "AAB", alevelOfferMinimum: "BBB", requiredSubjects: [M("Mathematics", "A")], ielts: 6.5 },
  { id: "cuhk-med", universityId: "cuhk", name: "Bachelor of Medicine and Surgery (MBChB)", nameZh: "内外全科医学士", field: "medicine", degreeType: "MBChB", applyRoute: "HK_DIRECT", annualTuitionHkd: 145000, alevelOfferTypical: "A*AA", alevelOfferMinimum: "AAA", requiredSubjects: [M("Chemistry"), M("Biology")], ielts: 7.0, interviewRequired: true },

];
