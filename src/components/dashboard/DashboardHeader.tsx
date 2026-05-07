'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, Menu, X, Bell } from 'lucide-react'
import { useState } from 'react'
import { cn, getInitials } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { ProfileRow } from '@/types/supabase'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':          'Overview',
  '/dashboard/plans':    'My Plans',
  '/dashboard/coaching': 'Coaching',
  '/dashboard/progress': 'Progress',
  '/dashboard/settings': 'Settings',
}

export function DashboardHeader({ profile }: { profile: ProfileRow }) {
  const pathname = usePathname()
  const router   = useRouter()
  const title    = PAGE_TITLES[pathname] ?? 'Dashboard'

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-black)]/90 backdrop-blur-xl">
      {/* Page title */}
      <h1 className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-brand-cream)]">
        {title}
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* User chip (desktop) */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[rgba(202,138,4,0.2)] flex items-center justify-center">
            <span className="text-xs font-[var(--font-heading)] font-bold text-[var(--color-brand-gold)]">
              {getInitials(profile.full_name ?? profile.email)}
            </span>
          </div>
          <span className="text-sm font-[var(--font-sans)] text-[var(--color-brand-muted)]">
            {profile.full_name?.split(' ')[0] ?? 'Account'}
          </span>
        </div>

        <button
          onClick={handleSignOut}
          className="p-2 rounded-lg text-[var(--color-brand-muted)] hover:text-red-400 hover:bg-[rgba(239,68,68,0.06)] transition-all cursor-pointer"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
