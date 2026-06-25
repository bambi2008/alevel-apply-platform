// 学生档案存储层（当前用 localStorage；接入登录/DB 后改为服务端读写，页面不变）。
import type { Region } from "@/lib/data/types";

export type GradeKind = "PREDICTED" | "ACTUAL" | "AS";

export interface ProfileSubject {
  subject: string;
  grade: string;
  kind: GradeKind;
}

export interface UserProfile {
  fullName?: string;
  school?: string;
  intakeYear?: number;
  targetRegions: Region[];
  intendedMajors: string[];
  subjects: ProfileSubject[];
  ielts?: number | null;
  ieltsSubscores?: IeltsSubscores | null;
}

export interface IeltsSubscores {
  listening?: number | null;
  reading?: number | null;
  writing?: number | null;
  speaking?: number | null;
}

const KEY = "alevel:profile:v1";

export const emptyProfile: UserProfile = {
  targetRegions: ["UK", "HK"],
  intendedMajors: [],
  subjects: [
    { subject: "Mathematics", grade: "A*", kind: "PREDICTED" },
    { subject: "Physics", grade: "A", kind: "PREDICTED" },
    { subject: "Chemistry", grade: "A", kind: "PREDICTED" },
  ],
  ielts: 6.5,
};

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveProfile(p: UserProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

/** 档案是否已具备可用于选校匹配的成绩。 */
export function profileHasGrades(p: UserProfile | null): boolean {
  return !!p && p.subjects.some((s) => s.subject && s.grade);
}
