// 学生档案存储层。
// 登录用户：通过 Server Actions 读写数据库（跨设备持久化）。
// 匿名用户：回退到 localStorage（无账号也能体验）。
// 类型与 emptyProfile / profileHasGrades 保持不变，页面只需把调用改为 await。
import type { Region } from "@/lib/data/types";
import { getProfileAction, saveIeltsScoresAction, saveProfileAction } from "./actions";

export type GradeKind = "PREDICTED" | "ACTUAL" | "AS";

export interface ProfileSubject {
  subject: string;
  grade: string;
  kind: GradeKind;
}

export interface IeltsSubscores {
  listening?: number | null;
  reading?: number | null;
  writing?: number | null;
  speaking?: number | null;
}

export interface UserProfile {
  fullName?: string;
  school?: string;
  intakeYear?: number;
  targetRegions: Region[];
  intendedUniversities?: string[];
  intendedMajors: string[];
  subjects: ProfileSubject[];
  ielts?: number | null;
  ieltsSubscores?: IeltsSubscores | null;
}

const KEY = "alevel:profile:v1";

export const emptyProfile: UserProfile = {
  targetRegions: ["UK", "HK"],
  intendedUniversities: [],
  intendedMajors: [],
  subjects: [
    { subject: "Mathematics", grade: "A*", kind: "PREDICTED" },
    { subject: "Physics", grade: "A", kind: "PREDICTED" },
    { subject: "Chemistry", grade: "A", kind: "PREDICTED" },
  ],
  ielts: 6.5,
};

// ---------- localStorage（匿名用户回退） ----------
function loadLocalProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

function saveLocalProfile(p: UserProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
}

function clearLocalProfile(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

// ---------- 对外 API（异步：DB 优先，匿名回退 localStorage） ----------
export async function loadProfile(): Promise<UserProfile | null> {
  try {
    const res = await getProfileAction();
    if (res.authed) return res.profile; // 已登录：数据库为准（可能尚未建档=null）
  } catch {
    // 忽略，回退到本地
  }
  return loadLocalProfile();
}

export async function saveProfile(p: UserProfile): Promise<void> {
  try {
    const res = await saveProfileAction(p);
    if (res.authed) return; // 已登录：已写入数据库
  } catch {
    // 忽略，回退到本地
  }
  saveLocalProfile(p);
}

export async function saveIeltsScores(
  overall: number,
  subscores: IeltsSubscores,
): Promise<void> {
  try {
    const res = await saveIeltsScoresAction(overall, subscores);
    if (res.authed && res.saved) return;
  } catch {
    // Ignore and preserve an anonymous/local planning path.
  }
  const current = loadLocalProfile() ?? emptyProfile;
  saveLocalProfile({
    ...current,
    ielts: overall,
    ieltsSubscores: subscores,
  });
}

export async function clearProfile(): Promise<void> {
  // 仅清理本地缓存；数据库档案由账号管理，不在此处删除。
  clearLocalProfile();
}

/** 档案是否已具备可用于选校匹配的成绩。 */
export function profileHasGrades(p: UserProfile | null): boolean {
  return !!p && p.subjects.some((s) => s.subject && s.grade);
}
