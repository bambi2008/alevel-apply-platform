import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { renderToString } from "katex";
import { ENGLISH_SUPPLEMENT_SOURCES } from "../scripts/export-english-supplement";
import data from "@/data/content-language/en-supplement.json";
import manifest from "@/data/content-language/source-manifest-supplement-20261028.json";
import labelsData from "@/data/content-language/math-labels-supplement-en.json";
import { ADMISSIONS_TESTS } from "./tests";
import { getKnowledgeByTopicId } from "./tests/knowledge";
import { REGISTRATION_INFO } from "./tests/registration";
import { contentText, localizeStaticContent } from "./content-language";
const english=data.translations as Record<string,string>;
const hashes=manifest.sourceHashes as Record<string,string>;
const labels=labelsData as Record<string,string>;
const locked=/```[\s\S]*?```|`[^`\n]+`|\$\$[\s\S]*?\$\$|\$(?:\\.|[^$])+\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|https?:\/\/[^\s)]+|\d+(?:[.,]\d+)*(?:%|°)?/g;
describe("static English knowledge supplement",()=>{
  it("has exact current-source hashes, no untranslated fields or transport tokens",()=>{
    expect(ENGLISH_SUPPLEMENT_SOURCES).toHaveLength(548);
    expect(Object.keys(english).sort()).toEqual(ENGLISH_SUPPLEMENT_SOURCES.map(e=>e.key).sort());
    for(const e of ENGLISH_SUPPLEMENT_SOURCES){
      expect(hashes[e.key]).toBe(createHash("sha256").update(e.source).digest("hex"));
      expect(contentText(e.source,"en")).toBe(english[e.key]);
      expect(english[e.key]).not.toMatch(/[\u3400-\u9fff]|@@P\d{4}@@/);
      expect(contentText(e.source,"zh-CN")).toBe(e.source);
      const required=new Map<string,number>();
      for(const fragment of e.source.match(locked)??[]){const expected=labels[fragment]??fragment;required.set(expected,(required.get(expected)??0)+1);}
      for(const [fragment,count] of required) expect(english[e.key].split(fragment).length-1,e.key+": "+fragment).toBeGreaterThanOrEqual(count);
    }
  });
  it("renders every current knowledge page and registration entry in English without changing keys",()=>{
    for(const exam of ADMISSIONS_TESTS)for(const topic of exam.topics){
      const source=getKnowledgeByTopicId(topic.id);if(!source)continue;
      const shown=localizeStaticContent(source,"en");
      expect(shown.topicId).toBe(source.topicId);
      expect(shown.workedExamples.map(e=>e.answer)).toEqual(source.workedExamples.map(e=>e.answer));
      expect(JSON.stringify(shown),topic.id).not.toMatch(/[\u3400-\u9fff]/);
      for(const value of JSON.stringify(shown).matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)) {
        const formula=JSON.parse('"'+(value[1]??value[2])+'"');
        expect(()=>renderToString(formula,{throwOnError:true,strict:"ignore"}),topic.id).not.toThrow();
      }
      expect(localizeStaticContent(source,"zh-CN")).toBe(source);
    }
    expect(JSON.stringify(localizeStaticContent(REGISTRATION_INFO,"en"))).not.toMatch(/[\u3400-\u9fff]/);
  });
  it("changes formula text labels only, preserving mathematical syntax",()=>{
    const maths=(s:string)=>s.replace(/\\(?:text|mathrm)\{[^{}]*\}/g,"").replace(/[\u3400-\u9fff]/gu,"").replace(/\s+/g,"");
    for(const [source,shown] of Object.entries(labels))expect(maths(shown)).toBe(maths(source));
  });
  it("continues one cost ledger instead of restarting the owner's budget",()=>{
    expect(manifest.ownerBudgetCny).toBe(20);expect(manifest.spendableCapCny).toBe(19);
    expect(manifest.previousCostUpperCny).toBeCloseTo(2.217222,6);
    expect(manifest.costUpperCny).toBeCloseTo(2.430020,6);
    expect(manifest.costUpperCny).toBeLessThan(manifest.spendableCapCny);
    const extra=(manifest.promptTokens-manifest.previousPromptTokens)*2/1e6+(manifest.completionTokens-manifest.previousCompletionTokens)*8/1e6;
    expect(manifest.previousCostUpperCny+extra).toBeCloseTo(manifest.costUpperCny,6);
  });
});
