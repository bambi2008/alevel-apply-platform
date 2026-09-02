import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  findFirst: vi.fn(),
  deleteRecord: vi.fn(),
  get: vi.fn(),
  deleteFile: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/db", () => ({
  db: {
    answerImage: {
      findFirst: mocks.findFirst,
      delete: mocks.deleteRecord,
    },
  },
}));
vi.mock("@/lib/storage", () => ({
  getStorage: () => ({ get: mocks.get, delete: mocks.deleteFile }),
}));

import { DELETE, GET } from "@/app/api/answer-images/[id]/route";

const context = { params: Promise.resolve({ id: "image-1" }) };
const request = new NextRequest("http://localhost/api/answer-images/image-1");

describe("answer image item API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.mockResolvedValue({ user: { id: "user-1" } });
  });

  it("requires authentication before reading an image", async () => {
    mocks.auth.mockResolvedValue(null);
    const response = await GET(request, context);

    expect(response.status).toBe(401);
    expect(mocks.findFirst).not.toHaveBeenCalled();
    expect(mocks.get).not.toHaveBeenCalled();
  });

  it("does not reveal an image that is not owned by the current user", async () => {
    mocks.findFirst.mockResolvedValue(null);
    const response = await GET(request, context);

    expect(response.status).toBe(404);
    expect(mocks.findFirst).toHaveBeenCalledWith({ where: { id: "image-1", ownerId: "user-1" } });
    expect(mocks.get).not.toHaveBeenCalled();
  });

  it("returns an owner image with private no-sniff headers", async () => {
    mocks.findFirst.mockResolvedValue({
      id: "image-1",
      ownerId: "user-1",
      fileKey: "answers/image-1.jpg",
      fileName: "answer.jpg",
      mime: "image/jpeg",
    });
    mocks.get.mockResolvedValue(Buffer.from([0xff, 0xd8, 0xff, 0xd9]));
    const response = await GET(request, context);

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("private");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("content-type")).toBe("image/jpeg");
  });

  it("removes both the private file and its database record for the owner", async () => {
    mocks.findFirst.mockResolvedValue({
      id: "image-1",
      ownerId: "user-1",
      fileKey: "answers/image-1.jpg",
    });
    mocks.deleteFile.mockResolvedValue(undefined);
    mocks.deleteRecord.mockResolvedValue({ id: "image-1" });
    const response = await DELETE(request, context);

    expect(response.status).toBe(200);
    expect(mocks.deleteFile).toHaveBeenCalledWith("answers/image-1.jpg");
    expect(mocks.deleteRecord).toHaveBeenCalledWith({ where: { id: "image-1" } });
    await expect(response.json()).resolves.toEqual({ ok: true });
  });
});
