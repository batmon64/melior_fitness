'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, X, FileText, Calculator, ShoppingCart, ChefHat, Mail, Download,
         MessageCircle, Clock, Video, ClipboardList, Pill, Dumbbell, BarChart,
         Leaf, Heart, Apple, FlaskConical, RefreshCw, Droplets } from 'lucide-react'
import { PlanCard } from './PlanCard'
import { Badge } from '@/components/ui/Badge'
import type { DetailedPlan } from '@/constants/plans'
import { getRelatedPlans } from '@/constants/plans'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText:      <FileText className="w-5 h-5" aria-hidden="true" />,
  Calculator:    <Calculator className="w-5 h-5" aria-hidden="true" />,
  ShoppingCart:  <ShoppingCart className="w-5 h-5" aria-hidden="true" />,
  ChefHat:       <ChefHat className="w-5 h-5" aria-hidden="true" />,
  Mail:          <Mail className="w-5 h-5" aria-hidden="true" />,
  Download:      <Download className="w-5 h-5" aria-hidden="true" />,
  MessageCircle: <MessageCircle className="w-5 h-5" aria-hidden="true" />,
  Clock:         <Clock className="w-5 h-5" aria-hidden="true" />,
  Video:         <Video className="w-5 h-5" aria-hidden="true" />,
  ClipboardList: <ClipboardList className="w-5 h-5" aria-hidden="true" />,
  Pill:          <Pill className="w-5 h-5" aria-hidden="true" />,
  Dumbbell:      <Dumbbell className="w-5 h-5" aria-hidden="true" />,
  BarChart:      <BarChart className="w-5 h-5" aria-hidden="true" />,
  Leaf:          <Leaf className="w-5 h-5" aria-hidden="true" />,
  Heart:         <Heart className="w-5 h-5" aria-hidden="true" />,
  Apple:         <Apple className="w-5 h-5" aria-hidden="true" />,
  FlaskConical:  <FlaskConical className="w-5 h-5" aria-hidden="true" />,
  RefreshCw:     <RefreshCw className="w-5 h-5" aria-hidden="true" />,
  Droplets:      <Droplets className="w-5 h-5" aria-hidden="true" />,
}

interface PlanDetailContentProps {
  plan: DetailedPlan
}

