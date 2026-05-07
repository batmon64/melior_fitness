-- ============================================================
-- MELIOR FITNESS — Storage Buckets & Policies
-- Migration: 003_storage.sql
-- Run AFTER: 002_rls_policies.sql
-- ============================================================

-- ============================================================
-- BUCKET: avatars
-- User profile pictures. Public read, user-restricted write.
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  TRUE,
  2097152,  -- 2 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Public can view all avatars
CREATE POLICY "avatars: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Users can upload/update their own avatar
-- Path convention: avatars/{user_id}/avatar.{ext}
CREATE POLICY "avatars: users upload own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

CREATE POLICY "avatars: users update own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

CREATE POLICY "avatars: users delete own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- ============================================================
-- BUCKET: plan-thumbnails
-- Diet plan cover images. Public read, trainer write.
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'plan-thumbnails',
  'plan-thumbnails',
  TRUE,
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Public can view all plan thumbnails
CREATE POLICY "plan-thumbnails: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'plan-thumbnails');

-- Trainers and admins can upload thumbnails
CREATE POLICY "plan-thumbnails: trainers upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'plan-thumbnails'
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('trainer', 'admin')
    )
  );

CREATE POLICY "plan-thumbnails: trainers update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'plan-thumbnails'
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('trainer', 'admin')
    )
  );

CREATE POLICY "plan-thumbnails: admin delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'plan-thumbnails'
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================
-- BUCKET: transformations
-- Before/after photos. Public read, admin write.
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'transformations',
  'transformations',
  TRUE,
  10485760,  -- 10 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "transformations: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'transformations');

CREATE POLICY "transformations: admin write"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'transformations'
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "transformations: admin update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'transformations'
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "transformations: admin delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'transformations'
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================
-- BUCKET: plan-documents
-- PDF diet plan files. PRIVATE — only purchasers can access.
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'plan-documents',
  'plan-documents',
  FALSE,   -- PRIVATE bucket
  52428800, -- 50 MB
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Only users who have paid for the plan can download
-- Path convention: plan-documents/{plan_id}/{filename}.pdf
CREATE POLICY "plan-documents: purchasers read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'plan-documents'
    AND auth.uid() IS NOT NULL
    AND (
      -- Check user has a paid purchase for this plan
      EXISTS (
        SELECT 1 FROM purchases pu
        WHERE pu.user_id = auth.uid()
          AND pu.plan_id = (storage.foldername(name))[1]::UUID
          AND pu.status = 'paid'
      )
      OR
      -- Trainers and admins always have access
      EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
          AND p.role IN ('trainer', 'admin')
      )
    )
  );

-- Only trainers/admins can upload plan documents
CREATE POLICY "plan-documents: trainers upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'plan-documents'
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('trainer', 'admin')
    )
  );

CREATE POLICY "plan-documents: admin delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'plan-documents'
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
