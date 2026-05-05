# ─────────────────────────────────────────────
# STAGE 1 — Base commune
# ─────────────────────────────────────────────
FROM node:20-alpine AS base

WORKDIR /app

# Dépendances système nécessaires à Prisma
RUN apk add --no-cache openssl libc6-compat

# Copie uniquement les fichiers de dépendances
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# ─────────────────────────────────────────────
# STAGE 2 — Dépendances
# ─────────────────────────────────────────────
FROM base AS deps

# Installation de toutes les dépendances (dev + prod)
RUN npm ci

# Génération du client Prisma
RUN npx prisma generate

# ─────────────────────────────────────────────
# STAGE 3 — Développement
# Hot-reload via ts-node-dev, source montée en volume
# ─────────────────────────────────────────────
FROM base AS development

ENV NODE_ENV=development

# Copie les node_modules depuis le stage deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma

# Copie le reste des sources
COPY . .

EXPOSE 5000

# ts-node-dev : transpile + hot-reload sans build
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"]

# ─────────────────────────────────────────────
# STAGE 4 — Builder (compilation TypeScript)
# ─────────────────────────────────────────────
FROM base AS builder

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY . .

# Compilation TypeScript → dist/
RUN npm run build

# ─────────────────────────────────────────────
# STAGE 5 — Production
# Image légère, uniquement le build compilé
# ─────────────────────────────────────────────
FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

# Dépendances système Prisma
RUN apk add --no-cache openssl libc6-compat

# Uniquement les dépendances de production
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci --omit=dev && npx prisma generate

# Copie le build compilé
COPY --from=builder /app/dist ./dist

# Utilisateur non-root pour la sécurité
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 5000

CMD ["node", "dist/index.js"]