import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  const captured = error instanceof Error ? error : new Error(String(error));
  const digest = typeof error === "object" && error !== null && "digest" in error
    ? String(error.digest)
    : undefined;
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    console.error(JSON.stringify({
      level: "error",
      time: new Date().toISOString(),
      msg: "Unhandled edge request error",
      meta: { digest, method: request.method, routePath: context.routePath, routeType: context.routeType },
    }));
    return;
  }

  const { reportOperationalEvent } = await import("@/lib/operations/events");
  await reportOperationalEvent({
    code: "UNHANDLED_REQUEST_ERROR",
    message: "Next.js captured an unhandled server request error",
    severity: "CRITICAL",
    source: context.routePath,
    meta: {
      digest,
      errorType: captured.name,
      method: request.method,
      routeType: context.routeType,
      routerKind: context.routerKind,
    },
  });
};
