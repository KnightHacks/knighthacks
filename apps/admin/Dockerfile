FROM node:18-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=admin --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable
RUN pnpm i

COPY --from=builder /app/out/full/ .
RUN pnpm dlx turbo run build --filter=admin

FROM base AS runner
WORKDIR /app
COPY --from=installer /app .

WORKDIR /app/apps/admin

CMD ["npm", "start"]