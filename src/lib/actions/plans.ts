'use server'

import { createClient } from '@/lib/supabase/server'

// ── Return type ───────────────────────────────────────────────────────────────

export type DownloadStatus =
  | 'unauthenticated'   // user not logged in
  | 'not_purchased'     // plan exists but user hasn't paid
  | 'no_plan'           // plan not yet in Supabase (still static-only)
  | 'no_document'       // plan in DB but PDF not uploaded yet
  | 'success'           // signed URL ready
  | 'error'             // storage / DB error

export interface DownloadResult {
  status: DownloadStatus
  url?: string
  filename?: string
  error?: string
}

/**
 * Generates a secure signed download URL for a plan PDF.
 *
 * Security chain:
 *   1. User must be authenticated
 *   2. Plan must exist in diet_plans table (has a UUID)
 *   3. A paid purchase must exist linking user_id → plan_id
 *   4. Plan must have a document_path set
 *   5. Signed URL is generated server-side (never expose service role client-side)
 *   6. URL expires in 1 hour — each download requires a fresh server request
 *
 * Storage path convention:
 *   plan-documents/{plan_uuid}/{filename}.pdf
 */
export async function getDownloadUrl(slug: string): Promise<DownloadResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Must be authenticated
  if (!user) return { status: 'unauthenticated' }

  // 2. Find the plan in Supabase by slug
  const { data: planData } = await (supabase
    .from('diet_plans') as ReturnType<typeof supabase.from>)
    .select('id, document_path, title')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  const plan = planData as { id: string; document_path: string | null; title: string } | null

  if (!plan) return { status: 'no_plan' }

  // 3. Verify a paid purchase exists for this user + plan
  const { count } = await supabase
    .from('purchases')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('plan_id', plan.id)
    .eq('status', 'paid')

  if (!count || count === 0) return { status: 'not_purchased' }

  // 4. Plan must have a PDF uploaded
  if (!plan.document_path) return { status: 'no_document' }

  // 5. Generate a short-lived signed URL (1 hour)
  //    The download: true flag forces browser to download rather than preview
  const { data: signedData, error } = await supabase.storage
    .from('plan-documents')
    .createSignedUrl(plan.document_path, 3600, { download: true })

  if (error || !signedData?.signedUrl) {
    console.error('[getDownloadUrl]', error?.message)
    return { status: 'error', error: error?.message ?? 'Failed to generate download link' }
  }

  // Extract filename from path for the download attribute
  const filename = plan.document_path.split('/').pop() ?? `${slug}.pdf`

  return {
    status: 'success',
    url: signedData.signedUrl,
    filename,
  }
}

/**
 * Check if the current user has purchased a plan.
 * Lightweight — only returns a boolean. Used to decide which UI to show.
 */
export async function checkPurchaseStatus(slug: string): Promise<{
  isAuthenticated: boolean
  isPurchased: boolean
  hasPdf: boolean
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { isAuthenticated: false, isPurchased: false, hasPdf: false }

  // Find plan in Supabase
  const { data: planData } = await (supabase
    .from('diet_plans') as ReturnType<typeof supabase.from>)
    .select('id, document_path')
    .eq('slug', slug)
    .single()

  const plan = planData as { id: string; document_path: string | null } | null

  if (!plan) return { isAuthenticated: true, isPurchased: false, hasPdf: false }

  const { count } = await supabase
    .from('purchases')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('plan_id', plan.id)
    .eq('status', 'paid')

  return {
    isAuthenticated: true,
    isPurchased: (count ?? 0) > 0,
    hasPdf: !!plan.document_path,
  }
}
