'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, Utensils, Flame, Star, ChevronRight, Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { DetailedPlan } from '@/constants/plans'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function PlanDetailHero({ plan }: { plan: DetailedPlan }) {
  return (
    <section className="relative pt-28 pb-12 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ background: plan.thumbnailGradient }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(10,9,8,0.6) 0%, rgba(10,9,8,0.95) 100%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-[var(--font-sans)] text-[var(--color-brand-muted)] mb-6">
          <Link href="/" className="hover:text-[var(--color-brand-cream)] transition-colors cursor-pointer">Home</Link>
          <ChevronRight className="w-3 h-3" aria-hidden="true" />
          <Link href="/plans" className="hover:text-[var(--color-brand-cream)] transition-colors cursor-pointer">Plans</Link>
          <ChevronRight className="w-3 h-3" aria-hidden="true" />
          <span className="text-[var(--color-brand-cream)] truncate">{plan.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-wrap items-center gap-2 mb-4"
            >
              <Badge variant="gold" className="capitalize">
                {plan.category.replace('_', ' ')}
              </Badge>
              {plan.isPopular && (
                <Badge variant="success">Most Popular</Badge>
              )}
              <span className="flex items-center gap-1 text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                by{' '}
                <Link
                  href={`/trainers/${plan.trainerSlug}`}
                  className="text-[var(--color-brand-cream)] hover:text-[var(--color-brand-gold)] transition-colors font-medium ml-1 cursor-pointer"
                >
                  {plan.trainerName}
                </Link>
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
              className="font-[var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-brand-cream)] leading-tight mb-3"
            >
              {plan.title}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
              className="text-lg text-[var(--color-brand-muted)] font-[var(--font-sans)] italic mb-6"
            >
              &ldquo;{plan.tagline}&rdquo;
            </motion.p>

            {/* Rating + purchase count */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
              className="flex flex-wrap items-center gap-5 mb-8"
            >
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5"
                    style={{
                      fill: i < Math.round(plan.rating) ? plan.accentColor : 'transparent',
                      color: plan.accentColor,
                    }}
                    aria-hidden="true"
                  />
                ))}
                <span className="text-sm font-bold text-[var(--color-brand-cream)] font-[var(--font-sans)] ml-1">
                  {plan.rating}
                </span>
                <span className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                  ({plan.reviewCount} reviews)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                <Users className="w-4 h-4" aria-hidden="true" />
                {plan.totalPurchases}+ enrolled
              </div>
            </motion.div>

            {/* Key stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { icon: <Clock className="w-5 h-5" aria-hidden="true" />, value: `${plan.durationWeeks} weeks`, label: 'Duration' },
                { icon: <Utensils className="w-5 h-5" aria-hidden="true" />, value: `${plan.mealsPerDay} meals/day`, label: 'Meals per day' },
                { icon: <Flame className="w-5 h-5" aria-hidden="true" />, value: plan.caloriesRange, label: 'Calories' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass rounded-xl p-4 flex flex-col gap-2"
                >
                  <span style={{ color: plan.accentColor }}>{stat.icon}</span>
                  <span className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
                    {stat.value}
                  </span>
                  <span className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
