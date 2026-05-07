import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar, AdminMobileNav } from '@/components/admin/AdminSidebar'
import type { ProfileRow } from '@/types/supabase'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin Panel' },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectTo=/admin')

  const { data: profileData } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()
  const profile = profileData as ProfileRow | null
  if (!profile) redirect('/auth/login')

  // Strict admin-only — trainer role does NOT grant access here
  if (profile.role !== 'admin') redirect('/dashboard')

  return (
    <div className="flex h-dvh bg-[var(--color-brand-black)] overflow-hidden">
      <AdminSidebar profile={profile} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="sticky top-0 z-30 h-14 flex items-center gap-3 px-4 sm:px-6 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-black)]/90 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/25">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" aria-hidden="true" />
            <span className="text-xs font-[var(--font-sans)] font-bold text-red-400 uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
          <span className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] hidden sm:block">
            Full system access · {profile.full_name ?? profile.email}
          </span>
        </header>
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
      <AdminMobileNav />
    </div>
  )
}
