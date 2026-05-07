'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Award, Users, Star, ArrowRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Section, SectionHeading } from '@/components/ui/Section'
import { TRAINERS } from '@/constants/data'
import { whatsappUrl } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function Trainers() {
  return (
    <Section id="trainers" className="relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(202,138,4,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <SectionHeading
        eyebrow="Meet Your Coaches"
        title={<>Your Transformation <span className="text-gradient-gold italic">Starts Here</span></>}
        subtitle="Two elite coaches. One goal — to help you build the body and life you deserve."
      />

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {TRAINERS.map((trainer, i) => (
          <motion.article
            key={trainer.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.15 }}
            className="glass rounded-[var(--radius-card)] overflow-hidden group cursor-pointer hover:border-[rgba(202,138,4,0.2)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(202,138,4,0.1)]"
          >
            {/* Trainer image placeholder */}
            <div className="relative h-72 bg-gradient-to-br from-[var(--color-brand-stone)] to-[var(--color-brand-dark)] overflow-hidden">
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(10,9,8,0.9) 0%, rgba(10,9,8,0.2) 50%, transparent 100%)',
                }}
                aria-hidden="true"
              />

              {/* Placeholder silhouette */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-[var(--color-brand-stone)] flex items-center justify-center">
                  <span className="font-[var(--font-heading)] text-5xl font-bold text-[var(--color-brand-gold)]">
                    {trainer.name[0]}
                  </span>
                </div>
              </div>

              {/* Experience badge */}
              <div className="absolute top-4 right-4">
                <Badge variant="gold">
                  <Star className="w-3 h-3" aria-hidden="true" />
                  {trainer.experience} Years
                </Badge>
              </div>

              {/* Name overlay */}
              <div className="absolute bottom-5 left-6">
                <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-gold)] mb-1">
                  {trainer.title}
                </p>
                <h3 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-brand-cream)]">
                  {trainer.name}
                </h3>
              </div>
            </div>

            {/* Card body */}
            <div className="p-6">
              <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed mb-5">
                {trainer.bio}
              </p>

              {/* Specialization */}
              <div className="mb-5 p-3 rounded-xl bg-[rgba(202,138,4,0.06)] border border-[rgba(202,138,4,0.12)]">
                <p className="text-xs text-[var(--color-brand-gold)] font-[var(--font-sans)] font-semibold tracking-wider uppercase mb-1">
                  Specialization
                </p>
                <p className="text-sm text-[var(--color-brand-cream)] font-[var(--font-sans)] font-medium">
                  {trainer.specialization}
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[rgba(202,138,4,0.1)] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-[var(--color-brand-gold)]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-[var(--font-heading)] text-lg font-bold text-[var(--color-brand-cream)]">
                      {trainer.clientsHelped}+
                    </p>
                    <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                      Clients helped
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[rgba(202,138,4,0.1)] flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-[var(--color-brand-gold)]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-[var(--font-heading)] text-lg font-bold text-[var(--color-brand-cream)]">
                      {trainer.certifications.length}
                    </p>
                    <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                      Certifications
                    </p>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="flex flex-wrap gap-2 mb-6">
                {trainer.certifications.map((cert) => (
                  <Badge key={cert} variant="default" className="text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="primary" size="sm" className="flex-1" asChild>
                  <Link href={`/trainers/${trainer.slug}`}>
                    View Profile
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  variant="glass"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    window.open(
                      whatsappUrl(
                        trainer.whatsapp,
                        `Hi ${trainer.name}! I'm interested in your coaching program. Can we discuss?`
                      ),
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }}
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mt-16"
      >
        <p className="text-[var(--color-brand-muted)] font-[var(--font-sans)] mb-4">
          Not sure which trainer is right for you?
        </p>
        <Button variant="secondary" size="md" asChild>
          <Link href="/#contact">Get a Free Consultation</Link>
        </Button>
      </motion.div>
    </Section>
  )
}
