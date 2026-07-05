// 交互式填表助手 —— 栏目与字段定义（原创引导内容）。
// 定位：帮学生逐栏「准备好该填什么」，内容存下来供自己誊到官方系统。
// 绝不代登录、代填或代提交。所有提示为原创，非复制官方页面。

export type AppPrepRegion = "UK_UCAS" | "HK";

export type FieldType = "text" | "textarea" | "date" | "select";

export interface PrepField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[]; // select 用
  hint?: string; // 填写要点
}

export interface PrepSection {
  id: string;
  title: string;
  intro: string;
  fields: PrepField[];
  tips: string[]; // 要点
  mistakes: string[]; // 常见错误
  linkTo?: { label: string; href: string }; // 指向平台其它工具（如文书教练）
}

// ─────────────────────── 英国 UCAS（2026 周期）───────────────────────
// 说明：UCAS 是英国本科统一申请系统，一份申请最多 5 个课程志愿，志愿之间无先后。
// 2026 起个人陈述改为三题；单志愿选项已取消。以下为「准备清单」，最终请在 UCAS Hub 填写。
export const UK_UCAS_SECTIONS: PrepSection[] = [
  {
    id: "personal",
    title: "个人信息 Personal details",
    intro: "填写姓名、出生日期、性别等基本信息。务必与护照等官方证件完全一致。",
    fields: [
      { id: "firstName", label: "名 First name(s)", type: "text", hint: "与护照完全一致；如含中间名也要写。" },
      { id: "lastName", label: "姓 Last name", type: "text", hint: "与护照姓氏一致。若只有一个名字，则在名和姓两栏都填它。" },
      { id: "dob", label: "出生日期 Date of birth", type: "date", hint: "UCAS 格式为 日/月/年（DD/MM/YYYY），别填成月/日。" },
      { id: "gender", label: "性别 Sex/Gender", type: "text", hint: "按官方证件填写。" },
    ],
    tips: [
      "姓名拼写、顺序必须与护照一致，否则后续录取/签证会出问题。",
      "先备好护照在手边照抄，避免拼错。",
    ],
    mistakes: [
      "把出生日期填成「月/日/年」（美式）——UCAS 用「日/月/年」。",
      "用了昵称或英文自取名，而非护照上的拼音名。",
    ],
  },
  {
    id: "contact",
    title: "联系方式与居住信息 Contact & residency",
    intro: "填写邮箱、电话、通信地址与居住/国籍状态。邮箱要长期可用（录取通知会发到这里）。",
    fields: [
      { id: "email", label: "邮箱 Email", type: "text", hint: "用长期可用的邮箱，常查收；别用可能过期的学校邮箱。" },
      { id: "phone", label: "电话 Phone", type: "text", hint: "含国家区号，如 +86。" },
      { id: "address", label: "通信地址 Address", type: "textarea", hint: "英文填写，能收到纸质信件的地址。" },
      { id: "residency", label: "居住/国籍状态 Residency status", type: "text", hint: "如实填写国籍与居住国，影响国际生学费判定。" },
    ],
    tips: [
      "邮箱务必常查——大学的面试邀请、补件要求都发邮件。",
      "国籍/居住状态如实填，别为了省学费谎报。",
    ],
    mistakes: ["用了会过期的邮箱，错过关键通知。"],
  },
  {
    id: "education",
    title: "学历与成绩 Education & qualifications",
    intro: "列出从中学起的所有学历与资格，包括 A-Level（含预估/待考成绩）、IGCSE、雅思等。已考和待考的都要列。",
    fields: [
      { id: "schools", label: "就读学校（名称+起止时间）", type: "textarea", hint: "按时间顺序列出中学及以后就读的学校。" },
      { id: "alevels", label: "A-Level 科目与成绩/预估", type: "textarea", hint: "逐科列出：科目 + 已得成绩或预估成绩（predicted）。待考的标注 pending。" },
      { id: "igcse", label: "IGCSE/GCSE 科目与成绩", type: "textarea", hint: "列出科目与等级。" },
      { id: "english", label: "英语成绩（雅思/托福等）", type: "text", hint: "如已考，填分数与日期；未考填计划考试时间。" },
    ],
    tips: [
      "所有已获得和待考（pending）的资格都要申报，别漏。",
      "预估成绩通常由学校/老师给出并随推荐信提交。",
      "科目名称用官方英文名，成绩等级照实填。",
    ],
    mistakes: [
      "漏报待考科目或某些资格——会导致申请不完整。",
      "A-Level 科目英文名写错，与考试局不符。",
    ],
  },
  {
    id: "work",
    title: "工作经历 Work experience",
    intro: "只填「有偿」工作经历（公司名、地址、起止时间）。志愿服务、无偿实习不放这里，可写进个人陈述。",
    fields: [
      { id: "jobs", label: "有偿工作（公司+地址+起止时间）", type: "textarea", hint: "只列受薪工作。记不清日期可查工资记录。" },
    ],
    tips: ["这一栏仅限受薪工作；无偿/志愿经历放到个人陈述里体现。"],
    mistakes: ["把志愿活动、无偿实习填进这一栏。"],
  },
  {
    id: "choices",
    title: "课程志愿 Course choices（最多 5 个）",
    intro: "最多选 5 个课程志愿，可以是不同学校/不同专业，志愿之间没有先后顺序。牛剑不能同时申请（二选一）；牛津/剑桥/医学等 10 月 15 日截止。",
    fields: [
      { id: "choice1", label: "志愿 1（学校 + 课程 + UCAS course code）", type: "text", hint: "填学校、专业与课程代码；注意各课程截止日期不同。" },
      { id: "choice2", label: "志愿 2", type: "text" },
      { id: "choice3", label: "志愿 3", type: "text" },
      { id: "choice4", label: "志愿 4", type: "text" },
      { id: "choice5", label: "志愿 5", type: "text" },
    ],
    tips: [
      "5 个志愿无先后，可混搭冲刺/稳妥/保底。",
      "牛津和剑桥同一年只能选其一。",
      "牛剑、医学等课程截止早（通常 10 月 15 日 18:00 英国时间），务必单独盯紧。",
      "确认所选课程的入学考试（如 ESAT/TMUA）需自行另行报名，不在 UCAS 内完成。",
    ],
    mistakes: [
      "同时填了牛津和剑桥（不允许）。",
      "错过 10 月 15 日的早截止课程。",
      "以为报了 UCAS 就自动报了入学考试。",
    ],
  },
  {
    id: "statement",
    title: "个人陈述 Personal statement（三题）",
    intro: "2026 起个人陈述改为三个问题：① 为何想读这个专业；② 学历/学习如何为该专业做了准备;③ 课外如何准备、为何有用。每题至少 350 字符，UCAS 有查重。",
    fields: [
      { id: "psNote", label: "备注 / 进度", type: "textarea", hint: "文书正文请用平台的『文书教练』准备好，再誊到 UCAS。这里可记录进度或版本备注。" },
    ],
    tips: [
      "三题分别对应：动机、学术准备、课外准备与反思。",
      "别照抄任何范文——UCAS 用查重软件。",
      "别在个人陈述里重复罗列 GCSE 成绩等已在别处填过的信息。",
    ],
    mistakes: ["套用模板/范文被查重；空泛无具体例子。"],
    linkTo: { label: "去『文书教练』准备三题个人陈述", href: "/statements" },
  },
  {
    id: "reference",
    title: "推荐信 Reference",
    intro: "需要一位非亲属（非家人/朋友/伴侣）的推荐人，通常是老师或升学顾问。务必先征得其同意，并尽早请其撰写。",
    fields: [
      { id: "referee", label: "推荐人（姓名 + 身份 + 联系方式）", type: "textarea", hint: "非亲属，通常为任课老师/班主任/升学顾问。填前先问过对方并获同意。" },
    ],
    tips: [
      "完成学历部分后就尽早联系推荐人，给足撰写时间。",
      "通过学校申请的，老师会附上推荐信与预估成绩并代为提交。",
    ],
    mistakes: ["太晚联系推荐人，导致赶不上截止日期。"],
  },
];

