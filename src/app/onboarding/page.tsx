import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingShell } from '@/components/onboarding/OnboardingShell'

/**
 * Onboarding page — Server Component.
 * Guards auth, checks if already onboarded, passes profile to shell.
 */
export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Unauthenticated → login
  if (!user) redirect('/auth/login?redirectTo=/onboarding')

  // Fetch profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('full_name, onboarding_completed')
    .eq('id', user.id)
    .single()

  const profile = profileData as { full_name: string | null; onboarding_completed: boolean } | null

  // Already completed → dashboard
  if (profile?.onboarding_completed) redirect('/dashboard')

  return (
    <OnboardingShell
      userId={user.id}
      userName={profile?.full_name ?? user.email?.split('@')[0] ?? 'there'}
    />
  )
}
