// 错误监控。captureError 统一记录错误；并支持插入外部上报器（如 Sentry）。
//
// 现在：错误都会通过 logger 记录（不会再被静默吞掉）。
// 接入 Sentry（上线前）：
//   1) 安装 SDK：pnpm add @sentry/nextjs
//   2) 在 .env 设置 SENTRY_DSN=...
//   3) 在 instrumentation.ts 中初始化后调用：
//        import * as Sentry from "@sentry/nextjs";
//        import { setErrorReporter } from "@/lib/monitoring";
//        Sentry.init({ dsn: process.env.SENTRY_DSN });
//        setErrorReporter((err, ctx) => Sentry.captureException(err, { extra: ctx }));
//   之后 captureError 会自动把错误转发给 Sentry —— 业务代码无需改动。

import { logger } from "./logger";

export type ErrorContext = Record<string, unknown>;

type Reporter = (error: Error, context?: ErrorContext) => void;

let reporter: Reporter | null = null;

/** 注册外部上报器（如 Sentry）。传 null 可取消。 */
export function setErrorReporter(fn: Reporter | null): void {
  reporter = fn;
}

/** 是否已配置外部上报器。 */
export function hasReporter(): boolean {
  return reporter !== null;
}

/**
 * 统一捕获并记录错误。始终写日志；若已注册上报器则同时转发。
 * @param error 任意抛出的值（Error 或其它）
 * @param context 附加上下文（路由、用户操作等），便于排查
 */
export function captureError(error: unknown, context?: ErrorContext): void {
  const err = error instanceof Error ? error : new Error(String(error));
  logger.error(err.message, { stack: err.stack, ...(context ?? {}) });
  if (reporter) {
    try {
      reporter(err, context);
    } catch {
      // 上报器本身出错不应影响主流程（已记录到日志）
    }
  } else if (process.env.SENTRY_DSN) {
    // 设置了 DSN 但尚未注册上报器：提示一次接入步骤
    logger.warn(
      "SENTRY_DSN 已设置，但未注册上报器。请在 instrumentation.ts 中调用 setErrorReporter。"
    );
  }
}
