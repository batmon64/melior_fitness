'use client'

import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Section, SectionHeading } from '@/components/ui/Section'
import type { TrainerData } from '@/constants/trainers'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function TrainerBio({ trainer }: { trainer: TrainerData }) {
  return (
    <Section id="bio" className="relative bg-[var(--color-brand-dark)]">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${trainer.accentColor}60, transparent)` }}
        aria-hidden="true"
      />

      <div className="grid lg:grid-cols-2 gap-16 items-start">

        {/* Left — Bio text */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <SectionHeading
            eyebrow="About"
            title={<>The Story<br />Behind <span className="italic" style={{ color: trainer.accentColor }}>{trainer.name}</span></>}
            centered={false}
            className="mb-8"
          />

          <div className="space-y-4">
            {trainer.bioExtended.split('\n\n').map((para, i) => (
              <p
                key={i}
                className="text-base text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-[1.85]"
              >
                {para.trim()}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Right — Philosophy + Week in the life */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          className="space-y-8"
        >
          {/* Philosophy */}
          <div className="glass rounded-2xl p-6">
            <h3
              className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.2em] uppercase mb-5"
              style={{ color: trainer.accentColor }}
            >
              Core Philosophy
            </h3>
            <ul className="space-y-4">
              {trainer.philosophy.map((belief, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{ color: trainer.accentColor }}
                    aria-hidden="true"
                  />
                  <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed">
                    {belief}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Week in the life */}
          <div className="glass rounded-2xl p-6">
            <h3
              className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.2em] uppercase mb-5"
              style={{ color: trainer.accentColor }}
            >
              A Week With {trainer.name}
            </h3>
            <ul className="space-y-3">
              {trainer.typicalWeek.map((day, i) => {
                const [label, ...rest] = day.split('—')
                return (
                  <li key={i} className="flex gap-3 text-sm font-[var(--font-sans)]">
                    <span className="font-semibold text-[var(--color-brand-cream)] shrink-0 w-28">{label.trim()}</span>
                    <span className="text-[var(--color-brand-muted)]">{rest.join('—').trim()}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
