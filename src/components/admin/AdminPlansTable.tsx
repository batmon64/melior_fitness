'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ExternalLink, Loader2 } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'

interface Plan {
  id: string; title: string; slug: string; category: string
  price: number; is_published: boolean; is_popular: boolean
  duration_weeks: number; created_at: string; trainer_id: string
}

const CATEGORY_COLORS: Record<string, string> = {
  fat_loss: '#F97316', muscle_gain: '#A78BFA', vegetarian: '#4ADE80',
  keto: '#FBBF24', beginner: '#34D399', advanced: '#F43F5E',
}

export function AdminPlansTable({ plans }: { plans: Plan[] }) {
  const router = useRouter()
  const [toggling, setToggling] = useState<string | null>(null)

  async function togglePublish(planId: string, current: boolean) {
    setToggling(planId)
    try {
      await fetch('/api/admin/toggle-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, isPublished: !current }),
      })
      router.refresh()
    } finally {
      setToggling(null)
    }
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.06)]">
        {[['Plan', '5'], ['Category', '2'], ['Price', '2'], ['Status', '2'], ['Action', '1']].map(([h, span]) => (
          <p key={h} className={`col-span-${span} text-[10px] font-[var(--font-sans)] font-semibold uppercase tracking-wider text-[var(--color-brand-muted)]`}>{h}</p>
        ))}
      </div>

      {plans.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          No plans in the database yet.
        </div>
      ) : (
        <div className="divide-y divide-[rgba(255,255,255,0.04)]">
          {plans.map((plan) => {
            const color = CATEGORY_COLORS[plan.category] ?? '#CA8A04'
            return (
              <div key={plan.id} className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-[rgba(255,255,255,0.02)]">
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <div className="w-1 h-8 rounded-full shrink-0" style={{ background: color }} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-brand-cream)] font-[var(--font-sans)] truncate">{plan.title}</p>
                    <p className="text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)]">{plan.duration_weeks}w</p>
                  </div>
                </div>
                <p className="col-span-2 text-xs font-[var(--font-sans)] capitalize truncate" style={{ color }}>
                  {plan.category.replace('_', ' ')}
                </p>
                <p className="col-span-2 text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
                  {formatPrice(plan.price)}
                </p>
                <div className="col-span-2">
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold font-[var(--font-sans)]',
                    plan.is_published ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[rgba(255,255,255,0.06)] text-[var(--color-brand-muted)]'
                  )}>
                    {plan.is_published ? 'Live' : 'Draft'}
                  </span>
                </div>
                <div className="col-span-1 flex items-center gap-2">
                  <button
                    onClick={() => togglePublish(plan.id, plan.is_published)}
                    disabled={toggling === plan.id}
                    className="p-1.5 rounded-lg glass hover:border-[rgba(202,138,4,0.3)] transition-all cursor-pointer disabled:opacity-50"
                    title={plan.is_published ? 'Unpublish' : 'Publish'}
                  >
                    {toggling === plan.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--color-brand-muted)]" aria-hidden="true" />
                      : plan.is_published
                        ? <EyeOff className="w-3.5 h-3.5 text-[var(--color-brand-muted)]" aria-hidden="true" />
                        : <Eye className="w-3.5 h-3.5 text-[var(--color-brand-gold)]" aria-hidden="true" />
                    }
                  </button>
                  <Link href={`/plans/${plan.slug}`} target="_blank"
                    className="p-1.5 rounded-lg glass hover:border-[rgba(202,138,4,0.3)] transition-all cursor-pointer">
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--color-brand-muted)]" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
