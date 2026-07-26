FROM node:20-bookworm-slim AS base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable \
  && corepack prepare pnpm@11.9.0 --activate \
  && apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates postgresql-client tar \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

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
