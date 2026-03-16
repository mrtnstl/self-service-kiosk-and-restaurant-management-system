FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts

COPY . .

RUN npm run build

FROM node:22-alpine AS runtime

RUN addgroup -g 1001 nodejs && \
    adduser -S appuser -u 1001 -G nodejs

WORKDIR /app

COPY --from=builder --chown=appuser:nodejs /app/package*.json ./
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist

RUN npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force

EXPOSE 3000

USER appuser

#ENV NODE_ENV=production \
#    PORT=3000

CMD ["npm", "start"]