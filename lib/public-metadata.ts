import type { Metadata } from "next";

export const PUBLIC_SITE_ORIGIN = "https://qiaoshenedu.com";
const ROUTES: Record<string, [string, string, string, string]> = {
  "": ["桥申｜A-Level 与英港升学训练", "QiaoShen | A-Level and UK/HK Admissions Training", "A-Level Pure 3、入学考试、竞赛、面试与文书的原创训练和学习记录。非官方试题，不承诺考试或录取结果。", "Original practice and study records for A-Level Pure 3, admissions tests, competitions, interviews and personal statements. Not official exam content or a guarantee of results."],
  tests: ["考试训练", "University Admissions Tests", "按考试和考点选择专项练习、原创计时训练与学习记录。", "Choose topic practice, original timed papers and study records by exam."],
  background: ["竞赛与专业实践", "Competitions and Projects", "进入 BMO、BPhO 题库，规划竞赛、研究与专业实践。", "Explore BMO and BPhO question banks and plan competitions, research and subject projects."],
  interview: ["面试训练", "Interviews", "练习学科推理、解释方法与回应追问。题目为训练用途，非官方面试题。", "Practise subject reasoning, explaining methods and responding to follow-up questions. Original training, not official interview questions."],
  statements: ["文书工作台", "Personal Statements", "整理真实经历、规划结构并修改自己的申请文书。AI 反馈仅供训练参考，不代写。", "Organise real experiences, plan a structure and revise your own statement. AI feedback supports training and does not write for you."],
  pricing: ["套餐说明", "Study Plans", "查看基础练习、体验与学习套餐说明；支付尚未开放。", "Review Basic Practice, trial and study-plan information. Purchases are not enabled."],
  privacy: ["隐私政策", "Privacy Policy", "了解桥申学习数据、图片上传、AI 数据处理及账号隐私权利。", "Understand study data, image uploads, AI processing and account privacy rights on QiaoShen."],
  terms: ["服务条款", "Terms of Service", "桥申训练服务的使用规则、AI 反馈限制与用户责任。", "Rules for using QiaoShen training, limitations of AI feedback and user responsibilities."],
  "question-bank-updates": ["题库更新记录", "Question-bank Updates", "查看各考试专项练习的新增与修正记录。", "See additions and corrections to topic-practice banks by exam."],
  login: ["登录", "Sign in", "登录桥申，继续自己的学习训练。", "Sign in to QiaoShen and continue your study."],
  register: ["注册", "Register", "创建桥申学习账号，注册方式以页面说明为准。", "Create a QiaoShen study account. Registration availability is shown on the page."],
  account: ["账号与隐私", "Account and Privacy", "管理自己的账号与学习数据。", "Manage your account and study data."],
  profile: ["我的档案", "My Profile", "管理意向院校、专业和学习科目。", "Manage intended universities, majors and study subjects."],
};
const EXAMS: Record<string, string> = { caie9709: "CAIE 9709 · Pure 3", esat: "ESAT", tmua: "TMUA", step: "STEP", mat: "MAT", pat: "PAT", lnat: "LNAT", tara: "TARA", ucat: "UCAT", ielts: "IELTS", bmo: "BMO", bpho: "BPhO", csat: "CSAT" };
const SUBPAGES: Record<string, [string, string]> = { practice: ["专项练习", "Topic practice"], mock: ["计时训练", "Timed practice"], paper: ["训练卷", "Practice paper"], learn: ["知识点", "Knowledge"], history: ["学习记录", "Study history"], review: ["错题复盘", "Review"] };
export const PUBLIC_PATHS = ["", "tests", "background", "interview", "statements", "pricing", "privacy", "terms", "question-bank-updates", ...Object.keys(EXAMS).map(id => `tests/${id}`)];

export function routeMetadata(locale: string, pathname: string): Metadata {
  const en = locale === "en";
  const path = pathname.replace(/^\/(?:zh-CN|en)(?:\/|$)/, "").replace(/^\/+|\/+$/g, "");
  const [area, id, level] = path.split("/");
  const labels = ROUTES[area] ?? ["学习训练", "Study", "继续桥申学习训练。", "Continue your QiaoShen study."];
  const exam = area === "tests" ? EXAMS[id] : undefined;
  const sub = SUBPAGES[level]?.[en ? 1 : 0];
  const name = exam ? `${exam}${sub ? ` · ${sub}` : ""}` : labels[en ? 1 : 0];
  const title = path ? `${name} · ${en ? "QiaoShen" : "桥申"}` : name;
  const description = exam
    ? en ? `${exam}: original topic practice and timed training. Platform scores and difficulty are references, not official results.` : `${exam} 专项练习与原创计时训练。平台分数和难度仅供参考，不代表官方成绩。`
    : labels[en ? 3 : 2];
  // Never copy answer/session IDs or arbitrary private path segments into
  // canonical, hreflang or social metadata. Those pages remain noindexed.
  const publicPage = PUBLIC_PATHS.includes(path);
  const safePath = publicPage ? path : exam ? `tests/${id}` : Object.hasOwn(ROUTES, area) && PUBLIC_PATHS.includes(area) ? area : "";
  const suffix = safePath ? `/${safePath}` : "";
  const canonical = `${PUBLIC_SITE_ORIGIN}/${en ? "en" : "zh-CN"}${suffix}`;
  return { metadataBase: new URL(PUBLIC_SITE_ORIGIN), title, description,
    alternates: { canonical, languages: { "zh-CN": `${PUBLIC_SITE_ORIGIN}/zh-CN${suffix}`, en: `${PUBLIC_SITE_ORIGIN}/en${suffix}`, "x-default": `${PUBLIC_SITE_ORIGIN}/zh-CN${suffix}` } },
    openGraph: { type: "website", title, description, url: canonical, siteName: "QiaoShen", locale: en ? "en_GB" : "zh_CN", alternateLocale: en ? ["zh_CN"] : ["en_GB"], images: [{ url: "/images/hero.jpg", alt: "QiaoShen" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/images/hero.jpg"] },
    robots: { index: publicPage, follow: publicPage },
  };
}
