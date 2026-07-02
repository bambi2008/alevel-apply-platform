// 背景提升 —— 进度提醒计算（纯逻辑）。
// 依据规划项的目标日期与状态，算出需要提醒的事项：临近/逾期/停滞。

import type { BackgroundPlanItem, BgStatus } from "./store";

export type ReminderKind = "overdue" | "due_soon" | "stalled";
export type Severity = "high" | "medium" | "low";

export interface Reminder {
  itemId: string;
  title: string;
  kind: ReminderKind;
  severity: Severity;
  message: string;
  days: number; // overdue: 已逾期天数；due_soon: 剩余天数；stalled: 停滞天数
}

const DAY = 24 * 60 * 60 * 1000;
const DUE_SOON_DAYS = 7; // 目标日期 7 天内视为临近
const STALLED_DAYS = 30; // 计划中且加入超 30 天未开始视为停滞

function startOfDay(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** 解析 YYYY-MM-DD 为当天零点毫秒；无效返回 null。 */
function parseDate(s?: string | null): number | null {
  if (!s) return null;
  const t = Date.parse(s);
  if (Number.isNaN(t)) return null;
  return startOfDay(t);
}

/**
 * 计算提醒列表。
 * @param items 规划项
 * @param now 当前时间（毫秒），默认 Date.now()，便于测试注入
 */
export function computeReminders(
  items: BackgroundPlanItem[],
  now: number = Date.now()
): Reminder[] {
  const today = startOfDay(now);
  const out: Reminder[] = [];

  for (const it of items) {
    if (it.status === ("DONE" as BgStatus)) continue; // 已完成不提醒

    const due = parseDate(it.targetDate);
    if (due !== null) {
      const diffDays = Math.round((due - today) / DAY);
      if (diffDays < 0) {
        out.push({
          itemId: it.id,
          title: it.title,
          kind: "overdue",
          severity: "high",
          days: -diffDays,
          message: `已超过目标日期 ${-diffDays} 天`,
        });
      } else if (diffDays <= DUE_SOON_DAYS) {
        out.push({
          itemId: it.id,
          title: it.title,
          kind: "due_soon",
          severity: "medium",
          days: diffDays,
          message: diffDays === 0 ? "目标日期就是今天" : `距目标日期还有 ${diffDays} 天`,
        });
      }
      continue; // 有目标日期的按日期判断，不再判停滞
    }

    // 无目标日期：计划中且加入过久 → 停滞提醒
    if (it.status === ("PLANNED" as BgStatus)) {
      const ageDays = Math.floor((today - startOfDay(it.createdAt)) / DAY);
      if (ageDays >= STALLED_DAYS) {
        out.push({
          itemId: it.id,
          title: it.title,
          kind: "stalled",
          severity: "low",
          days: ageDays,
          message: `已加入 ${ageDays} 天仍未开始，建议设定一个目标日期`,
        });
      }
    }
  }

  // 排序：高 > 中 > 低；同级逾期天数多/剩余天数少者靠前
  const rank: Record<Severity, number> = { high: 0, medium: 1, low: 2 };
  out.sort((a, b) => {
    if (rank[a.severity] !== rank[b.severity]) return rank[a.severity] - rank[b.severity];
    if (a.kind === "due_soon" && b.kind === "due_soon") return a.days - b.days;
    return b.days - a.days;
  });

  return out;
}

/** 提醒数量摘要（用于徽标/概览）。 */
export function reminderSummary(reminders: Reminder[]): {
  total: number;
  overdue: number;
  dueSoon: number;
  stalled: number;
} {
  return {
    total: reminders.length,
    overdue: reminders.filter((r) => r.kind === "overdue").length,
    dueSoon: reminders.filter((r) => r.kind === "due_soon").length,
    stalled: reminders.filter((r) => r.kind === "stalled").length,
  };
}
