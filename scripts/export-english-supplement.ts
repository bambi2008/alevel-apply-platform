import { createHash } from "node:crypto";
import { ADMISSIONS_TESTS } from "../lib/tests";
import { getKnowledgeByTopicId } from "../lib/tests/knowledge";
import { REGISTRATION_INFO } from "../lib/tests/registration";
import { CONTENT_STRUCTURAL_FIELDS, HAS_HAN, contentLanguageKey } from "../lib/content-language-key";
import { ENGLISH_CONTENT_SOURCES } from "./export-english-content";
const existing = new Set(ENGLISH_CONTENT_SOURCES.entries.map(e => e.key));
const entries = new Map<string, {key: string; source: string; sha256: string; origins: string[]}>();
function collect(value: unknown, origin: string, field = "") {
  if (CONTENT_STRUCTURAL_FIELDS.has(field)) return;
  if (typeof value === "string" && HAS_HAN.test(value)) {
    const key = contentLanguageKey(value);
    if (existing.has(key)) return;
    const previous = entries.get(key);
    if (previous && previous.source !== value) throw new Error("Supplement content-key collision");
    if (previous) { if (previous.origins.length < 4) previous.origins.push(origin); }
    else entries.set(key,{key,source:value,sha256:createHash("sha256").update(value).digest("hex"),origins:[origin]});
  } else if (Array.isArray(value)) value.forEach((v,i) => collect(v,`${origin}.${i}`,field));
  else if (value && typeof value === "object") for (const [k,v] of Object.entries(value)) collect(v,`${origin}.${k}`,k);
}
for (const exam of ADMISSIONS_TESTS) for (const topic of exam.topics) collect(getKnowledgeByTopicId(topic.id),`knowledge.${topic.id}`);
collect(REGISTRATION_INFO,"registration");
export const ENGLISH_SUPPLEMENT_SOURCES = [...entries.values()].sort((a,b) => a.key.localeCompare(b.key));
if (process.argv[1]?.endsWith("export-english-supplement.ts")) console.log(JSON.stringify(process.argv.includes("--all") ? ENGLISH_SUPPLEMENT_SOURCES : {fields:entries.size,chars:[...entries.values()].reduce((n,e)=>n+e.source.length,0)}));
