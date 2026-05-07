-- ============================================================
-- MELIOR FITNESS — Row Level Security Policies
-- Migration: 002_rls_policies.sql
-- Run AFTER: 001_initial_schema.sql
-- ============================================================

-- ============================================================
-- Enable RLS on all tables
-- ============================================================

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_plans        ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases         ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials      ENABLE ROW LEVEL SECURITY;
ALTER TABLE transformations   ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES policies
-- ============================================================

-- Anyone authenticated can read their own profile
CREATE POLICY "profiles: users read own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Trainers and admins can read all profiles
CREATE POLICY "profiles: trainers read all"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('trainer', 'admin')
    )
  );

-- Users can only update their own profile
-- Role escalation is blocked (cannot promote self to trainer/admin)
CREATE POLICY "profiles: users update own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())  -- role unchanged
  );

-- Admins can update any profile (including role changes)
CREATE POLICY "profiles: admins update any"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Profile INSERT is handled by the handle_new_user() trigger (SECURITY DEFINER)
-- No direct INSERT policy needed — prevents manual row injection

-- ============================================================
-- TRAINERS policies
-- ============================================================

-- Public: anyone can read active trainer profiles
CREATE POLICY "trainers: public read active"
  ON trainers FOR SELECT
  USING (is_active = TRUE);

-- Admins can read all trainers (including inactive)
CREATE POLICY "trainers: admins read all"
  ON trainers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Trainers can update their own record
CREATE POLICY "trainers: own update"
  ON trainers FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Only admins can insert/delete trainer records
CREATE POLICY "trainers: admin insert"
  ON trainers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "trainers: admin delete"
  ON trainers FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================
-- DIET_PLANS policies
-- ============================================================

-- Public: anyone can read published plans
CREATE POLICY "diet_plans: public read published"
  ON diet_plans FOR SELECT
  USING (is_published = TRUE);

-- Trainers can read their own unpublished plans
CREATE POLICY "diet_plans: trainer read own"
  ON diet_plans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trainers t
      WHERE t.id = diet_plans.trainer_id
        AND t.user_id = auth.uid()
    )
  );

-- Admins can read all plans
CREATE POLICY "diet_plans: admin read all"
  ON diet_plans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Trainers can insert their own plans
CREATE POLICY "diet_plans: trainer insert"
  ON diet_plans FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trainers t
      WHERE t.id = diet_plans.trainer_id
        AND t.user_id = auth.uid()
    )
  );

-- Trainers can update their own plans
CREATE POLICY "diet_plans: trainer update own"
  ON diet_plans FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trainers t
      WHERE t.id = diet_plans.trainer_id
        AND t.user_id = auth.uid()
    )
  );

-- Admins can update any plan
CREATE POLICY "diet_plans: admin update"
  ON diet_plans FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Only admins can delete plans (data integrity)
CREATE POLICY "diet_plans: admin delete"
  ON diet_plans FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================
-- PURCHASES policies
-- ============================================================

-- Users can see their own purchases
CREATE POLICY "purchases: users read own"
  ON purchases FOR SELECT
  USING (user_id = auth.uid());

-- Trainers can see purchases of their plans
CREATE POLICY "purchases: trainers read plan sales"
  ON purchases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM diet_plans dp
      JOIN trainers t ON t.id = dp.trainer_id
      WHERE dp.id = purchases.plan_id
        AND t.user_id = auth.uid()
    )
  );

-- Admins can see all purchases
CREATE POLICY "purchases: admin read all"
  ON purchases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- CRITICAL: No direct INSERT/UPDATE from client
-- All purchase writes go through the service role (Stripe webhook)
-- This prevents payment bypass attacks

-- ============================================================
-- COACHING_REQUESTS policies
-- ============================================================

-- Users can see their own requests
CREATE POLICY "coaching: users read own"
  ON coaching_requests FOR SELECT
  USING (user_id = auth.uid());

-- Trainers can see requests assigned to them
CREATE POLICY "coaching: trainers read assigned"
  ON coaching_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trainers t
      WHERE t.id = coaching_requests.trainer_id
        AND t.user_id = auth.uid()
    )
  );

-- Admins can see all requests
CREATE POLICY "coaching: admin read all"
  ON coaching_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Authenticated users can submit new coaching requests
CREATE POLICY "coaching: users insert"
  ON coaching_requests FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND auth.uid() IS NOT NULL
  );

-- Users can cancel their own pending requests
CREATE POLICY "coaching: users cancel own"
  ON coaching_requests FOR UPDATE
  USING (user_id = auth.uid() AND status = 'pending')
  WITH CHECK (
    user_id = auth.uid()
    AND status = 'cancelled'  -- users can only set to cancelled
  );

-- Trainers can update status and add notes to their requests
CREATE POLICY "coaching: trainers update assigned"
  ON coaching_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trainers t
      WHERE t.id = coaching_requests.trainer_id
        AND t.user_id = auth.uid()
    )
  );

-- Admins full update access
CREATE POLICY "coaching: admin update"
  ON coaching_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================
-- TESTIMONIALS policies
-- ============================================================

-- Public: anyone can read published testimonials
CREATE POLICY "testimonials: public read published"
  ON testimonials FOR SELECT
  USING (is_published = TRUE);

-- Admins can read all (including unpublished)
CREATE POLICY "testimonials: admin read all"
  ON testimonials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Only admins can write testimonials (moderated content)
CREATE POLICY "testimonials: admin insert"
  ON testimonials FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "testimonials: admin update"
  ON testimonials FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "testimonials: admin delete"
  ON testimonials FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================
-- TRANSFORMATIONS policies
-- ============================================================

-- Public: anyone can read published transformations
CREATE POLICY "transformations: public read published"
  ON transformations FOR SELECT
  USING (is_published = TRUE);

-- Admins can read all
CREATE POLICY "transformations: admin read all"
  ON transformations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Only admins can write (user consent required before publishing)
CREATE POLICY "transformations: admin insert"
  ON transformations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "transformations: admin update"
  ON transformations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "transformations: admin delete"
  ON transformations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
