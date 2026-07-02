"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", margin: 0 }}>
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: 420 }}>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 8 }}>应用出错了</h1>
          <p style={{ color: "#737373", fontSize: "0.875rem", marginBottom: 24 }}>抱歉，应用遇到了一个严重错误。请重试。</p>
          <button onClick={() => reset()} style={{ background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, padding: "0.5rem 1rem", fontSize: "0.875rem", cursor: "pointer" }}>重试</button>
        </div>
      </body>
    </html>
  );
}
