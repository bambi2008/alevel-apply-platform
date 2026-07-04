import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { captureError } from "@/lib/monitoring";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

interface Req {
  question: "q2" | "q3";
  projectTitle: string;
  field?: string;
  summary?: string;
  reflection?: string; // 学生对这个课题的反思
  submissions?: string[]; // 各阶段的文字说明
  currentAnswer?: string; // 这一题当前已写的内容（可选）
}

const Q_DESC: Record<string, string> = {
  q2: "第 2 题：你的学业如何为这个专业做了准备（最重要的一题，招生官在这里找超出学校要求的真正智识投入的证据，重点是反思而非罗列）",
  q3: "第 3 题：在正式教育之外你还做了什么准备、为什么有用（聚焦 1-2 个经历深入讲，重点是学到了什么、与专业的关联）",
};

const SYSTEM_PROMPT = `你是一位英国大学申请文书教练。学生在平台上做过一个课题（有成果和反思），现在想把这段真实经历用进 UCAS 个人陈述的某一题。

你的任务：基于学生这个课题的真实材料（标题、成果说明、反思），帮他想清楚「这段经历该如何组织进这一题」。

绝对红线：
1. 绝不代写。不要提供任何可以直接复制粘贴进文书的成段或成句文字。你只给「思路、角度、该强调什么、追问」，让学生自己动笔。
2. 提醒学生：文书必须是本人真实文字，UCAS 有相似度检测。
3. 引导学生突出「反思」而非「罗列做了什么」——这是英国招生官最看重的。
4. 只基于学生提供的真实材料，不要编造他没做过的事。
5. 用中文；只返回合法 JSON，不要 markdown。`;

const buildPrompt = (r: Req) => `
目标题目：${Q_DESC[r.question]}

学生做过的课题：
- 标题：${r.projectTitle}
${r.field ? `- 领域：${r.field}` : ""}
${r.summary ? `- 简介：${r.summary}` : ""}
${r.submissions && r.submissions.length ? `- 各阶段成果说明：\n${r.submissions.map((s, i) => `  ${i + 1}. ${s}`).join("\n")}` : ""}
${r.reflection ? `- 学生的反思：${r.reflection}` : ""}
${r.currentAnswer ? `\n学生这一题已经写了的内容：\n"""\n${r.currentAnswer}\n"""` : ""}

请帮学生想清楚如何把这段经历用进这一题。只返回如下 JSON（不要其它文字、不要 markdown）：
{
  "summary": "一句话：这段经历最适合用来体现你的什么（对应这一题）",
  "strengths": ["这段经历里最值得写进文书的点1（基于他的真实成果/反思，但只作提示、不是成句）", "点2"],
  "suggestions": ["如何在这一题里组织这段经历的思路建议1", "2", "3"],
  "questions": ["帮学生把这段经历写得更深的追问1", "2"]
}

注意：strengths 和 suggestions 都只给方向和提示，绝不能是可照抄的成句文书文字。`;

export async function POST(req: NextRequest) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json({ error: "AI 暂未配置（缺少 DEEPSEEK_API_KEY）" }, { status: 503 });
  }
  let body: Req;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.question || !["q2", "q3"].includes(body.question)) {
    return NextResponse.json({ error: "请选择要写入的题目（Q2 或 Q3）" }, { status: 400 });
  }
  if (!body.projectTitle) {
    return NextResponse.json({ error: "缺少课题信息" }, { status: 400 });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      max_tokens: 1500,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt(body) },
      ],
    });
    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    const jsonText = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    const parsed = JSON.parse(jsonText);
    return NextResponse.json({
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.map(String) : [],
      questions: Array.isArray(parsed.questions) ? parsed.questions.map(String) : [],
    });
  } catch (err) {
    captureError(err, { route: "ps-from-project" });
    return NextResponse.json({ error: "生成失败，请稍后重试。" }, { status: 500 });
  }
}
