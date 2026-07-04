import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { captureError } from "@/lib/monitoring";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

export interface ProjectFeedbackRequest {
  projectTitle: string;
  stageTitle: string;
  stageTask: string;
  stageDeliverable: string;
  rubric: string[];
  metrics: string[];
  baseline: string;
  challenge: string;
  submission: string; // 学生提交的文字说明 / 结果描述
}

export interface ProjectFeedbackResponse {
  strengths: string[]; // 做得好的地方
  suggestions: string[]; // 改进建议
  questions: string[]; // 引导性追问
  summary: string; // 鼓励式总结
}

const SYSTEM_PROMPT = `你是一位资深工程课题导师（mentor），指导高中生完成用专业工业软件（如 ANSYS、Fusion 360、Python）做的工程课题。

你的角色是「教练」，不是「考官」。你的目标是帮学生把课题做得更深入、更严谨、更专业。

严格遵守以下规则：
1. 绝对不要打分、评级或给任何分数。你给的是建议，不是评判。
2. 只基于学生提交的「文字说明」给反馈。学生可能上传了截图/云图/报告，但你看不到图片——绝不要臆断或假装看到了图里的内容；如果关键结论只能从图中判断，就提醒学生在文字里补充具体数值。
3. 用鼓励、具体、可操作的语气。先肯定做得好的地方，再给改进建议，再用引导性问题帮学生想得更深（像导师追问，而不是直接给答案）。
4. 建议要贴合工程实践与量化指标（如网格无关性、安全系数、收敛判据、升阻比、单位规范等）。
5. 鼓励学术诚信：产出必须是学生本人完成。绝不建议代做或造假。
6. 用中文回复。
7. 只返回合法 JSON，不要 markdown、不要多余文字。`;

const buildPrompt = (r: ProjectFeedbackRequest) => `
课题：${r.projectTitle}
当前阶段：${r.stageTitle}
本阶段任务：${r.stageTask}
应交付产出：${r.stageDeliverable}
量化验收指标：${r.metrics.join("；")}
评价标准：${r.rubric.join("；")}
课题基础线：${r.baseline}
课题挑战目标：${r.challenge}

学生提交的文字说明：
"""
${r.submission || "（学生未填写文字说明）"}
"""

请基于以上信息，给出教练式反馈。只返回如下 JSON 结构（不要其它文字、不要 markdown 代码块）：
{
  "strengths": ["做得好的地方1", "做得好的地方2"],
  "suggestions": ["具体改进建议1", "具体改进建议2", "具体改进建议3"],
  "questions": ["引导性追问1", "引导性追问2"],
  "summary": "一句鼓励式总结"
}

注意：
- 若学生说明过于简略或空白，strengths 可以只放 1 条或指出「说明太少，无法判断」，并把重点放在 suggestions 与 questions 上，引导他补充具体内容与数值。
- suggestions 请尽量对应量化指标与工程严谨性。`;

export async function POST(req: NextRequest) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json(
      { error: "AI 反馈暂未配置（缺少 DEEPSEEK_API_KEY）" },
      { status: 503 }
    );
  }

  let body: ProjectFeedbackRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.stageTitle) {
    return NextResponse.json({ error: "缺少阶段信息" }, { status: 400 });
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
    const parsed = JSON.parse(jsonText) as ProjectFeedbackResponse;

    const response: ProjectFeedbackResponse = {
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      questions: Array.isArray(parsed.questions) ? parsed.questions : [],
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
    };

    return NextResponse.json(response);
  } catch (err) {
    captureError(err, { route: "project-feedback" });
    return NextResponse.json(
      { error: "反馈生成失败，请稍后重试。" },
      { status: 500 }
    );
  }
}
