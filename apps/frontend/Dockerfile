FROM node:lts-slim as builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm run build:frontend

FROM node:lts-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 4000
CMD node dist/apps/frontend/server/server.mjs
