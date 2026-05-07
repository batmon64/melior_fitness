'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { Section, SectionHeading } from '@/components/ui/Section'
import { FAQS } from '@/constants/data'
import { cn } from '@/lib/utils'

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <Section id="faq" className="bg-[var(--color-brand-dark)] relative">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(202,138,4,0.3), transparent)' }}
        aria-hidden="true"
      />

      <SectionHeading
        eyebrow="FAQ"
        title={<>Questions? <span className="text-gradient-gold italic">Answered.</span></>}
        subtitle="Everything you need to know before taking the next step."
      />

      <div className="max-w-3xl mx-auto space-y-3" role="list" aria-label="Frequently asked questions">
        {FAQS.map((faq, i) => {
          const isOpen = open === i
          return (
            <motion.div
              key={i}
              role="listitem"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={cn(
                'glass rounded-[var(--radius-card)] overflow-hidden transition-all duration-300',
                isOpen && 'border-[rgba(202,138,4,0.25)] shadow-[0_0_24px_rgba(202,138,4,0.06)]'
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer group"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
                id={`faq-question-${i}`}
              >
                <span
                  className={cn(
                    'text-base font-[var(--font-sans)] font-medium transition-colors duration-200',
                    isOpen
                      ? 'text-[var(--color-brand-cream)]'
                      : 'text-[var(--color-brand-muted)] group-hover:text-[var(--color-brand-cream)]'
                  )}
                >
                  {faq.question}
                </span>
                <div
                  className={cn(
                    'shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200',
                    isOpen
                      ? 'bg-[var(--color-brand-gold)] text-[var(--color-brand-black)]'
                      : 'bg-[rgba(255,255,255,0.06)] text-[var(--color-brand-muted)]'
                  )}
                  aria-hidden="true"
                >
                  {isOpen ? (
                    <Minus className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-answer-${i}`}
                    role="region"
                    aria-labelledby={`faq-question-${i}`}
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0">
                      <div className="h-px bg-[rgba(255,255,255,0.06)] mb-4" aria-hidden="true" />
                      <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
