# A-Level 留学申请平台 — 第一阶段开发计划（架构设计）

## Context（背景与目标）

为中国大陆 A-Level 学生提供申请**英国（UCAS）+ 香港本科**的低成本、透明、流程化平台，替代传统高价中介。核心价值 = **选校定位 + 流程管理 + 文书工具 + 申请追踪 + 知识库**，用自助化 + 后续 AI 辅助压低成本。

**全新项目**，当前仓库（`D:\MQ\CC`）与本项目无关。建议新建独立项目目录：`D:\MQ\alevel-apply`（名称待你确认）。本计划只做设计，**确认后**才创建文件。

### 关键现实约束（影响范围设定）
- **不能全自动提交申请**：UCAS 由学生通过 UCAS Hub 自行提交（或经注册 centre）；香港各校用各自 portal。平台定位是**资料管理 + 引导 + AI 辅助 + 状态追踪**,不是自动投递。MVP 不做深度对接，设清楚预期。
- **UCAS 文书新格式（2026 入学起）**：个人陈述从单篇长文改为 **3 个结构化问题**（为什么选该专业 / 学业如何为之准备 / 课外经历及其价值）。文书模块按此设计。
- **香港=非本地生**：大陆生走各校 international/non-JUPAS 直申，需学校担保的学生签证。

### 待你确认的关键假设
1. **MVP 不含真人导师 marketplace**（自助工具为核心，真人服务/预约/分佣放到 Phase 2）。— 这显著影响范围与 schema。
2. 项目目录/名：`D:\MQ\alevel-apply`。
3. 包管理器用 **pnpm**（更适合 Next.js；当前未安装，需 `npm i -g pnpm`）。不想装就用 npm。
4. MVP 文书工作台先做**结构化编辑器 + 模板 + 自查清单**，AI 辅助走 feature flag 在 Phase 2 接入（符合你"后续接入 AI/RAG"）。

---

## 1. 产品信息架构（Information Architecture）

```
公开区（未登录）
├─ 首页 / 价值主张 / 定价
├─ 知识库（申请指南：UCAS流程、香港申请、文书、面试、签证）  ← 双语
├─ 院校/专业浏览（公开可查，匹配需登录）
└─ 登录 / 注册（手机验证码为主，邮箱次之）

学生工作台（登录后）
├─ 仪表盘（总览：进度、临近截止、待办、Offer状态）
├─ 我的档案（A-Level选科/预估成绩、英语成绩、目标专业/地区/预算）
├─ 选校定位（按档案匹配UK+HK专业 → reach/match/safety）
├─ 申请清单（已选目标 → 每个申请的状态/材料/截止）
├─ 资料中心（成绩单/护照/预估成绩/雅思/证书 上传管理 + 每校清单）
├─ 文书工作台（UCAS 3问 / 香港文书；模板、版本、字数、自查）
├─ 时间线/待办（按 UCAS / 香港路线自动生成任务 + 提醒）
├─ Offer与决策（追踪Offer、UK firm/insurance 选择）
└─ 设置（账号、隐私/同意、通知偏好）

管理后台（运营/Admin）
├─ 院校与专业数据维护（入学要求、课程码、申请路线）
├─ 知识库内容管理（双语文章）
├─ 任务模板维护（不同路线的清单模板）
└─ 用户/申请运营、审计日志
```

---

## 2. MVP 功能清单（Phase 1 范围）

**纳入 MVP：**
1. 账户与认证：手机验证码 + 邮箱/密码；角色（STUDENT/ADMIN）；注册时采集 PIPL/监护人同意。
2. 学生档案：选科、预估/实考成绩、英语成绩、目标专业/地区/预算。
3. 院校与专业库 + 运营后台维护 + 初始 UK/HK 种子数据。
4. **选校匹配引擎**：成绩 vs 入学要求 + 先修科目 + 英语门槛 → reach/match/safety + 解释。
5. 申请清单与状态追踪：每个目标专业一条申请，状态机（规划→进行→已提交→面试→Offer→录取/拒绝）。
6. Offer 与决策：记录 Offer（有/无条件）、UK firm/insurance。
7. 资料中心：上传/管理文档（本地存储适配器）、按校生成材料清单。
8. 文书工作台：UCAS 3 问结构化编辑器 + 香港文书；模板、字数统计、版本历史、自查清单（AI 钩子预留）。
9. 时间线/待办：按路线模板自动生成任务 + 截止提醒（站内；短信/邮件走 stub）。
10. 知识库：双语文章 CMS + 渲染。
11. 通用/合规：i18n（zh-CN/en）、审计日志、同意记录、隐私政策/服务条款页。

