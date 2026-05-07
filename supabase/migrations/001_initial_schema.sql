-- ============================================================
-- MELIOR FITNESS — Initial Schema
-- Migration: 001_initial_schema.sql
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role       AS ENUM ('user', 'trainer', 'admin');
CREATE TYPE plan_category   AS ENUM ('fat_loss', 'muscle_gain', 'vegetarian', 'keto', 'beginner', 'advanced');
CREATE TYPE coaching_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
CREATE TYPE payment_status  AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE activity_level  AS ENUM ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'super_active');
CREATE TYPE fitness_goal    AS ENUM ('fat_loss', 'muscle_gain', 'body_recomposition', 'general_fitness', 'athletic_performance');
CREATE TYPE diet_preference AS ENUM ('non_vegetarian', 'vegetarian', 'vegan', 'keto', 'no_preference');

-- ============================================================
-- TABLE: profiles
-- Extends auth.users (1:1). Created automatically on signup.
-- ============================================================

CREATE TABLE profiles (
  id                    UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 TEXT        NOT NULL,
  full_name             TEXT,
  avatar_url            TEXT,
  role                  user_role   NOT NULL DEFAULT 'user',
  phone                 TEXT,
  age                   SMALLINT    CHECK (age BETWEEN 10 AND 120),
  weight_kg             NUMERIC(5,2) CHECK (weight_kg > 0),
  height_cm             NUMERIC(5,2) CHECK (height_cm > 0),
  fitness_goal          fitness_goal,
  diet_preference       diet_preference,
  activity_level        activity_level,
  onboarding_completed  BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: trainers
-- Trainer-specific data. Linked 1:1 to a profile with role='trainer'.
-- ============================================================

CREATE TABLE trainers (
  id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID        NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  slug              TEXT        NOT NULL UNIQUE,
  title             TEXT        NOT NULL,
  bio               TEXT        NOT NULL,
  specialization    TEXT        NOT NULL,
  experience_years  SMALLINT    NOT NULL CHECK (experience_years >= 0),
  clients_helped    INTEGER     NOT NULL DEFAULT 0 CHECK (clients_helped >= 0),
  certifications    TEXT[]      NOT NULL DEFAULT '{}',
  achievements      TEXT[]      NOT NULL DEFAULT '{}',
  whatsapp          TEXT,
  instagram_url     TEXT,
  is_active         BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: diet_plans
-- Products available in the marketplace.
-- Price stored in INR rupees (integer). Convert to paise for Stripe.
-- ============================================================

CREATE TABLE diet_plans (
  id                UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id        UUID          NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  title             TEXT          NOT NULL,
  slug              TEXT          NOT NULL UNIQUE,
  description       TEXT          NOT NULL,
  category          plan_category NOT NULL,
  price             INTEGER       NOT NULL CHECK (price > 0),         -- INR rupees
  original_price    INTEGER       CHECK (original_price > 0),        -- for showing discount
  duration_weeks    SMALLINT      NOT NULL CHECK (duration_weeks > 0),
  meals_per_day     SMALLINT      NOT NULL CHECK (meals_per_day BETWEEN 1 AND 10),
  calories_range    TEXT          NOT NULL,  -- e.g. "1600-2000 kcal"
  features          TEXT[]        NOT NULL DEFAULT '{}',
  is_published      BOOLEAN       NOT NULL DEFAULT FALSE,
  is_popular        BOOLEAN       NOT NULL DEFAULT FALSE,
  thumbnail_url     TEXT,
  stripe_price_id   TEXT,                                            -- Stripe Price ID (price_xxx)
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT price_discount_check CHECK (original_price IS NULL OR original_price > price)
);

-- ============================================================
-- TABLE: purchases
-- Payment records. Only written by Stripe webhook (service role).
-- ============================================================

CREATE TABLE purchases (
  id                        UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                   UUID           NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  plan_id                   UUID           NOT NULL REFERENCES diet_plans(id) ON DELETE RESTRICT,
  stripe_payment_intent_id  TEXT           UNIQUE,
  stripe_session_id         TEXT           UNIQUE,
  amount                    INTEGER        NOT NULL CHECK (amount > 0), -- INR rupees
  currency                  TEXT           NOT NULL DEFAULT 'INR',
  status                    payment_status NOT NULL DEFAULT 'pending',
  created_at                TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  -- Prevent duplicate pending purchases for same user+plan
  CONSTRAINT unique_user_plan UNIQUE (user_id, plan_id)
);

-- ============================================================
-- TABLE: coaching_requests
-- User-to-trainer coaching enquiry + relationship management.
-- ============================================================

CREATE TABLE coaching_requests (
  id           UUID             PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID             NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trainer_id   UUID             NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  message      TEXT             NOT NULL CHECK (char_length(message) BETWEEN 10 AND 2000),
  goal         TEXT             NOT NULL,
  status       coaching_status  NOT NULL DEFAULT 'pending',
  trainer_note TEXT,            -- Trainer's internal notes
  created_at   TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: testimonials
-- Published client testimonials shown on landing page.
-- ============================================================

CREATE TABLE testimonials (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID        REFERENCES profiles(id) ON DELETE SET NULL, -- nullable: can be anonymous
  trainer_id    UUID        NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  display_name  TEXT        NOT NULL,   -- Name shown publicly (may differ from profile)
  location      TEXT,
  quote         TEXT        NOT NULL CHECK (char_length(quote) BETWEEN 20 AND 1000),
  before_weight TEXT,
  after_weight  TEXT,
  weight_lost   TEXT,
  duration      TEXT,
  rating        SMALLINT    NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_published  BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: transformations
-- Before/after photo pairs shown in the results section.
-- ============================================================

CREATE TABLE transformations (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  trainer_id       UUID        NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  display_name     TEXT        NOT NULL,
  before_image_url TEXT        NOT NULL,
  after_image_url  TEXT        NOT NULL,
  duration_weeks   SMALLINT    CHECK (duration_weeks > 0),
  weight_lost_kg   NUMERIC(4,1),
  description      TEXT,
  is_published     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES — for common query patterns
-- ============================================================

CREATE INDEX idx_profiles_role            ON profiles(role);
CREATE INDEX idx_diet_plans_trainer       ON diet_plans(trainer_id);
CREATE INDEX idx_diet_plans_category      ON diet_plans(category);
CREATE INDEX idx_diet_plans_published     ON diet_plans(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_purchases_user           ON purchases(user_id);
CREATE INDEX idx_purchases_plan           ON purchases(plan_id);
CREATE INDEX idx_purchases_status         ON purchases(status);
CREATE INDEX idx_coaching_user            ON coaching_requests(user_id);
CREATE INDEX idx_coaching_trainer         ON coaching_requests(trainer_id);
CREATE INDEX idx_coaching_status          ON coaching_requests(status);
CREATE INDEX idx_testimonials_trainer     ON testimonials(trainer_id);
CREATE INDEX idx_testimonials_published   ON testimonials(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_transformations_trainer  ON transformations(trainer_id);
CREATE INDEX idx_transformations_pub      ON transformations(is_published) WHERE is_published = TRUE;

-- ============================================================
-- TRIGGER: auto-update updated_at timestamp
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_trainers_updated_at
  BEFORE UPDATE ON trainers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_diet_plans_updated_at
  BEFORE UPDATE ON diet_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_coaching_updated_at
  BEFORE UPDATE ON coaching_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER: auto-create profile on auth.users INSERT
-- Fires when a new user signs up via Supabase Auth.
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- FUNCTION: check if current user has purchased a plan
-- Used in RLS and application logic.
-- ============================================================

CREATE OR REPLACE FUNCTION user_has_purchased(plan_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM purchases
    WHERE user_id = auth.uid()
      AND plan_id = plan_uuid
      AND status = 'paid'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- FUNCTION: get current user role
-- ============================================================

CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
BEGIN
  RETURN (
    SELECT role FROM profiles WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- FUNCTION: is current user a trainer or admin
-- ============================================================

CREATE OR REPLACE FUNCTION is_trainer_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role IN ('trainer', 'admin') FROM profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
