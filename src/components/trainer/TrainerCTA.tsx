'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageCircle, ArrowRight, Shield, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import type { TrainerData } from '@/constants/trainers'
import { getTrainerWhatsAppUrl } from '@/constants/trainers'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function TrainerCTA({ trainer }: { trainer: TrainerData }) {
  return (
    <Section id="contact" className="relative overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${trainer.accentColor}0D 0%, transparent 70%)` }}
        aria-hidden="true"
      />

      {/* Animated border top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${trainer.accentColor}80, transparent)` }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-3xl mx-auto text-center"
      >
        {/* Eyebrow */}
        <p
          className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.2em] uppercase mb-6"
          style={{ color: trainer.accentColor }}
        >
          Ready to Start?
        </p>

        {/* Heading */}
        <h2 className="font-[var(--font-heading)] text-4xl md:text-5xl lg:text-6xl text-[var(--color-brand-cream)] leading-[1.1] mb-6">
          Work directly with{' '}
          <span className="italic" style={{ color: trainer.accentColor }}>
            {trainer.name}
          </span>
        </h2>

        {/* Subtext */}
        <p className="text-base md:text-lg text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed mb-10 max-w-xl mx-auto">
          Start with a diet plan, or message {trainer.name} directly on WhatsApp for a free 10-minute intro call. No pressure, no sales pitch.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button variant="primary" size="xl" asChild>
            <Link href="#pricing">
              Get Started Today
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </Button>

          <a
            href={getTrainerWhatsAppUrl(trainer)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 h-15 px-10 text-xl rounded-[var(--radius-btn)] font-[var(--font-sans)] font-semibold glass hover:border-[rgba(37,211,102,0.4)] transition-all duration-300 cursor-pointer text-[var(--color-brand-cream)]"
          >
            <MessageCircle className="w-6 h-6" style={{ color: '#25D366' }} aria-hidden="true" />
            WhatsApp {trainer.name}
          </a>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4" style={{ color: trainer.accentColor }} aria-hidden="true" />
            7-day money-back guarantee
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: trainer.accentColor }} aria-hidden="true" />
            Response within 2 hours
          </span>
          <span className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" style={{ color: trainer.accentColor }} aria-hidden="true" />
            Free intro call available
          </span>
        </div>

        {/* Other trainer nudge */}
        <p className="mt-10 text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          Not sure if {trainer.name} is right for you?{' '}
          <Link
            href="/#trainers"
            className="font-medium hover:underline cursor-pointer transition-colors"
            style={{ color: trainer.accentColor }}
          >
            Meet our other coaches →
          </Link>
        </p>
      </motion.div>
    </Section>
  )
}
