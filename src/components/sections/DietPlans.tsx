'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Check, Flame, Zap, Leaf, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Section, SectionHeading } from '@/components/ui/Section'
import { DIET_PLANS, PLAN_CATEGORIES } from '@/constants/data'
import { formatPrice, cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Fat Loss': <Flame className="w-4 h-4" aria-hidden="true" />,
  'Muscle Gain': <Zap className="w-4 h-4" aria-hidden="true" />,
  Vegetarian: <Leaf className="w-4 h-4" aria-hidden="true" />,
  Keto: <Flame className="w-4 h-4" aria-hidden="true" />,
  Beginner: <Star className="w-4 h-4" aria-hidden="true" />,
  Advanced: <Star className="w-4 h-4" aria-hidden="true" />,
  All: null,
}

export function DietPlans() {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const filtered =
    activeCategory === 'All'
      ? DIET_PLANS
      : DIET_PLANS.filter((p) => p.category === activeCategory)

  return (
    <Section id="plans" className="relative bg-[var(--color-brand-dark)]">
      {/* Top border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(202,138,4,0.4), transparent)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(202,138,4,0.4), transparent)' }}
        aria-hidden="true"
      />

      <SectionHeading
        eyebrow="Diet Plans"
        title={<>Plans That <span className="text-gradient-gold italic">Actually Work</span></>}
        subtitle="Choose from our curated library of nutrition plans. Every plan is crafted by a certified coach, based on your goals."
      />

      {/* Category filter tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12" role="tablist" aria-label="Filter plans by category">
        {PLAN_CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-[var(--font-sans)] font-medium transition-all duration-200 cursor-pointer',
              activeCategory === cat
                ? 'bg-[var(--color-brand-gold)] text-[var(--color-brand-black)] shadow-[0_0_20px_rgba(202,138,4,0.4)]'
                : 'glass text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] hover:border-[rgba(202,138,4,0.2)]'
            )}
          >
            {CATEGORY_ICONS[cat]}
            {cat}
          </button>
        ))}
      </div>

      {/* Plans grid */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          role="tabpanel"
        >
          {filtered.map((plan, i) => (
            <motion.article
              key={plan.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.07 }}
              className={cn(
                'relative flex flex-col rounded-[var(--radius-card)] overflow-hidden transition-all duration-300 cursor-pointer group',
                'glass hover:border-[rgba(202,138,4,0.25)] hover:shadow-[0_0_40px_rgba(202,138,4,0.08)]',
                plan.isPopular && 'border-[rgba(202,138,4,0.35)] shadow-[0_0_24px_rgba(202,138,4,0.12)]'
              )}
            >
              {/* Popular badge */}
              {plan.isPopular && (
                <div className="absolute top-0 left-0 right-0 py-1.5 text-center bg-[var(--color-brand-gold)] z-10">
                  <span className="text-xs font-[var(--font-sans)] font-bold tracking-[0.12em] uppercase text-[var(--color-brand-black)]">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={cn('p-6 flex flex-col flex-1', plan.isPopular && 'pt-10')}>
                {/* Category + trainer */}
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="gold" className="text-xs">
                    {CATEGORY_ICONS[plan.category]}
                    {plan.category}
                  </Badge>
                  <span className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                    by {plan.trainerName}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-brand-cream)] mb-2 leading-snug">
                  {plan.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed mb-5 flex-1">
                  {plan.description}
                </p>

                {/* Plan metadata */}
                <div className="grid grid-cols-3 gap-2 mb-5 p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
                      {plan.durationWeeks}w
                    </p>
                    <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">Duration</p>
                  </div>
                  <div className="text-center border-x border-[rgba(255,255,255,0.06)]">
                    <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
                      {plan.mealsPerDay}
                    </p>
                    <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">Meals/day</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)] truncate">
                      {plan.caloriesRange.split('–')[0]}+
                    </p>
                    <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">kcal</p>
                  </div>
                </div>

                {/* Features list */}
                <ul className="space-y-2 mb-6" aria-label="Plan includes">
                  {plan.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check
                        className="w-4 h-4 text-[var(--color-brand-gold)] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Price + CTA */}
                <div className="flex items-end justify-between gap-4 mt-auto pt-5 border-t border-[rgba(255,255,255,0.06)]">
                  <div>
                    <div className="flex items-baseline gap-2">
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
                      <p className="text-xs text-emerald-400 font-[var(--font-sans)] font-medium mt-0.5">
                        Save {formatPrice(plan.originalPrice - plan.price)}
                      </p>
                    )}
                  </div>

                  <Button variant={plan.isPopular ? 'primary' : 'secondary'} size="sm" asChild>
                    <Link href={`/plans/${plan.id}`}>
                      Buy Now
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Browse all CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mt-14"
      >
        <Button variant="ghost" size="md" asChild>
          <Link href="/plans">
            Browse All Plans
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </Button>
      </motion.div>
    </Section>
  )
}