**预留接口（MVP 建空壳，Phase 2 实现）：** 通知（短信/邮件/微信模板）、支付（微信/支付宝）、AI/RAG（文书润色、模拟面试、智能问答）。

**MVP 不做（后续阶段）：** 真人导师 marketplace 与预约/分佣、AI 模拟面试、签证模块、社区/UGC、移动端/微信小程序。

---

## 3. 技术架构

**整体：** Next.js（App Router）全栈单体应用——RSC + Server Actions + Route Handlers 做 API，前后端同仓，MVP 不拆微服务。

| 层 | 选型 |
|---|---|
| 框架 | Next.js (App Router) + React + TypeScript（strict） |
| 样式/UI | Tailwind CSS + shadcn/ui + lucide 图标 |
| ORM/DB | Prisma + PostgreSQL（启用 `pgvector` 扩展，为 RAG 预留） |
| 认证 | Auth.js (NextAuth v5)：Credentials(手机OTP) + 邮箱密码；WeChat OAuth 预留 |
| 校验 | Zod（DTO/表单/Server Action 入参）；表单 react-hook-form |
| i18n | next-intl（zh-CN 默认 / en） |
| 文件存储 | `lib/storage` 适配器接口：dev=本地FS/MinIO，prod=腾讯COS/阿里OSS |
| 通知 | `lib/notify` 适配器：短信(阿里/腾讯)、邮件(SMTP/Resend)、微信模板 —— MVP 为 no-op stub |
| 支付 | `lib/payments` 适配器：微信支付/支付宝 —— MVP 预留接口 |
| AI/RAG | `lib/ai`：LLM(Claude 经网关) + pgvector 检索 —— Phase 2 |
| 后台任务 | MVP 同步处理；后续 BullMQ + Redis（通知/AI 异步） |
| 测试 | Vitest（单元，重点匹配引擎）+ Playwright（E2E 关键流程） |
| 质量 | ESLint + Prettier + tsc，提交前校验 |
| 部署 | 国内：腾讯云/阿里云 + **ICP 备案**；开发期可任意托管（见合规清单） |

**关键设计原则：** 所有"外部/受管"能力（存储、通知、支付、AI）一律走**接口 + 适配器**，MVP 用 stub/local 实现，生产替换适配器即可——避免与具体云厂商/合规方案耦合。

---

## 4. 数据库 Schema 初稿（Prisma，代表性草案）

> 仅列核心模型与关键字段，落地时再补全索引/约束。

