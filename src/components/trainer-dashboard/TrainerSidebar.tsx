'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, MessageSquare, Users, BookOpen,
  BarChart2, Settings, LogOut, ChevronRight, Bell, ShoppingBag,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { ProfileRow } from '@/types/supabase'

const NAV = [
  { href: '/trainer-dashboard',          icon: LayoutDashboard, label: 'Overview' },
  { href: '/trainer-dashboard/requests', icon: MessageSquare,   label: 'Coaching Requests' },
  { href: '/trainer-dashboard/clients',  icon: Users,           label: 'Clients' },
  { href: '/trainer-dashboard/plans',    icon: BookOpen,        label: 'My Plans' },
  { href: '/trainer-dashboard/revenue',  icon: BarChart2,       label: 'Revenue' },
]

interface TrainerSidebarProps {
  profile: ProfileRow
  pendingCount?: number
}

export function TrainerSidebar({ profile, pendingCount = 0 }: TrainerSidebarProps) {
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
      aria-label="Trainer dashboard navigation"
    >
      {/* Logo + role badge */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-brand-border)]">
        <Link href="/trainer-dashboard" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-gold)] flex items-center justify-center shrink-0">
            <span className="font-[var(--font-heading)] font-bold text-[var(--color-brand-black)] text-sm">M</span>
          </div>
          <span className="font-[var(--font-heading)] font-semibold text-[var(--color-brand-cream)] text-base tracking-wide">
            Melior
          </span>
        </Link>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-[var(--font-sans)] font-bold tracking-wider uppercase bg-[rgba(202,138,4,0.15)] text-[var(--color-brand-gold)] border border-[rgba(202,138,4,0.3)]">
          Trainer
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const isActive = href === '/trainer-dashboard'
            ? pathname === '/trainer-dashboard'
            : pathname.startsWith(href)
          const showBadge = label === 'Coaching Requests' && pendingCount > 0

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-[var(--font-sans)] font-medium transition-all duration-150 cursor-pointer',
                isActive
                  ? 'bg-[rgba(202,138,4,0.12)] text-[var(--color-brand-gold)]'
                  : 'text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] hover:bg-[rgba(255,255,255,0.04)]'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="flex-1">{label}</span>
              {showBadge && (
                <span className="w-5 h-5 rounded-full bg-[var(--color-brand-gold)] text-[var(--color-brand-black)] text-[10px] font-bold flex items-center justify-center">
                  {pendingCount > 9 ? '9+' : pendingCount}
                </span>
              )}
              {isActive && !showBadge && (
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-gold)]" aria-hidden="true" />
              )}
            </Link>
          )
        })}

        {/* Divider */}
        <div className="h-px bg-[var(--color-brand-border)] my-3 mx-1" aria-hidden="true" />

        {/* Quick links */}
        {[
          { href: '/plans',    icon: ShoppingBag, label: 'View Marketplace' },
          { href: '/dashboard', icon: Settings,    label: 'User Dashboard' },
        ].map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-[var(--font-sans)] font-medium text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] hover:bg-[rgba(255,255,255,0.04)] transition-all duration-150 cursor-pointer group"
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
            {label}
            <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-40 transition-opacity" aria-hidden="true" />
          </Link>
        ))}
      </nav>

      {/* User + sign out */}
      <div className="px-3 pb-4 border-t border-[var(--color-brand-border)] pt-3">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-[rgba(202,138,4,0.2)] flex items-center justify-center shrink-0">
            <span className="text-xs font-[var(--font-heading)] font-bold text-[var(--color-brand-gold)]">
              {getInitials(profile.full_name ?? profile.email)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--color-brand-cream)] font-[var(--font-sans)] truncate">
              {profile.full_name ?? 'Trainer'}
            </p>
            <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] truncate">
              {profile.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-[var(--font-sans)] font-medium text-[var(--color-brand-muted)] hover:text-red-400 hover:bg-[rgba(239,68,68,0.06)] transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

/* ── Mobile bottom nav ── */
export function TrainerMobileNav() {
  const pathname = usePathname()
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-brand-dark)]/95 backdrop-blur-xl border-t border-[var(--color-brand-border)]" aria-label="Trainer mobile nav">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV.map(({ href, icon: Icon, label }) => {
          const isActive = href === '/trainer-dashboard'
            ? pathname === '/trainer-dashboard'
            : pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={cn('flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all cursor-pointer min-w-[48px]',
                isActive ? 'text-[var(--color-brand-gold)]' : 'text-[var(--color-brand-muted)]'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="text-[9px] font-[var(--font-sans)] font-medium truncate">{label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
