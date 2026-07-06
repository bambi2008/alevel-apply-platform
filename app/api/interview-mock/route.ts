import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { captureError } from "@/lib/monitoring";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

interface Msg {
  role: "interviewer" | "student";
  content: string;
}

interface MockRequest {
  subject: string; // 学科名（中文）
  question?: string; // 起始题（可选，来自题库）
  history?: Msg[]; // 对话历史
  studentReply?: string; // 学生本轮回答
}

const SYSTEM = `你是一位牛津/剑桥风格的学科面试官，正在对一名中国 A-Level 学生进行模拟面试。请严格遵守：
1. 你的目标是考察学生「面对陌生问题如何思考」，不是考知识点背诵，也不是替他解题。
2. 一次只问一个问题或一个追问，简短、聚焦。像真实辅导课一样，顺着学生的回答往下追问（"为什么""如果换成…呢""你能说得更具体吗"）。
3. 学生想错时，不要直接给答案，而是用提示引导他自己修正（苏格拉底式）。
4. 语气温和、鼓励，但保持学术严谨。用中文提问。
5. 绝不替学生写出完整答案或代其思考；不脱离面试情境；不使用套话。
6. 如果学生明显卡住，给一个小提示（一句话），再把问题抛回给他。
输出只包含你作为面试官要说的话，简洁自然，不要加旁白或标注。`;

export async function POST(req: NextRequest) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json({ error: "AI 暂未配置" }, { status: 503 });
  }
  try {
    const body = (await req.json()) as MockRequest;
    const { subject, question, history = [], studentReply } = body;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: `${SYSTEM}\n\n本场面试学科：${subject || "综合"}。` },
    ];

    // 起始：还没有历史，就用题库题目开场（或让 AI 出一题）
    if (history.length === 0 && !studentReply) {
      if (question) {
        return NextResponse.json({ interviewer: question });
      }
      messages.push({
        role: "user",
        content: `请为「${subject}」面试出一道适合开场的、陌生情境式的问题，直接抛给学生。`,
      });
    } else {
      // 重建对话
      for (const m of history) {
        messages.push({
          role: m.role === "interviewer" ? "assistant" : "user",
          content: m.content,
        });
      }
      if (studentReply) {
        messages.push({ role: "user", content: studentReply });
      }
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages,
      temperature: 0.8,
      max_tokens: 400,
    });

    const interviewer = completion.choices[0]?.message?.content?.trim() || "（面试官沉默了，请再试一次）";
    return NextResponse.json({ interviewer });
  } catch (err) {
    captureError(err, { route: "interview-mock" });
    return NextResponse.json({ error: "生成失败，请稍后再试" }, { status: 500 });
  }
}
