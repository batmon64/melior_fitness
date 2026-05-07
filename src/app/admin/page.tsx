import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  Users, BookOpen, ShoppingCart, MessageSquare, IndianRupee,
  TrendingUp, UserCheck, Star, ArrowUpRight, AlertCircle,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = { title: 'Overview' }

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  // Parallel data fetches
  const [
    usersRes, trainersRes, plansRes, purchasesRes, coachingRes, testimonialsRes,
  ] = await Promise.all([
    supabase.from('profiles').select('id, role, created_at', { count: 'exact' }),
    (supabase.from('trainers') as ReturnType<typeof supabase.from>).select('id, slug, is_active', { count: 'exact' }),
    supabase.from('diet_plans').select('id, is_published, price', { count: 'exact' }),
    (supabase.from('purchases') as ReturnType<typeof supabase.from>).select('id, amount, status, created_at', { count: 'exact' }),
    (supabase.from('coaching_requests') as ReturnType<typeof supabase.from>).select('id, status, created_at', { count: 'exact' }),
    (supabase.from('testimonials') as ReturnType<typeof supabase.from>).select('id, is_published', { count: 'exact' }),
  ])

  const users        = (usersRes.data        ?? []) as { id: string; role: string; created_at: string }[]
  const trainers     = (trainersRes.data      ?? []) as { id: string; slug: string; is_active: boolean }[]
  const plans        = (plansRes.data         ?? []) as { id: string; is_published: boolean; price: number }[]
  const purchases    = (purchasesRes.data     ?? []) as { id: string; amount: number; status: string; created_at: string }[]
  const coaching     = (coachingRes.data      ?? []) as { id: string; status: string; created_at: string }[]
  const testimonials = (testimonialsRes.data  ?? []) as { id: string; is_published: boolean }[]

  // Computed stats
  const totalRevenue    = purchases.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const paidPurchases   = purchases.filter((p) => p.status === 'paid').length
  const pendingCoaching = coaching.filter((c) => c.status === 'pending').length
  const pendingTestimonials = testimonials.filter((t) => !t.is_published).length
  const publishedPlans  = plans.filter((p) => p.is_published).length

  // New this month
  const cutoff = new Date(Date.now() - 30 * 86400000).toISOString()
  const newUsers      = users.filter((u) => u.created_at >= cutoff).length
  const newPurchases  = purchases.filter((p) => p.created_at >= cutoff && p.status === 'paid').length
  const monthRevenue  = purchases
    .filter((p) => p.status === 'paid' && p.created_at >= cutoff)
    .reduce((s, p) => s + p.amount, 0)

  const STATS = [
    { icon: <Users className="w-5 h-5" />,        label: 'Total Users',       value: users.length,       sub: `+${newUsers} this month`,          color: '#CA8A04', href: '/admin/users' },
    { icon: <IndianRupee className="w-5 h-5" />,  label: 'Total Revenue',     value: formatPrice(totalRevenue), sub: `${formatPrice(monthRevenue)} this month`, color: '#4ADE80', href: '/admin/purchases' },
    { icon: <ShoppingCart className="w-5 h-5" />, label: 'Plan Sales',        value: paidPurchases,      sub: `+${newPurchases} this month`,       color: '#F97316', href: '/admin/purchases' },
    { icon: <BookOpen className="w-5 h-5" />,     label: 'Published Plans',   value: publishedPlans,     sub: `${plans.length} total`,             color: '#A78BFA', href: '/admin/plans' },
    { icon: <MessageSquare className="w-5 h-5" />,label: 'Pending Coaching',  value: pendingCoaching,    sub: `${coaching.length} total`,          color: '#FBBF24', href: '/admin/coaching',
      urgent: pendingCoaching > 0 },
    { icon: <UserCheck className="w-5 h-5" />,    label: 'Active Trainers',   value: trainers.filter((t) => t.is_active).length, sub: `${trainers.length} total`, color: '#34D399', href: '/admin/trainers' },
    { icon: <Star className="w-5 h-5" />,         label: 'Pending Reviews',   value: pendingTestimonials, sub: `${testimonials.length} total`,      color: '#F43F5E', href: '/admin/testimonials',
      urgent: pendingTestimonials > 0 },
    { icon: <TrendingUp className="w-5 h-5" />,   label: 'Conversion',        value: users.length > 0 ? `${Math.round((paidPurchases / users.length) * 100)}%` : '—', sub: 'users who purchased', color: '#60A5FA', href: '/admin/users' },
  ]

  // Recent activity feed
  const recentActivity = [
    ...purchases.filter((p) => p.status === 'paid').slice(0, 3).map((p) => ({
      type: 'purchase', label: `New purchase · ${formatPrice(p.amount)}`, date: p.created_at, color: '#4ADE80',
    })),
    ...users.slice(-3).map((u) => ({
      type: 'user', label: `New ${u.role} registered`, date: u.created_at, color: '#CA8A04',
    })),
    ...coaching.filter((c) => c.status === 'pending').slice(0, 3).map((c) => ({
      type: 'coaching', label: 'New coaching request', date: c.created_at, color: '#FBBF24',
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8)

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-brand-cream)] mb-1">
          System Overview
        </h1>
        <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          Full visibility across all users, trainers, plans, and revenue.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="glass rounded-2xl p-5 hover:border-[rgba(202,138,4,0.2)] transition-all duration-200 cursor-pointer group relative"
          >
            {stat.urgent && (
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[var(--color-brand-black)] bg-red-400 animate-pulse" aria-hidden="true" />
            )}
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}18`, color: stat.color }}>
                {stat.icon}
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-brand-muted)] opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            </div>
            <p className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-brand-cream)] mb-0.5">{stat.value}</p>
            <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">{stat.label}</p>
            <p className="text-[10px] font-[var(--font-sans)] mt-0.5" style={{ color: stat.color }}>{stat.sub}</p>
          </Link>
        ))}
      </div>

      {/* Role breakdown + Activity */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* User roles */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-[var(--font-sans)] font-semibold text-[var(--color-brand-cream)] mb-5">User Breakdown</h2>
          {[
            { role: 'user',    label: 'Regular Users',  color: '#CA8A04' },
            { role: 'trainer', label: 'Trainers',       color: '#A78BFA' },
            { role: 'admin',   label: 'Admins',         color: '#F43F5E' },
          ].map(({ role, label, color }) => {
            const count = users.filter((u) => u.role === role).length
            const pct   = users.length > 0 ? Math.round((count / users.length) * 100) : 0
            return (
              <div key={role} className="mb-4 last:mb-0">
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-[var(--color-brand-cream)] font-[var(--font-sans)]">{label}</span>
                  <span className="text-sm font-semibold font-[var(--font-sans)]" style={{ color }}>
                    {count} <span className="text-[var(--color-brand-muted)] font-normal text-xs">({pct}%)</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent activity */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-[var(--font-sans)] font-semibold text-[var(--color-brand-cream)] mb-5">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} aria-hidden="true" />
                  <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] flex-1">{item.label}</p>
                  <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] shrink-0">
                    {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick action alerts */}
      {(pendingCoaching > 0 || pendingTestimonials > 0) && (
        <div className="space-y-3">
          {pendingCoaching > 0 && (
            <div className="glass rounded-xl p-4 flex items-center gap-4 border border-[rgba(251,191,36,0.25)] bg-[rgba(251,191,36,0.04)]">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
              <p className="text-sm text-[var(--color-brand-cream)] font-[var(--font-sans)] flex-1">
                <span className="font-semibold">{pendingCoaching}</span> coaching request{pendingCoaching !== 1 ? 's' : ''} awaiting trainer response.
              </p>
              <Link href="/admin/coaching" className="text-xs text-amber-400 hover:underline font-[var(--font-sans)] cursor-pointer shrink-0">
                Review →
              </Link>
            </div>
          )}
          {pendingTestimonials > 0 && (
            <div className="glass rounded-xl p-4 flex items-center gap-4 border border-[rgba(244,63,94,0.25)] bg-[rgba(244,63,94,0.04)]">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" aria-hidden="true" />
              <p className="text-sm text-[var(--color-brand-cream)] font-[var(--font-sans)] flex-1">
                <span className="font-semibold">{pendingTestimonials}</span> testimonial{pendingTestimonials !== 1 ? 's' : ''} pending approval.
              </p>
              <Link href="/admin/testimonials" className="text-xs text-red-400 hover:underline font-[var(--font-sans)] cursor-pointer shrink-0">
                Review →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
