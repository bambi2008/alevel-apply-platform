import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  poweredByHeader: false,
  compress: true,
  async redirects() {
    const retiredSections = [
      "applications",
      "apply-guide",
      "apply-prep",
      "documents",
      "match",
      "reference",
      "shortlist",
      "study",
      "tasks",
      "timeline",
      "universities",
    ];

    return [
      ...retiredSections.map((section) => ({
        source: `/:locale/${section}/:path*`,
        destination: "/:locale",
        permanent: false,
      })),
      {
        source: "/:locale/english/:path*",
        destination: "/:locale/tests/ielts",
        permanent: false,
      },
    ];
  },
  async headers() {
    const isProduction = process.env.NODE_ENV === "production";
    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "img-src 'self' blob: data:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
      "connect-src 'self' https://api.deepseek.com",
      "upgrade-insecure-requests",
    ].join("; ");
    const securityHeaders = [
        { key: "Content-Security-Policy", value: contentSecurityPolicy },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), payment=()" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        ...(isProduction
          ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
          : []),
      ];
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/:locale(zh-CN|en)/waterlight",
        headers: securityHeaders.map((header) => {
          if (header.key === "Content-Security-Policy") {
            return { ...header, value: header.value.replace("frame-ancestors 'none'", "frame-ancestors 'self'") };
          }
          if (header.key === "X-Frame-Options") return { ...header, value: "SAMEORIGIN" };
          return header;
        }),
      },
    ];
  },
};

export default withNextIntl(nextConfig);
