FROM node:lts-slim as builder
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build:backend

FROM node:lts-slim
RUN npm install -g pnpm
WORKDIR /app
COPY --from=builder /app/dist/apps/backend/ ./
ENV NODE_ENV=production
RUN pnpm install # --frozen-lockfile
EXPOSE 3000
CMD node main.js
