import { NextResponse } from "next/server";
import { getPrograms } from "@/lib/data";

// 返回全部专业（含院校），供客户端选校匹配 / 申请清单使用。
export async function GET() {
  const programs = await getPrograms();
  return NextResponse.json(programs);
}
