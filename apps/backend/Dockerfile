FROM node:23-slim AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN CYPRESS_INSTALL_BINARY=0 corepack pnpm install --frozen-lockfile
COPY . .
RUN corepack pnpm run build:backend

FROM node:23-slim
WORKDIR /app
COPY --from=builder /app/dist/apps/backend/ ./
ENV NODE_ENV=production
RUN CYPRESS_INSTALL_BINARY=0 corepack pnpm install --frozen-lockfile
EXPOSE 3000
CMD node main.js
