# 预生产部署、恢复演练与回滚

## 前置条件

- Docker Engine 或 Docker Desktop，且包含 Compose v2。
- Node.js 22.13+、pnpm 11.9。
- 至少预留约 8 GB 磁盘空间用于镜像、隔离数据库和备份。

## 安全边界

- 预生产与生产使用不同的 Compose project、PostgreSQL 卷、上传文件卷和备份目录。
- 应用回滚只切换到已构建的旧镜像，不反向执行数据库迁移。
- 每次生产发布和手动回滚前都创建加密备份。
- 备份验收必须完成校验和验证、dump/归档解析，以及一次性数据库真实恢复。
- `.deploy/` 只保存镜像标签和发布时间，不保存密码；该目录不提交 Git。

## 准备预生产环境

复制示例文件并替换所有 `replace-with-...` 值：

```bash
cp .env.preproduction.example .env.preproduction
openssl rand -base64 32
```

`BACKUP_ENCRYPTION_KEY` 必须保存到密码管理器。丢失该密钥后，已有备份无法恢复。

预生产默认仅绑定本机：

- Web：`http://127.0.0.1:3200`
- PostgreSQL：`127.0.0.1:5434`
- 备份：`backups-preproduction/`

## 一键预生产演练

```bash
pnpm drill:preproduction -- --release "$(git rev-parse --short HEAD)"
```

该命令依次执行：

1. 构建固定版本镜像并执行生产环境预检。
2. 启动隔离 PostgreSQL，执行 Prisma 迁移并等待应用健康。
3. 创建 AES-256-GCM 加密备份。
4. 解密并解析 PostgreSQL dump 与上传文件归档。
5. 将备份恢复到 tmpfs 一次性 PostgreSQL，并查询 `_prisma_migrations`。
6. 对预生产网页运行桌面端、手机端和学生关键旅程 E2E。

只演练部署与恢复、暂不运行浏览器验收时：

```bash
pnpm drill:preproduction -- --release "manual-check" --skip-e2e
```

## 生产发布

先确认 GitHub `Production check` 通过，再在生产主机执行：

```bash
pnpm deploy:production -- --release "$(git rev-parse --short HEAD)" --confirm
```

发布状态写入 `.deploy/production/release-state.json`。发布过程中如新容器未通过健康检查，脚本会自动切回上一镜像并返回失败。

首次接管已有部署时还没有上一版本记录，因此第一次发布无法自动回退。第一次发布前必须手动确认现有镜像和备份可用。

## 一键应用回滚

回到上一健康镜像：

```bash
pnpm rollback:production -- --confirm
```

回到发布历史中的指定版本：

```bash
pnpm rollback:production -- --to "qiaoshen-app:COMMIT_SHA" --confirm
```

回滚后必须检查：

```bash
docker compose --env-file .env.production -f compose.production.yml ps
curl --fail https://你的域名/api/health
```

如果旧代码不兼容当前数据库结构，不得执行应用回滚；应发布向前修复版本。

## 单独验证或恢复备份

只验证，不修改数据：

```bash
docker compose --env-file .env.production -f compose.production.yml \
  run --rm backup node scripts/restore-production.mjs /backups/BACKUP_ID --verify-only
```

真实生产恢复是破坏性操作。必须先停止应用写入，并在隔离环境完成同一备份的恢复演练：

```bash
docker compose --env-file .env.production -f compose.production.yml stop app backup
docker compose --env-file .env.production -f compose.production.yml \
  run --rm app node scripts/restore-production.mjs /backups/BACKUP_ID --confirm
docker compose --env-file .env.production -f compose.production.yml up -d
```

恢复后检查健康接口、用户数量、考试记录数量、最新上传文件和迁移历史。不要删除恢复前的备份。
