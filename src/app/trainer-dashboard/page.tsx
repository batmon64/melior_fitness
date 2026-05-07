import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  MessageSquare, Users, IndianRupee, BookOpen,
  ArrowRight, TrendingUp, Clock, CheckCircle, AlertCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import type { ProfileRow } from '@/types/supabase'

export const metadata: Metadata = { title: 'Overview' }

export default async function TrainerOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profileData } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user!.id)
    .single()
  const profile = profileData as Pick<ProfileRow, 'full_name' | 'role'> | null

  // Detect trainer slug from name
  const name = profile?.full_name?.toLowerCase() ?? ''
  const trainerSlug = name.includes('sharon') ? 'sharon' : 'vishal'

  // Find trainer record
  const { data: trainerData } = await (supabase
    .from('trainers') as ReturnType<typeof supabase.from>)
    .select('id, clients_helped, experience_years')
    .eq('user_id', user!.id)
    .single()
  const dbTrainer = trainerData as { id: string; clients_helped: number; experience_years: number } | null

  // Fetch stats in parallel
  const [reqResult, planResult, purchaseResult] = await Promise.all([
    // Coaching requests (by trainer_id OR trainer_slug)
    dbTrainer
      ? supabase.from('coaching_requests').select('id, status, created_at, goal, trainer_slug').eq('trainer_id', dbTrainer.id).order('created_at', { ascending: false })
      : (supabase.from('coaching_requests') as ReturnType<typeof supabase.from>).select('id, status, created_at, goal, trainer_slug').eq('trainer_slug', trainerSlug).order('created_at', { ascending: false }),

    // Plans
    dbTrainer
      ? supabase.from('diet_plans').select('id, title, price, is_published, created_at').eq('trainer_id', dbTrainer.id)
      : Promise.resolve({ data: [], error: null }),

    // Purchases of trainer's plans
    dbTrainer
      ? (supabase.from('purchases') as ReturnType<typeof supabase.from>)
          .select('id, amount, created_at, status, plan_id')
          .in('plan_id', [])  // populated below
          .eq('status', 'paid')
      : Promise.resolve({ data: [], error: null }),
  ])

  const allRequests = (reqResult.data ?? []) as {
    id: string; status: string; created_at: string; goal: string; trainer_slug: string
  }[]
  const plans       = (planResult.data ?? []) as { id: string; title: string; price: number; is_published: boolean; created_at: string }[]

  // Fetch purchases separately if trainer is in DB
  let purchases: { id: string; amount: number; created_at: string }[] = []
  if (dbTrainer && plans.length > 0) {
    const planIds = plans.map((p) => p.id)
    const { data: purchaseData } = await (supabase.from('purchases') as ReturnType<typeof supabase.from>)
      .select('id, amount, created_at')
      .in('plan_id', planIds)
      .eq('status', 'paid')
    purchases = (purchaseData ?? []) as typeof purchases
  }

  const totalRevenue    = purchases.reduce((sum, p) => sum + p.amount, 0)
  const pendingRequests = allRequests.filter((r) => r.status === 'pending')
  const activeRequests  = allRequests.filter((r) => r.status === 'active')

  // Last 30 days revenue
  const cutoff   = new Date(Date.now() - 30 * 86400000).toISOString()
  const monthRev = purchases.filter((p) => p.created_at >= cutoff).reduce((s, p) => s + p.amount, 0)

  const stats = [
    {
      icon: <MessageSquare className="w-5 h-5" aria-hidden="true" />,
      label: 'Pending Requests',
      value: pendingRequests.length,
      sub: `${activeRequests.length} active`,
      color: '#CA8A04',
      href: '/trainer-dashboard/requests',
      urgent: pendingRequests.length > 0,
    },
    {
      icon: <Users className="w-5 h-5" aria-hidden="true" />,
      label: 'Total Clients',
      value: purchases.length > 0 ? new Set(purchases.map((p: any) => p.user_id)).size : dbTrainer?.clients_helped ?? 0,
      sub: 'all time',
      color: '#A78BFA',
      href: '/trainer-dashboard/clients',
    },
    {
      icon: <BookOpen className="w-5 h-5" aria-hidden="true" />,
      label: 'Plans Published',
      value: plans.filter((p) => p.is_published).length,
      sub: `${plans.length} total`,
      color: '#4ADE80',
      href: '/trainer-dashboard/plans',
    },
    {
      icon: <IndianRupee className="w-5 h-5" aria-hidden="true" />,
      label: 'Total Revenue',
      value: formatPrice(totalRevenue),
      sub: `${formatPrice(monthRev)} this month`,
      color: '#F97316',
      href: '/trainer-dashboard/revenue',
    },
  ]

  return (
    <div className="space-y-8">

      {/* Welcome */}
      <div
        className="relative rounded-2xl overflow-hidden p-6 md:p-8"
        style={{ background: 'linear-gradient(135deg, rgba(28,25,23,0.95) 0%, rgba(68,64,60,0.4) 100%)' }}
      >
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(#CA8A04, transparent)', transform: 'translate(40%, -40%)' }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.2em] uppercase text-[var(--color-brand-gold)] mb-2">
            Trainer Portal
          </p>
          <h1 className="font-[var(--font-heading)] text-3xl md:text-4xl font-bold text-[var(--color-brand-cream)] mb-2">
            Welcome back, {profile?.full_name?.split(' ')[0] ?? 'Coach'} 👋
          </h1>
          <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
            {allRequests.length} total coaching request{allRequests.length !== 1 ? 's' : ''} · {plans.length} plan{plans.length !== 1 ? 's' : ''} created
          </p>
        </div>
      </div>

      {/* Setup prompt — when trainer not in DB */}
      {!dbTrainer && (
        <div className="glass rounded-2xl p-5 flex items-start gap-4 border border-[rgba(251,191,36,0.25)] bg-[rgba(251,191,36,0.04)]">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)] mb-1">
              Trainer profile not yet linked
            </p>
            <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed">
              Your account has the trainer role but no trainer record in the database yet.
              Contact the admin to link your profile to the <code className="text-amber-400">trainers</code> table.
              Coaching requests submitted with your slug are still visible below.
            </p>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="glass rounded-2xl p-5 hover:border-[rgba(202,138,4,0.2)] transition-all duration-200 cursor-pointer group relative"
          >
            {stat.urgent && (
              <div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[var(--color-brand-black)] bg-[var(--color-brand-gold)] animate-pulse"
                aria-label="Has new items"
              />
            )}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${stat.color}18`, color: stat.color }}
            >
              {stat.icon}
            </div>
            <p className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-brand-cream)] mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">{stat.label}</p>
            {stat.sub && (
              <p className="text-[10px] font-[var(--font-sans)] mt-0.5" style={{ color: stat.color }}>
                {stat.sub}
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* Recent requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-[var(--font-sans)] font-semibold text-[var(--color-brand-muted)] uppercase tracking-wider">
            Recent Requests
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/trainer-dashboard/requests">
              View all <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {allRequests.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <MessageSquare className="w-10 h-10 text-[var(--color-brand-muted)] mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
              No coaching requests yet. Share your profile to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {allRequests.slice(0, 5).map((req) => {
              const STATUS_COLOR: Record<string, string> = {
                pending: '#FBBF24', active: '#34D399', completed: '#A78BFA', cancelled: '#F87171',
              }
              const color = STATUS_COLOR[req.status] ?? '#CA8A04'
              return (
                <div key={req.id} className="glass rounded-xl p-4 flex items-center gap-4">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: color }}
                    aria-label={req.status}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-brand-cream)] font-[var(--font-sans)] truncate">
                      {req.goal || 'Coaching request'}
                    </p>
                    <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                      {new Date(req.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-[var(--font-sans)] font-semibold capitalize"
                    style={{ background: `${color}18`, color }}
                  >
                    {req.status}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-[var(--font-sans)] font-semibold text-[var(--color-brand-muted)] uppercase tracking-wider mb-4">
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { href: '/trainer-dashboard/requests', icon: <MessageSquare className="w-5 h-5" aria-hidden="true" />, label: 'Review Requests', color: '#CA8A04' },
            { href: '/trainer-dashboard/plans',    icon: <BookOpen className="w-5 h-5" aria-hidden="true" />,     label: 'Manage Plans',    color: '#4ADE80' },
            { href: '/trainer-dashboard/revenue',  icon: <TrendingUp className="w-5 h-5" aria-hidden="true" />,   label: 'View Revenue',    color: '#F97316' },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="glass rounded-xl p-5 flex items-center gap-4 hover:border-[rgba(202,138,4,0.2)] transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${a.color}15`, color: a.color }}>
                {a.icon}
              </div>
              <span className="text-sm font-semibold font-[var(--font-sans)] text-[var(--color-brand-muted)] group-hover:text-[var(--color-brand-cream)] transition-colors">
                {a.label}
              </span>
              <ArrowRight className="w-4 h-4 text-[var(--color-brand-muted)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
