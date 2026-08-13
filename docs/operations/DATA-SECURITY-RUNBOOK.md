# 数据安全与恢复运行手册

## 已落实的控制

- 生产启动前强制校验 HTTPS、认证密钥、数据库 TLS/内网连接、持久存储和备份密钥。
- PostgreSQL 仅位于 Compose 内网；公网入口只有 Caddy 的 80/443。
- 全站启用 HSTS、CSP、禁止 iframe、MIME 嗅探和严格 Referrer Policy。
- 登录、短信验证码、公开推荐信上传和 AI 评分均有限流。
- 学生文件按归属鉴权；只接受签名匹配的 PDF、DOC、DOCX，并强制以附件下载。
- 数据库与上传资料每日打包，使用 AES-256-GCM 加密并记录 SHA-256 校验值。

进程内限流只适用于单个应用实例。多实例发布前必须改用 Redis 等共享限流存储。

## 备份目标

- RPO：不超过 24 小时。
- RTO：60 分钟内恢复单机服务。
- 本机保留：默认最近 14 份，最低 3 份。
- 异地副本：至少一份，建议对象存储开启版本控制和保留锁。

手工备份：

```bash
docker compose --env-file .env.production -f compose.production.yml run --rm backup node scripts/backup-production.mjs
```

只校验备份，不改动数据库：

```bash
docker compose --env-file .env.production -f compose.production.yml run --rm backup \
  node scripts/restore-production.mjs /backups/20260101T000000Z --verify-only
```

## 恢复演练

每月至少一次在隔离的临时环境执行完整恢复。`--confirm` 会清理目标数据库并替换上传目录，只能指向演练库或经负责人批准的生产事故恢复目标：

```bash
node scripts/restore-production.mjs /backups/20260101T000000Z --confirm
```

恢复后必须检查 `/api/health`、登录、随机三名学生的历史记录、一个文件下载和一套模拟卷提交。将耗时、备份编号、验证人和结果记录在运维日志。

## 事故响应

1. 隔离：撤销泄漏密钥，限制入口流量，保留容器和代理日志。
2. 定界：确认受影响时间、账号、数据类型和入口，不在原始证据上直接修改。
3. 恢复：从已校验备份恢复，轮换 `AUTH_SECRET`、数据库、AI、短信与备份密钥。
4. 通知：按适用的隐私法规和合同要求通知受影响用户及监管方。
5. 复盘：记录根因、检测缺口、修复和验证证据；未完成验证前不宣告关闭。
