import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { feedbackAllowance } from "@/lib/ai/feedback-quota";
import { privateNoStore } from "@/lib/security/json-request";

export async function GET() {
  const userId = (await auth())?.user.id;
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401, headers: privateNoStore });
  if (process.env.AI_ENABLED !== "true" || !process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json({ enabled: false }, { headers: privateNoStore });
  }
  return NextResponse.json({ enabled: true, ...await feedbackAllowance(userId) }, { headers: privateNoStore });
}
