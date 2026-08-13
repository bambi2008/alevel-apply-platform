import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  if (!request.nextUrl.pathname.endsWith("/session")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(await auth());
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
