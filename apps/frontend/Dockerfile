FROM node:lts-slim as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack pnpm install --frozen-lockfile
COPY . .
ARG APP_VERSION
RUN APP_VERSION=$APP_VERSION corepack pnpm run build:frontend

FROM node:lts-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 4000
CMD node dist/apps/frontend/server/server.mjs
