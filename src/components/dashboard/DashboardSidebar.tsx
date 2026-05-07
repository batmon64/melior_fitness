'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, MessageSquare, TrendingUp,
  Settings, ShoppingBag, Users, LogOut, ChevronRight, Dumbbell,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { ProfileRow } from '@/types/supabase'

const NAV = [
  { href: '/dashboard',          icon: LayoutDashboard,  label: 'Overview' },
  { href: '/dashboard/plans',    icon: BookOpen,          label: 'My Plans' },
  { href: '/dashboard/coaching', icon: MessageSquare,     label: 'Coaching' },
  { href: '/dashboard/progress', icon: TrendingUp,        label: 'Progress' },
  { href: '/dashboard/settings', icon: Settings,          label: 'Settings' },
]

const EXTERNAL = [
  { href: '/plans',            icon: ShoppingBag, label: 'Browse Plans' },
  { href: '/coaching/request', icon: Dumbbell,    label: 'Request Coaching' },
  { href: '/#trainers',        icon: Users,       label: 'Our Trainers' },
]

interface DashboardSidebarProps {
  profile: ProfileRow
}

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside
      className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-[var(--color-brand-border)] bg-[var(--color-brand-dark)]"
      aria-label="Dashboard navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-[var(--color-brand-border)]">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-gold)] flex items-center justify-center shrink-0">
          <span className="font-[var(--font-heading)] font-bold text-[var(--color-brand-black)] text-sm">M</span>
        </div>
        <span className="font-[var(--font-heading)] font-semibold text-[var(--color-brand-cream)] text-base tracking-wide">
          Melior
        </span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Main">
        {NAV.map(({ href, icon: Icon, label }) => {
          const isActive = href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-[var(--font-sans)] font-medium transition-all duration-150 cursor-pointer group',
                isActive
                  ? 'bg-[rgba(202,138,4,0.12)] text-[var(--color-brand-gold)]'
                  : 'text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] hover:bg-[rgba(255,255,255,0.04)]'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" aria-hidden="true" />
              {label}
              {isActive && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--color-brand-gold)' }}
                  aria-hidden="true"
                />
              )}
            </Link>
          )
        })}

        {/* Divider */}
        <div className="h-px bg-[var(--color-brand-border)] my-3 mx-1" aria-hidden="true" />

        {/* External links */}
        {EXTERNAL.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-[var(--font-sans)] font-medium text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] hover:bg-[rgba(255,255,255,0.04)] transition-all duration-150 cursor-pointer group"
          >
            <Icon className="w-4.5 h-4.5 shrink-0" aria-hidden="true" />
            {label}
            <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-40 transition-opacity" aria-hidden="true" />
          </Link>
        ))}
      </nav>

      {/* User profile + sign out */}
      <div className="px-3 pb-4 border-t border-[var(--color-brand-border)] pt-3">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[rgba(255,255,255,0.04)] transition-all cursor-pointer group mb-1"
        >
          <div className="w-8 h-8 rounded-full bg-[rgba(202,138,4,0.2)] flex items-center justify-center shrink-0">
            <span className="text-xs font-[var(--font-heading)] font-bold text-[var(--color-brand-gold)]">
              {getInitials(profile.full_name ?? profile.email)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[var(--color-brand-cream)] font-[var(--font-sans)] truncate">
              {profile.full_name ?? 'My Account'}
            </p>
            <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] truncate">
              {profile.email}
            </p>
          </div>
        </Link>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-[var(--font-sans)] font-medium text-[var(--color-brand-muted)] hover:text-red-400 hover:bg-[rgba(239,68,68,0.06)] transition-all duration-150 cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

/* ── Mobile bottom navigation ──────────────────────────────────────────────── */

export function MobileBottomNav() {
  const pathname = usePathname()

  const MOBILE_NAV = NAV.slice(0, 5)

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-brand-dark)]/95 backdrop-blur-xl border-t border-[var(--color-brand-border)]"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {MOBILE_NAV.map(({ href, icon: Icon, label }) => {
          const isActive = href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-150 cursor-pointer min-w-[52px]',
                isActive
                  ? 'text-[var(--color-brand-gold)]'
                  : 'text-[var(--color-brand-muted)]'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="text-[10px] font-[var(--font-sans)] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
