# Four-core Beta on the existing production server

This is the lower-cost deployment path. It keeps the production database,
storage, backup directory, and app container untouched. Beta gets its own
PostgreSQL container, storage volume, backup directory, and app container.
The existing production Caddy remains the only process binding ports 80 and
443 and proxies `beta.qiaoshenedu.com` to `qiaoshen-core-beta-app`.

## Before starting

1. Add a DNSPod A record:
   - Host: `beta`
   - Value: the existing Tencent Cloud server IPv4
   - TTL: `600`
2. Confirm the production frontend network is named `qiaoshen_frontend`.
3. Do not run `compose.core-beta.yml` on this server. It starts a second
   Caddy and conflicts with the production ports.

## Prepare the production project

Run this in the existing server checkout, normally `/opt/qiaoshen`:

```bash
cd /opt/qiaoshen
git fetch origin
git switch codex/core-four-redesign
git pull --ff-only origin codex/core-four-redesign
printf '\nBETA_DOMAIN=beta.qiaoshenedu.com\n' >> .env.production
docker compose --env-file .env.production -f compose.production.yml config --quiet
docker compose --env-file .env.production -f compose.production.yml up -d caddy
```

Only add `BETA_DOMAIN` once. If it already exists, edit that line instead of
appending another one. The production app and database do not need to be
recreated for this step.

## Prepare the Beta checkout

Use a separate directory on the same server:

```bash
sudo mkdir -p /opt/qiaoshen-core-beta
sudo chown "$USER":"$USER" /opt/qiaoshen-core-beta
git clone --branch codex/core-four-redesign --single-branch https://github.com/bambi2008/alevel-apply-platform.git /opt/qiaoshen-core-beta
cd /opt/qiaoshen-core-beta
cp .env.core-beta.same-host.example .env.core-beta.same-host
nano .env.core-beta.same-host
chmod 600 .env.core-beta.same-host
mkdir -p backups-core-beta
sudo chown 1001:1001 backups-core-beta
chmod 700 backups-core-beta
```

Replace `AUTH_SECRET`, `RESEND_API_KEY`, `POSTGRES_PASSWORD`, the matching
password in `DATABASE_URL`, `BACKUP_ENCRYPTION_KEY`, and the privacy email.

## Check and start Beta

```bash
docker compose --env-file .env.core-beta.same-host -f compose.core-beta.same-host.yml config --quiet
docker compose --env-file .env.core-beta.same-host -f compose.core-beta.same-host.yml run --rm --no-deps app pnpm preflight:production
docker compose --env-file .env.core-beta.same-host -f compose.core-beta.same-host.yml up -d --build
docker compose --env-file .env.core-beta.same-host -f compose.core-beta.same-host.yml ps
curl -fsS https://beta.qiaoshenedu.com/api/health
curl -I https://beta.qiaoshenedu.com/zh-CN
```

The first start runs Prisma migrations against the Beta database only. Caddy
can obtain the certificate after the DNS record resolves.

## Admin and student access

Register the owner account at:

`https://beta.qiaoshenedu.com/zh-CN/register`

Then promote that account using the Beta PostgreSQL container:

```bash
docker compose --env-file .env.core-beta.same-host -f compose.core-beta.same-host.yml exec -T postgres \
  psql -U qiaoshen_beta -d qiaoshen_beta \
  -c "UPDATE \"User\" SET role='ADMIN' WHERE email='your-admin-email@example.com';"
```

Admin page:

`https://beta.qiaoshenedu.com/zh-CN/admin/beta`

Create the first 5-10 one-time invites, not all 20 at once. The server-side
transaction enforces email binding, one-time use, and the total 20-account
cap.

## Update and rollback

```bash
cd /opt/qiaoshen-core-beta
git fetch origin
git switch codex/core-four-redesign
git pull --ff-only origin codex/core-four-redesign
sed -i "s/^APP_RELEASE=.*/APP_RELEASE=$(git rev-parse --short HEAD)/" .env.core-beta.same-host
docker compose --env-file .env.core-beta.same-host -f compose.core-beta.same-host.yml up -d --build
docker compose --env-file .env.core-beta.same-host -f compose.core-beta.same-host.yml ps
```

Never run `down -v`. To roll back, check out the previous commit and rebuild
only the Beta app and backup services. The production project remains on its
own release and data volumes.
