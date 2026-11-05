import { deepSeekFeedback, parseModelJson, readFeedbackInput } from "@/lib/ai/feedback-response";
import { aiResponseLanguage } from "@/lib/ai-response-language";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { aiSystemForRequest, aiMessageForRequest } from "@/lib/ai-response-language";
import { requireAiAccess } from "@/lib/security/ai-route";

export const runtime = "nodejs";

interface StructureRequest {
  title: string;
  field: string;
  question: string;
  motivation: string;
  method: string;
  variables: string;
}

const SYSTEM_PROMPT = `你是一位帮助高中生把「研究想法」梳理成规范课题的导师。学生申请英国/香港大学，需要把自己的研究做成结构清晰、有量化、能写进个人陈述（PS）的课题。

你的任务：根据学生填写的想法，生成一个结构化的课题框架。要求：
1. 尊重学生原本的想法与方向，只做梳理和专业化，不要替换成别的课题。
2. 把课题拆成 4 个循序渐进的阶段，每阶段有：标题、目标、任务、产出物、2-3 个可量化的验收指标。
3. 给出「基础线」（达到即合格）与「挑战目标」（拔高），都尽量量化。
4. 给出 4 个「反思与延伸」问题——英国招生官最看重反思，问题要能引导学生深入思考（如结果是否意外、有何局限、如何联系更大图景）。
5. 给出「PS 用途」：这个课题如何用于英国 UCAS 个人陈述 / 港校申请（1-2 句）。
6. 给出一句话 summary 概括课题，和一个 primaryTool（主要工具/方法）。
7. 诚实、务实：如果学生的方法有局限（如设备、样本、精度），可以在挑战目标或反思里体现，但不要否定学生的努力。
8. 用中文；只返回合法 JSON，不要 markdown、不要多余文字。`;

const buildPrompt = (r: StructureRequest) => `
学生的课题想法：
- 标题：${r.title}
- 领域：${r.field}
- 想研究的问题：${r.question}
- 动机来源：${r.motivation}
- 方法/工具：${r.method}
- 想比较/测量：${r.variables}

请生成结构化课题，只返回如下 JSON（不要其它文字、不要 markdown）：
{
  "summary": "一句话概括这个课题",
  "primaryTool": "主要工具/方法",
  "baseline": "基础线（量化）",
  "challenge": "挑战目标（量化）",
  "stages": [
    {"num": 1, "title": "阶段标题", "goal": "阶段目标", "tasks": "具体任务", "deliverable": "产出物", "metrics": ["量化指标1", "量化指标2"]},
    {"num": 2, "title": "...", "goal": "...", "tasks": "...", "deliverable": "...", "metrics": ["..."]},
    {"num": 3, "title": "...", "goal": "...", "tasks": "...", "deliverable": "...", "metrics": ["..."]},
    {"num": 4, "title": "...", "goal": "...", "tasks": "...", "deliverable": "...", "metrics": ["..."]}
  ],
  "reflection": ["反思问题1", "反思问题2", "反思问题3", "反思问题4"],
  "psUse": "这个课题如何用于英国/港校申请"
}`;

const strings = (value: unknown) => Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];

const textField = z.string().max(30_000).default("");
const structureInput = z.object({
  title: textField, field: textField, question: z.string().trim().min(1).max(30_000),
  motivation: textField, method: textField, variables: textField,
}).strict();

export async function POST(req: NextRequest) {
  const access = await requireAiAccess(req, "structure-project", 30);
  if (!access.ok) return access.response;
  if (process.env.AI_ENABLED !== "true" || !process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json({ error: aiMessageForRequest("AI 暂未配置（缺少 DEEPSEEK_API_KEY）", req) }, { status: 503 });
  }
  const parsed = await readFeedbackInput(req, structureInput);
  if (!parsed.ok) return parsed.response;
  return deepSeekFeedback({
    request: req, userId: access.userId, route: "/api/structure-project", kind: "general", json: true, maxTokens: 2500,
    messages: [{ role: "system", content: aiSystemForRequest(SYSTEM_PROMPT, req) }, { role: "user", content: buildPrompt(parsed.data) }],
    parse(raw) {
      const data = parseModelJson(raw);
      if (!Array.isArray(data.stages) || !data.stages.length) throw Error("invalid_project_structure");
      const en = aiResponseLanguage(req) === "en";
      const stages = data.stages.slice(0, 6).map((entry: unknown, index: number) => {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) throw Error("invalid_project_stage");
        const stage = entry as Record<string, unknown>;
        return {
          num: typeof stage.num === "number" ? stage.num : index + 1,
          title: String(stage.title ?? (en ? "Stage " : "阶段 ") + (index + 1)),
          goal: String(stage.goal ?? ""), tasks: String(stage.tasks ?? ""),
          deliverable: String(stage.deliverable ?? ""), metrics: strings(stage.metrics),
        };
      });
      return { structure: { summary: String(data.summary ?? ""), primaryTool: String(data.primaryTool ?? ""),
        baseline: String(data.baseline ?? ""), challenge: String(data.challenge ?? ""), stages,
        reflection: strings(data.reflection), psUse: String(data.psUse ?? "") } };
    },
  });
}
