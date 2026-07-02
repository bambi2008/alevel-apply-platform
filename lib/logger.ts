// 统一日志封装。分级输出：开发环境可读、生产环境结构化 JSON（便于日志系统采集）。
// 级别阈值由环境变量 LOG_LEVEL 控制（debug < info < warn < error），默认 info。

type Level = "debug" | "info" | "warn" | "error";

const ORDER: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 };
const threshold = ORDER[(process.env.LOG_LEVEL as Level) ?? "info"] ?? ORDER.info;
const isProd = process.env.NODE_ENV === "production";

function emit(level: Level, msg: string, meta?: Record<string, unknown>): void {
  if (ORDER[level] < threshold) return;
  const time = new Date().toISOString();
  const line = isProd
    ? JSON.stringify({ level, time, msg, ...(meta ? { meta } : {}) })
    : `[${level.toUpperCase()}] ${msg}${meta ? " " + safeJson(meta) : ""}`;
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

function safeJson(v: unknown): string {
  try {
    return JSON.stringify(v);
  } catch {
    return "[unserializable]";
  }
}

export const logger = {
  debug: (msg: string, meta?: Record<string, unknown>) => emit("debug", msg, meta),
  info: (msg: string, meta?: Record<string, unknown>) => emit("info", msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => emit("warn", msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => emit("error", msg, meta),
};