export function PlanDetailContent({ plan }: PlanDetailContentProps) {
  const related = getRelatedPlans(plan.relatedSlugs)

  return (
    <div className="space-y-14">

      {/* ── About ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        aria-labelledby="about-heading"
      >
        <h2 id="about-heading" className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--color-brand-cream)] mb-5">
          About This Plan
        </h2>
        <div className="space-y-4">
          {plan.longDescription.split('\n\n').map((para, i) => (
            <p key={i} className="text-base text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-[1.85]">
              {para.trim()}
            </p>
          ))}
        </div>
      </motion.section>

      {/* ── Who it's for / not for ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        aria-labelledby="audience-heading"
      >
        <h2 id="audience-heading" className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--color-brand-cream)] mb-5">
          Is This Plan Right For You?
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {/* For */}
          <div className="glass rounded-2xl p-5">
            <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-emerald-400 mb-4">
              This plan IS for you if…
            </p>
            <ul className="space-y-3">
              {plan.targetAudience.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Not for */}
          <div className="glass rounded-2xl p-5">
            <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-red-400 mb-4">
              This plan is NOT for you if…
            </p>
            <ul className="space-y-3">
              {plan.notFor.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* ── What's included ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        aria-labelledby="includes-heading"
      >
        <h2 id="includes-heading" className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--color-brand-cream)] mb-5">
          Everything That's Included
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {plan.whatsIncluded.map((item) => (
            <div key={item.title} className="glass rounded-xl p-5 flex gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${plan.accentColor}18`, color: plan.accentColor }}
              >
                {ICON_MAP[item.icon] ?? <FileText className="w-5 h-5" aria-hidden="true" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)] mb-1">
                  {item.title}
                </p>
                <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Sample day ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        aria-labelledby="sample-heading"
      >
        <h2 id="sample-heading" className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--color-brand-cream)] mb-2">
          Sample Day of Eating
        </h2>
        <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] mb-5">
          A preview from Week 2 of the plan. Every day is mapped out like this.
        </p>
        <div className="glass rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-4 px-5 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
            {['Time', 'Meal', 'Calories', 'Protein'].map((h) => (
              <span key={h} className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.1em] uppercase text-[var(--color-brand-muted)]">
                {h}
              </span>
            ))}
          </div>
          {plan.sampleDay.map((meal, i) => (
            <div
              key={meal.time}
              className={`grid grid-cols-4 px-5 py-4 ${i < plan.sampleDay.length - 1 ? 'border-b border-[rgba(255,255,255,0.04)]' : ''}`}
            >
              <span className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] font-medium">{meal.time}</span>
              <span className="text-sm text-[var(--color-brand-cream)] font-[var(--font-sans)] col-span-1 pr-4">{meal.name}</span>
              <span className="text-sm font-[var(--font-sans)]" style={{ color: plan.accentColor }}>{meal.calories}</span>
              <span className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">{meal.protein}</span>
            </div>
          ))}
          {/* Daily totals */}
          <div className="px-5 py-3 bg-[rgba(255,255,255,0.02)] border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
            <span className="text-xs font-[var(--font-sans)] font-semibold text-[var(--color-brand-muted)]">Daily total range</span>
            <span className="text-sm font-semibold font-[var(--font-sans)]" style={{ color: plan.accentColor }}>
              {plan.caloriesRange}
            </span>
          </div>
        </div>
      </motion.section>

      {/* ── Week breakdown ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        aria-labelledby="weeks-heading"
      >
        <h2 id="weeks-heading" className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--color-brand-cream)] mb-5">
          Week-by-Week Breakdown
        </h2>
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-5 top-0 bottom-0 w-px hidden sm:block"
            style={{ background: `linear-gradient(to bottom, ${plan.accentColor}60, transparent)` }}
            aria-hidden="true"
          />
          <div className="space-y-4 sm:pl-12">
            {plan.weekBreakdown.map((week, i) => (
              <div key={week.label} className="relative">
                {/* Dot */}
                <div
                  className="absolute -left-12 top-3 w-4 h-4 rounded-full hidden sm:flex items-center justify-center"
                  style={{ background: plan.accentColor }}
                  aria-hidden="true"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-black)]" />
                </div>
                <div className="glass rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="gold" className="text-xs">{week.label}</Badge>
                    <span className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
                      {week.focus}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed">
                    {week.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Trainer section ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        aria-labelledby="trainer-heading"
      >
        <h2 id="trainer-heading" className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--color-brand-cream)] mb-5">
          Meet Your Coach
        </h2>
        <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-[var(--font-heading)] font-bold shrink-0"
            style={{ background: plan.accentColor, color: '#0A0908' }}
            aria-hidden="true"
          >
            {plan.trainerName[0]}
          </div>
          <div className="flex-1">
            <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase mb-1" style={{ color: plan.accentColor }}>
              Plan Designer
            </p>
            <h3 className="font-[var(--font-heading)] text-xl font-bold text-[var(--color-brand-cream)] mb-1">
              {plan.trainerName}
            </h3>
            <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] mb-4">
              {plan.trainerTitle}
            </p>
            <Link
              href={`/trainers/${plan.trainerSlug}`}
              className="text-sm font-medium font-[var(--font-sans)] hover:underline cursor-pointer transition-colors"
              style={{ color: plan.accentColor }}
            >
              View full profile →
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── FAQ ── */}
      {plan.faqs.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          aria-labelledby="faq-heading"
        >
          <h2 id="faq-heading" className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--color-brand-cream)] mb-5">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {plan.faqs.map((faq) => (
              <details key={faq.question} className="glass rounded-xl group">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-[var(--font-sans)] font-medium text-sm text-[var(--color-brand-cream)] hover:text-[var(--color-brand-gold)] transition-colors">
                  {faq.question}
                  <span className="text-[var(--color-brand-muted)] group-open:rotate-45 transition-transform duration-200 shrink-0 ml-4 text-lg leading-none">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 pt-0">
                  <div className="h-px bg-[rgba(255,255,255,0.06)] mb-4" aria-hidden="true" />
                  <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Related plans ── */}
      {related.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          aria-labelledby="related-heading"
        >
          <h2 id="related-heading" className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--color-brand-cream)] mb-5">
            You Might Also Like
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((p, i) => (
              <PlanCard key={p.id} plan={p} index={i} />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  )
}
