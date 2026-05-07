import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { TrainerSidebar, TrainerMobileNav } from '@/components/trainer-dashboard/TrainerSidebar'
import type { ProfileRow } from '@/types/supabase'

export const metadata: Metadata = {
  title: { default: 'Trainer Dashboard', template: '%s | Trainer Dashboard' },
}

export default async function TrainerDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // 1. Auth guard
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectTo=/trainer-dashboard')

  // 2. Fetch profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = profileData as ProfileRow | null
  if (!profile) redirect('/auth/login')

  // 3. Role guard — only trainer or admin
  if (profile.role !== 'trainer' && profile.role !== 'admin') {
    redirect('/dashboard')
  }

  // 4. Count pending coaching requests for badge (by trainer_slug if no DB trainer record)
  const { data: trainerData } = await (supabase
    .from('trainers') as ReturnType<typeof supabase.from>)
    .select('id')
    .eq('user_id', user.id)
    .single()

  const dbTrainer = trainerData as { id: string } | null

  let pendingCount = 0

  if (dbTrainer) {
    const { count } = await supabase
      .from('coaching_requests')
      .select('id', { count: 'exact', head: true })
      .eq('trainer_id', dbTrainer.id)
      .eq('status', 'pending')
    pendingCount = count ?? 0
  } else {
    // Fallback: match by trainer_slug (new column)
    const trainerName = profile.full_name?.toLowerCase() ?? ''
    if (trainerName) {
      const { count } = await (supabase
        .from('coaching_requests') as ReturnType<typeof supabase.from>)
        .select('id', { count: 'exact', head: true })
        .eq('trainer_slug', trainerName.includes('vishal') ? 'vishal' : 'sharon')
        .eq('status', 'pending')
      pendingCount = count ?? 0
    }
  }

  return (
    <div className="flex h-dvh bg-[var(--color-brand-black)] overflow-hidden">
      <TrainerSidebar profile={profile} pendingCount={pendingCount} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-black)]/90 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-[var(--font-sans)] font-bold tracking-wider uppercase border"
              style={{
                background: 'rgba(202,138,4,0.1)',
                color: 'var(--color-brand-gold)',
                borderColor: 'rgba(202,138,4,0.25)',
              }}
            >
              Trainer Portal
            </span>
            <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] hidden sm:block">
              Welcome, {profile.full_name?.split(' ')[0] ?? 'Coach'}
            </p>
          </div>
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[rgba(202,138,4,0.1)] border border-[rgba(202,138,4,0.25)]">
              <div className="w-2 h-2 rounded-full bg-[var(--color-brand-gold)] animate-pulse" aria-hidden="true" />
              <span className="text-xs font-[var(--font-sans)] font-semibold text-[var(--color-brand-gold)]">
                {pendingCount} new request{pendingCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
      <TrainerMobileNav />
    </div>
  )
}
