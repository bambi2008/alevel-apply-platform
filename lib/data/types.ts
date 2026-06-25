// 数据访问层共享类型（与 Prisma 解耦，便于 mock → DB 平滑切换）。
export type Region = "UK" | "HK";
export type ApplyRoute = "UCAS" | "HK_DIRECT";

export interface SubjectRequirement {
  subject: string;
  minGrade: string;
}

export interface University {
  id: string;
  name: string;
  nameZh: string;
  region: Region;
  city: string;
  league?: string;
  qsRankWorld?: number;
  website?: string;
}

export interface Program {
  id: string;
  universityId: string;
  name: string;
  nameZh: string;
  degreeType?: string;
  applyRoute: ApplyRoute;
  annualTuitionGbp?: number;
  annualTuitionHkd?: number;
  alevelOfferTypical?: string;
  alevelOfferMinimum?: string;
  requiredSubjects?: SubjectRequirement[];
  excludedSubjects?: string[];
  ielts?: number;
  admissionsTest?: string;
  interviewRequired?: boolean;
}

export interface ProgramWithUniversity extends Program {
  university: University;
}
