-- ─────────────────────────────────────────────────────────────
-- LINGUA-LEARN — Initialisation PostgreSQL
-- Ce fichier est exécuté automatiquement par Docker au premier
-- démarrage du container postgres (docker-entrypoint-initdb.d)
-- ─────────────────────────────────────────────────────────────

-- Extensions utiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- Génération UUID
CREATE EXTENSION IF NOT EXISTS "unaccent";   -- Recherche sans accents

-- ─────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────

CREATE TYPE language_code AS ENUM ('FR', 'EN', 'AR', 'ES', 'RU');
CREATE TYPE theme AS ENUM ('LIGHT', 'DARK', 'OCEAN');
CREATE TYPE difficulty AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE exercise_type AS ENUM (
  'TRANSLATION',
  'MULTIPLE_CHOICE',
  'FILL_IN_BLANK',
  'LISTENING'
);

-- ─────────────────────────────────────────────
-- UTILISATEURS
-- ─────────────────────────────────────────────

CREATE TABLE users (
  id                UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  email             VARCHAR(255)  NOT NULL UNIQUE,
  username          VARCHAR(50)   NOT NULL UNIQUE,
  password_hash     TEXT          NOT NULL,
  avatar_url        TEXT,

  -- Préférences linguistiques
  native_language   language_code NOT NULL DEFAULT 'FR',
  learning_language language_code NOT NULL DEFAULT 'EN',

  -- Préférences d'affichage
  theme             theme         NOT NULL DEFAULT 'LIGHT',

  -- Accessibilité
  font_size         SMALLINT      NOT NULL DEFAULT 16,
  high_contrast     BOOLEAN       NOT NULL DEFAULT FALSE,
  reduce_motion     BOOLEAN       NOT NULL DEFAULT FALSE,

  -- Timestamps
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  last_login_at     TIMESTAMPTZ
);

-- ─────────────────────────────────────────────
-- TOKENS DE RAFRAÎCHISSEMENT JWT
-- ─────────────────────────────────────────────

