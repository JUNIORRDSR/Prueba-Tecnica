FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

RUN apk add --no-cache netcat-openbsd

COPY prisma ./prisma
COPY src ./src
COPY docker/entrypoint.sh ./entrypoint.sh

ARG DATABASE_URL=postgresql://postgres:postgres@postgres:5432/pruebas
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=3000
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
