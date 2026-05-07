'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import type { TrainerData } from '@/constants/trainers'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function TrainerTestimonials({ trainer }: { trainer: TrainerData }) {
  return (
    <Section id="testimonials" className="relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 40% at 50% 100%, ${trainer.accentColor}06 0%, transparent 70%)` }}
        aria-hidden="true"
      />

      <SectionHeading
        eyebrow="Reviews"
        title={<>What Clients Say<br />About <span className="italic" style={{ color: trainer.accentColor }}>{trainer.name}</span></>}
        subtitle="Unfiltered feedback from clients who committed to the process."
      />

      <div className="grid md:grid-cols-2 gap-6">
        {trainer.testimonials.map((t, i) => (
          <motion.article
            key={t.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: EASE, delay: i * 0.1 }}
            className="glass rounded-2xl p-6 flex flex-col gap-5 hover:border-[rgba(202,138,4,0.15)] transition-all duration-300"
          >
            {/* Stars */}
            <div className="flex items-center gap-1" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: t.rating }).map((_, idx) => (
                <Star
                  key={idx}
                  className="w-4 h-4"
                  style={{ fill: trainer.accentColor, color: trainer.accentColor }}
                  aria-hidden="true"
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="relative flex-1">
              <Quote
                className="absolute -top-1 -left-1 w-7 h-7 opacity-20"
                style={{ color: trainer.accentColor }}
                aria-hidden="true"
              />
              <p className="text-sm text-[var(--color-brand-cream)] font-[var(--font-sans)] leading-relaxed pl-5">
                {t.quote}
              </p>
            </blockquote>

            {/* Result badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-[var(--font-sans)] font-semibold w-fit"
              style={{
                background: `${trainer.accentColor}12`,
                border: `1px solid ${trainer.accentColor}30`,
                color: trainer.accentColor,
              }}
            >
              ✓ {t.result} · {t.duration}
            </div>

            {/* Author */}
            <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${trainer.accentColor}20` }}
                >
                  <span
                    className="text-sm font-[var(--font-heading)] font-bold"
                    style={{ color: trainer.accentColor }}
                  >
                    {t.name[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">{t.name}</p>
                  <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">{t.location}</p>
                </div>
              </div>
              <Badge variant="glass" className="text-xs">Verified Client</Badge>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