```prisma
// ---------- 账户 ----------
model User {
  id           String   @id @default(cuid())
  phone        String?  @unique
  email        String?  @unique
  passwordHash String?
  role         Role     @default(STUDENT)
  locale       String   @default("zh-CN")
  profile      StudentProfile?
  consents     Consent[]
  documents    Document[]
  createdAt    DateTime @default(now())
}
enum Role { STUDENT ADMIN MENTOR }

model Consent {            // PIPL / 跨境 / 监护人同意
  id        String      @id @default(cuid())
  userId    String
  user      User        @relation(fields: [userId], references: [id])
  type      ConsentType
  version   String
  grantedAt DateTime    @default(now())
}
enum ConsentType { PRIVACY_PIPL CROSS_BORDER GUARDIAN MARKETING }

// ---------- 学生档案 ----------
model StudentProfile {
  id            String        @id @default(cuid())
  userId        String        @unique
  user          User          @relation(fields: [userId], references: [id])
  fullName      String?
  school        String?
  isMinor       Boolean       @default(false)
  intakeYear    Int?
  targetRegions Region[]      // UK / HK
  intendedMajors String[]
  budgetNote    String?
  subjects      ALevelSubject[]
  testScores    TestScore[]
  applications  Application[]
  statements    PersonalStatement[]
  tasks         Task[]
}
enum Region { UK HK }

model ALevelSubject {
  id        String   @id @default(cuid())
  profileId String
  profile   StudentProfile @relation(fields: [profileId], references: [id])
  subject   String
  kind      GradeKind  // AS / PREDICTED / ACTUAL
  grade     String     // A*, A, B...
}
enum GradeKind { AS PREDICTED ACTUAL }

model TestScore {
  id        String   @id @default(cuid())
  profileId String
  profile   StudentProfile @relation(fields: [profileId], references: [id])
  type      String   // IELTS / TOEFL / DUOLINGO
  overall   Float?
  subscores Json?
  takenAt   DateTime?
}

// ---------- 院校与专业 ----------
model University {
  id        String   @id @default(cuid())
  name      String
  nameZh    String?
  region    Region
  city      String?
  ucasCode  String?
  website   String?
  ranking   Json?
  programs  Program[]
}

model Program {
  id            String   @id @default(cuid())
  universityId  String
  university    University @relation(fields: [universityId], references: [id])
  name          String
  nameZh        String?
  degree        String?   // BSc/BA...
  durationYears Int?
  applyRoute    ApplyRoute // UCAS / HK_DIRECT
  ucasCourseCode String?
  tuitionPerYear Int?
  // 入学要求（结构化 + 文本）
  aLevelOffer   String?   // 例 "A*AA"
  requiredSubjects Json?  // [{subject, minGrade}]
  englishReq    Json?     // {ielts, toefl}
  admissionTest String?   // LNAT/UCAT/TMUA...
  requirementsText String?
  applications  Application[]
}
enum ApplyRoute { UCAS HK_DIRECT }

// ---------- 申请 ----------
model Application {
  id          String   @id @default(cuid())
  studentId   String
  student     StudentProfile @relation(fields: [studentId], references: [id])
  programId   String
  program     Program  @relation(fields: [programId], references: [id])
  choiceType  ChoiceType
  status      AppStatus @default(PLANNING)
  externalRef String?
  submittedAt DateTime?
  offer       Offer?
  documents   ApplicationDocument[]
  tasks       Task[]
}
enum ChoiceType { UCAS_CHOICE HK_DIRECT }
enum AppStatus { PLANNING IN_PROGRESS SUBMITTED INTERVIEW OFFER REJECTED ACCEPTED WITHDRAWN }

model Offer {
  id          String   @id @default(cuid())
  applicationId String @unique
  application Application @relation(fields: [applicationId], references: [id])
  type        OfferType  // CONDITIONAL / UNCONDITIONAL
  conditions  String?
  decision    OfferDecision? // FIRM / INSURANCE / DECLINE / ACCEPTED
  deadline    DateTime?
  respondedAt DateTime?
}
enum OfferType { CONDITIONAL UNCONDITIONAL }
enum OfferDecision { FIRM INSURANCE DECLINE ACCEPTED }

// ---------- 资料 ----------
model Document {
  id        String   @id @default(cuid())
  ownerId   String
  owner     User     @relation(fields: [ownerId], references: [id])
  type      DocType
  fileKey   String   // 存储适配器的 key
  fileName  String
  mime      String?
  size      Int?
  createdAt DateTime @default(now())
  links     ApplicationDocument[]
}
enum DocType { TRANSCRIPT PASSPORT PREDICTED_GRADES IELTS TOEFL CERTIFICATE PHOTO OTHER }

model ApplicationDocument {
  applicationId String
  documentId    String
  application   Application @relation(fields: [applicationId], references: [id])
  document      Document    @relation(fields: [documentId], references: [id])
  @@id([applicationId, documentId])
}

// ---------- 文书 ----------
model PersonalStatement {
  id         String   @id @default(cuid())
  studentId  String
  student    StudentProfile @relation(fields: [studentId], references: [id])
  kind       PsKind   // UK_UCAS_3Q / HK_ESSAY
  title      String?
  content    Json     // UK: {q1,q2,q3}；HK: {body}
  wordCount  Int      @default(0)
  status     String   @default("DRAFT")
  versions   PersonalStatementVersion[]
  updatedAt  DateTime @updatedAt
}
enum PsKind { UK_UCAS_3Q HK_ESSAY }

model PersonalStatementVersion {
  id        String   @id @default(cuid())
  statementId String
  statement PersonalStatement @relation(fields: [statementId], references: [id])
  content   Json
  createdAt DateTime @default(now())
}

// ---------- 时间线/任务 ----------
model Task {
  id          String   @id @default(cuid())
  studentId   String
  student     StudentProfile @relation(fields: [studentId], references: [id])
  applicationId String?
  application Application? @relation(fields: [applicationId], references: [id])
  title       String
  category    String?  // DOC / WRITING / SUBMIT / TEST / INTERVIEW
  dueDate     DateTime?
  status      TaskStatus @default(TODO)
}
enum TaskStatus { TODO DOING DONE }

// ---------- 内容/合规 ----------
model ContentArticle {
  id        String   @id @default(cuid())
  slug      String   @unique
  locale    String
  title     String
  body      String
  category  String?
  published Boolean  @default(false)
  updatedAt DateTime @updatedAt
}

model AuditLog {
  id        String   @id @default(cuid())
  actorId   String?
  action    String
  entity    String?
  entityId  String?
  meta      Json?
  createdAt DateTime @default(now())
}
```
> 预留（Phase 2，先不建表或建空模型）：`Mentor`、`Booking`、`Order`/`Payment`、`Reference`、`Notification`、`Embedding`(pgvector)。

