import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { captureError } from "@/lib/monitoring";
import { requireAiAccess } from "@/lib/security/ai-route";

export const runtime = "nodejs";

export interface ProjectFeedbackRequest {
  mode?: "stage" | "reflection"; // stage=阶段成果反馈；reflection=反思与延伸的文书式教练反馈
  projectTitle: string;
  stageTitle: string;
  stageTask: string;
  stageDeliverable: string;
  rubric: string[];
  metrics: string[];
  baseline: string;
  challenge: string;
  submission: string; // 学生提交的文字说明 / 结果描述 / 反思作答
  reflectionQuestions?: string[]; // 反思模式下：课题给出的引导问题
  psUse?: string; // 反思模式下：这个课题如何用于申请
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

const SYSTEM_PROMPT_REFLECTION = `你是一位英国大学申请的文书教练（personal statement coach），专门指导学生把课题经历转化为有深度的个人陈述素材。

背景：英国大学招生官（尤其牛剑、罗素集团）最看重的不是"学生做了什么"，而是"学生从中思考了什么、反思了什么"。最弱的个人陈述是"描述"活动，最强的是"分析"活动。

你的角色是文书教练，绝不是代写者。严格遵守：
1. 绝对不要替学生写个人陈述，也不要提供可直接照抄的成段文字。你只给方向、建议和追问。
2. 只基于学生写的反思文字给反馈。指出：哪些思考有深度、值得写进 PS；哪些太表面、需要再挖；哪些可以联系到更大的学科图景或未来学习。
3. 用"苏格拉底式追问"帮学生想得更深——问出能让他写出更有洞察的问题（如"你说结果出乎意料，那它具体挑战了你原本的哪个假设？"）。
4. 提醒学生：英国 PS 要体现真实的智识好奇心与批判性思考，且必须是自己的真实想法与文字（UCAS 有相似度检测，代写/AI 生成有风险）。
5. 鼓励但诚实。若反思太空泛，明确指出并引导他补充具体、个人化的思考。
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

const buildReflectionPrompt = (r: ProjectFeedbackRequest) => `
课题：${r.projectTitle}
这个课题如何用于申请：${r.psUse || "（未提供）"}
课题给出的反思引导问题：
${(r.reflectionQuestions || []).map((q, i) => `${i + 1}. ${q}`).join("\n")}

学生写的反思与延伸：
"""
${r.submission || "（学生尚未填写反思）"}
"""

请以文书教练的身份，帮学生把这段反思打磨成更有深度、更适合写进英国个人陈述的素材。只返回如下 JSON（不要其它文字、不要 markdown）：
{
  "strengths": ["这段反思里有深度、值得写进 PS 的点1", "点2"],
  "suggestions": ["如何让某个想法更深入/更具体的建议1", "建议2", "建议3"],
  "questions": ["能帮学生想得更深的追问1", "追问2"],
  "summary": "一句话鼓励式总结，点明这段反思距离一份好 PS 素材还差什么"
}

注意：
- 不要提供可照抄的成段 PS 文字；只给方向、建议与追问。
- 若反思空白或太简略，strengths 可指出"目前还看不出你的独立思考"，把重点放在 suggestions 与 questions 上，引导他写出具体、个人化的思考。`;

export async function POST(req: NextRequest) {
  const access = await requireAiAccess(req, "project-feedback", 30);
  if (!access.ok) return access.response;
  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json(
      { error: "AI 反馈暂未配置（缺少 DEEPSEEK_API_KEY）" },
      { status: 503 }
    );
  }
  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  });

  let body: ProjectFeedbackRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.mode !== "reflection" && !body.stageTitle) {
    return NextResponse.json({ error: "缺少阶段信息" }, { status: 400 });
  }

  try {
    const isReflection = body.mode === "reflection";
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      max_tokens: 1500,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: isReflection ? SYSTEM_PROMPT_REFLECTION : SYSTEM_PROMPT },
        { role: "user", content: isReflection ? buildReflectionPrompt(body) : buildPrompt(body) },
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
