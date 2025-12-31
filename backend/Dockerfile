FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./
COPY prisma ./prisma/

RUN npm install

COPY src ./src

RUN npx prisma generate
RUN npm run build

# Prüfe ob dist existiert
RUN ls -la dist/

FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates curl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN ls -la dist/

RUN mkdir -p /app/uploads && chown -R node:node /app

USER node

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
