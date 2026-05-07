'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, UserCheck, BookOpen, ShoppingCart,
  MessageSquare, Star, LogOut, ChevronRight, Shield,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { ProfileRow } from '@/types/supabase'

const NAV = [
  { href: '/admin',             icon: LayoutDashboard, label: 'Overview',      exact: true },
  { href: '/admin/users',       icon: Users,           label: 'Users' },
  { href: '/admin/trainers',    icon: UserCheck,       label: 'Trainers' },
  { href: '/admin/plans',       icon: BookOpen,        label: 'Diet Plans' },
  { href: '/admin/purchases',   icon: ShoppingCart,    label: 'Purchases' },
  { href: '/admin/coaching',    icon: MessageSquare,   label: 'Coaching' },
  { href: '/admin/testimonials',icon: Star,            label: 'Testimonials' },
]

export function AdminSidebar({ profile }: { profile: ProfileRow }) {
  const pathname = usePathname()
  const router   = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r border-[var(--color-brand-border)] bg-[var(--color-brand-dark)]">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-brand-border)]">
        <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
          <div className="w-7 h-7 rounded-lg bg-[var(--color-brand-gold)] flex items-center justify-center">
            <span className="font-[var(--font-heading)] font-bold text-[var(--color-brand-black)] text-xs">M</span>
          </div>
          <span className="font-[var(--font-heading)] font-semibold text-[var(--color-brand-cream)] text-sm">Melior</span>
        </Link>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30">
          <Shield className="w-2.5 h-2.5 text-red-400" aria-hidden="true" />
          <span className="text-[10px] font-bold font-[var(--font-sans)] text-red-400 uppercase tracking-wider">Admin</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-[var(--font-sans)] font-medium transition-all cursor-pointer',
                isActive
                  ? 'bg-[rgba(202,138,4,0.12)] text-[var(--color-brand-gold)]'
                  : 'text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] hover:bg-[rgba(255,255,255,0.04)]'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="flex-1">{label}</span>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-gold)]" aria-hidden="true" />}
            </Link>
          )
        })}

        <div className="h-px bg-[var(--color-brand-border)] my-2 mx-1" aria-hidden="true" />

        {[
          { href: '/dashboard',         label: 'User Dashboard' },
          { href: '/trainer-dashboard', label: 'Trainer Portal' },
        ].map(({ href, label }) => (
          <Link key={href} href={href}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-[var(--font-sans)] text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] hover:bg-[rgba(255,255,255,0.04)] transition-all cursor-pointer group"
          >
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Profile */}
      <div className="px-2 pb-3 border-t border-[var(--color-brand-border)] pt-2">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-red-400 font-[var(--font-heading)]">
              {getInitials(profile.full_name ?? profile.email)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-[var(--color-brand-cream)] font-[var(--font-sans)] truncate">
              {profile.full_name ?? 'Admin'}
            </p>
            <p className="text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)] truncate">{profile.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-[var(--font-sans)] font-medium text-[var(--color-brand-muted)] hover:text-red-400 hover:bg-red-500/06 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export function AdminMobileNav() {
  const pathname = usePathname()
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-brand-dark)]/95 backdrop-blur-xl border-t border-[var(--color-brand-border)]">
      <div className="flex items-center justify-around px-1 py-2">
        {NAV.slice(0, 6).map(({ href, icon: Icon, label, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={cn('flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all cursor-pointer',
                isActive ? 'text-[var(--color-brand-gold)]' : 'text-[var(--color-brand-muted)]'
              )}
            >
              <Icon className="w-4.5 h-4.5" aria-hidden="true" />
              <span className="text-[9px] font-[var(--font-sans)]">{label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
