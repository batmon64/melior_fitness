'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, Utensils, Flame, Star, Users, ChevronRight, Check } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn, formatPrice } from '@/lib/utils'
import type { DetailedPlan } from '@/constants/plans'
import { formatDiscount } from '@/constants/plans'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface PlanCardProps {
  plan: DetailedPlan
  index?: number
}

export function PlanCard({ plan, index = 0 }: PlanCardProps) {
  const discount = formatDiscount(plan)

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: EASE, delay: (index % 3) * 0.08 }}
      className={cn(
        'relative flex flex-col rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300',
        'glass hover:shadow-[0_0_40px_rgba(202,138,4,0.08)]',
        plan.isPopular && 'border-[rgba(202,138,4,0.35)] shadow-[0_0_24px_rgba(202,138,4,0.1)]'
      )}
    >
      {/* Popular banner */}
      {plan.isPopular && (
        <div className="absolute top-0 left-0 right-0 py-1.5 text-center bg-[var(--color-brand-gold)] z-10">
          <span className="text-xs font-[var(--font-sans)] font-bold tracking-[0.12em] uppercase text-[var(--color-brand-black)]">
            Most Popular
          </span>
        </div>
      )}

      {/* Thumbnail */}
      <div
        className={cn('relative h-44 overflow-hidden', plan.isPopular && 'mt-7')}
        style={{ background: plan.thumbnailGradient }}
        aria-hidden="true"
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(10,9,8,0.85) 0%, transparent 60%)' }}
        />

        {/* Category + discount badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge variant="glass" className="text-xs capitalize">
            {plan.category.replace('_', ' ')}
          </Badge>
          {discount && (
            <span className="px-2 py-0.5 rounded-full text-xs font-[var(--font-sans)] font-bold bg-emerald-500 text-white">
              {discount}
            </span>
          )}
        </div>

        {/* Trainer chip — bottom of thumbnail */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-[var(--font-heading)] font-bold"
            style={{ background: plan.accentColor, color: '#0A0908' }}
            aria-hidden="true"
          >
            {plan.trainerName[0]}
          </div>
          <span className="text-xs text-white/80 font-[var(--font-sans)]">by {plan.trainerName}</span>
        </div>

        {/* Ratings */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1">
          <Star className="w-3 h-3 fill-[var(--color-brand-gold)] text-[var(--color-brand-gold)]" aria-hidden="true" />
          <span className="text-xs text-white/80 font-[var(--font-sans)]">{plan.rating}</span>
          <span className="text-xs text-white/50 font-[var(--font-sans)]">({plan.reviewCount})</span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">

        {/* Title */}
        <h3 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-brand-cream)] leading-snug mb-1.5">
          {plan.title}
        </h3>
        <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] italic mb-3">
          {plan.tagline}
        </p>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
          <div className="flex flex-col items-center gap-0.5">
            <Clock className="w-3.5 h-3.5 text-[var(--color-brand-muted)]" aria-hidden="true" />
            <span className="text-xs font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
              {plan.durationWeeks}w
            </span>
            <span className="text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)]">Duration</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 border-x border-[rgba(255,255,255,0.05)]">
            <Utensils className="w-3.5 h-3.5 text-[var(--color-brand-muted)]" aria-hidden="true" />
            <span className="text-xs font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
              {plan.mealsPerDay}
            </span>
            <span className="text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)]">Meals/day</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <Flame className="w-3.5 h-3.5 text-[var(--color-brand-muted)]" aria-hidden="true" />
            <span className="text-xs font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)] truncate max-w-full px-1 text-center">
              {plan.caloriesMin}+
            </span>
            <span className="text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)]">kcal</span>
          </div>
        </div>

        {/* 3 top features */}
        <ul className="space-y-1.5 mb-5 flex-1" aria-label="Key features">
          {plan.features.slice(0, 3).map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check
                className="w-3.5 h-3.5 shrink-0 mt-0.5"
                style={{ color: plan.accentColor }}
                aria-hidden="true"
              />
              <span className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">{f}</span>
            </li>
          ))}
        </ul>

        {/* Purchase count */}
        <div className="flex items-center gap-1.5 mb-4">
          <Users className="w-3.5 h-3.5 text-[var(--color-brand-muted)]" aria-hidden="true" />
          <span className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
            {plan.totalPurchases}+ people enrolled
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)] mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-brand-cream)]">
                {formatPrice(plan.price)}
              </span>
              {plan.originalPrice && (
                <span className="text-sm text-[var(--color-brand-muted)] line-through font-[var(--font-sans)]">
                  {formatPrice(plan.originalPrice)}
                </span>
              )}
            </div>
            {plan.originalPrice && (
              <p className="text-xs text-emerald-400 font-[var(--font-sans)] font-medium">
                You save {formatPrice(plan.originalPrice - plan.price)}
              </p>
            )}
          </div>

          <Button
            variant={plan.isPopular ? 'primary' : 'secondary'}
            size="sm"
            asChild
          >
            <Link href={`/plans/${plan.slug}`}>
              View Plan
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
  )
}
