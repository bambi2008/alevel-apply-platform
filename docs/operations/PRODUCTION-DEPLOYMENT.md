# 桥申生产部署手册

## 架构边界

当前方案面向一台 Linux 云服务器：Caddy 自动申请 HTTPS 证书，Next.js 应用、PostgreSQL 和每日备份任务由 Docker Compose 管理。数据库不开放公网端口，上传资料位于持久卷，备份文件经过 AES-256-GCM 认证加密后写入宿主机 `backups/`。

这是可上线的单机架构，不是多机高可用架构。横向扩容前必须把上传存储迁移到对象存储，把进程内限流迁移到 Redis，并使用托管 PostgreSQL 或独立数据库集群。

## 首次部署

1. 准备带公网 IP 的 Linux 主机，将域名 A/AAAA 记录指向该主机，只开放 SSH、80 和 443。
2. 安装 Docker Engine 和 Compose 插件，拉取项目代码。
3. 生成密钥：

```bash
openssl rand -base64 48
openssl rand -base64 32
openssl rand -base64 32
```

第一项可作数据库密码，第二项作 `AUTH_SECRET`，第三项作 `BACKUP_ENCRYPTION_KEY`。数据库密码写入 `DATABASE_URL` 时要做 URL 编码。

4. 从 `.env.production.example` 创建不入库的 `.env.production`，填写真实域名和密钥。
5. 创建备份目录并只授予容器运行用户访问权：

```bash
mkdir -p backups
sudo chown 1001:1001 backups
chmod 700 backups
```

6. 运行启动前检查和部署：

```bash
docker compose --env-file .env.production -f compose.production.yml run --rm app pnpm preflight:production
docker compose --env-file .env.production -f compose.production.yml up -d --build
docker compose --env-file .env.production -f compose.production.yml ps
curl --fail https://你的域名/api/health
```

应用启动时自动执行 `prisma migrate deploy`，任何环境变量或迁移错误都会阻止应用对外服务。

## 发布与回滚

发布前必须通过 GitHub Actions 的 Production check。发布时先完成数据库备份，再拉取固定 commit 并重新构建：

```bash
docker compose --env-file .env.production -f compose.production.yml run --rm backup node scripts/backup-production.mjs
git pull --ff-only
docker compose --env-file .env.production -f compose.production.yml up -d --build
```

应用代码可回滚到上一个 commit；数据库迁移按前向修复处理。不要在没有恢复演练和备份的情况下手工回退数据库结构。

## 主机要求

- 启用云盘加密或 LUKS；数据库卷和上传卷在运行时不是应用层加密。
- 启用自动安全更新、防火墙和 SSH 密钥登录，禁用密码 SSH。
- `backups/` 至少每天异地同步一次，异地副本只能由备份账号写入，应用账号不能删除。
- 生产密钥只保存在主机密钥管理或受控的 `.env.production`，权限设为 `600`，不得发到 GitHub、聊天或日志。
