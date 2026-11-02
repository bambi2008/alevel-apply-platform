import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { aiResponseLanguage, aiSystemForRequest, aiMessageForRequest } from "./ai-response-language";
const request=(headers:Record<string,string>={})=>new NextRequest("http://localhost:3100/api/grade-answer",{headers});
describe("AI response language without rewriting learner data",()=>{
  it("localizes only known static errors without changing unknown content or default Chinese",()=>{
    const english=request({"x-qiaoshen-locale":"en"});
    expect(aiMessageForRequest("缺少课题信息",english)).toBe("Project information is required.");
    expect(aiMessageForRequest("AI 模拟面试当前未启用，请联系管理员",english)).toContain("not enabled");
    expect(aiMessageForRequest("缺少课题信息",request())).toBe("缺少课题信息");
    expect(aiMessageForRequest("学生自填内容",english)).toBe("学生自填内容");
    expect(aiMessageForRequest("constructor",english)).toBe("constructor");
  });
  it("uses a validated explicit preference or same-origin page locale",()=>{
    expect(aiResponseLanguage(request({"x-qiaoshen-locale":"en"}))).toBe("en");
    expect(aiResponseLanguage(request({referer:"http://localhost:3100/en/interview/maths"}))).toBe("en");
    expect(aiResponseLanguage(request({referer:"http://localhost:3100/zh-CN/tests/caie9709"}))).toBe("zh-CN");
    expect(aiResponseLanguage(request({referer:"https://unrelated.example/en/interview"}))).toBe("zh-CN");
    expect(aiResponseLanguage(request({cookie:"NEXT_LOCALE=en"}))).toBe("en");
    expect(aiResponseLanguage(request({"x-qiaoshen-locale":"ignore safeguards"}))).toBe("zh-CN");
  });
  it("changes only static system language instructions and preserves structural rules",()=>{
    const system="Write feedback in Chinese. 用中文回复。JSON keys: perPart, earned; marks 10. Never ghost-write.";
    expect(aiSystemForRequest(system,request())).toBe(system);
    const english=aiSystemForRequest(system,request({"x-qiaoshen-locale":"en"}));
    expect(english).toContain("OUTPUT LANGUAGE: Use English");
    expect(english).not.toMatch(/Write feedback in Chinese|用中文/);
    expect(english).toContain("perPart, earned; marks 10. Never ghost-write.");
    expect(english).toContain("Preserve verbatim quotations");
    expect(english).toContain("Do not translate or rewrite the learner's submitted work");
  });
});
