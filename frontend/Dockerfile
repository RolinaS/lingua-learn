# ─────────────────────────────────────────────
# STAGE 1 — Base commune
# ─────────────────────────────────────────────
FROM node:20-alpine AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copie uniquement les fichiers de dépendances
COPY package.json package-lock.json* ./

# ─────────────────────────────────────────────
# STAGE 2 — Dépendances
# ─────────────────────────────────────────────
FROM base AS deps

RUN npm ci

# ─────────────────────────────────────────────
# STAGE 3 — Développement
# Hot-reload Next.js natif, sources montées en volume
# ─────────────────────────────────────────────
FROM base AS development

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

# next dev : hot-reload natif TypeScript
CMD ["npx", "next", "dev", "--turbopack"]

# ─────────────────────────────────────────────
# STAGE 4 — Builder (compilation Next.js)
# ─────────────────────────────────────────────
FROM base AS builder

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Variables publiques injectées au build
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js optimisé
RUN npm run build

# ─────────────────────────────────────────────
# STAGE 5 — Production
# Image légère avec standalone output Next.js
# ─────────────────────────────────────────────
FROM node:20-alpine AS production

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

RUN apk add --no-cache libc6-compat

# Utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copie uniquement ce qui est nécessaire (standalone)
COPY --from=builder --chown=appuser:appgroup /app/public ./public
COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static

USER appuser

EXPOSE 3000

# Serveur Next.js standalone (sans node_modules complets)
CMD ["node", "server.js"]