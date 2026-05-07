'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Quote } from 'lucide-react'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import type { TrainerData } from '@/constants/trainers'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function TrainerTransformations({ trainer }: { trainer: TrainerData }) {
  return (
    <Section id="results" className="bg-[var(--color-brand-dark)] relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${trainer.accentColor}50, transparent)` }}
        aria-hidden="true"
      />

      <SectionHeading
        eyebrow="Transformations"
        title={<>Real Results from <span className="italic" style={{ color: trainer.accentColor }}>Real Clients</span></>}
        subtitle={`Every number below represents a life changed by ${trainer.name}'s coaching.`}
      />

      <div className="grid sm:grid-cols-2 gap-6">
        {trainer.transformations.map((t, i) => (
          <motion.article
            key={t.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: EASE, delay: i * 0.1 }}
            className="glass rounded-2xl overflow-hidden hover:border-[rgba(202,138,4,0.2)] transition-all duration-300"
          >
            {/* Before / After bar */}
            <div
              className="p-5 border-b border-[rgba(255,255,255,0.06)]"
              style={{ background: `${trainer.accentColor}08` }}
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant="gold" className="text-xs">{t.goalType}</Badge>
                <span className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">{t.duration}</span>
              </div>

              <div className="flex items-center gap-4">
                {/* Before */}
                <div className="text-center flex-1 p-3 rounded-xl bg-[rgba(255,255,255,0.04)]">
                  <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] mb-1">Before</p>
                  <p className="font-[var(--font-heading)] text-xl font-bold text-[var(--color-brand-cream)]">
                    {t.beforeWeight}
                  </p>
                </div>

                {/* Arrow */}
                <div style={{ color: trainer.accentColor }}>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </div>

                {/* After */}
                <div
                  className="text-center flex-1 p-3 rounded-xl"
                  style={{ background: `${trainer.accentColor}15`, border: `1px solid ${trainer.accentColor}30` }}
                >
                  <p className="text-xs font-[var(--font-sans)] mb-1" style={{ color: trainer.accentColor }}>After</p>
                  <p className="font-[var(--font-heading)] text-xl font-bold" style={{ color: trainer.accentColor }}>
                    {t.afterWeight}
                  </p>
                </div>

                {/* Weight lost */}
                <div className="text-center flex-1 p-3 rounded-xl bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.15)]">
                  <p className="text-xs text-emerald-400 font-[var(--font-sans)] mb-1">Result</p>
                  <p className="font-[var(--font-heading)] text-xl font-bold text-emerald-400">
                    {t.weightLost}
                  </p>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="p-5">
              <Quote className="w-6 h-6 text-[var(--color-brand-stone)] mb-3" aria-hidden="true" />
              <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed italic mb-4">
                {t.quote}
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${trainer.accentColor}20` }}
                >
                  <span
                    className="font-[var(--font-heading)] text-sm font-bold"
                    style={{ color: trainer.accentColor }}
                  >
                    {t.clientName[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
                    {t.clientName}
                  </p>
                  <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                    {t.location}
                  </p>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
