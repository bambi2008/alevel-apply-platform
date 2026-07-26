import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/zh-CN") || pathname.startsWith("/en")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/zh-CN${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
