# 生产监控与故障处置

## 上线前配置

1. 将 `APP_RELEASE` 设置为本次不可变发布编号；部署脚本会自动传入 `--release` 的值。
2. 配置 `OPERATIONS_ALERT_WEBHOOK_URL`。如接收端需要鉴权，再配置 `OPERATIONS_ALERT_WEBHOOK_TOKEN`。
3. 在 GitHub Actions Secrets 中配置 `PRODUCTION_HEALTH_URL`，值为 `https://你的域名/api/health`。同时配置与生产环境相同的告警 Webhook。
4. 首次部署后打开 `/zh-CN/admin/operations`，确认数据库、文件存储和备份均为正常。

Webhook 请求为 JSON，包含 `service`、`release`、`severity`、`source`、`code`、`message` 和 `occurredAt`。业务元数据会过滤密码、令牌、Cookie 和密钥字段。

Next.js 的统一 `onRequestError` 钩子会捕获 Server Component、Server Action 和 Route Handler 的未处理错误。相同来源与错误码默认每 60 秒最多写入一次审计记录，Webhook 默认每 15 分钟最多通知一次，防止故障期间产生告警风暴。

## 服务目标与告警阈值

| 信号 | 正常 | 需要处置 |
| --- | --- | --- |
| `/api/health/live` | HTTP 200 | 连续 2 次失败，检查容器和反向代理 |
| `/api/health` | HTTP 200，数据库与存储均为 `ok` | 连续 3 次失败，按 P1 处理 |
| 数据库/存储延迟 | 小于 1 秒 | 连续 5 分钟超过 2 秒，按 P2 处理 |
| 加密备份 | 30 小时内 | 超过 30 小时或缺失，按 P1 处理 |
| 应用错误 | 偶发且可解释 | 10 分钟内相同流程连续失败，按 P1 处理 |

目标：月可用率不低于 99.5%，P1 在 10 分钟内确认、30 分钟内恢复或回滚。

## 处置顺序

1. 在管理员运行状态页确认发布编号、失败依赖、错误开始时间和最近管理员操作。
2. 运行 `docker compose --env-file .env.production -f compose.production.yml ps`，确认 `app`、`postgres`、`backup`、`caddy` 状态。
3. 查看结构化日志，但不要把用户数据、Cookie 或环境变量复制到工单和聊天中。
4. 若故障紧随发布出现，执行 `pnpm rollback:production -- --confirm`。数据库迁移只允许向前兼容，回滚不会逆向修改数据库。
5. 若数据库或存储损坏，停止写入并按 `PREPRODUCTION-AND-ROLLBACK.md` 使用最近一次已验证备份恢复。
6. 恢复后检查健康接口、登录、历史记录、文件下载和一次考试提交，并在审计记录中写明原因、影响、时间线和修复。

## 演练命令

```bash
MONITOR_HEALTH_URL=https://你的域名/api/health pnpm monitor:production
```

每月执行一次：停止预生产应用容器，确认站外探测失败并收到告警；随后启动容器，确认健康恢复。每季度执行完整备份恢复和版本回滚演练。
