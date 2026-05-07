import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar, MobileBottomNav } from '@/components/dashboard/DashboardSidebar'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import type { ProfileRow } from '@/types/supabase'

export const metadata: Metadata = {
  title: { default: 'Dashboard', template: '%s | Melior Dashboard' },
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // 1. Auth guard
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectTo=/dashboard')

  // 2. Fetch profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = profileData as ProfileRow | null
  if (!profile) redirect('/auth/login')

  // 3. Redirect to onboarding if not completed
  if (!profile.onboarding_completed) redirect('/onboarding')

  return (
    <div className="flex h-dvh bg-[var(--color-brand-black)] overflow-hidden">
      {/* Sidebar — desktop only */}
      <DashboardSidebar profile={profile} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader profile={profile} />

        <main
          className="flex-1 overflow-y-auto pb-24 lg:pb-8"
          id="dashboard-content"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <MobileBottomNav />
    </div>
  )
}
