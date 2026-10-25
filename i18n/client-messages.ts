import type { AbstractIntlMessages } from "next-intl";

// Only namespaces consumed by active client screens. Marketing drafts, prices
// and the retired personal story must never be serialized with every page.
export const CLIENT_MESSAGE_NAMESPACES = [
  "auth", "common", "nav", "profile", "applications", "timeline", "statements",
] as const;

export function clientMessages(messages: Record<string, unknown>): AbstractIntlMessages {
  return Object.fromEntries(CLIENT_MESSAGE_NAMESPACES
    .filter((key) => messages[key] !== undefined)
    .map((key) => [key, messages[key]])) as AbstractIntlMessages;
}
