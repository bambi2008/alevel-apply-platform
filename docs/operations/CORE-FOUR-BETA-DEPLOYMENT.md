# 四核心 Beta 独立环境

这套环境对应 `codex/core-four-redesign` 分支，只保留四个核心入口：

1. 入学考试练习与模考（含 CAIE A-Level 数学）
2. 竞赛与专业实践
3. 面试
4. 文书

本部署使用独立的 Compose project、PostgreSQL、存储卷、Caddy 数据和备份目录，不读取或覆盖正式站 `qiaoshen` 的数据。

## 先看边界

- 推荐使用一台新的 Linux 云服务器部署 Beta。
- `compose.core-beta.yml` 内含 Caddy，会绑定新服务器的 80/443 端口。
- 不要在现有正式服务器 `/opt/qiaoshen` 上直接运行这份带 Caddy 的 Compose 文件；正式 Caddy 已经占用 80/443。
- 如果必须同机部署，应先单独设计反向代理路由和非冲突端口，再执行，不能把正式 Compose 的环境文件替换成 Beta 文件。

## 新服务器部署

### 1. DNS

在 DNSPod 添加：

```text
类型: A
主机记录: beta
记录值: 新 Beta 服务器公网 IPv4
TTL: 600
```

等待 `beta.qiaoshenedu.com` 解析到新服务器后再申请 HTTPS。

### 2. 拉取分支

```bash
sudo mkdir -p /opt/qiaoshen-core-beta
sudo chown "$USER":"$USER" /opt/qiaoshen-core-beta
git clone --branch codex/core-four-redesign --single-branch https://github.com/bambi2008/alevel-apply-platform.git /opt/qiaoshen-core-beta
cd /opt/qiaoshen-core-beta
```

### 3. 创建 Beta 环境文件

```bash
cp .env.core-beta.example .env.core-beta
nano .env.core-beta
```

至少修改：

- `AUTH_SECRET`
- `RESEND_API_KEY`
- `POSTGRES_PASSWORD`
- `DATABASE_URL` 中的同一个数据库密码
- `BACKUP_ENCRYPTION_KEY`
- `PRIVACY_CONTACT_EMAIL`
- `APP_RELEASE`，填当前 commit 短哈希

推荐生成随机值：

```bash
openssl rand -hex 32
openssl rand -base64 32
openssl rand -base64 48
chmod 600 .env.core-beta
```

`EMAIL_FROM` 必须使用已经在 Resend 验证的发送域名。本项目已有 `mail.qiaoshenedu.com` 验证记录时，可使用 `account@mail.qiaoshenedu.com`。

### 4. 创建备份目录

```bash
mkdir -p backups-core-beta
sudo chown 1001:1001 backups-core-beta
chmod 700 backups-core-beta
```

### 5. 配置检查与启动

```bash
docker compose --env-file .env.core-beta -f compose.core-beta.yml config --quiet
docker compose --env-file .env.core-beta -f compose.core-beta.yml run --rm --no-deps app pnpm preflight:production
docker compose --env-file .env.core-beta -f compose.core-beta.yml up -d --build
```

首次启动会执行 Prisma 迁移。检查服务：

```bash
docker compose --env-file .env.core-beta -f compose.core-beta.yml ps
curl -fsS https://beta.qiaoshenedu.com/api/health
BASE_URL=https://beta.qiaoshenedu.com pnpm smoke:core-beta
```

预期：`postgres` 和 `app` 为 `healthy`，健康接口返回 `"status":"ok"`，五个核心页面均返回 2xx 或正常 3xx。

## 建立 Beta 管理员

先用管理员邮箱在 Beta 站完成一次注册，然后在新服务器执行以下命令，把自己的账号提升为管理员。只替换最后一行里的邮箱，不要使用学生邮箱：

```bash
docker compose --env-file .env.core-beta -f compose.core-beta.yml exec -T postgres \
  psql -U qiaoshen_beta -d qiaoshen_beta \
  -c "UPDATE \"User\" SET role='ADMIN' WHERE email='your-admin-email@example.com';"
```

重新登录后打开：

```text
https://beta.qiaoshenedu.com/zh-CN/admin/beta
```

在“首批 Beta 邀请码”中按学生邮箱逐个生成邀请码。当前系统后端事务会校验邮箱绑定、一次性使用和总量上限 20 人；不要把邀请码和管理员链接混在一起发送。

学生入口：

```text
https://beta.qiaoshenedu.com/zh-CN/register
```

学生使用自己的邮箱和邀请码注册，注册后进入四核心工作台。

## 50 人目标与首批 20 人

当前 Beta 邀请上限是 20 个学生账号。第一批建议只生成 5 到 10 个邀请码，完成一轮真实验收后再继续发放，避免链接外泄时一次性占满名额。

管理后台重点观察：

- 注册人数、档案完成率、首次诊断
- 首次练习、首次整卷、7 日回访
- 补弱完成和前后测变化
- 考试练习与模考记录、面试记录
- 失败/超时的 AI 评分请求（本 Beta 默认关闭 AI）

## 四核心验收清单

- 未登录访问首页、注册、登录、忘记密码。
- 管理员生成一个指定邮箱邀请码；错误邮箱、重复使用、超过 20 人均被拒绝。
- 登录后直接看到四个核心入口，不进入申请流程或工具集合。
- 入学考试进入后保留“考试结构、知识点、历史记录、学前分析”四个板块。
- 完成练习后，从“补知识”“练同类题”“完整报告”“能力画像”均能返回复盘上下文，不重新开始整卷。
- 桌面端和手机端各完成一套练习，确认公式、计时、提交、解析和历史记录。
- 竞赛/专业实践、面试、文书四个入口可正常打开，旧申请与工具内容不出现在 Beta 首页主导航。
- 执行 `pnpm smoke:core-beta`，结果为 `smoke passed`。

## 更新 Beta

每次更新先保留当前运行版本并确认备份，再拉取分支和重建：

```bash
cd /opt/qiaoshen-core-beta
git fetch origin
git switch codex/core-four-redesign
git pull --ff-only origin codex/core-four-redesign
sed -i "s/^APP_RELEASE=.*/APP_RELEASE=$(git rev-parse --short HEAD)/" .env.core-beta
docker compose --env-file .env.core-beta -f compose.core-beta.yml up -d --build
docker compose --env-file .env.core-beta -f compose.core-beta.yml ps
curl -fsS https://beta.qiaoshenedu.com/api/health
```

不要删除 `qiaoshen_core_beta_*` 卷，不要执行 `down -v`。删除卷会永久删除 Beta 数据。

## 故障处理

查看日志：

```bash
docker compose --env-file .env.core-beta -f compose.core-beta.yml logs --tail=200 app
docker compose --env-file .env.core-beta -f compose.core-beta.yml logs --tail=200 caddy
docker compose --env-file .env.core-beta -f compose.core-beta.yml logs --tail=200 postgres
```

若只是应用容器异常，可重启应用，不动数据库：

```bash
docker compose --env-file .env.core-beta -f compose.core-beta.yml restart app
```

若需要回到上一版，先从 Git 切换到上一 commit，再重建应用；不要用 `down -v`：

```bash
git checkout <previous-commit>
docker compose --env-file .env.core-beta -f compose.core-beta.yml up -d --build app backup
```
