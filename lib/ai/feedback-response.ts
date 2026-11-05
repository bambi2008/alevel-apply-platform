import type { AiFeedbackKind, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { aiResponseLanguage } from "@/lib/ai-response-language";
import { db } from "@/lib/db";
import { boundedJson, privateNoStore } from "@/lib/security/json-request";
import type { z } from "zod";
import { deepSeekParameters } from "./deepseek-config";
import { feedbackFingerprint, finishFeedback, releaseFeedback, reserveFeedback } from "./feedback-quota";

export function quotaMessage(locale: string) {
  return locale === "en" ? "You've used today's AI feedback. Please come back tomorrow." : "今天的 AI 批改次数已用完，明天再来吧。";
}

export async function withFeedbackQuota(
  input: { userId: string; kind: AiFeedbackKind; cacheKey: string; locale: string },
  perform: () => Promise<Response>,
) {
  const reservation = await reserveFeedback(input);
  const reply = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: privateNoStore });
  if (reservation.state === "quota") return reply({ code: "ai_quota_exhausted", error: quotaMessage(input.locale) }, 429);
  if (reservation.state === "in_progress") return reply({ code: "ai_in_progress", error: input.locale === "en" ? "This feedback is being prepared." : "这份反馈正在生成。" }, 409);
  if (reservation.state === "cached") return NextResponse.json(reservation.output, { headers: { ...privateNoStore, "X-QiaoShen-AI-Cache": "hit" } });
  if (reservation.state !== "reserved") return reply({ error: reservation.state }, 402);
  let committed = false;
  try {
    const response = await perform();
    if (!response.ok) {
      response.headers.set("Cache-Control", privateNoStore["Cache-Control"]);
      return response;
    }
    const value = await response.clone().json() as Prisma.InputJsonValue;
    if (Buffer.byteLength(JSON.stringify(value)) > 256 * 1024) return reply({ error: "ai_response_too_large" }, 503);
    committed = await finishFeedback(reservation.id, value);
    if (!committed) return reply({ error: "ai_session_ended" }, 409);
    response.headers.set("Cache-Control", privateNoStore["Cache-Control"]);
    return response;
  } catch {
    return reply({ error: input.locale === "en" ? "Feedback is temporarily unavailable." : "反馈暂时不可用。" }, 503);
  } finally {
    if (!committed) await releaseFeedback(reservation.id).catch(() => undefined);
  }
}

export async function deepSeekFeedback<T>(input: {
  request: NextRequest; userId: string; route: string; kind: AiFeedbackKind;
  messages: OpenAI.Chat.ChatCompletionMessageParam[]; maxTokens: number; json?: boolean; temperature?: number;
  parse: (raw: string) => T;
}) {
  const model = deepSeekParameters();
  const locale = aiResponseLanguage(input.request);
  const cacheKey = feedbackFingerprint(input.route, [locale, model.model, input.messages, input.maxTokens, input.json ?? false, input.temperature ?? null]);
  return withFeedbackQuota({ userId: input.userId, kind: input.kind, cacheKey, locale }, async () => {
    const evaluation = await db.aiEvaluation.create({ data: {
      userId: input.userId, route: input.route, purpose: input.kind, provider: "deepseek", model: model.model,
      requestHash: cacheKey, inputChars: JSON.stringify(input.messages).length, providerCalls: 1,
    }, select: { id: true, createdAt: true } });
    try {
      const client = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY, baseURL: "https://api.deepseek.com", timeout: 30_000, maxRetries: 0 });
      const response = await client.chat.completions.create({
        ...model, messages: input.messages, max_tokens: input.maxTokens, temperature: input.temperature,
        response_format: input.json ? { type: "json_object" } : undefined,
      });
      const raw = response.choices[0]?.message?.content?.trim();
      const usage = response.usage;
      const tokens = { promptTokens: usage?.prompt_tokens, completionTokens: usage?.completion_tokens, totalTokens: usage?.total_tokens };
      try {
        if (!raw) throw Error("empty_feedback");
        const output = input.parse(raw);
        await db.aiEvaluation.updateMany({ where: { id: evaluation.id }, data: { status: "SUCCEEDED", ...tokens,
          outputChars: raw.length, latencyMs: Date.now() - +evaluation.createdAt } });
        return NextResponse.json(output, { headers: privateNoStore });
      } catch {
        await db.aiEvaluation.updateMany({ where: { id: evaluation.id }, data: { status: "FAILED", ...tokens,
          errorCode: "AI_OUTPUT_INVALID", latencyMs: Date.now() - +evaluation.createdAt } });
        return NextResponse.json({ error: "ai_feedback_invalid" }, { status: 503, headers: privateNoStore });
      }
    } catch {
      await db.aiEvaluation.updateMany({ where: { id: evaluation.id }, data: { status: "FAILED", errorCode: "AI_PROVIDER_FAILED",
        latencyMs: Date.now() - +evaluation.createdAt } });
      return NextResponse.json({ error: "ai_provider_unavailable" }, { status: 503, headers: privateNoStore });
    }
  });
}

export function parseModelJson(raw: string): Record<string, unknown> {
  const value: unknown = JSON.parse(raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, ""));
  if (!value || typeof value !== "object" || Array.isArray(value)) throw Error("invalid_feedback");
  return value as Record<string, unknown>;
}

export async function readFeedbackInput<T>(request: NextRequest, schema: z.ZodType<T>) {
  const body = await boundedJson(request, 128 * 1024);
  if (!body.ok) return body;
  const parsed = schema.safeParse(body.value);
  if (!parsed.success) {
    return { ok: false, response: NextResponse.json({ error: "invalid_body" }, { status: 400, headers: privateNoStore }) } as const;
  }
  return { ok: true, data: parsed.data } as const;
}
