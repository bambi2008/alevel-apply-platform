import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { captureError } from "@/lib/monitoring";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

type QKey = "q1" | "q2" | "q3";

interface CoachRequest {
  question: QKey;
  text: string;
  subject?: string; // 意向专业（可选）
}

// 每题的真实评判标准（据 UCAS 官方 + 招生官/机构实战经验）
const Q_GUIDE: Record<QKey, string> = {
  q1: `第 1 题「为什么想学这个专业」的评判标准：
- 忌陈词滥调开头：如「从小/一直以来/for as long as I can remember」「名人名言开场」「字典定义」——这些是 UCAS 统计中最常见的套路，招生官一看就厌倦。
- 忌复述 A-Level 大纲（如「我着迷于生物，尤其喜欢遗传与进化」）——这没有提供 UCAS 表格之外的任何信息。
- 应有一个具体的「火花」：某本书、某篇文章、某场讲座、某个研究或某个具体瞬间，让学生想在大学层面钻研这门学科。
- 应体现真正的智识动机（这门学科的什么问题吸引你），而非空泛的「passion」。
- 忌提及具体大学名（文书会发给全部 5 个志愿）。
- 想提职业方向可以，但要融入动机。`,
  q2: `第 2 题「学业如何为之做准备」是最重要的一题（约占一半篇幅），评判标准：
- 招生官在这里找「超出学校要求的真正智识投入」的证据——这是区分「能在顶尖大学立足」和「合格但未准备好」的关键。
- 应有具体的超课程证据：读过的书/论文/期刊、做过的项目/课题，并说明「从中想到/学到了什么」。
- 核心是「反思」而非「罗列」：不是列出做了什么，而是「读了 X → 引发了什么思考 → 如何联系到更大的学科图景」。
- 可结合 A-Level 科目/课题，说明它们如何培养了相关能力，并连回所申专业。
- 忌堆砌事实教招生官（他们是专家）；忌把一句话塞进两三个以上的例子（清单式）。`,
  q3: `第 3 题「教育之外做了什么准备、为何有用」的评判标准：
- 忌贪多：与其塞进一堆经历，不如深入讲 1-2 个，有细节、有反思。
- 重点不是「做了什么」，而是「从中学到了什么、为什么对这个专业有用」。
- 应把课外经历连回所申专业所需的能力/品质。
- 个人困难（健康/家庭等）如要提，一两句即可，通常更适合放在推荐信里。`,
};

const SYSTEM_PROMPT = `你是一位资深的英国大学申请文书教练（UCAS personal statement coach），帮助学生打磨 2026 新版三问个人陈述。

绝对红线（必须遵守）：
1. 绝不代写。不提供任何可以直接复制粘贴进文书的成段文字或句子。你只诊断问题、给方向、给建议、提出追问。
2. 时刻提醒学生：个人陈述必须是本人真实想法与文字。UCAS 有相似度检测系统，罗素集团大学会用它识别 AI 生成或抄袭的文书，被标记可能直接被拒。
3. 诚实、具体、鼓励。先肯定可取之处，再指出具体问题（引用学生的原话来说明），再给改进方向与追问。
4. 反馈要基于英国招生官的真实标准（下面会给出本题的标准）。
5. 用中文回复。只返回合法 JSON，不要 markdown、不要多余文字。`;

const buildPrompt = (r: CoachRequest) => `
${Q_GUIDE[r.question]}

${r.subject ? `学生意向专业：${r.subject}` : ""}

学生这一题的作答：
"""
${r.text || "（学生尚未填写）"}
"""

请基于上面这一题的真实评判标准，给出教练式反馈。只返回如下 JSON（不要其它文字、不要 markdown）：
{
  "strengths": ["写得好的地方1", "写得好的地方2"],
  "issues": ["发现的具体问题1（可引用学生原话）", "问题2"],
  "suggestions": ["如何改进的具体方向1", "方向2", "方向3"],
  "questions": ["能帮学生挖得更深的追问1", "追问2"],
  "summary": "一句话总结这一题目前离一份强答案还差什么"
}

注意：
- 若作答空白或过短，strengths 可指出「目前内容太少，无法判断」，把重点放在 suggestions 与 questions，引导学生写出具体、个人化的内容。
- issues 要具体，最好引用学生的原话或点出具体位置，而不是泛泛而谈。
- 绝不提供可照抄的成句。`;

export async function POST(req: NextRequest) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json({ error: "AI 暂未配置（缺少 DEEPSEEK_API_KEY）" }, { status: 503 });
  }

  let body: CoachRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.question || !["q1", "q2", "q3"].includes(body.question)) {
    return NextResponse.json({ error: "缺少题号" }, { status: 400 });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      max_tokens: 1600,
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
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
      issues: Array.isArray(parsed.issues) ? parsed.issues.map(String) : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.map(String) : [],
      questions: Array.isArray(parsed.questions) ? parsed.questions.map(String) : [],
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
    });
  } catch (err) {
    captureError(err, { route: "ps-coach" });
    return NextResponse.json({ error: "点评生成失败，请稍后重试。" }, { status: 500 });
  }
}
