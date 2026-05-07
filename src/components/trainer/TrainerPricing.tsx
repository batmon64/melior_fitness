'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, MessageCircle } from 'lucide-react'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { cn, formatPrice } from '@/lib/utils'
import type { TrainerData } from '@/constants/trainers'
import { getTrainerWhatsAppUrl } from '@/constants/trainers'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function TrainerPricing({ trainer }: { trainer: TrainerData }) {
  return (
    <Section id="pricing" className="relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${trainer.accentColor}08 0%, transparent 65%)` }}
        aria-hidden="true"
      />

      <SectionHeading
        eyebrow="Pricing"
        title={<>Invest in Your <span className="italic" style={{ color: trainer.accentColor }}>Transformation</span></>}
        subtitle="Transparent pricing. No hidden fees. Every plan comes with a 7-day satisfaction guarantee."
      />

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {trainer.pricing.map((tier, i) => (
          <motion.article
            key={tier.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.12 }}
            className={cn(
              'relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300',
              tier.isPopular
                ? 'shadow-[0_0_40px_rgba(202,138,4,0.15)]'
                : 'glass hover:border-[rgba(202,138,4,0.2)]'
            )}
            style={tier.isPopular ? {
              background: `linear-gradient(135deg, ${trainer.accentColor}18 0%, rgba(28,25,23,0.95) 50%)`,
              border: `1px solid ${trainer.accentColor}50`,
            } : {}}
          >
            {/* Popular banner */}
            {tier.isPopular && (
              <div
                className="py-2 text-center text-xs font-[var(--font-sans)] font-bold tracking-[0.12em] uppercase text-[var(--color-brand-black)]"
                style={{ background: trainer.accentColor }}
              >
                Most Popular
              </div>
            )}

            <div className="p-7 flex flex-col flex-1">
              {/* Tier name */}
              <h3 className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-brand-cream)] mb-1">
                {tier.name}
              </h3>
              <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] mb-5 leading-relaxed">
                {tier.description}
              </p>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-[rgba(255,255,255,0.07)]">
                <div className="flex items-baseline gap-2">
                  <span className="font-[var(--font-heading)] text-4xl font-bold text-[var(--color-brand-cream)]">
                    {formatPrice(tier.price)}
                  </span>
                  {tier.originalPrice && (
                    <span className="text-sm text-[var(--color-brand-muted)] line-through font-[var(--font-sans)]">
                      {formatPrice(tier.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] mt-1">
                  {tier.duration}
                  {tier.originalPrice && (
                    <span className="ml-2 text-emerald-400 font-medium">
                      Save {formatPrice(tier.originalPrice - tier.price)}
                    </span>
                  )}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1" aria-label={`${tier.name} features`}>
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: trainer.accentColor }}
                      aria-hidden="true"
                    />
                    <span className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {tier.ctaLabel === 'Apply Now' ? (
                <a
                  href={getTrainerWhatsAppUrl(trainer, `Hi ${trainer.name}! I'd like to apply for your Elite 1-on-1 Coaching. Can we discuss?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-[var(--radius-btn)] font-[var(--font-sans)] font-semibold text-base transition-all duration-200 cursor-pointer"
                  style={{
                    background: `${trainer.accentColor}20`,
                    border: `1px solid ${trainer.accentColor}50`,
                    color: trainer.accentColor,
                  }}
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  {tier.ctaLabel}
                </a>
              ) : (
                <Button
                  variant={tier.isPopular ? 'primary' : 'secondary'}
                  size="md"
                  className="w-full"
                  asChild
                >
                  <Link href="/auth/signup">{tier.ctaLabel}</Link>
                </Button>
              )}
            </div>
          </motion.article>
        ))}
      </div>

      {/* Guarantee note */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center mt-10 text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]"
      >
        🛡️ All plans include a <span className="text-[var(--color-brand-cream)]">7-day money-back guarantee</span> — no questions asked.
      </motion.p>
    </Section>
  )
}
