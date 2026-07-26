export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
  idempotencyKey?: string;
}

export interface EmailAdapter {
  readonly isDev: boolean;
  send(message: EmailMessage): Promise<void>;
}

class ConsoleEmailAdapter implements EmailAdapter {
  readonly isDev = true;

  async send(message: EmailMessage): Promise<void> {
    console.info("[email:development]", message.to, message.subject, message.text);
  }
}

class ResendEmailAdapter implements EmailAdapter {
  readonly isDev = false;

  constructor(
    private readonly apiKey: string,
    private readonly from: string,
  ) {}

  async send(message: EmailMessage): Promise<void> {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.apiKey}`,
        "content-type": "application/json",
        ...(message.idempotencyKey
          ? { "idempotency-key": message.idempotencyKey }
          : {}),
      },
      body: JSON.stringify({
        from: this.from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        html: message.html,
      }),
    });
    if (!response.ok) {
      throw new Error(`Email provider rejected the request (${response.status})`);
    }
  }
}

export function getEmail(): EmailAdapter {
  const driver = process.env.EMAIL_DRIVER?.trim().toLowerCase();
  if (driver === "resend") {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = process.env.EMAIL_FROM?.trim();
    if (!apiKey || !from) {
      throw new Error("RESEND_API_KEY and EMAIL_FROM are required for EMAIL_DRIVER=resend");
    }
    return new ResendEmailAdapter(apiKey, from);
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("A production email provider is required");
  }
  return new ConsoleEmailAdapter();
}
