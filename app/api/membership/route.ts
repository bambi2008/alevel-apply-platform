import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { membershipAccess } from "@/lib/membership/access";
import { privateNoStore } from "@/lib/security/json-request";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401, headers: privateNoStore });
  return NextResponse.json(await membershipAccess(userId), { headers: privateNoStore });
}
