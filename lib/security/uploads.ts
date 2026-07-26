import path from "node:path";

export const DOCUMENT_MIME = new Map([
  [".pdf", new Set(["application/pdf"])],
  [".doc", new Set(["application/msword", "application/octet-stream"])],
  [".docx", new Set(["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/zip", "application/octet-stream"])],
]);

export function validateDocumentUpload(file: Pick<File, "name" | "type" | "size">, bytes: Buffer) {
  const extension = path.extname(file.name).toLowerCase();
  const allowedMime = DOCUMENT_MIME.get(extension);
  if (!allowedMime || !allowedMime.has(file.type || "application/octet-stream")) {
    return { ok: false as const, error: "unsupported_type" };
  }
  const signatureMatches = extension === ".pdf"
    ? bytes.subarray(0, 5).toString("ascii") === "%PDF-"
    : extension === ".docx"
      ? bytes[0] === 0x50 && bytes[1] === 0x4b
      : bytes.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
  if (!signatureMatches) return { ok: false as const, error: "signature_mismatch" };
  return { ok: true as const, extension };
}
