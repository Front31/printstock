FROM node:20-alpine AS builder

WORKDIR /app

# OpenSSL installieren (wichtig für Prisma!)
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# OpenSSL und curl installieren
RUN apk add --no-cache dumb-init curl openssl libc6-compat

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --production && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN mkdir -p /app/uploads && chown -R node:node /app

USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

ENTRYPOINT ["dumb-init", "--"]

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/main.js"]
