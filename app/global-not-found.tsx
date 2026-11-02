import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function GlobalNotFound() {
  const locale = (await headers()).get("x-qiaoshen-locale") === "en" ? "en" : "zh-CN";
  const english = locale === "en";
  return <html lang={locale}><head><title>{english ? "Page not found | QiaoShen" : "页面未找到 | 桥申"}</title><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
    <body style={{ margin: 0, background: "#f4f4f0", color: "#101817", fontFamily: "system-ui, sans-serif" }}>
      <main style={{ maxWidth: "40rem", margin: "15vh auto", padding: "2rem" }}>
        <p>404</p><h1>{english ? "Page not found" : "页面未找到"}</h1>
        <p>{english ? "This page does not exist." : "此页面不存在。"}</p>
        <a href={`/${locale}`} style={{ display: "inline-flex", alignItems: "center", minHeight: 44, color: "inherit" }}>{english ? "Return home" : "返回首页"}</a>
      </main>
    </body></html>;
}
