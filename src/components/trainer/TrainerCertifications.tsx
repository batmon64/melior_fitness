'use client'

import { motion } from 'framer-motion'
import { Award, ShieldCheck } from 'lucide-react'
import { Section, SectionHeading } from '@/components/ui/Section'
import type { TrainerData } from '@/constants/trainers'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function TrainerCertifications({ trainer }: { trainer: TrainerData }) {
  return (
    <Section id="certifications" className="bg-[var(--color-brand-dark)] relative">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${trainer.accentColor}50, transparent)` }}
        aria-hidden="true"
      />

      <SectionHeading
        eyebrow="Credentials"
        title={<><span className="italic" style={{ color: trainer.accentColor }}>{trainer.name}&apos;s</span> Certifications</>}
        subtitle="Every certification represents months of study and a commitment to evidence-based practice."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {trainer.certifications.map((cert, i) => (
          <motion.div
            key={cert.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
            className="glass rounded-2xl p-5 flex gap-4 items-start hover:border-[rgba(202,138,4,0.2)] transition-all duration-300"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: `${trainer.accentColor}18`, color: trainer.accentColor }}
            >
              <Award className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)] leading-snug mb-1">
                {cert.name}
              </p>
              <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed">
                {cert.issuer}
              </p>
              <p className="text-xs font-[var(--font-sans)] mt-1.5" style={{ color: trainer.accentColor }}>
                {cert.year}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust note */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center justify-center gap-3 mt-12 text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]"
      >
        <ShieldCheck className="w-5 h-5" style={{ color: trainer.accentColor }} aria-hidden="true" />
        All certifications verified and up to date
      </motion.div>
    </Section>
  )
}
