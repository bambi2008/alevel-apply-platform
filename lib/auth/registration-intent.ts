import { z } from "zod";

export const registrationIntentSchema = z
  .array(z.string().min(1).max(120))
  .min(1)
  .max(10);

export function parseRegistrationIntent(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];

  const seen = new Set<string>();
  return value
    .split(/[，,；;\n\r]+/)
    .map((item) => item.trim().replace(/\s+/g, " "))
    .filter((item) => {
      if (!item) return false;
      const key = item.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}
