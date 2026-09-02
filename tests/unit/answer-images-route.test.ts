import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  create: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/db", () => ({
  db: { answerImage: { create: mocks.create } },
}));
vi.mock("@/lib/storage", () => ({
  getStorage: () => ({ put: mocks.put, delete: mocks.delete }),
}));

import { POST } from "@/app/api/answer-images/route";

function request(file?: File) {
  const form = new FormData();
  if (file) form.append("file", file);
  form.append("contextKey", "paper:q1:(a)");
  return new NextRequest("http://localhost/api/answer-images", { method: "POST", body: form });
}

describe("answer image upload API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.mockResolvedValue({ user: { id: "user-1" } });
  });

  it("requires authentication", async () => {
    mocks.auth.mockResolvedValue(null);
    const response = await POST(request());
    expect(response.status).toBe(401);
  });

  it("rejects a renamed non-image", async () => {
    const response = await POST(request(new File(["not an image"], "answer.jpg", { type: "image/jpeg" })));
    expect(response.status).toBe(415);
    await expect(response.json()).resolves.toEqual({ error: "signature_mismatch" });
  });

  it("normalizes and stores a valid image for its owner", async () => {
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");
    mocks.put.mockResolvedValue({ key: "storage-key.jpg", fileName: "answer.jpg", mime: "image/jpeg", size: 280 });
    mocks.create.mockResolvedValue({
      id: "image-1",
      fileName: "answer.jpg",
      mime: "image/jpeg",
      size: 280,
      width: 1,
      height: 1,
      createdAt: new Date("2026-09-02T00:00:00Z"),
    });
    const response = await POST(request(new File([png], "answer.png", { type: "image/png" })));
    expect(response.status).toBe(201);
    expect(mocks.put).toHaveBeenCalledWith(expect.objectContaining({ mime: "image/jpeg", fileName: "answer.jpg" }));
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ ownerId: "user-1", contextKey: "paper:q1:(a)" }),
    }));
    await expect(response.json()).resolves.toMatchObject({ image: { id: "image-1", url: "/api/answer-images/image-1" } });
  });
});
