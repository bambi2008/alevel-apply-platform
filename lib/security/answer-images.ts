import { MAX_ANSWER_IMAGE_BYTES, MAX_ANSWER_IMAGES_PER_PART } from "@/lib/tests/answer-images";

export { MAX_ANSWER_IMAGE_BYTES, MAX_ANSWER_IMAGES_PER_PART };

const IMAGE_SIGNATURES = {
  "image/jpeg": (bytes: Buffer) => bytes.length >= 3
    && bytes[0] === 0xff
    && bytes[1] === 0xd8
    && bytes[2] === 0xff,
  "image/png": (bytes: Buffer) => bytes.length >= 8
    && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  "image/webp": (bytes: Buffer) => bytes.length >= 12
    && bytes.subarray(0, 4).toString("ascii") === "RIFF"
    && bytes.subarray(8, 12).toString("ascii") === "WEBP",
} satisfies Record<string, (bytes: Buffer) => boolean>;

export const ANSWER_IMAGE_MIME_TYPES = Object.keys(IMAGE_SIGNATURES);
export function validateAnswerImageUpload(
  file: Pick<File, "type" | "size">,
  bytes: Buffer,
) {
  if (!ANSWER_IMAGE_MIME_TYPES.includes(file.type)) {
    return { ok: false as const, error: "unsupported_type" };
  }
  if (file.size === 0 || bytes.length === 0) {
    return { ok: false as const, error: "empty_file" };
  }
  if (file.size > MAX_ANSWER_IMAGE_BYTES || bytes.length > MAX_ANSWER_IMAGE_BYTES) {
    return { ok: false as const, error: "too_large" };
  }
  const matches = IMAGE_SIGNATURES[file.type as keyof typeof IMAGE_SIGNATURES](bytes);
  if (!matches) return { ok: false as const, error: "signature_mismatch" };
  return { ok: true as const };
}
