/**
 * Auth helpers — server-side only.
 * Use these in Server Components and Route Handlers.
 * For client-side auth actions use the browser client directly.
 */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

/** Get the current user. Returns null if not authenticated. */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

/**
 * Require authentication. Redirects to /auth/login if not signed in.
 * Use at the top of protected Server Components.
 *
 * @example
 * const user = await requireAuth()
 */
export async function requireAuth(redirectTo = '/auth/login'): Promise<User> {
  const user = await getUser()
  if (!user) redirect(`${redirectTo}?redirectTo=${encodeURIComponent(redirectTo)}`)
  return user
}

/**
 * Require a specific role. Redirects to /dashboard if role doesn't match.
 * Use in trainer/admin Server Components.
 *
 * @example
 * await requireRole('trainer')
 */
export async function requireRole(
  role: 'trainer' | 'admin',
  fallback = '/dashboard'
): Promise<User> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const profile = profileData as { role: string } | null

  if (!profile || (role === 'trainer' && !['trainer', 'admin'].includes(profile.role))) {
    redirect(fallback)
  }

  if (role === 'admin' && profile.role !== 'admin') {
    redirect(fallback)
  }

  return user
}

/**
 * Sign out the current user.
 * Call from a Server Action or Route Handler.
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
