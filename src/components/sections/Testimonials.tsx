'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { TESTIMONIALS } from '@/constants/data'
import { cn } from '@/lib/utils'

export function Testimonials() {
  return (
    <Section id="results" className="relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(202,138,4,0.06) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <SectionHeading
        eyebrow="Transformation Stories"
        title={<>Real Results. <span className="text-gradient-gold italic">Real People.</span></>}
        subtitle="Every number behind these stories represents a life changed. Read what our clients say about their journey."
      />

      {/* Testimonials grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {TESTIMONIALS.map((t, i) => (
          <motion.article
            key={t.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
            className="glass rounded-[var(--radius-card)] p-6 flex flex-col gap-5 hover:border-[rgba(202,138,4,0.2)] transition-all duration-300"
          >
            {/* Rating */}
            <div className="flex items-center gap-1" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: t.rating }).map((_, idx) => (
                <Star
                  key={idx}
                  className="w-4 h-4 fill-[var(--color-brand-gold)] text-[var(--color-brand-gold)]"
                  aria-hidden="true"
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="relative">
              <Quote
                className="absolute -top-1 -left-1 w-8 h-8 text-[var(--color-brand-gold)] opacity-20"
                aria-hidden="true"
              />
              <p className="text-base text-[var(--color-brand-cream)] font-[var(--font-sans)] leading-relaxed pl-5">
                {t.quote}
              </p>
            </blockquote>

            {/* Transformation stats */}
            {(t.before || t.after || t.weightLost) && (
              <div className="flex items-center gap-4 p-3 rounded-xl bg-[rgba(202,138,4,0.06)] border border-[rgba(202,138,4,0.12)]">
                {t.before && (
                  <div className="text-center">
                    <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] mb-0.5">Before</p>
                    <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
                      {t.before}
                    </p>
                  </div>
                )}
                {t.before && t.after && (
                  <div className="flex-1 h-px bg-gradient-to-r from-[rgba(202,138,4,0.3)] via-[rgba(202,138,4,0.6)] to-[rgba(202,138,4,0.3)]" aria-hidden="true" />
                )}
                {t.after && (
                  <div className="text-center">
                    <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] mb-0.5">After</p>
                    <p className="text-sm font-semibold text-[var(--color-brand-gold)] font-[var(--font-sans)]">
                      {t.after}
                    </p>
                  </div>
                )}
                <div className="ml-auto text-center">
                  <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] mb-0.5">Duration</p>
                  <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
                    {t.duration}
                  </p>
                </div>
              </div>
            )}

            {/* Author */}
            <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="w-9 h-9 rounded-full bg-[var(--color-brand-stone)] flex items-center justify-center shrink-0">
                  <span className="text-sm font-[var(--font-heading)] font-bold text-[var(--color-brand-gold)]">
                    {t.name[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
                    {t.name}
                  </p>
                  <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                    {t.location}
                  </p>
                </div>
              </div>
              <Badge variant="glass" className="text-xs">
                Coach {t.trainerName}
              </Badge>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Bottom trust bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-16 text-center"
      >
        <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          Join{' '}
          <span className="text-[var(--color-brand-gold)] font-semibold">800+ clients</span>{' '}
          who have already transformed their lives
        </p>
      </motion.div>
    </Section>
  )
}
