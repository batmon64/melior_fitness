'use client'

import Link from 'next/link'
import { Check, Shield, MessageCircle, Star, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn, formatPrice } from '@/lib/utils'
import { getTrainerWhatsAppUrl } from '@/constants/trainers'
import { TRAINER_DATA } from '@/constants/trainers'
import type { DetailedPlan } from '@/constants/plans'
import { formatDiscount } from '@/constants/plans'

interface PlanPurchaseCardProps {
  plan: DetailedPlan
}

export function PlanPurchaseCard({ plan }: PlanPurchaseCardProps) {
  const discount    = formatDiscount(plan)
  const trainer     = TRAINER_DATA[plan.trainerSlug]
  const waUrl       = trainer
    ? getTrainerWhatsAppUrl(trainer, `Hi ${plan.trainerName}! I'm interested in the "${plan.title}" plan. Can you tell me more?`)
    : '#'

  return (
    <div
      className={cn(
        'glass rounded-2xl overflow-hidden',
        plan.isPopular && 'border-[rgba(202,138,4,0.35)] shadow-[0_0_32px_rgba(202,138,4,0.12)]'
      )}
    >
      {plan.isPopular && (
        <div className="py-2 text-center text-xs font-[var(--font-sans)] font-bold tracking-[0.12em] uppercase text-[var(--color-brand-black)] bg-[var(--color-brand-gold)]">
          Most Popular
        </div>
      )}

      <div className="p-6">
        {/* Price */}
        <div className="mb-5">
          <div className="flex items-baseline gap-2.5">
            <span className="font-[var(--font-heading)] text-4xl font-bold text-[var(--color-brand-cream)]">
              {formatPrice(plan.price)}
            </span>
            {plan.originalPrice && (
              <span className="text-base text-[var(--color-brand-muted)] line-through font-[var(--font-sans)]">
                {formatPrice(plan.originalPrice)}
              </span>
            )}
          </div>
          {discount && (
            <div className="flex items-center gap-2 mt-1.5">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-[var(--font-sans)] font-semibold text-emerald-400">
                {discount}
              </span>
              <span className="text-xs text-emerald-400 font-[var(--font-sans)]">
                Save {formatPrice(plan.originalPrice! - plan.price)}
              </span>
            </div>
          )}
          <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] mt-2">
            One-time payment · Instant access · No subscription
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-5 pb-5 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4"
                style={{
                  fill: i < Math.round(plan.rating) ? plan.accentColor : 'transparent',
                  color: plan.accentColor,
                }}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
            {plan.rating}
          </span>
          <span className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
            ({plan.reviewCount} reviews)
          </span>
          <span className="ml-auto flex items-center gap-1 text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
            <Users className="w-3.5 h-3.5" aria-hidden="true" />
            {plan.totalPurchases}+ enrolled
          </span>
        </div>

        {/* Whats included quick list */}
        <ul className="space-y-2 mb-6" aria-label="What's included">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <Check
                className="w-4 h-4 shrink-0 mt-0.5"
                style={{ color: plan.accentColor }}
                aria-hidden="true"
              />
              <span className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA buttons */}
        <div className="flex flex-col gap-3">
          <Button variant="primary" size="lg" className="w-full" asChild>
            <Link href={`/auth/signup?plan=${plan.slug}`}>
              Get This Plan
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </Button>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2.5 h-11 px-6 rounded-[var(--radius-btn)] glass font-[var(--font-sans)] font-semibold text-sm text-[var(--color-brand-cream)] hover:border-[rgba(37,211,102,0.4)] transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" style={{ color: '#25D366' }} aria-hidden="true" />
            Ask {plan.trainerName} on WhatsApp
          </a>
        </div>

        {/* Guarantee */}
        <div className="flex items-center gap-2.5 mt-5 p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
          <Shield className="w-5 h-5 text-[var(--color-brand-gold)] shrink-0" aria-hidden="true" />
          <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed">
            <span className="text-[var(--color-brand-cream)] font-semibold">7-day money-back guarantee.</span>{' '}
            If you're not satisfied after following the plan for 7 days, we'll refund you in full.
          </p>
        </div>
      </div>
    </div>
  )
}
