'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Dumbbell, Apple, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface StepWelcomeProps {
  userName: string
  onNext: () => void
  direction: number
}

const features = [
  { icon: <Apple className="w-5 h-5" aria-hidden="true" />, text: 'Personalised diet plan recommendations' },
  { icon: <Dumbbell className="w-5 h-5" aria-hidden="true" />, text: 'Coach matching based on your goals' },
  { icon: <MessageCircle className="w-5 h-5" aria-hidden="true" />, text: 'Direct WhatsApp access to your trainer' },
]

export function StepWelcome({ userName, onNext, direction }: StepWelcomeProps) {
  return (
    <motion.div
      key="welcome"
      custom={direction}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center text-center"
    >
      {/* Gold M logo */}
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-brand-gold)] flex items-center justify-center mb-8 shadow-[0_0_32px_rgba(202,138,4,0.35)]">
        <span className="font-[var(--font-heading)] font-bold text-[var(--color-brand-black)] text-2xl">M</span>
      </div>

      {/* Heading */}
      <h1 className="font-[var(--font-heading)] text-4xl md:text-5xl font-bold text-[var(--color-brand-cream)] leading-tight mb-4">
        Welcome,{' '}
        <span className="text-gradient-gold italic">
          {userName.split(' ')[0]}
        </span>
        !
      </h1>

      <p className="text-base text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed max-w-md mb-10">
        We need 2 minutes to understand your body, goals, and lifestyle — so we can point you to the right plan and trainer.
      </p>

      {/* Feature list */}
      <div className="w-full max-w-sm space-y-3 mb-10">
        {features.map(({ icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-3 glass rounded-xl px-4 py-3 text-left"
          >
            <span className="text-[var(--color-brand-gold)] shrink-0">{icon}</span>
            <span className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">{text}</span>
          </div>
        ))}
      </div>

      <Button variant="primary" size="xl" onClick={onNext}>
        Let&apos;s Get Started
        <ArrowRight className="w-5 h-5" aria-hidden="true" />
      </Button>

      <p className="mt-5 text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
        Takes about 2 minutes · Your data is private and secure
      </p>
    </motion.div>
  )
}
