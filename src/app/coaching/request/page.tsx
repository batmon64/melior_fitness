import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { CoachingRequestShell } from '@/components/coaching/CoachingRequestShell'
import type { ProfileRow } from '@/types/supabase'

export const metadata: Metadata = {
  title: 'Request Coaching — Melior Fitness',
}

export default async function CoachingRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ trainer?: string; service?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Must be logged in
  if (!user) redirect('/auth/login?redirectTo=/coaching/request')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('full_name, phone, onboarding_completed')
    .eq('id', user.id)
    .single()

  const profile = profileData as Pick<ProfileRow, 'full_name' | 'phone' | 'onboarding_completed'> | null

  // Redirect to onboarding if not completed
  if (!profile?.onboarding_completed) redirect('/onboarding')

  const { trainer, service } = await searchParams

  return (
    <div className="min-h-dvh bg-[var(--color-brand-black)] relative overflow-hidden">
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 50% -5%, rgba(167,139,250,0.08) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />
      <div className="relative z-10">
        <CoachingRequestShell
          defaultTrainer={trainer ?? ''}
          defaultService={service  ?? ''}
          profilePhone={profile?.phone ?? ''}
          userName={profile?.full_name ?? user.email?.split('@')[0] ?? ''}
        />
      </div>
    </div>
  )
}
