import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 已有 locale 前缀，直接放行
  if (pathname.startsWith("/zh-CN") || pathname.startsWith("/en")) {
    return NextResponse.next();
  }

  // 默认跳转到中文
  return NextResponse.redirect(new URL("/zh-CN" + pathname, request.url));
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
