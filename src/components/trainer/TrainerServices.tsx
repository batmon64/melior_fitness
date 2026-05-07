'use client'

import { motion } from 'framer-motion'
import { FileText, Video, Target, Check } from 'lucide-react'
import { Section, SectionHeading } from '@/components/ui/Section'
import type { TrainerData } from '@/constants/trainers'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-6 h-6" aria-hidden="true" />,
  Video:    <Video className="w-6 h-6" aria-hidden="true" />,
  Target:   <Target className="w-6 h-6" aria-hidden="true" />,
}

export function TrainerServices({ trainer }: { trainer: TrainerData }) {
  return (
    <Section id="services" className="bg-[var(--color-brand-dark)] relative">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${trainer.accentColor}50, transparent)` }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${trainer.accentColor}50, transparent)` }}
        aria-hidden="true"
      />

      <SectionHeading
        eyebrow="Services"
        title={<>How <span className="italic" style={{ color: trainer.accentColor }}>{trainer.name}</span> Can Help You</>}
        subtitle="Choose the level of support that fits your goals and lifestyle."
      />

      <div className="grid md:grid-cols-3 gap-6">
        {trainer.services.map((service, i) => (
          <motion.article
            key={service.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.12 }}
            className="glass rounded-2xl p-7 flex flex-col hover:border-[rgba(202,138,4,0.2)] transition-all duration-300"
          >
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shrink-0"
              style={{ background: `${trainer.accentColor}15`, color: trainer.accentColor }}
            >
              {ICON_MAP[service.icon] ?? <Target className="w-6 h-6" aria-hidden="true" />}
            </div>

            <h3 className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-brand-cream)] mb-3">
              {service.name}
            </h3>

            <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed mb-6 flex-1">
              {service.description}
            </p>

            <ul className="space-y-2.5" aria-label={`${service.name} features`}>
              {service.features.map((feature) => (
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
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
