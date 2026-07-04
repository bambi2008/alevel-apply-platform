"use client";

// 在线课题进度追踪（客户端本地版）。
// 记录每个课题的报名、各阶段的提交内容、rubric 自评勾选、状态与时间。
// 先用 localStorage 打通完整体验；后续可接入数据库与人工点评后端。

export type StageStatus = "todo" | "submitted" | "reviewed";

export interface ProjectAttachment {
  key: string; // 存储 key（用于 /api/files/[key] 下载）
  name: string; // 文件名
  docId: string; // Document 记录 id
}

export interface StageProgress {
  stageNum: number;
  status: StageStatus;
  submission: string; // 学生提交的文字说明（喂给 AI 反馈、进完成记录）
  attachments?: ProjectAttachment[]; // 上传的产出文件（截图/报告/数据）
  checkedRubric: number[]; // 已自评勾选的 rubric 项索引
  reviewNote?: string; // 预留：人工点评（后续接后端）
  updatedAt: number;
}

export interface ProjectProgress {
  projectId: string;
  enrolledAt: number;
  reflectionNotes?: string; // 学生的反思与延伸作答（最能体现智识投入，可写入 PS）
  stages: StageProgress[];
}

const KEY = "alevel:projects:v1";
type Listener = () => void;
const listeners = new Set<Listener>();

function loadAll(): ProjectProgress[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProjectProgress[]) : [];
  } catch {
    return [];
  }
}

function saveAll(data: ProjectProgress[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(data));
  listeners.forEach((l) => l());
}

export function subscribeProjects(cb: Listener): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getAllProjectProgress(): ProjectProgress[] {
  return loadAll();
}

export function getProjectProgress(projectId: string): ProjectProgress | null {
  return loadAll().find((p) => p.projectId === projectId) ?? null;
}

export function isEnrolled(projectId: string): boolean {
  return !!getProjectProgress(projectId);
}

export function enrollProject(projectId: string): void {
  const all = loadAll();
  if (all.some((p) => p.projectId === projectId)) return;
  all.push({ projectId, enrolledAt: Date.now(), stages: [] });
  saveAll(all);
}

export function getStageProgress(projectId: string, stageNum: number): StageProgress {
  const p = getProjectProgress(projectId);
  const s = p?.stages.find((x) => x.stageNum === stageNum);
  return (
    s ?? { stageNum, status: "todo", submission: "", checkedRubric: [], updatedAt: 0 }
  );
}

export function saveStageProgress(
  projectId: string,
  stageNum: number,
  patch: Partial<Omit<StageProgress, "stageNum">>,
): void {
  const all = loadAll();
  let proj = all.find((p) => p.projectId === projectId);
  if (!proj) {
    proj = { projectId, enrolledAt: Date.now(), stages: [] };
    all.push(proj);
  }
  const existing = proj.stages.find((s) => s.stageNum === stageNum);
  if (existing) {
    Object.assign(existing, patch, { updatedAt: Date.now() });
  } else {
    proj.stages.push({
      stageNum,
      status: "todo",
      submission: "",
      checkedRubric: [],
      ...patch,
      updatedAt: Date.now(),
    });
  }
  saveAll(all);
}

/** 完成度：以「已提交或已点评」的阶段数 / 总阶段数 计。 */
export function computeProjectPercent(projectId: string, totalStages: number): number {
  const p = getProjectProgress(projectId);
  if (!p || totalStages === 0) return 0;
  const done = p.stages.filter((s) => s.status === "submitted" || s.status === "reviewed").length;
  return Math.round((Math.min(done, totalStages) / totalStages) * 100);
}

export function isProjectComplete(projectId: string, totalStages: number): boolean {
  return computeProjectPercent(projectId, totalStages) >= 100;
}

export function getReflectionNotes(projectId: string): string {
  return getProjectProgress(projectId)?.reflectionNotes ?? "";
}

export function saveReflectionNotes(projectId: string, text: string): void {
  const all = loadAll();
  let proj = all.find((p) => p.projectId === projectId);
  if (!proj) {
    proj = { projectId, enrolledAt: Date.now(), stages: [] };
    all.push(proj);
  }
  proj.reflectionNotes = text;
  saveAll(all);
}
