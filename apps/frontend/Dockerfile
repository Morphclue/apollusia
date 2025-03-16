FROM node:23-slim as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN CYPRESS_INSTALL_BINARY=0 corepack pnpm install --frozen-lockfile
COPY . .
ARG APP_VERSION
RUN APP_VERSION=$APP_VERSION corepack pnpm run build:frontend

FROM node:23-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 4000
CMD node dist/apps/frontend/server/server.mjs