// ─────────────────────── 香港（港校本科）───────────────────────
// 说明：港校多为各校独立申请系统（如 HKU/CUHK/HKUST 官网），非统一平台。
// 与英国最大不同：必须写清「为什么选这所学校/这个专业」，且通常要求列出兴趣专业排序。
export const HK_SECTIONS: PrepSection[] = [
  {
    id: "personal",
    title: "个人与联系信息 Personal & contact",
    intro: "各港校在自己的申请系统填写。基本信息与联系方式，务必与护照/证件一致。",
    fields: [
      { id: "name", label: "姓名（与护照一致）", type: "text", hint: "拼音与护照一致。" },
      { id: "dob", label: "出生日期", type: "date" },
      { id: "email", label: "邮箱", type: "text", hint: "长期可用、常查收。" },
      { id: "phone", label: "电话", type: "text", hint: "含区号。" },
      { id: "id", label: "证件号（护照/身份证）", type: "text" },
    ],
    tips: ["港校多为各自独立系统，需分别注册账号。"],
    mistakes: ["各校信息不一致（姓名拼写等）。"],
  },
  {
    id: "academics",
    title: "学历与成绩 Academic qualifications",
    intro: "列出 A-Level（含预估）、IGCSE、英语成绩等。港校普遍看重预估成绩与英语水平。",
    fields: [
      { id: "alevels", label: "A-Level 科目与成绩/预估", type: "textarea", hint: "逐科列出，含预估成绩。" },
      { id: "igcse", label: "IGCSE/GCSE 成绩", type: "textarea" },
      { id: "english", label: "英语成绩（雅思/托福）", type: "text", hint: "港校多要求雅思，注意各校最低分要求。" },
    ],
    tips: ["确认目标专业的具体科目与分数要求（各专业不同）。"],
    mistakes: ["英语成绩不达标却未提前规划重考。"],
  },
  {
    id: "choices",
    title: "专业志愿 Programme choices",
    intro: "多数港校要求按兴趣排序选择专业。与英国不同，港校很看重你「为什么选这个专业/这所学校」。",
    fields: [
      { id: "school", label: "目标院校", type: "select", options: ["香港大学 HKU", "香港中文大学 CUHK", "香港科技大学 HKUST", "其它"], hint: "各校系统与专业数量上限不同。" },
      { id: "programmes", label: "意向专业（按优先级排序）", type: "textarea", hint: "列出并排序；注意每所学校可选专业数量有上限。" },
    ],
    tips: [
      "港校通常允许按优先级填多个专业志愿。",
      "务必研究每个专业的课程设置与特色，为文书做准备。",
    ],
    mistakes: ["志愿排序随意，或没研究专业就乱填。"],
  },
  {
    id: "essay",
    title: "个人陈述 / Essay",
    intro: "港校文书与英国相反：必须写清「为什么选这所学校、这个专业」，并结合经历谈成长与贡献。",
    fields: [
      { id: "essayNote", label: "备注 / 进度", type: "textarea", hint: "正文请用平台『文书教练』的港校版准备，再誊到各校系统。" },
    ],
    tips: [
      "重点写清为何选该校该专业、未来目标、能贡献什么。",
      "别只写自己，也要谈这所学校/专业为何契合你。",
    ],
    mistakes: ["套用英国式文书（忌提校名）——港校恰恰要写校名与理由。"],
    linkTo: { label: "去『文书教练』准备港校 essay", href: "/statements" },
  },
  {
    id: "referees",
    title: "推荐人 Referees",
    intro: "港校通常要求 1–2 位推荐人（多为老师）。部分学校由系统自动发邮件给推荐人填写。",
    fields: [
      { id: "referees", label: "推荐人（姓名+身份+邮箱）", type: "textarea", hint: "先征得同意；确保推荐人邮箱准确（系统会自动发信）。" },
    ],
    tips: ["尽早联系推荐人，确认其邮箱能收到系统邮件。"],
    mistakes: ["推荐人邮箱填错，导致收不到系统邀请。"],
  },
  {
    id: "documents",
    title: "支持材料 Supporting documents",
    intro: "按各校要求上传成绩单、证书、获奖证明、作品集（如适用）等。提前扫描备好。",
    fields: [
      { id: "docs", label: "需准备的材料清单", type: "textarea", hint: "如成绩单、在读证明、英语成绩单、获奖证书、（部分专业）作品集。" },
    ],
    tips: ["提前把材料扫描成清晰 PDF，命名规范，方便上传。"],
    mistakes: ["临近截止才找材料，扫描不清或缺件。"],
  },
];

export function getSections(region: AppPrepRegion): PrepSection[] {
  return region === "UK_UCAS" ? UK_UCAS_SECTIONS : HK_SECTIONS;
}

export const REGION_META: Record<AppPrepRegion, { label: string; flag: string; note: string; officialUrl: string; officialLabel: string }> = {
  UK_UCAS: {
    label: "英国 UCAS",
    flag: "🇬🇧",
    note: "UCAS 是英国本科统一申请系统，一份申请最多 5 个志愿。本助手帮你准备内容，最终请到 UCAS Hub 亲自填写并提交。",
    officialUrl: "https://www.ucas.com/",
    officialLabel: "前往 UCAS 官网填写",
  },
  HK: {
    label: "香港",
    flag: "🇭🇰",
    note: "港校多为各校独立申请系统。本助手帮你准备内容，最终请到各校官网亲自填写并提交。",
    officialUrl: "https://www.study.hk/",
    officialLabel: "了解港校申请（Study in HK）",
  },
};
