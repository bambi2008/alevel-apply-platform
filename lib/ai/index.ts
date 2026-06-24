// AI / RAG 服务接口（Phase 2 预留）。
// 用途：文书润色建议、智能问答、模拟面试。模型经 Claude 网关，检索用 pgvector。
// MVP 不接入；此处仅定义接口，便于后续替换实现与功能开关（AI_ENABLED）。

export interface PsFeedbackInput {
  kind: "UK_UCAS_3Q" | "HK_ESSAY";
  content: Record<string, string>;
  targetProgram?: string;
}

export interface PsFeedback {
  suggestions: string[];
  rubricScores?: Record<string, number>;
  disclaimer: string; // 必须提示：AI 仅辅助，文书须本人原创
}

export interface AiService {
  enabled(): boolean;
  reviewPersonalStatement(input: PsFeedbackInput): Promise<PsFeedback>;
}

class DisabledAiService implements AiService {
  enabled() {
    return process.env.AI_ENABLED === "true";
  }
  async reviewPersonalStatement(): Promise<PsFeedback> {
    throw new Error("AI 能力尚未启用（设置 AI_ENABLED=true 并实现适配器）");
  }
}

export function getAiService(): AiService {
  return new DisabledAiService();
}
