'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageCircle, ArrowRight, ChevronDown, Star, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { TrainerData } from '@/constants/trainers'
import { getTrainerWhatsAppUrl } from '@/constants/trainers'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function TrainerHero({ trainer }: { trainer: TrainerData }) {
  const isSharon = trainer.slug === 'sharon'

  return (
    <section className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden" aria-label={`${trainer.name} hero`}>

      {/* ── Layered cinematic background ── */}
      <div className="absolute inset-0 bg-[var(--color-brand-black)]" aria-hidden="true" />

      {/* Trainer-specific accent glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full opacity-15 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${trainer.accentColor} 0%, transparent 70%)` }}
        aria-hidden="true"
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--color-brand-black), transparent)' }}
        aria-hidden="true"
      />

      {/* Diagonal line decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 right-0 w-px h-full opacity-10"
          style={{ background: `linear-gradient(to bottom, transparent, ${trainer.accentColor}, transparent)`, right: '15%' }}
        />
        <div
          className="absolute top-0 left-0 w-px h-full opacity-10"
          style={{ background: `linear-gradient(to bottom, transparent, ${trainer.accentColor}, transparent)`, left: '15%' }}
        />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${trainer.accentColor} 1px, transparent 1px), linear-gradient(90deg, ${trainer.accentColor} 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-28 pb-12">

        {/* Trainer badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex justify-center mb-8"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase"
            style={{
              background: `rgba(${isSharon ? '167,139,250' : '202,138,4'}, 0.1)`,
              borderColor: `${trainer.accentColor}40`,
              color: trainer.accentColor,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: trainer.accentColor }}
              aria-hidden="true"
            />
            {trainer.experience} Years Experience · Melior Fitness
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="font-[var(--font-heading)] font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[var(--color-brand-cream)] leading-[0.95] tracking-tight mb-4"
        >
          {trainer.name}
        </motion.h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className="font-[var(--font-sans)] text-lg md:text-xl font-medium mb-4"
          style={{ color: trainer.accentColor }}
        >
          {trainer.title}
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
          className="text-base md:text-lg text-[var(--color-brand-muted)] font-[var(--font-sans)] italic max-w-xl mx-auto mb-10"
        >
          &ldquo;{trainer.tagline}&rdquo;
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <Button variant="primary" size="lg" asChild>
            <Link href={`#pricing`}>
              Work With {trainer.name}
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </Button>
          <a
            href={getTrainerWhatsAppUrl(trainer)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 h-13 px-8 rounded-[var(--radius-btn)] glass text-[var(--color-brand-cream)] text-lg font-[var(--font-sans)] font-semibold hover:border-[rgba(202,138,4,0.3)] transition-all duration-300 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" style={{ color: '#25D366' }} aria-hidden="true" />
            Chat on WhatsApp
          </a>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
          className="glass rounded-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { icon: <Users className="w-5 h-5" aria-hidden="true" />, value: `${trainer.clientsHelped}+`, label: 'Clients Helped' },
            { icon: <Award className="w-5 h-5" aria-hidden="true" />, value: `${trainer.experience} Yrs`, label: 'Experience' },
            { icon: <Star className="w-5 h-5" aria-hidden="true" />, value: `${trainer.successRate}%`, label: 'Success Rate' },
            { icon: <ArrowRight className="w-5 h-5" aria-hidden="true" />, value: trainer.avgWeightLost, label: 'Avg Result' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="flex justify-center mb-2"
                style={{ color: trainer.accentColor }}
              >
                {stat.icon}
              </div>
              <div
                className="font-[var(--font-heading)] text-2xl md:text-3xl font-bold mb-1"
                style={{ color: trainer.accentColor }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

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
