export function preferredPublicLocale(acceptLanguage = "", cookie?: string): "zh-CN" | "en" {
  if (cookie === "en" || cookie === "zh-CN") return cookie;
  const supported = acceptLanguage.split(",").map((entry, order) => {
    const [language, ...params] = entry.trim().toLowerCase().split(";");
    const quality = params.find((param) => param.trim().startsWith("q="));
    const q = quality ? Number(quality.trim().slice(2)) : 1;
    const locale = /^en(?:-|$)/.test(language) ? "en" : /^zh(?:-|$)/.test(language) ? "zh-CN" : null;
    return { locale, q, order };
  }).filter((entry) => entry.locale && Number.isFinite(entry.q) && entry.q > 0 && entry.q <= 1)
    .sort((a, b) => b.q - a.q || a.order - b.order);
  return supported[0]?.locale === "en" ? "en" : "zh-CN";
}

/** Static before-streaming 404 for unpublished content: no draft is serialized. */
export function unpublishedPageHtml(locale: "zh-CN" | "en") {
  const en = locale === "en";
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${en ? "Page not found | QiaoShen" : "页面未找到 | 桥申"}</title></head><body style="margin:0;background:#f4f4f0;color:#101817;font-family:system-ui,sans-serif"><main style="max-width:40rem;margin:15vh auto;padding:2rem"><p>404</p><h1>${en ? "Page not found" : "页面未找到"}</h1><p>${en ? "This page is not available." : "此页面暂不可用。"}</p><a style="display:inline-flex;min-height:44px;align-items:center;color:inherit" href="/${locale}">${en ? "Return home" : "返回首页"}</a></main></body></html>`;
}
