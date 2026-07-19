FROM node:26-slim AS builder
WORKDIR /app
RUN npm install -g corepack && corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN CYPRESS_INSTALL_BINARY=0 corepack pnpm install --frozen-lockfile
COPY . .
RUN corepack pnpm run build:backend

FROM node:26-slim
WORKDIR /app
RUN npm install -g corepack && corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --from=builder /app/dist/apps/backend/ ./
ENV NODE_ENV=production
RUN CYPRESS_INSTALL_BINARY=0 corepack pnpm install --frozen-lockfile
EXPOSE 3000
CMD node main.js
