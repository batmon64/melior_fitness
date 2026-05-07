'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay } },
  }
}

export function Hero() {
  return (
    <section
      className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0 bg-[var(--color-brand-black)]" aria-hidden="true" />

      {/* Gold radial glow — top centre */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #CA8A04 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(202,138,4,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(202,138,4,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      {/* Side accent bars */}
      <div
        className="absolute left-8 top-1/4 bottom-1/4 w-px pointer-events-none hidden lg:block"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(202,138,4,0.4), transparent)' }}
        aria-hidden="true"
      />
      <div
        className="absolute right-8 top-1/4 bottom-1/4 w-px pointer-events-none hidden lg:block"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(202,138,4,0.4), transparent)' }}
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-28 pb-16">

        {/* Eyebrow badge */}
        <motion.div {...fadeUp(0)} className="flex justify-center mb-8">
          <Badge variant="gold" className="px-4 py-1.5 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-gold)] animate-pulse" aria-hidden="true" />
            Premium Fitness Coaching — India
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.1)}
          className="font-[var(--font-heading)] font-bold leading-[1.08] tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[var(--color-brand-cream)]"
        >
          Transform Your{' '}
          <span className="text-gradient-gold italic">Body.</span>
          <br />
          Elevate Your{' '}
          <span className="relative inline-block" aria-label="Life">
            Life.
            <span
              className="absolute -bottom-1 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #CA8A04, transparent)' }}
              aria-hidden="true"
            />
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...fadeUp(0.2)}
          className="mt-8 text-lg md:text-xl text-[var(--color-brand-muted)] max-w-2xl mx-auto leading-relaxed"
        >
          Science-backed diet plans and 1-on-1 coaching from certified trainers{' '}
          <span className="text-[var(--color-brand-cream)] font-medium">Vishal</span> &{' '}
          <span className="text-[var(--color-brand-cream)] font-medium">Sharon</span>.
          Join <span className="text-[var(--color-brand-gold)] font-semibold">800+</span> clients
          who have already changed their lives.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          {...fadeUp(0.3)}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="primary" size="lg" asChild>
            <Link href="/auth/signup">
              Start Your Transformation
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </Button>

          <Button variant="glass" size="lg" asChild>
            <Link href="/#plans">
              <Play className="w-4 h-4" aria-hidden="true" />
              View Diet Plans
            </Link>
          </Button>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          {...fadeUp(0.4)}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {[
            '✓ No restrictive crash diets',
            '✓ 7-day money-back guarantee',
            '✓ Instant plan access',
          ].map((signal) => (
            <span key={signal} className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
              {signal}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Stats strip ── */}
      <motion.div
        {...fadeUp(0.5)}
        className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-16"
      >
        <div className="glass rounded-[var(--radius-card)] p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '800+', label: 'Clients Transformed' },
            { value: '2,400+', label: 'Plans Sold' },
            { value: '11 kg', label: 'Avg Weight Lost' },
            { value: '98%', label: 'Satisfaction Rate' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-[var(--font-heading)] text-3xl md:text-4xl font-bold text-gradient-gold">
                {stat.value}
              </div>
              <div className="mt-1 text-xs md:text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--color-brand-muted)]"
        aria-hidden="true"
      >
        <span className="text-xs font-[var(--font-sans)] tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}
