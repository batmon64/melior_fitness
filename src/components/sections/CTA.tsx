'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'

export function CTA() {
  return (
    <Section id="contact" className="relative overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(202,138,4,0.1) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-4xl mx-auto text-center"
      >
        {/* Eyebrow */}
        <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.2em] uppercase text-[var(--color-brand-gold)] mb-6">
          Ready to Begin?
        </p>

        {/* Heading */}
        <h2 className="font-[var(--font-heading)] text-4xl md:text-6xl lg:text-7xl text-[var(--color-brand-cream)] leading-[1.1] mb-6">
          Your best body is{' '}
          <span className="text-gradient-gold italic">90 days away.</span>
        </h2>

        {/* Subtext */}
        <p className="text-lg text-[var(--color-brand-muted)] font-[var(--font-sans)] max-w-2xl mx-auto leading-relaxed mb-10">
          Start with a diet plan today — or book a free consultation with Vishal or Sharon to find the right path for your body and goals.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button variant="primary" size="xl" asChild>
            <Link href="/auth/signup">
              Start Transformation
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </Button>
          <Button variant="secondary" size="xl" asChild>
            <Link href="/#plans">Browse Plans</Link>
          </Button>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[var(--color-brand-gold)]" aria-hidden="true" />
            7-day money-back guarantee
          </span>
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--color-brand-gold)]" aria-hidden="true" />
            Instant plan access after payment
          </span>
        </div>
      </motion.div>
    </Section>
  )
}
