FROM node:lts-slim as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack pnpm install --frozen-lockfile
COPY . .
RUN corepack pnpm run build:backend

FROM node:lts-slim
WORKDIR /app
COPY --from=builder /app/dist/apps/backend/ ./
ENV NODE_ENV=production
RUN corepack pnpm install # --frozen-lockfile
EXPOSE 3000
CMD node main.js
