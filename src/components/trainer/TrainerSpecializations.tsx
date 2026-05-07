'use client'

import { motion } from 'framer-motion'
import { Flame, Dumbbell, Zap, RefreshCw, TrendingUp, BarChart, Heart, Leaf, Star } from 'lucide-react'
import { Section, SectionHeading } from '@/components/ui/Section'
import type { TrainerData } from '@/constants/trainers'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const ICON_MAP: Record<string, React.ReactNode> = {
  Flame:      <Flame className="w-5 h-5" aria-hidden="true" />,
  Dumbbell:   <Dumbbell className="w-5 h-5" aria-hidden="true" />,
  Zap:        <Zap className="w-5 h-5" aria-hidden="true" />,
  RefreshCw:  <RefreshCw className="w-5 h-5" aria-hidden="true" />,
  TrendingUp: <TrendingUp className="w-5 h-5" aria-hidden="true" />,
  BarChart:   <BarChart className="w-5 h-5" aria-hidden="true" />,
  Heart:      <Heart className="w-5 h-5" aria-hidden="true" />,
  Leaf:       <Leaf className="w-5 h-5" aria-hidden="true" />,
  Star:       <Star className="w-5 h-5" aria-hidden="true" />,
  Sparkles:   <Star className="w-5 h-5" aria-hidden="true" />,
}

export function TrainerSpecializations({ trainer }: { trainer: TrainerData }) {
  return (
    <Section id="specializations" className="relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 40% at 50% 100%, ${trainer.accentColor}08 0%, transparent 70%)` }}
        aria-hidden="true"
      />

      <SectionHeading
        eyebrow="Expertise"
        title={<>What {trainer.name} <span className="italic" style={{ color: trainer.accentColor }}>Specialises In</span></>}
        subtitle="Areas of deep expertise backed by years of study, certifications, and real-world client results."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {trainer.specializations.map((spec, i) => (
          <motion.div
            key={spec.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: EASE, delay: i * 0.07 }}
            className="glass rounded-2xl p-6 group hover:border-[rgba(202,138,4,0.2)] transition-all duration-300 cursor-default"
            style={{ '--tw-border-opacity': '1' } as React.CSSProperties}
          >
            {/* Icon */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
              style={{
                background: `${trainer.accentColor}18`,
                color: trainer.accentColor,
              }}
            >
              {ICON_MAP[spec.icon] ?? <Star className="w-5 h-5" aria-hidden="true" />}
            </div>

            <h3 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-brand-cream)] mb-2 leading-snug">
              {spec.title}
            </h3>
            <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed">
              {spec.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
