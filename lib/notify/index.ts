// 通知适配器接口 + 开发 stub。
// 生产：短信(阿里/腾讯)、邮件(SMTP/Resend)、微信模板消息。MVP 仅记录到控制台。

export type NotifyChannel = "sms" | "email" | "wechat";

export interface NotifyMessage {
  channel: NotifyChannel;
  to: string;
  template: string;
  data?: Record<string, unknown>;
  subject?: string; // email
}

export interface Notifier {
  send(msg: NotifyMessage): Promise<{ ok: boolean; id?: string }>;
}

class ConsoleNotifier implements Notifier {
  async send(msg: NotifyMessage) {
    console.info("[notify:stub]", msg.channel, "->", msg.to, msg.template, msg.data ?? {});
    return { ok: true, id: `stub_${Date.now()}` };
  }
}

// TODO(Phase 2): SmsNotifier / EmailNotifier / WeChatNotifier
export function getNotifier(): Notifier {
  return new ConsoleNotifier();
}
