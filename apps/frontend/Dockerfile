FROM node:26-slim as builder
WORKDIR /app
RUN npm install -g corepack && corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN CYPRESS_INSTALL_BINARY=0 corepack pnpm install --frozen-lockfile
COPY . .
ARG APP_VERSION
RUN APP_VERSION=$APP_VERSION corepack pnpm run build:frontend

FROM node:26-slim
WORKDIR /app
RUN npm install -g corepack && corepack enable
COPY --from=builder /app/dist ./dist
EXPOSE 4000
CMD node dist/apps/frontend/server/server.mjs
