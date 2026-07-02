// UCAS 申请表指导 — 8 个模块数据
import { getGuideProgressAction, saveGuideProgressAction } from "./actions";

export interface FieldExample {
  field: string;       // 英文字段名 (官方)
  fieldZh: string;     // 中文说明
  example?: string;    // 填写示例（谨慎——仅占位符或格式说明）
  note?: string;       // 注意事项
  warning?: string;    // 风险提示
}

export interface GuideModule {
  id: string;
  num: number;
  title: string;        // 中文标题
  titleEn: string;      // 英文官方名称
  icon: string;
  region: "UK" | "HK";
  officialUrl: string;
  summary: string;      // 一句话说明
  overview: string;     // 2-3 句详细说明
  fields: FieldExample[];
  checklist: string[];  // 提交前自查项
  chinaNote?: string;   // 大陆学生特别注意
}

export const APPLY_GUIDE_MODULES: GuideModule[] = [
  {
    id: "personal-details",
    num: 1,
    region: "UK",
    title: "个人信息",
    titleEn: "Personal Details",
    icon: "👤",
    officialUrl: "https://www.ucas.com/undergraduate/applying-university",
    summary: "填写你的基本身份信息，包括姓名、出生日期、地址和联系方式。",
    overview: "个人信息模块是 UCAS 申请的基础部分。所有信息必须与护照完全一致，任何不符都可能导致签证或入学手续出现麻烦。大陆学生的姓名应填写护照上的拼音全名。",
    fields: [
      {
        field: "Title / First name / Last name",
        fieldZh: "称谓 / 名字 / 姓氏",
        example: "Ms · XIAOMEI · ZHANG（按护照英文拼音，全大写）",
        note: "中国护照姓名格式：姓(Last name) + 名(First name)，拼音大写。UCAS 填写顺序为 First name 在前。",
        warning: "姓名必须与护照完全一致，不可使用英文别名或缩写。",
      },
      {
        field: "Date of birth",
        fieldZh: "出生日期",
        example: "DD/MM/YYYY 格式，如 15/03/2007",
        note: "英国日期格式为 日/月/年，与中国习惯相反，注意不要填反月份和日期。",
      },
      {
        field: "Gender",
        fieldZh: "性别",
        example: "Female / Male / I don't want to provide this information",
        note: "按护照信息填写。",
      },
      {
        field: "Nationality / Country of birth",
        fieldZh: "国籍 / 出生国",
        example: "Chinese / China",
        note: "持中国护照的大陆学生填写 Chinese / China。持 BNO 或其他护照的学生填写对应国籍。",
      },
      {
        field: "Correspondence address",
        fieldZh: "通讯地址",
        example: "填写目前在读学校或家庭住址，建议填写英文格式",
        note: "入学通知等重要信件将寄往此地址。如果在英国就读，填写当前住所；在国内就读则填写家庭地址（按官方拼音/英文填写）。",
      },
      {
        field: "Email address",
        fieldZh: "电子邮箱",
        example: "建议使用 Gmail/Outlook 等国际邮箱，不建议使用 QQ 邮箱",
        warning: "所有院校通知、Offer 都将发往此邮箱。确保能正常收信，并在整个申请期间定期查看。",
      },
    ],
    checklist: [
      "姓名与护照英文拼音完全一致（无别名、无缩写）",
      "出生日期格式正确（DD/MM/YYYY）",
      "国籍填写 Chinese",
      "通讯地址为英文格式",
      "邮箱为可正常接收境外邮件的国际邮箱",
    ],
    chinaNote: "大陆学生通讯地址如在国内，建议对照护照/户口本的英文翻译版本填写，保持一致性。部分院校发放 CAS（入学确认函）时会核对地址。",
  },

  {
    id: "education",
    num: 2,
    region: "UK",
    title: "教育经历",
    titleEn: "Education",
    icon: "🎓",
    officialUrl: "https://www.ucas.com/undergraduate/applying-university",
    summary: "填写所有在读或已毕业的学校、GCSE/IGCSE 和 A-Level 课程与成绩。",
    overview: "教育经历模块需要列出从中学开始的所有学校，并逐科填写 GCSE/IGCSE 已考成绩和 A-Level 已考/预估成绩。大陆学生需特别注意学校英文名称和资质代码的填写。",
    fields: [
      {
        field: "Schools / Colleges attended",
        fieldZh: "就读学校",
        example: "按学校的官方英文名称填写，如：[你的学校官方英文名]",
        note: "UCAS 系统有英国院校的代码数据库。海外学校（含大陆 A-Level 学校）选择「Add a school not on the list」，手动填写学校英文名、城市和国家（China）。",
        warning: "学校英文名请使用学校官网或护照背面的官方英文译名，不要自行翻译。",
      },
      {
        field: "Qualifications — GCSE/IGCSE",
        fieldZh: "GCSE/IGCSE 成绩",
        example: "科目选 English Language · 成绩选 A* 或 9 · 考试机构选 Cambridge / Edexcel / Pearson",
        note: "逐科填写：科目名、考试机构（Awarding body）、考试年份、等级（A*-G 或 9-1）。待考科目选 Pending（预估）。",
      },
      {
        field: "Qualifications — A-Level",
        fieldZh: "A-Level 成绩",
        example: "Mathematics · Edexcel · 2026 · Pending (predicted A*)",
        note: "已考科目填写实际成绩；尚未参加的 A-Level 科目（Year 13 待考）选 Pending，在括号内注明老师预估等级。UCAS 会将预估成绩展示给院校。",
        warning: "预估成绩(Predicted grades)由学校老师负责，必须通过学校老师系统提交，学生无法自行修改。",
      },
      {
        field: "Other qualifications",
        fieldZh: "其他资质",
        example: "IELTS 7.5 Overall · British Council · 2025",
        note: "雅思、托福等语言成绩在此填写。如有竞赛成绩（如 AMC、物理竞赛）可在此提及，具体在个人陈述中说明。",
      },
    ],
    checklist: [
      "学校英文名与官方一致，不自行翻译",
      "每门 GCSE/IGCSE 科目均已填写（待考的选 Pending）",
      "A-Level 预估成绩与老师确认一致",
      "雅思/托福成绩已录入（如已考）",
      "考试机构（Awarding body）正确（Cambridge/Edexcel/AQA/Pearson）",
    ],
    chinaNote: "大陆就读 A-Level 国际学校的学生：学校英文名直接用学校英文官名，考试机构选对应的 Cambridge International / Pearson Edexcel 等。若同时持有高中毕业证，无需填写——UCAS 只需 A-Level 体系的资质。",
  },

  {
    id: "employment",
    num: 3,
    region: "UK",
    title: "工作 / 实习经历",
    titleEn: "Employment",
    icon: "💼",
    officialUrl: "https://www.ucas.com/undergraduate/applying-university",
    summary: "填写有薪或无薪的工作、实习、志愿服务经历（非强制，但相关经历有帮助）。",
    overview: "Employment 模块是可选的，但如果你有与目标专业相关的实习、科研助手、志愿服务或兼职经历，强烈建议填写，并在个人陈述中呼应。无相关经历的学生直接跳过即可，不会扣分。",
    fields: [
      {
        field: "Employer / Organisation",
        fieldZh: "雇主 / 机构名称",
        example: "填写机构英文官名，如：[公司/学校/机构英文名]",
        note: "无英文名的国内机构：使用拼音全名 + 机构类型（如 Co., Ltd. / Research Institute）。",
      },
      {
        field: "Job title",
        fieldZh: "职位名称",
        example: "Research Assistant · Intern · Volunteer",
        note: "如实填写，不要夸大职位级别。",
      },
      {
        field: "Start / End date",
        fieldZh: "开始 / 结束日期",
        example: "07/2024 - 08/2024",
        note: "暑假科研项目填实际开始和结束月份。",
      },
      {
        field: "Description",
        fieldZh: "工作描述",
        example: "简短描述主要职责和学习收获（50-80 字英文为宜）",
        note: "重点写：做了什么、与目标专业的关联、获得了什么技能。这些内容要在个人陈述中进一步展开。",
      },
    ],
    checklist: [
      "经历真实，可在面试中详细讲述",
      "机构名称为英文（无英文名则用拼音）",
      "日期格式正确（MM/YYYY）",
      "描述聚焦与专业的关联性",
    ],
    chinaNote: "中国学生常见的「背景包装」活动（学术夏令营、科研项目、竞赛辅导课）均可填写，但要确保真实参与、能应对面试追问。",
  },

  {
    id: "personal-statement",
    num: 4,
    region: "UK",
    title: "个人陈述",
    titleEn: "Personal Statement",
    icon: "✍️",
    officialUrl: "https://www.ucas.com/undergraduate/applying-university",
    summary: "2026 年入学起改为 3 个结构化问题，总计约 4000 字符，须由学生本人撰写。",
    overview: "个人陈述（Personal Statement）是 UCAS 申请中权重最高的主观材料，院校据此判断你对专业的热情与准备程度。2026 年起 UCAS 将原来的自由文章形式改为 3 个结构化问题，每题各有字数上限。内容必须本人原创——UCAS 内置相似度检测系统，代写风险极高。",
    fields: [
      {
        field: "Question 1: Why do you want to study this subject?",
        fieldZh: "Q1：为什么想学这个专业？",
        note: "重点：学术兴趣的起源 + 具体经历（不是空泛的热爱）。参考结构：①引发兴趣的具体时刻/课题 → ②深入探索过程（读了什么书、做了哪些研究）→ ③为何这正是你想在大学继续深究的方向。",
        warning: "避免：「从小就对 X 感兴趣」「爸爸妈妈影响了我」等套语。院校想看的是学术好奇心，而非人生故事。",
      },
      {
        field: "Question 2: How have your academic studies prepared you?",
        fieldZh: "Q2：学业如何为此专业做好了准备？",
        note: "参考结构：①A-Level 科目中的具体课题/实验/分析 → ②从中获得的与专业相关的核心能力 → ③自主延伸的学习（课外阅读、MOOCs、学术论文）。每点须具体，忌流水账。",
      },
      {
        field: "Question 3: What else have you done to prepare, and why?",
        fieldZh: "Q3：课外做了哪些准备，有何收获？",
        note: "参考结构：①选择 1-2 个最相关的课外经历（实习/竞赛/科研/志愿） → ②具体做了什么，学到了什么 → ③如何与专业学习产生联结。质量优于数量。",
      },
    ],
    checklist: [
      "全部内容由本人撰写，未让他人代写",
      "三题合计不超过 4000 字符",
      "每题有具体事例，无空泛形容词",
      "Q1 聚焦学术动机，非个人情感",
      "Q2/Q3 有与专业的明确关联",
      "未复制网上范文或 AI 生成稿",
    ],
    chinaNote: "桥申文书工作台（/statements）提供三题的结构化编辑器与字数实时统计，帮你组织思路。UCAS 查重系统（Copycatch）能识别与历年申请的相似度，代写被查出将直接取消资格。",
  },

  {
    id: "reference",
    num: 5,
    region: "UK",
    title: "推荐信",
    titleEn: "Reference",
    icon: "📝",
    officialUrl: "https://www.ucas.com/undergraduate/applying-university",
    summary: "由学校老师或辅导员在 UCAS 系统中直接提交，学生不参与撰写也无法查看内容。",
    overview: "UCAS 推荐信由学校指定的推荐人（Referee，通常是班主任或学科老师）通过 UCAS 系统直接提交，学生无法自行修改或查看具体内容。推荐信的字数上限为 4000 字符，内容应涵盖：学术能力、学习态度、课外表现及适合该专业的理由。",
    fields: [
      {
        field: "Referee name / email",
        fieldZh: "推荐人姓名 / 邮箱",
        example: "[老师姓名（英文）] · [学校邮箱]",
        note: "在 UCAS 系统中填写推荐人信息后，系统会自动向老师发送邀请邮件。确认老师已同意并能收到 UCAS 系统邮件（境外邮箱）。",
      },
      {
        field: "UCAS reference letter",
        fieldZh: "推荐信内容",
        example: "（由老师撰写，学生无法查看）",
        note: "推荐人在 UCAS 系统中直接填写，学生只能看到「已提交」状态，不能查看具体内容，家长也无法代为查看。",
        warning: "切勿自行撰写推荐信内容交给老师，这构成申请造假，风险极高。如对老师不熟悉，可提前给老师一份「活动简历」（Brag Sheet）供其参考。",
      },
    ],
    checklist: [
      "已与推荐人老师确认意愿并充分沟通",
      "推荐人邮箱能接收 UCAS 系统邀请邮件",
      "已向老师提供活动简历（Brag Sheet）和申请院校/专业列表",
      "确认老师知晓截止日期（牛剑 10 月初，其余 12 月底前）",
    ],
    chinaNote: "大陆学校老师可能对 UCAS 系统不熟悉——提前和老师确认是否能收到境外邮件，或由学校升学指导老师协助操作。部分私立国际学校有专职升学顾问处理此流程。",
  },

  {
    id: "finance",
    num: 6,
    region: "UK",
    title: "学费与资助",
    titleEn: "Finance",
    icon: "💰",
    officialUrl: "https://www.ucas.com/undergraduate/applying-university",
    summary: "填写学费缴纳方式和费用状态，大陆学生统一选 Overseas（海外）费率。",
    overview: "Finance 模块主要用于确定你的学费身份（Home/EU 还是 Overseas），以及是否申请英国政府助学贷款（Student Finance）。持中国护照在大陆就读的学生属于 Overseas 学生，学费按国际生收费，无法申请英国政府助学贷款。",
    fields: [
      {
        field: "Fee status",
        fieldZh: "费用身份",
        example: "Overseas（海外）",
        note: "大陆学生（不具英国永居权）一律选 Overseas。若你持有英国永久居留权（ILR）或英国国籍，应选择 Home 并咨询院校。",
        warning: "填错 Fee status 可能导致录取后被要求补缴差额学费，差额可达数万英镑。",
      },
      {
        field: "Student Finance",
        fieldZh: "英国学生贷款",
        example: "No（不申请）",
        note: "Overseas 学生不具资格申请英国政府学生贷款（Student Loan England/Wales）。直接选 No。",
      },
      {
        field: "Sponsorship / Funding",
        fieldZh: "资助来源",
        example: "Self-funded（自费）或填写奖学金名称",
        note: "如获得政府奖学金或院校奖学金，在此注明。大多数大陆学生填写 Self-funded 即可。",
      },
    ],
    checklist: [
      "Fee status 选择 Overseas（确认非 Home/EU 身份）",
      "未申请英国学生贷款（Overseas 学生无资格）",
      "如有奖学金已正确填写资助来源",
    ],
    chinaNote: "香港直申的院校通常有独立的财务说明，请参考各校官网。部分院校提供针对大陆学生的奖学金项目，可在录取后单独申请，与 UCAS 填写无关。",
  },

  {
    id: "choices",
    num: 7,
    region: "UK",
    title: "志愿选择",
    titleEn: "Choices",
    icon: "🎯",
    officialUrl: "https://www.ucas.com/undergraduate/applying-university",
    summary: "最多填写 5 个志愿，牛津剑桥只能二选一。志愿之间无排名，院校看不到彼此。",
    overview: "UCAS 允许最多填写 5 所院校的 5 个专业（每所仅 1 个专业），但可以填写同一院校的不同专业。志愿列表对院校保密——每所院校只知道你申请了自己，不知道你同时申请了哪些其他学校。牛津和剑桥只能申请其中一所（不能同时申请牛津 + 剑桥）。",
    fields: [
      {
        field: "University / College",
        fieldZh: "院校",
        example: "University of [Name]（从 UCAS 下拉列表选择）",
        note: "在 UCAS 搜索框中输入院校名称，从官方列表中选择，不要手动输入——拼写错误可能导致志愿无效。",
      },
      {
        field: "Course code",
        fieldZh: "课程代码",
        example: "如数学：G100 · 计算机科学：G400（具体以院校官网为准）",
        note: "每个专业在 UCAS 有唯一的 5 位课程代码（UCAS Course Code）。在院校官网的「How to apply」页面可以找到。选错代码等于申请了错误专业，务必核对。",
        warning: "申请前确认该专业当年是否招收 Overseas 学生，以及是否有入学笔试要求（如 MAT/STEP 等）。",
      },
      {
        field: "Point of Entry",
        fieldZh: "入学时间",
        example: "Year 1（第一年入学，绝大多数情况）",
        note: "大多数大陆学生从 Year 1 开始。极少数学生有可能申请 Foundation Year，须在院校官网确认。",
      },
      {
        field: "Start date",
        fieldZh: "入学年份",
        example: "September 2026",
        note: "按实际计划入学年份填写。",
      },
    ],
    checklist: [
      "不超过 5 个志愿",
      "牛津和剑桥未同时选择",
      "每个专业的 UCAS Course Code 已在院校官网核对",
      "所有专业均接受 Overseas 学生",
      "有笔试要求的专业已了解考试时间与报名方式（如 MAT/STEP/LNAT）",
      "牛剑志愿（如有）须在 10 月 15 日前提交整份申请",
    ],
    chinaNote: "大陆学生对英国大学申请专业（不是学校）的概念可能不熟悉：UCAS 是专业级别申请，同一院校的「数学」和「数学与统计」是两个独立课程代码，申请要求可能不同。务必逐一核对各专业页面。",
  },

  {
    id: "declaration",
    num: 8,
    region: "UK",
    title: "声明与提交",
    titleEn: "Declaration",
    icon: "✅",
    officialUrl: "https://www.ucas.com/undergraduate/applying-university",
    summary: "确认所有信息真实准确后，由学生签署声明，学校检查后最终提交至 UCAS。",
    overview: "Declaration 是 UCAS 申请的最后一步。你需要确认所有填写的信息真实、准确，并同意 UCAS 的条款。之后申请发送至学校（你的推荐人），由老师/升学顾问最终审核并提交至 UCAS。一旦提交给院校后，基本信息和志愿选择不可更改。",
    fields: [
      {
        field: "Declaration statement",
        fieldZh: "诚信声明",
        example: "认真阅读每项声明内容后逐条勾选同意",
        note: "声明内容包括：信息真实、个人陈述为本人原创、了解虚假信息的后果（撤销录取资格）。认真阅读后再勾选。",
        warning: "一旦提交至 UCAS，无法撤回修改，但可以在 UCAS Extra（5 月）或 Clearing（8 月）阶段补充申请。",
      },
      {
        field: "UCAS application fee",
        fieldZh: "UCAS 申请费",
        example: "多志愿申请约 28.50 英镑（2025-26 年费率，以 UCAS 官网为准）",
        note: "UCAS 收取一次性申请费，通过信用卡/借记卡支付。大陆学生可用 Visa/Mastercard 国际卡。",
      },
    ],
    checklist: [
      "所有模块（1-7）已全部填写完整",
      "个人陈述已最终定稿",
      "推荐人已收到 UCAS 邀请并确认会提交",
      "所有志愿的 Course Code 已最终核对",
      "已向学校提交，等待老师审核发送",
      "申请费已支付",
      "有牛剑志愿的学生：学校已在 10 月 15 日前发送申请",
    ],
    chinaNote: "提交后通过 UCAS Track 追踪申请状态。院校收到申请后会发邮件确认。等待期间定期查看注册邮箱，不要错过院校发出的笔试邀请或面试通知。",
  },

  // ═══════════ 香港直申指南（轻量版；具体字段/截止以各校官网为准）═══════════
  {
    id: "hk-overview",
    num: 101,
    region: "HK",
    title: "香港直申总览",
    titleEn: "HK Direct Application Overview",
    icon: "🇭🇰",
    officialUrl: "https://www.hku.hk",
    summary: "香港高校本科不走 UCAS，需通过各校自己的国际生 / 非联招申请系统分别申请。",
    overview:
      "与英国统一的 UCAS 不同，香港三所主要大学（港大 HKU、科大 HKUST、中大 CUHK）各自有独立的国际生招生门户。持 A-Level 成绩的大陆学生一般走 International / Non-JUPAS 途径，需对每所目标院校单独注册、单独申请、单独缴费。没有 UCAS 的「5 个志愿」上限，但每校的可选专业数各有规定。",
    fields: [
      {
        field: "Application route",
        fieldZh: "申请途径",
        example: "International Students / Non-JUPAS（A-Level 考生适用）",
        note: "香港本地考生走 JUPAS 联招；持 A-Level 等国际课程的大陆学生走 International 或 Non-JUPAS 途径，通过各校国际招生页申请。",
      },
      {
        field: "Application portals",
        fieldZh: "各校申请门户",
        example: "港大、科大、中大各有独立在线申请系统",
        note: "分别在三校的「本科招生 / International Admissions」页面注册账号申请。以官网为准：hku.hk、hkust.edu.hk、cuhk.edu.hk。",
        warning: "三校系统互相独立，账号与申请材料需分别提交，不能一次通投。",
      },
      {
        field: "Application fee",
        fieldZh: "申请费",
        example: "各校单独收取申请费（金额以官网为准）",
        note: "每所院校单独缴纳申请费，通常线上信用卡支付。",
      },
      {
        field: "Deadlines",
        fieldZh: "截止时间",
        example: "多在入学前一年的秋冬至次年春季；部分为滚动录取",
        note: "港校普遍设有 Early round（早申，常在 11 月前后）与 Main round，早申通常更有优势。具体日期每年不同，务必查当年官网。",
        warning: "部分热门专业名额有限、滚动录取，越早申请越好，别拖到最后。",
      },
      {
        field: "Number of choices",
        fieldZh: "可选专业数",
        example: "每校可选若干志愿（规则各校不同）",
        note: "不同于 UCAS 全国 5 个志愿的上限，港校是「每校单独申请、每校内可填若干志愿」，具体上限看各校规定。",
      },
    ],
    checklist: [
      "已确认走 International / Non-JUPAS 途径",
      "已在每所目标院校的招生门户分别注册",
      "已了解各校申请费与缴费方式",
      "已查清当年各校 Early / Main round 截止日期",
      "已了解各校可填志愿数规则",
    ],
    chinaNote:
      "港校对 A-Level 大陆学生非常友好，但「每校单独申请」这一点和英国差异很大，务必给每所院校单独留出准备时间。早申（Early round）通常竞争压力较小，建议优先。",
  },
  {
    id: "hk-grades",
    num: 102,
    region: "HK",
    title: "成绩与材料",
    titleEn: "Grades & Documents",
    icon: "📄",
    officialUrl: "https://www.hkust.edu.hk",
    summary: "港校接受预估成绩申请，录取多为 conditional offer，凭最终成绩换 unconditional。",
    overview:
      "香港高校普遍接受以预估成绩（predicted grades）申请，先发有条件录取（conditional offer），待 A-Level 最终成绩达标后转为正式录取。需准备成绩单、护照、英语能力证明等材料。",
    fields: [
      {
        field: "Predicted / actual grades",
        fieldZh: "预估 / 实际成绩",
        example: "以学校开具的预估成绩申请；出分后补交正式成绩",
        note: "多数港校接受预估成绩发 conditional offer。最终 A-Level 成绩需达到 offer 条件方可入学。",
      },
      {
        field: "Transcript",
        fieldZh: "成绩单",
        example: "学校盖章的官方成绩单（中英文）",
        note: "含 AS/A-Level 已考科目成绩与在读证明。",
      },
      {
        field: "Passport / ID",
        fieldZh: "护照 / 身份证明",
        example: "有效护照或港澳通行证",
        note: "用于身份核验，姓名须与申请信息一致。",
      },
      {
        field: "English proficiency",
        fieldZh: "英语能力",
        example: "IELTS / TOEFL，或 A-Level English 成绩",
        note: "多数港校可用 A-Level 中的 English 成绩或雅思托福满足语言要求，具体门槛以各校专业为准。",
      },
    ],
    checklist: [
      "已取得学校开具的预估成绩",
      "已准备中英文官方成绩单",
      "护照在有效期内且姓名一致",
      "已确认目标专业的英语要求并达标",
    ],
    chinaNote:
      "香港与英国都接受预估成绩，材料可复用。注意港校 conditional offer 的换取条件（最终成绩）要盯紧出分时间。",
  },
  {
    id: "hk-essay-interview",
    num: 103,
    region: "HK",
    title: "文书 · 推荐 · 面试",
    titleEn: "Essay, Referee & Interview",
    icon: "🎤",
    officialUrl: "https://www.cuhk.edu.hk",
    summary: "港校多要求个人陈述 / essay 与推荐人；医学、法律、商科等热门专业常设面试。",
    overview:
      "香港高校的申请通常包含个人陈述或短文（要求因校而异，不能直接套用 UCAS 的三题 PS）、推荐人信息，以及针对热门专业的面试。面试是港校录取的重要环节，尤其医学、法律、商科、部分工程专业。",
    fields: [
      {
        field: "Personal statement / Essay",
        fieldZh: "个人陈述 / 短文",
        example: "按各校题目与字数要求撰写（与 UCAS PS 不同）",
        note: "港校的文书题目、字数与 UCAS 不同，需针对各校单独准备；有的要求回答特定问题，有的是开放式短文。",
        warning: "不要直接把 UCAS 的三题个人陈述原样提交给港校，题目与侧重点不一样。",
      },
      {
        field: "Referee / Recommendation",
        fieldZh: "推荐人 / 推荐信",
        example: "任课老师或升学指导，提供推荐或作为 referee",
        note: "部分港校在申请中填写推荐人信息，由校方联系；也有要求上传推荐信的。",
      },
      {
        field: "Interview",
        fieldZh: "面试",
        example: "医学 / 法律 / 商科 / 部分工程专业常设面试",
        note: "面试形式包括线上单面、小组面试等，考查沟通、逻辑与专业兴趣。收到面试邀请后应认真准备。",
        warning: "热门专业面试往往是录取的关键环节，别只顾成绩而忽视面试准备。",
      },
    ],
    checklist: [
      "已针对每所港校单独准备文书（未套用 UCAS PS）",
      "已确认各校对推荐人 / 推荐信的要求",
      "已了解目标专业是否需要面试",
      "收到面试邀请后已做针对性准备",
    ],
    chinaNote:
      "桥申的文书工作台（/statements）与背景提升（/background）可以帮你准备文书素材与面试谈资，但港校文书要按各校题目重新组织，不能直接复用英国 PS。",
  },

];

export const APPLY_GUIDE_STORAGE_KEY = "alevel:apply-guide:v1";

export interface ModuleProgress {
  moduleId: string;
  checked: string[];  // checked checklist items
  done: boolean;      // user manually marked as complete
}

function loadLocalProgress(): ModuleProgress[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(APPLY_GUIDE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ModuleProgress[]) : [];
  } catch {
    return [];
  }
}

function saveLocalProgress(data: ModuleProgress[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(APPLY_GUIDE_STORAGE_KEY, JSON.stringify(data));
}

export async function loadProgress(): Promise<ModuleProgress[]> {
  try {
    const r = await getGuideProgressAction();
    if (r.authed) return r.progress; // 登录：数据库为准
  } catch {
    /* 字段尚未迁移或出错 → 回退本地 */
  }
  return loadLocalProgress();
}

export async function saveProgress(data: ModuleProgress[]): Promise<void> {
  try {
    const r = await saveGuideProgressAction(data);
    if (r.authed) return;
  } catch {
    /* 回退本地 */
  }
  saveLocalProgress(data);
}
