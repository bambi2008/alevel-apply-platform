import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { preferredPublicLocale } from "@/lib/public-routing";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const localePath = /^\/(zh-CN|en)(?:\/|$)/.exec(pathname);
  if (localePath) {
    const forwarded = new Headers(request.headers);
    // Never trust an incoming locale header; derive it from the verified route.
    forwarded.set("x-qiaoshen-locale", localePath[1]);
    forwarded.set("x-qiaoshen-pathname", pathname);
    return NextResponse.next({ request: { headers: forwarded } });
  }

  const url = request.nextUrl.clone();
  const locale = preferredPublicLocale(request.headers.get("accept-language") ?? "", request.cookies.get("NEXT_LOCALE")?.value);
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url, 308);
  response.headers.set("Vary", "Accept-Language, Cookie");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/:locale(zh-CN|en)/:path*"],
};
