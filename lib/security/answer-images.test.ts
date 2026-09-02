import { describe, expect, it } from "vitest";
import { validateAnswerImageUpload } from "./answer-images";

function image(type: string, bytes: number[]) {
  return validateAnswerImageUpload(
    { type, size: bytes.length },
    Buffer.from(bytes),
  );
}

describe("answer image upload validation", () => {
  it("accepts JPEG, PNG and WebP signatures", () => {
    expect(image("image/jpeg", [0xff, 0xd8, 0xff, 0xdb])).toMatchObject({ ok: true });
    expect(image("image/png", [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])).toMatchObject({ ok: true });
    expect(image("image/webp", [...Buffer.from("RIFF0000WEBP")])).toMatchObject({ ok: true });
  });

  it("rejects renamed files and unsupported formats", () => {
    expect(image("image/jpeg", [...Buffer.from("not-jpeg")])).toEqual({ ok: false, error: "signature_mismatch" });
    expect(image("image/gif", [...Buffer.from("GIF89a")])).toEqual({ ok: false, error: "unsupported_type" });
  });
});
