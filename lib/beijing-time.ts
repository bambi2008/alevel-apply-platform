const OFFSET_MS = 8 * 3_600_000;
export const DAY_MS = 86_400_000;

export function beijingDay(now = new Date()) {
  const start = new Date(Math.floor((+now + OFFSET_MS) / DAY_MS) * DAY_MS - OFFSET_MS);
  return { start, end: new Date(+start + DAY_MS), key: new Date(+start + OFFSET_MS).toISOString().slice(0, 10) };
}

export function beijingMonthStart(now = new Date()) {
  const local = new Date(+now + OFFSET_MS);
  return new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), 1) - OFFSET_MS);
}

export function parseBeijingDate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T00:00:00+08:00`);
  return Number.isFinite(+date) && beijingDay(date).key === value ? date : undefined;
}
