import { describe, expect, it } from "vitest";
import { validateDocumentUpload } from "./uploads";

function upload(name: string, type: string, bytes: number[]) {
  return validateDocumentUpload(
    { name, type, size: bytes.length },
    Buffer.from(bytes),
  );
}

describe("document upload validation", () => {
  it("accepts a PDF with a matching signature", () => {
    expect(upload("grades.pdf", "application/pdf", [...Buffer.from("%PDF-1.7")])).toMatchObject({ ok: true });
  });

  it("rejects an executable renamed as a PDF", () => {
    expect(upload("grades.pdf", "application/pdf", [...Buffer.from("MZfake")])).toEqual({
      ok: false,
      error: "signature_mismatch",
    });
  });

  it("rejects unsupported extensions even with a common MIME type", () => {
    expect(upload("photo.html", "application/octet-stream", [0x50, 0x4b])).toEqual({
      ok: false,
      error: "unsupported_type",
    });
  });

  it("accepts Open XML and legacy Word signatures", () => {
    expect(upload("reference.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", [0x50, 0x4b, 0x03, 0x04])).toMatchObject({ ok: true });
    expect(upload("reference.doc", "application/msword", [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])).toMatchObject({ ok: true });
  });
});