CREATE TABLE refresh_tokens (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  token      TEXT        NOT NULL UNIQUE,
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- LANGUES
-- ─────────────────────────────────────────────

CREATE TABLE languages (
  code        language_code PRIMARY KEY,
  name        VARCHAR(50)   NOT NULL,
  native_name VARCHAR(50)   NOT NULL,
  flag_emoji  VARCHAR(10)   NOT NULL,
  rtl         BOOLEAN       NOT NULL DEFAULT FALSE
);

-- Données de base — 5 langues supportées
INSERT INTO languages (code, name, native_name, flag_emoji, rtl) VALUES
  ('FR', 'Français',  'Français',  '🇫🇷', FALSE),
  ('EN', 'Anglais',   'English',   '🇬🇧', FALSE),
  ('AR', 'Arabe',     'العربية',   '🇸🇦', TRUE),
  ('ES', 'Espagnol',  'Español',   '🇪🇸', FALSE),
  ('RU', 'Russe',     'Русский',   '🇷🇺', FALSE);

-- ─────────────────────────────────────────────
-- CATÉGORIES DE MOTS
-- ─────────────────────────────────────────────

CREATE TABLE categories (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        VARCHAR(50) NOT NULL UNIQUE,
  emoji       VARCHAR(10) NOT NULL,
  order_index SMALLINT    NOT NULL,

  -- Noms traduits dans les 5 langues
  name_fr     VARCHAR(100) NOT NULL,
  name_en     VARCHAR(100) NOT NULL,
  name_ar     VARCHAR(100) NOT NULL,
  name_es     VARCHAR(100) NOT NULL,
  name_ru     VARCHAR(100) NOT NULL
);

-- Catégories de base
INSERT INTO categories (slug, emoji, order_index, name_fr, name_en, name_ar, name_es, name_ru) VALUES
  ('greetings',   '👋', 1,  'Salutations',  'Greetings',    'تحيات',       'Saludos',      'Приветствия'),
  ('numbers',     '🔢', 2,  'Chiffres',     'Numbers',      'أرقام',       'Números',      'Числа'),
  ('colors',      '🎨', 3,  'Couleurs',     'Colours',      'ألوان',       'Colores',      'Цвета'),
  ('family',      '👨‍👩‍👧', 4, 'Famille',     'Family',       'عائلة',       'Familia',      'Семья'),
  ('food',        '🍎', 5,  'Nourriture',   'Food',         'طعام',        'Comida',       'Еда'),
  ('animals',     '🐾', 6,  'Animaux',      'Animals',      'حيوانات',     'Animales',     'Животные'),
  ('body',        '🫀', 7,  'Corps humain', 'Human body',   'جسم الإنسان', 'Cuerpo humano','Тело человека'),
  ('travel',      '✈️', 8,  'Voyage',       'Travel',       'سفر',         'Viaje',        'Путешествие'),
  ('school',      '📚', 9,  'École',        'School',       'مدرسة',       'Escuela',      'Школа'),
  ('weather',     '☀️', 10, 'Météo',        'Weather',      'طقس',         'Tiempo',       'Погода');

-- ─────────────────────────────────────────────
-- MOTS / VOCABULAIRE
-- ─────────────────────────────────────────────

CREATE TABLE words (
  id              UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  language_code   language_code NOT NULL REFERENCES languages(code),
  category_id     UUID          NOT NULL REFERENCES categories(id),

  term            VARCHAR(255)  NOT NULL,
  phonetic        VARCHAR(255),
  audio_url       TEXT,
  image_url       TEXT,
  difficulty      difficulty    NOT NULL DEFAULT 'BEGINNER',

  -- Traductions dans les 5 langues
  translation_fr  TEXT          NOT NULL,
  translation_en  TEXT          NOT NULL,
  translation_ar  TEXT          NOT NULL,
  translation_es  TEXT          NOT NULL,
  translation_ru  TEXT          NOT NULL,

  -- Exemples d'utilisation
  example_fr      TEXT,
  example_en      TEXT,
  example_ar      TEXT,
  example_es      TEXT,
  example_ru      TEXT,

  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  UNIQUE (language_code, term)
);

-- ─────────────────────────────────────────────
-- PROGRESSION UTILISATEUR (Spaced Repetition)
-- ─────────────────────────────────────────────

CREATE TABLE user_progress (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word_id         UUID        NOT NULL REFERENCES words(id) ON DELETE CASCADE,

  -- Statistiques
  score           SMALLINT    NOT NULL DEFAULT 0,
  review_count    INT         NOT NULL DEFAULT 0,
  correct_count   INT         NOT NULL DEFAULT 0,
  incorrect_count INT         NOT NULL DEFAULT 0,

  -- Révision espacée (algorithme SM-2)
  ease_factor     FLOAT       NOT NULL DEFAULT 2.5,
  interval        INT         NOT NULL DEFAULT 1,
  next_review_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_id, word_id)
);

-- ─────────────────────────────────────────────
-- SESSIONS D'APPRENTISSAGE
-- ─────────────────────────────────────────────

CREATE TABLE learning_sessions (
  id              UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  language_code   language_code NOT NULL,
  exercise_type   exercise_type NOT NULL,

  total_words     SMALLINT      NOT NULL,
  correct_answers SMALLINT      NOT NULL,
  score           SMALLINT      NOT NULL,
  duration_secs   INT           NOT NULL,

  completed_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- INDEX DE PERFORMANCE
-- ─────────────────────────────────────────────

CREATE INDEX idx_refresh_tokens_user_id      ON refresh_tokens(user_id);
CREATE INDEX idx_words_language_category     ON words(language_code, category_id);
CREATE INDEX idx_words_difficulty            ON words(difficulty);
CREATE INDEX idx_user_progress_user_review   ON user_progress(user_id, next_review_at);
CREATE INDEX idx_learning_sessions_user_date ON learning_sessions(user_id, completed_at);

-- ─────────────────────────────────────────────
-- TRIGGER — updated_at automatique
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
