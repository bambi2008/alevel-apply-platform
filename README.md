# A-Level 留学申请平台（alevel-apply-platform）

服务**中国大陆 A-Level 学生**申请**英国（UCAS）+ 香港本科**的全流程平台，用低成本、透明、流程化的方式替代传统高价中介。

核心价值：**选校定位 + 流程管理 + 文书工具 + 申请追踪 + 知识库**（自助为主，后续接入 AI 辅助）。

> 完整架构设计见 [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)。

## 技术栈
Next.js 16 (App Router) · TypeScript · Tailwind v4 · Prisma + PostgreSQL · NextAuth v5 · next-intl(zh-CN/en) · Zod · Vitest/Playwright。
外部能力（存储/通知/支付/AI）一律走 **接口 + 适配器**，MVP 用本地/stub 实现，生产替换适配器即可。

## 目录结构（要点）
```
app/            Next.js App Router 页面（[locale] 双语，待接入）
components/      UI 与业务组件
lib/
  db.ts         Prisma client 单例
  matching/     选校匹配引擎（纯函数，已含单测）
  storage/      存储适配器（local；COS/OSS 预留）
  notify/       通知适配器（stub；短信/邮件/微信预留）
  payments/     支付适配器（预留：微信/支付宝）
  ai/           AI/RAG 服务（预留，AI_ENABLED 开关）
  validators/   Zod 校验
prisma/         schema.prisma + seed.ts（样例数据）
docs/           架构设计
```

## 本地开发

### 0. 前置
- Node ≥ 20、pnpm、PostgreSQL（本地或 Docker）
- 国内网络：项目已含 `.npmrc`（npmmirror 镜像 + 低并发，避免安装超时）

### 1. 安装依赖
```bash
pnpm install
```

### 2. 配置环境
```bash
cp .env.example .env   # 填入 DATABASE_URL、AUTH_SECRET
```

### 3. 数据库
```bash
pnpm prisma generate
pnpm prisma migrate dev   # 需要本地 Postgres 可用
pnpm db:seed              # 灌入样例院校/专业（⚠️ 入学要求需人工核验）
```

### 4. 启动 / 测试
```bash
pnpm dev      # http://localhost:3000
pnpm test     # Vitest（含匹配引擎单测）
```

## 合规要点（详见 ARCHITECTURE.md 第 7 节）
ICP 备案 · PIPL/未成年人同意 · 数据跨境 · 生成式 AI 备案 · 广告法（禁"保录取"）· 学术诚信（文书须本人原创）。院校数据须人工核验来源。

## 状态
Phase 1 进行中：已完成脚手架、Prisma schema、选校匹配引擎（+单测）、各适配器骨架、种子数据、架构文档。
后续：认证/档案/匹配 UI、资料中心、文书工作台、时间线、知识库（见 ARCHITECTURE.md 任务拆分）。
