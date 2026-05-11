# LinguaLearn

Plateforme d'apprentissage de langues étrangères par répétition espacée (algorithme SM-2), conçue pour des apprenants souhaitant maîtriser du vocabulaire en comparant leur langue natale avec la langue cible.

---

## Table des matières

- [LinguaLearn](#lingualearn)
  - [Table des matières](#table-des-matières)
  - [Technologies utilisées](#technologies-utilisées)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Base de données \& Infrastructure](#base-de-données--infrastructure)
  - [Architecture du projet](#architecture-du-projet)
  - [Pages et fonctionnalités](#pages-et-fonctionnalités)
    - [Pages publiques](#pages-publiques)
    - [Dashboard (authentifié)](#dashboard-authentifié)
    - [Fonctionnalités clés](#fonctionnalités-clés)
  - [API Backend](#api-backend)
    - [Authentification](#authentification)
    - [Utilisateur](#utilisateur)
    - [Contenu](#contenu)
    - [Progression \& Sessions](#progression--sessions)
  - [Base de données](#base-de-données)
    - [Schéma (modèles Prisma)](#schéma-modèles-prisma)
    - [Énumérations](#énumérations)
  - [Fichiers de configuration](#fichiers-de-configuration)
  - [Variables d'environnement](#variables-denvironnement)
  - [Lancer le projet](#lancer-le-projet)
    - [Avec Docker (recommandé)](#avec-docker-recommandé)
    - [Sans Docker (développement local)](#sans-docker-développement-local)
    - [Scripts disponibles](#scripts-disponibles)
  - [Tests](#tests)
    - [Modifications apportées au code pour les tests](#modifications-apportées-au-code-pour-les-tests)
    - [Fichiers de configuration Jest](#fichiers-de-configuration-jest)
    - [Tests unitaires (42 tests)](#tests-unitaires-42-tests)
    - [Tests d'intégration (25 tests, stack HTTP complète avec Supertest)](#tests-dintégration-25-tests-stack-http-complète-avec-supertest)
    - [Lancer les tests (via Docker)](#lancer-les-tests-via-docker)

---

## Technologies utilisées

### Frontend

| Technologie | Version | Rôle |
|-------------|---------|------|
| Next.js | 16.2.4 | Framework React avec routing App Router |
| TypeScript | 5.4.5 | Typage statique |
| Tailwind CSS | 4.2.4 | Styles utilitaires |
| shadcn/ui + Radix UI | — | Composants UI accessibles |
| Zustand | 4.5.2 | Gestion d'état global (auth, session) |
| Axios | 1.7.2 | Client HTTP avec intercepteur de refresh JWT |
| React Hook Form + Zod | 7.52.0 | Formulaires et validation |
| Sonner | 2.0.7 | Notifications toast |
| next-themes | 0.4.6 | Gestion du thème clair/sombre |

### Backend

| Technologie | Version | Rôle |
|-------------|---------|------|
| Node.js | 20 | Runtime JavaScript |
| Express.js | 4.19.2 | Framework HTTP |
| TypeScript | 5.4.5 | Typage statique |
| Prisma | 5.14.0 | ORM (accès base de données) |
| jsonwebtoken | 9.0.2 | Authentification JWT |
| bcryptjs | 2.4.3 | Hachage des mots de passe |
| Helmet | 7.1.0 | En-têtes de sécurité HTTP |
| express-rate-limit | 7.3.1 | Limitation de débit (100 req/15 min) |
| express-validator | 7.1.0 | Validation des entrées |
| Morgan | 1.10.0 | Journalisation HTTP |

### Base de données & Infrastructure

| Technologie | Rôle |
|-------------|------|
| PostgreSQL 16 (Alpine) | Base de données relationnelle |
| Docker + Docker Compose | Conteneurisation et orchestration |
| Nginx (Alpine) | Reverse proxy (HTTP/HTTPS) |

---

## Architecture du projet

```
lingua-learn/
├── backend/                    # API Express.js + TypeScript
│   ├── src/
│   │   ├── index.ts            # Point d'entrée, configuration Express
│   │   ├── config/
│   │   │   ├── env.ts          # Validation des variables d'environnement
│   │   │   └── database.ts     # Client Prisma (singleton)
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts      # Vérification JWT
│   │   │   ├── error.middleware.ts     # Gestion globale des erreurs
│   │   │   ├── notFound.middleware.ts  # Handler 404
│   │   │   └── validate.middleware.ts  # Intégration express-validator
│   │   ├── routes/
│   │   │   ├── auth.routes.ts      # Inscription, connexion, refresh, logout
│   │   │   ├── user.routes.ts      # Profil et préférences utilisateur
│   │   │   ├── language.routes.ts  # Liste des langues disponibles
│   │   │   ├── word.routes.ts      # Vocabulaire avec filtres
│   │   │   ├── progress.routes.ts  # Suivi SM-2 de l'apprentissage
│   │   │   └── session.routes.ts   # Historique des sessions d'exercices
│   │   ├── services/
│   │   │   ├── auth.service.ts     # Logique d'authentification
│   │   │   └── jwt.service.ts      # Génération et vérification des tokens
│   │   └── types/
│   │       └── index.ts            # Types partagés (AuthRequest, User)
│   ├── prisma/
│   │   ├── schema.prisma           # Schéma de la base de données
│   │   └── seed.ts                 # Script de peuplement initial
│   ├── Dockerfile                  # Build multi-étapes (dev + prod)
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/                   # Application Next.js + TypeScript
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Landing page
│   │   │   ├── layout.tsx          # Layout racine (fonts, theme)
│   │   │   ├── globals.css
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   └── (dashboard)/
│   │   │       ├── layout.tsx
│   │   │       └── dashboard/
│   │   │           ├── page.tsx            # Hub principal
│   │   │           ├── alphabet/page.tsx   # Vocabulaire par catégorie
│   │   │           ├── progress/page.tsx   # Statistiques
│   │   │           ├── settings/page.tsx   # Préférences
│   │   │           └── games/
│   │   │               ├── page.tsx        # Sélection du jeu
│   │   │               ├── qcm/page.tsx    # QCM
│   │   │               ├── anagram/page.tsx
│   │   │               └── pairs/page.tsx  # Paires associées
│   │   ├── components/
│   │   │   └── ui/                 # Composants shadcn/ui
│   │   ├── store/
│   │   │   ├── auth.store.ts       # État auth (Zustand + persistance)
│   │   │   └── learn.store.ts      # État session d'apprentissage
│   │   ├── lib/
│   │   │   ├── api.ts              # Instance Axios + intercepteur refresh
│   │   │   └── utils.ts
│   │   └── types/                  # Définitions TypeScript
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── package.json
│
├── config/
│   └── nginx/
│       ├── nginx.dev.conf          # Reverse proxy HTTP (développement)
│       ├── nginx.prod.conf         # Reverse proxy HTTPS (production)
│       └── ssl/                    # Certificats SSL
│
├── database/
│   ├── init/
│   │   └── 01-schema.sql           # Init PostgreSQL (extensions, types)
│   └── migrations/                 # Fichiers de migration Prisma
│
├── docker-compose.yml              # Orchestration développement
├── docker-compose.prod.yml         # Orchestration production
├── .env.example                    # Modèle de variables d'environnement
├── generate-certs.sh               # Génération de certificats SSL auto-signés
└── README.md
```

---

## Pages et fonctionnalités

### Pages publiques

| Route | Description |
|-------|-------------|
| `/` | Landing page — présentation du projet, guide en 3 étapes, fonctionnalités clés |
| `/login` | Connexion par email/mot de passe |
| `/register` | Inscription avec sélection de la langue native et de la langue cible |

### Dashboard (authentifié)

| Route | Description |
|-------|-------------|
| `/dashboard` | Hub principal : progression du jour, mots à réviser, accès rapide aux jeux |
| `/dashboard/alphabet` | Navigation du vocabulaire par catégorie et par difficulté |
| `/dashboard/games` | Sélection du mode de jeu |
| `/dashboard/games/qcm` | QCM — choisir la bonne traduction parmi 4 propositions |
| `/dashboard/games/anagram` | Anagramme — reconstituer le mot dans la langue cible |
| `/dashboard/games/pairs` | Paires — associer chaque mot à sa traduction |
| `/dashboard/progress` | Statistiques : historique de sessions, score moyen, mots maîtrisés |
| `/dashboard/settings` | Préférences : thème, taille de police, accessibilité |

### Fonctionnalités clés

- **Répétition espacée (SM-2)** — chaque mot dispose d'un facteur d'aisance, d'un intervalle et d'une date de prochaine révision, ajustés automatiquement selon la performance.
- **5 langues disponibles** — Français, Anglais, Arabe (RTL), Espagnol, Russe.
- **3 thèmes** — Clair, Sombre, Océan.
- **Accessibilité** — mode fort contraste, réduction des animations, taille de police ajustable (14–20 px).
- **Authentification sécurisée** — JWT à courte durée de vie + rotation de refresh tokens.

---

## API Backend

Base URL : `http://localhost:5000/api`

### Authentification

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/auth/register` | Créer un compte |
| POST | `/auth/login` | Se connecter |
| POST | `/auth/refresh` | Rafraîchir le token d'accès |
| POST | `/auth/logout` | Se déconnecter |
| GET | `/auth/me` | Utilisateur courant |

### Utilisateur

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/users/profile` | Profil détaillé |
| PATCH | `/users/preferences` | Modifier thème, langue, accessibilité |
| DELETE | `/users/account` | Supprimer le compte |

### Contenu

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/languages` | Langues disponibles |
| GET | `/words` | Liste de mots (filtres : `language`, `category`, `difficulty`, `limit`, `page`) |
| GET | `/words/:id` | Détail d'un mot |

### Progression & Sessions

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/progress` | Toute la progression de l'utilisateur |
| GET | `/progress/review` | Mots dus à révision (SM-2) |
| POST | `/progress` | Mettre à jour la progression avec SM-2 |
| GET | `/sessions` | Historique des 20 dernières sessions |
| POST | `/sessions` | Enregistrer une nouvelle session |
| GET | `/health` | Vérification d'état du serveur |

---

## Base de données

### Schéma (modèles Prisma)

| Modèle | Description |
|--------|-------------|
| `User` | Compte utilisateur avec langue native, langue cible, thème et préférences d'accessibilité |
| `RefreshToken` | Tokens de rafraîchissement JWT (rotation) |
| `Language` | Langues supportées avec drapeau et indicateur RTL |
| `Category` | 18 catégories de mots avec noms multilingues |
| `Word` | Vocabulaire : traductions, phonétique, URL audio/image, niveau de difficulté |
| `UserProgress` | Suivi SM-2 par mot (ease factor, intervalle, prochaine révision) |
| `LearningSession` | Historique des exercices avec score et durée |

### Énumérations

- **LanguageCode** : `FR`, `EN`, `AR`, `ES`, `RU`
- **Theme** : `LIGHT`, `DARK`, `OCEAN`
- **Difficulty** : `BEGINNER`, `INTERMEDIATE`, `ADVANCED`
- **ExerciseType** : `TRANSLATION`, `MULTIPLE_CHOICE`, `FILL_IN_BLANK`, `LISTENING`

---

## Fichiers de configuration

| Fichier | Description |
|---------|-------------|
| `.env.example` | Modèle de toutes les variables d'environnement requises |
| `docker-compose.yml` | Stack de développement (PostgreSQL + Backend + Frontend + Nginx HTTP) |
| `docker-compose.prod.yml` | Stack de production (ports exposés directement, sans Nginx) |
| `generate-certs.sh` | Génère un certificat SSL auto-signé pour le développement HTTPS |
| `backend/tsconfig.json` | TypeScript strict, alias `@/*` → `./src/*` |
| `backend/prisma/schema.prisma` | Schéma complet de la base de données |
| `backend/prisma/seed.ts` | Peuplement initial des langues, catégories et mots |
| `frontend/next.config.mjs` | En-têtes de sécurité, variables d'environnement, sortie standalone |
| `frontend/tsconfig.json` | TypeScript avec alias `@/*` → `./src/*` |
| `frontend/tailwind.config.ts` | Configuration Tailwind CSS |
| `config/nginx/nginx.dev.conf` | Reverse proxy HTTP — redirige `/api` vers le backend, `/` vers le frontend |
| `config/nginx/nginx.prod.conf` | Reverse proxy HTTPS avec SSL, cache statique et headers de sécurité |

---

## Variables d'environnement

Copier `.env.example` en `.env` et renseigner les valeurs :

```env
# Application
NODE_ENV=development

# Backend
BACKEND_PORT=5000
JWT_SECRET=votre_secret_jwt_tres_long
JWT_REFRESH_SECRET=votre_secret_refresh_tres_long
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost

# Base de données
DATABASE_URL=postgresql://lingua_user:mot_de_passe@postgres:5432/lingua_learn_db
POSTGRES_DB=lingua_learn_db
POSTGRES_USER=lingua_user
POSTGRES_PASSWORD=mot_de_passe

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=LinguaLearn
```

---

## Lancer le projet

### Avec Docker (recommandé)

```bash
# 1. Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos secrets JWT

# 2. Démarrer tous les services
docker-compose up --build

# 3. Initialiser la base de données (première fois)
docker-compose exec backend npm run prisma:generate
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:seed

# Accès
# Application : http://localhost
# API :         http://localhost/api
# PostgreSQL :  localhost:5432
```

### Sans Docker (développement local)

```bash
# Base de données (via Docker uniquement)
docker run -d --name postgres \
  -e POSTGRES_DB=lingua_learn_db \
  -e POSTGRES_USER=lingua_user \
  -e POSTGRES_PASSWORD=change_me \
  -p 5432:5432 \
  postgres:16-alpine

# Backend (terminal 1)
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev              # Hot-reload sur http://localhost:5000

# Frontend (terminal 2)
cd frontend
npm install
npm run dev              # Turbopack sur http://localhost:3000
```

### Scripts disponibles

**Backend**

| Commande | Description |
|----------|-------------|
| `npm run dev` | Développement avec rechargement automatique |
| `npm run build` | Compilation TypeScript |
| `npm start` | Démarrer en production |
| `npm run prisma:generate` | Générer le client Prisma |
| `npm run prisma:migrate` | Appliquer les migrations |
| `npm run prisma:seed` | Peupler la base de données |
| `npm run prisma:studio` | Interface Prisma GUI (port 5555) |
| `npm run type-check` | Vérification TypeScript |

**Frontend**

| Commande | Description |
|----------|-------------|
| `npm run dev` | Développement avec Turbopack |
| `npm run build` | Build de production |
| `npm start` | Démarrer le serveur de production |
| `npm run type-check` | Vérification TypeScript |

---

## Tests

### Modifications apportées au code pour les tests

| Fichier | Modification |
|---------|-------------|
| `backend/src/utils/sm2.ts` | Logique SM-2 extraite dans un utilitaire pur (plus testable) |
| `backend/src/routes/progress.routes.ts` | Utilise maintenant `computeSm2()` au lieu d'inline |
| `backend/src/index.ts` | `app.listen()` et le rate limiter désactivés en mode `test` |

### Fichiers de configuration Jest

| Fichier | Description |
|---------|-------------|
| `backend/jest.config.ts` | Preset ts-jest, résolution des alias `@/*`, setup files |
| `backend/tsconfig.test.json` | Étend le tsconfig principal, relâche `noUnusedLocals` |
| `backend/package.json` | Scripts `test`, `test:watch`, `test:coverage` + nouvelles devDependencies |

### Tests unitaires (42 tests)

| Fichier | Ce qui est testé |
|---------|-----------------|
| `jwt.service.test.ts` | Génération, vérification, expiration des tokens JWT |
| `auth.service.test.ts` | `register`, `login`, `refresh`, `logout` avec Prisma mocké |
| `sm2.test.ts` | Algorithme SM-2 : calculs, plancher 1.3, dates |
| `error.middleware.test.ts` | `AppError`, erreur Prisma P2002, erreur inconnue |

### Tests d'intégration (25 tests, stack HTTP complète avec Supertest)

| Fichier | Ce qui est testé |
|---------|-----------------|
| `auth.test.ts` | Register, login, refresh, logout, `/me` — validations + middlewares |
| `progress.test.ts` | `GET /progress`, `GET /review`, `POST /progress` SM-2 — validations + auth |

### Lancer les tests (via Docker)

```bash
# Lancer tous les tests
docker run --rm -v "$(pwd)/backend:/app" -w /app node:20-alpine npx jest

# Lancer avec rapport de couverture
docker run --rm -v "$(pwd)/backend:/app" -w /app node:20-alpine npx jest --coverage
```
