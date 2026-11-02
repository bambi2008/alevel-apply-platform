import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/grade-answer/route";

function request(body: unknown) {
  return new NextRequest("http://localhost/api/grade-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("grade answer API", () => {
  it("grades blank work deterministically without an API key", async () => {
    const response = await POST(request({
      questionId: "blank",
      testId: "bmo",
      parts: [{
        label: "(i)",
        question: "Prove it.",
        marks: 4,
        solutionOutline: "State the invariant.",
        studentWork: " ",
      }],
      fullSolution: "Use the invariant.",
    }));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      totalEarned: 0,
      totalMax: 4,
      assessment: { method: "deterministic-empty", confidence: "high" },
    });
  });

  it("rejects malformed grading requests before model access", async () => {
    const response = await POST(request({ questionId: "bad", parts: [] }));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: "Invalid grading request" });
  });
  it("returns English deterministic blank feedback without calling a model", async () => {
    const req=request({questionId:"blank-en",testId:"bmo",parts:[{label:"(i)",question:"Prove it.",marks:4,solutionOutline:"State the invariant.",studentWork:" "}],fullSolution:"Use the invariant."});
    req.headers.set("x-qiaoshen-locale","en");
    const response=await POST(req),body=await response.json();
    expect(response.status).toBe(200);
    expect(body).toMatchObject({totalEarned:0,totalMax:4,assessment:{method:"deterministic-empty"}});
    expect(JSON.stringify(body)).not.toMatch(/[\u3400-\u9fff]/);
  });
});
