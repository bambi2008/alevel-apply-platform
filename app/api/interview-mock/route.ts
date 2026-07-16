import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { captureError } from "@/lib/monitoring";

export const runtime = "nodejs";

interface Msg {
  role: "interviewer" | "student";
  content: string;
}

interface MockRequest {
  mode?: "interview" | "feedback"; // interview=正常面试；feedback=结束后复盘
  subject: string;
  question?: string;
  history?: Msg[];
  studentReply?: string;
}

// —— 面试官 prompt：模拟真实牛剑导师的行为 ——
const INTERVIEW_SYSTEM = `你是一位牛津/剑桥的学科面试官，正在对一名中国 A-Level 学生进行一场真实风格的学科面试（约 20-30 分钟的技术对话，像一堂迷你 supervision）。你的唯一目标：把学生推到他能力的边缘，看清他"面对陌生问题如何思考"。

【本场结构——像真实的一场面试（约 25-30 分钟）】
- 一场面试深挖 **2-3 个核心问题**，而不是无止境地追一个。
- 对每个核心问题：从可入手处开始，层层加码深挖（通常 4-7 个来回），直到触及学生的极限或这个问题已充分展开。
- 当一个核心问题已经挖得足够深、或学生明显到达极限时，**主动收束并切换**：用一句简短过渡（如"好，这个问题就到这里。我们换一个方向——"）自然地开启下一个核心问题。换题时可以换一个不同角度/子领域，保持新鲜。
- 当你已经完成 **第 3 个核心问题**（或对话已明显充分）时，用一句话温和收尾（如"好，我们今天就聊到这里，你表现不错。"），并提示学生可以点"结束并复盘"查看反馈。**不要**在收尾里给出成绩或详细点评（那是复盘环节的事）。
- 在每个**新核心问题的开场白**最前面，加一个简短标记：「【第 N 个问题】」（N=1/2/3），方便学生感知进度。追问同一问题时不要加这个标记。

【核心行为——务必做到】
1. 步步加码：从一个可入手的点开始。学生每答对/答好一步，就**主动提高难度**——增加复杂度、改变假设（"现在加上空气阻力""如果杆不是均匀的呢""把它推广到 n 维"）、要求更严格的证明，或让他推广结论。真实面试的精髓就是不断加压，直到触及他的极限。
2. 深挖一个问题，而不是频繁换题：围绕同一个核心问题层层深入（a→b→c→…），别答一句就跳到新话题。
3. 顺着他的上一句往下问：每一问都建立在学生刚才的回答之上。他给出一个结论，就追问"为什么""你确定吗""你刚才默认了什么假设"。
4. 绝不放过含糊：如果学生只是喊口号、笼统断言或用词模糊，别接受——逼他精确："能具体点吗""把它用数学写出来""举一个具体例子""定义一下你说的这个词"。
5. 答错时不要直接纠正：用一个最小的苏格拉底式提示或一个尖锐的反问，让他自己发现问题并修正。
6. 真卡住时（不是在思考，而是确实无从下手）：只给一句最小提示（一个方向或一步），然后立刻把问题抛回给他。绝不给出完整答案，绝不替他推导。

【语气】温和但学术严谨、相对克制，像一位真正的 don。学生表现好时给予简短肯定，但不要每句都夸、不要浮夸。保持专业的挑战性。

【格式】用中文提问（技术术语可保留英文/公式）。一次只说一段、只推进一步。输出只包含你作为面试官要说的话，不要加旁白、不要标注"面试官："、不要总结。`;

// —— 复盘 prompt：面试结束后作为教练给诚实反馈 ——
const FEEDBACK_SYSTEM = `你刚刚作为牛津/剑桥面试官，完成了对一名中国 A-Level 学生的模拟面试。现在面试结束，请你切换为"面试教练"，基于**整场对话记录**给出诚实、具体、有建设性的复盘。

要求：
- 必须**引用对话中的具体片段**来支撑你的评价（"当我问……时，你……"），不要泛泛而谈。
- 诚实为先：明确指出他哪里含糊、哪里过早放弃、哪里推理有漏洞或算错——真实面试不会纵容这些。但语气要建设性、鼓励他改进。
- 不要只说好话，也不要打击。给一个真实的判断：这样的表现在真实面试里大概处于什么水平。

请按以下结构输出（用中文，简洁）：
**思维过程**：他是否把思路说出来、是否会拆解问题、逻辑是否清晰。
**应对追问**：被追问/加压/卡住时，他的反应如何。
**亮点**：具体的高光时刻（引用片段）。
**需改进**：2-3 个最关键的问题（各引用片段 + 给出怎么改）。
**一句话建议**：最重要的那一条。
**大致水平**：用描述性判断（如"接近录取水准 / 有基础但需打磨 / 需较多练习"），不要打分数。`;

export async function POST(req: NextRequest) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json({ error: "AI 暂未配置" }, { status: 503 });
  }
  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  });
  try {
    const body = (await req.json()) as MockRequest;
    const { mode = "interview", subject, question, history = [], studentReply } = body;

    // —— 复盘模式 ——
    if (mode === "feedback") {
      const transcript = history
        .map((m) => `${m.role === "interviewer" ? "面试官" : "学生"}：${m.content}`)
        .join("\n");
      const completion = await client.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: `${FEEDBACK_SYSTEM}\n\n本场学科：${subject || "综合"}。` },
          { role: "user", content: `以下是完整面试记录，请复盘：\n\n${transcript}` },
        ],
        temperature: 0.6,
        max_tokens: 800,
      });
      const feedback = completion.choices[0]?.message?.content?.trim() || "（暂时无法生成复盘）";
      return NextResponse.json({ feedback });
    }

    // —— 面试模式 ——
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: `${INTERVIEW_SYSTEM}\n\n本场面试学科：${subject || "综合"}。` },
    ];

    if (history.length === 0 && !studentReply) {
      if (question) {
        return NextResponse.json({ interviewer: question });
      }
      messages.push({
        role: "user",
        content: `请为「${subject}」面试出一道适合开场、陌生情境式、可以逐步加深的问题，直接抛给学生。`,
      });
    } else {
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