---

## 5. 代码目录结构

```
alevel-apply/
├─ app/
│  ├─ [locale]/
│  │  ├─ (marketing)/        # 首页、定价、知识库
│  │  ├─ (auth)/             # 登录、注册
│  │  ├─ (dashboard)/        # 登录后工作台
│  │  │  ├─ page.tsx         # 仪表盘
│  │  │  ├─ profile/  match/  applications/
│  │  │  ├─ documents/  statements/  timeline/  settings/
│  │  └─ admin/              # 运营后台
│  ├─ api/                   # Route Handlers（auth、webhook 等）
│  ├─ layout.tsx  globals.css
├─ components/
│  ├─ ui/                    # shadcn 基础组件
│  └─ features/              # 业务组件（match-card、ps-editor…）
├─ lib/
│  ├─ db.ts                  # Prisma client 单例
│  ├─ auth/                  # Auth.js 配置、OTP
│  ├─ matching/              # 选校匹配引擎（纯函数，可单测）
│  ├─ storage/              # 存储适配器接口 + local/COS/OSS
│  ├─ notify/               # 通知适配器（短信/邮件/微信，MVP stub）
│  ├─ payments/             # 支付适配器（微信/支付宝，预留）
│  ├─ ai/                   # AI/RAG 服务（Phase 2 预留）
│  ├─ validators/           # Zod schemas
│  └─ i18n/                 # next-intl 配置
├─ prisma/
│  ├─ schema.prisma  ├─ migrations/  └─ seed.ts   # UK/HK 种子数据
├─ messages/  zh-CN.json  en.json
├─ tests/     unit/  e2e/
├─ scripts/   public/
├─ .env.example  .eslintrc  prettier  tailwind.config  next.config
└─ package.json  tsconfig.json  README.md
```

---

## 6. 第一阶段开发任务拆分（Epics → Tasks）

