import type { NextRequest } from "next/server";

const messages: Record<string, string> = {
  "AI 暂未配置（缺少 DEEPSEEK_API_KEY）": "AI is not configured. Please contact the administrator.",
  "AI 反馈暂未配置（缺少 DEEPSEEK_API_KEY）": "AI feedback is not configured. Please contact the administrator.",
  "AI 模拟面试当前未启用，请联系管理员": "AI interview practice is not enabled. Please contact the administrator.",
  "AI 模拟面试未配置 DeepSeek API 密钥，请联系管理员": "AI interview practice is not configured. Please contact the administrator.",
  "请选择要写入的题目（Q2 或 Q3）": "Choose a question: Q2 or Q3.",
  "缺少课题信息": "Project information is required.",
  "请先填写研究问题": "Enter a research question first.",
  "缺少题号": "A question identifier is required.",
  "缺少阶段信息": "Stage information is required.",
  "生成失败，请稍后重试。": "Generation failed. Please try again later.",
  "生成失败，请稍后再试": "Generation failed. Please try again later.",
  "点评生成失败，请稍后重试。": "The review could not be generated. Please try again later.",
  "反馈生成失败，请稍后重试。": "Feedback could not be generated. Please try again later.",
};

/** Owned static error messages only; not a translator for provider errors or user input. */
export function aiMessageForRequest(source: string, request: NextRequest): string {
  return aiResponseLanguage(request) === "en" && Object.hasOwn(messages, source) ? messages[source] : source;
}

export function aiResponseLanguage(request: NextRequest): "en" | "zh-CN" {
  const explicit = request.headers.get("x-qiaoshen-locale");
  if (explicit === "en" || explicit === "zh-CN") return explicit;
  try {
    const referrer = new URL(request.headers.get("referer") ?? "");
    if (referrer.origin === request.nextUrl.origin) {
      if (/^\/en(?:\/|$)/.test(referrer.pathname)) return "en";
      if (/^\/zh-CN(?:\/|$)/.test(referrer.pathname)) return "zh-CN";
    }
  } catch { /* A missing referrer is normal with strict browser privacy. */ }
  return request.cookies.get("NEXT_LOCALE")?.value === "en" ? "en" : "zh-CN";
}

/** Static system instructions only. Never pass candidate work or transcripts. */
export function aiSystemForRequest(system: string, request: NextRequest): string {
  if (aiResponseLanguage(request) !== "en") return system;
  return system.replace(/Write feedback in Chinese/gi,"Write feedback in English")
    .replace(/用中文回复/g,"Respond in English").replace(/用中文提问/g,"Ask questions in English").replace(/用中文/g,"Use English")
    + "\n\nOUTPUT LANGUAGE: Use English for all learner-facing feedback, reasoning, coaching and interview questions. Keep JSON property names, identifiers, mark limits and scoring rules unchanged. Preserve verbatim quotations from the learner and any handwriting transcription in their original language. Do not translate or rewrite the learner's submitted work.";
}
