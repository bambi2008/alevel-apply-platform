FROM node:22-bookworm-slim AS base

ENV PNPM_HOME=/pnpm
ENV COREPACK_HOME=/opt/corepack
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable \
  && corepack prepare pnpm@11.9.0 --activate \
  && chmod -R a+rX "$COREPACK_HOME" \
  && apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl \
  && install -d /usr/share/postgresql-common/pgdg \
  && curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc \
    -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc \
  && . /etc/os-release \
  && echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt ${VERSION_CODENAME}-pgdg main" \
    > /etc/apt/sources.list.d/pgdg.list \
  && apt-get update \
  && apt-get install -y --no-install-recommends postgresql-client-16 tar \
  && apt-get purge -y --auto-remove curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN --mount=type=cache,id=qiaoshen-pnpm-store,target=/pnpm/store \
  pnpm install --frozen-lockfile --trust-lockfile

FROM dependencies AS builder
COPY . .
ENV DATABASE_URL=postgresql://build:build-password@postgres:5432/build
RUN pnpm exec prisma generate && pnpm build

FROM base AS production
ENV NODE_ENV=production
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs
COPY --from=builder --chown=nextjs:nodejs /app /app
RUN mkdir -p /app/.storage /backups \
  && chown -R nextjs:nodejs /app/.storage /backups
USER nextjs
EXPOSE 3000
CMD ["pnpm", "start:production"]