**E0 脚手架**：Next.js+TS+Tailwind 初始化；shadcn；next-intl；ESLint/Prettier/tsc；Prisma 接 Postgres；`.env` 管理；基础布局与导航。
**E1 认证与账户**：Auth.js（手机 OTP + 邮箱密码）；session/角色中间件；注册流程含 PIPL/监护人同意采集 → `Consent`。
**E2 学生档案**：Profile + 选科/预估成绩/英语成绩/目标 的增删改查与表单校验。
**E3 院校专业库 + 后台**：University/Program 模型；Admin CMS 维护；`seed.ts` 灌入初始 UK+HK 院校与入学要求。
**E4 选校匹配引擎**：`lib/matching` 纯函数（成绩比对、先修科目、英语门槛）→ reach/match/safety + 解释；结果页 UI；单测覆盖。
**E5 申请与 Offer 追踪**：Application 状态机；Offer 录入；UK firm/insurance；仪表盘总览。
**E6 资料中心**：`lib/storage` 本地适配器；上传/列表/删除；DocType；按校材料清单（ApplicationDocument）。
**E7 文书工作台**：UCAS 3 问 + 香港文书编辑器；模板；字数；版本历史；自查清单（AI 钩子预留 feature flag）。
**E8 时间线/待办**：路线任务模板 → 自动生成 Task；截止与提醒（站内；notify stub）。
**E9 知识库**：ContentArticle CMS + 双语渲染；初始几篇核心指南。
**E10 通用/合规**：i18n 完整化；AuditLog；隐私政策/服务条款页；统一错误处理；基础埋点。
**E11 测试与部署准备**：Vitest（匹配引擎）+ Playwright（注册→匹配→建申请→录 Offer）；demo 种子；部署/备案说明文档。

**建议落地顺序**：E0 → E1 → E2 → E3 → E4 →（E5/E6/E7 并行）→ E8 → E9 → E10 → E11。

---

## 7. 风险与合规清单

**合规（中国大陆，最高优先）**
- [ ] **ICP 备案**：国内托管须备案，需 **PRC 公司主体 + 域名**。（你的香港公司不满足大陆 ICP；需内地主体或合作方。）未备案则只能海外托管（GFW 下慢），作过渡。
- [ ] **PIPL**：明示同意、最小必要、敏感信息（护照/成绩）加密与权限控制。
- [ ] **未成年人**：≥多数申请者 <18，需**监护人同意**与更严处理（已在 `Consent` 预留）。
- [ ] **数据跨境**：向英/港高校传学生数据=跨境传输，需**标准合同/安全评估/认证**（重大事项，先评估）。
- [ ] **生成式 AI 合规**：面向公众的 AI 服务可能需**算法备案 + 内容审核**；文书 AI 需定位"辅助"、加审核与免责声明。
- [ ] **广告法**：禁止"保录取/保 Offer"等保证性宣传。
- [ ] **支付/短信资质**：支付牌照/商户号、短信签名模板报备。

**产品/法律**
- [ ] **不能自动投递**：UCAS/港校均需学生本人在官方 portal 提交；平台定位引导+管理，设清楚预期；远期可评估申请成为 UCAS 注册 centre。
- [ ] **学术诚信**：UCAS/高校有 AI 与抄袭政策；文书须本人原创，加 AI 使用披露与相似度自查。
- [ ] **数据来源**：院校/专业/要求数据须人工核验、注明来源，避免违反目标站点 ToS 的抓取。

**技术**
- [ ] 存储/通知/支付/AI 全部走适配器接口，避免厂商与合规方案耦合。
- [ ] 加密（传输/静态）、备份、审计日志、权限分级。
- [ ] 入学要求模型需兼顾"结构化匹配"与"自由文本"（很多要求无法完全结构化）。

---

## 验证方式（Phase 1 完成时）
- `pnpm test`（Vitest）：匹配引擎单测——给定档案与要求，正确产出 reach/match/safety。
- `pnpm e2e`（Playwright）：端到端跑通 **注册 → 填档案 → 选校匹配 → 建立申请 → 上传资料 → 写文书 → 录入 Offer**。
- `pnpm prisma db seed` 后本地启动，人工走查双语 UI 与后台院校维护。
- 产出《部署与备案说明》文档（ICP、托管、跨境数据评估清单）。
