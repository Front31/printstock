FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# NUR dumb-init, KEIN curl
RUN apk add --no-cache dumb-init

COPY package*.json ./
RUN npm install --production && npm cache clean --force
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000

# Health check OHNE curl
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
