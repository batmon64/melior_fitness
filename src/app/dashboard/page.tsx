import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ShoppingBag, MessageSquare, TrendingUp, ArrowRight, BookOpen, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'
import type { ProfileRow } from '@/types/supabase'
import { TRAINERS } from '@/constants/data'

export const metadata: Metadata = { title: 'Overview' }

export default async function DashboardOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const profile = profileData as ProfileRow | null

  // Fetch stats
  const [purchasesResult, coachingResult] = await Promise.all([
    supabase
      .from('purchases')
      .select('id, plan_id, amount, created_at, status')
      .eq('user_id', user!.id)
      .eq('status', 'paid')
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('coaching_requests')
      .select('id, status, created_at')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const purchases = (purchasesResult.data ?? []) as { id: string; plan_id: string; amount: number; created_at: string; status: string }[]
  const coachingRequests = (coachingResult.data ?? []) as { id: string; status: string; created_at: string }[]

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : null

  const GOAL_LABELS: Record<string, string> = {
    fat_loss: 'Fat Loss', muscle_gain: 'Muscle Gain', body_recomposition: 'Recomposition',
    general_fitness: 'General Fitness', athletic_performance: 'Athletic Performance',
  }

  return (
    <div className="space-y-8">

      {/* Welcome banner */}
      <div
        className="relative rounded-2xl overflow-hidden p-6 md:p-8"
        style={{ background: 'linear-gradient(135deg, rgba(28,25,23,0.9) 0%, rgba(68,64,60,0.5) 100%)' }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #CA8A04, transparent)', transform: 'translate(30%, -30%)' }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.2em] uppercase text-[var(--color-brand-gold)] mb-2">
            Welcome back
          </p>
          <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl font-bold text-[var(--color-brand-cream)] mb-2">
            Hey, {firstName}! 👋
          </h2>
          <p className="text-[var(--color-brand-muted)] font-[var(--font-sans)] text-sm mb-4">
            {memberSince ? `Member since ${memberSince}` : 'Welcome to Melior Fitness'}
            {profile?.fitness_goal && (
              <> · Goal: <span className="text-[var(--color-brand-cream)]">{GOAL_LABELS[profile.fitness_goal] ?? profile.fitness_goal}</span></>
            )}
          </p>
          {purchases.length === 0 && (
            <Button variant="primary" size="sm" asChild>
              <Link href="/plans">
                Browse Plans <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: <BookOpen className="w-5 h-5" aria-hidden="true" />,
            value: purchases.length,
            label: 'Plans Purchased',
            color: '#CA8A04',
            href: '/dashboard/plans',
          },
          {
            icon: <MessageSquare className="w-5 h-5" aria-hidden="true" />,
            value: coachingRequests.length,
            label: 'Coaching Requests',
            color: '#A78BFA',
            href: '/dashboard/coaching',
          },
          {
            icon: <TrendingUp className="w-5 h-5" aria-hidden="true" />,
            value: profile?.weight_kg ? `${profile.weight_kg} kg` : '—',
            label: 'Current Weight',
            color: '#34D399',
            href: '/dashboard/progress',
          },
          {
            icon: <Star className="w-5 h-5" aria-hidden="true" />,
            value: profile?.experience_level
              ? profile.experience_level.charAt(0).toUpperCase() + (profile.experience_level as string).slice(1)
              : '—',
            label: 'Experience Level',
            color: '#F97316',
            href: '/dashboard/settings',
          },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="glass rounded-2xl p-5 hover:border-[rgba(202,138,4,0.2)] transition-all duration-200 cursor-pointer group"
          >
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
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-[var(--font-sans)] font-semibold text-[var(--color-brand-muted)] uppercase tracking-wider mb-4">
          Quick Actions
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              href: '/plans',
              icon: <ShoppingBag className="w-5 h-5" aria-hidden="true" />,
              title: 'Browse Plans',
              desc: 'Find your next diet plan',
              color: '#CA8A04',
            },
            {
              href: '/dashboard/coaching',
              icon: <MessageSquare className="w-5 h-5" aria-hidden="true" />,
              title: 'Request Coaching',
              desc: 'Get 1-on-1 trainer support',
              color: '#A78BFA',
            },
            {
              href: '/dashboard/settings',
              icon: <TrendingUp className="w-5 h-5" aria-hidden="true" />,
              title: 'Update Profile',
              desc: 'Keep your metrics current',
              color: '#34D399',
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="glass rounded-xl p-5 flex items-start gap-4 hover:border-[rgba(202,138,4,0.2)] transition-all duration-200 cursor-pointer group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${action.color}15`, color: action.color }}
              >
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)] group-hover:text-[var(--color-brand-gold)] transition-colors">
                  {action.title}
                </p>
                <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] mt-0.5">
                  {action.desc}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--color-brand-muted)] ml-auto mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      {(purchases.length > 0 || coachingRequests.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent purchases */}
          {purchases.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-[var(--font-sans)] font-semibold text-[var(--color-brand-muted)] uppercase tracking-wider">
                  Recent Plans
                </h3>
                <Link href="/dashboard/plans" className="text-xs text-[var(--color-brand-gold)] hover:underline font-[var(--font-sans)] cursor-pointer">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {purchases.slice(0, 3).map((p) => (
                  <div key={p.id} className="glass rounded-xl p-4 flex items-center justify-between gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[rgba(202,138,4,0.12)] flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-[var(--color-brand-gold)]" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-brand-cream)] font-[var(--font-sans)] truncate">
                        Plan #{p.plan_id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                        {formatPrice(p.amount)} · {new Date(p.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <Badge variant="success">Paid</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meet your trainers */}
          <div>
            <h3 className="text-sm font-[var(--font-sans)] font-semibold text-[var(--color-brand-muted)] uppercase tracking-wider mb-4">
              Your Trainers
            </h3>
            <div className="space-y-3">
              {TRAINERS.map((trainer) => (
                <Link
                  key={trainer.id}
                  href={`/trainers/${trainer.slug}`}
                  className="glass rounded-xl p-4 flex items-center gap-4 hover:border-[rgba(202,138,4,0.2)] transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-[rgba(202,138,4,0.2)] flex items-center justify-center shrink-0">
                    <span className="font-[var(--font-heading)] font-bold text-[var(--color-brand-gold)]">
                      {trainer.name[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
                      {trainer.name}
                    </p>
                    <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] truncate">
                      {trainer.specialization}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--color-brand-muted)] opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
