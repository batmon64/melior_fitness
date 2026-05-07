import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, MessageCircle, LayoutDashboard } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { COACHING_SERVICES, COACHING_GOALS, buildWhatsAppMessage } from '@/constants/coaching'
import { TRAINER_DATA, getTrainerWhatsAppUrl } from '@/constants/trainers'
import { TRAINERS } from '@/constants/data'

export const metadata: Metadata = { title: 'Request Submitted — Melior Fitness' }

export default async function CoachingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ trainer?: string; service?: string; goal?: string; phone?: string; name?: string }>
}) {
  const { trainer: trainerSlug, service: serviceId, goal, phone, name } = await searchParams

  const trainerStatic = TRAINERS.find((t) => t.slug === trainerSlug)
  const trainerData   = trainerSlug ? TRAINER_DATA[trainerSlug] : null
  const service       = COACHING_SERVICES.find((s) => s.id === serviceId)
  const goalObj       = COACHING_GOALS.find((g) => g.value === goal)

  // Build pre-filled WhatsApp message
  const waUrl = trainerData && trainerStatic
    ? getTrainerWhatsAppUrl(
        trainerData,
        buildWhatsAppMessage({
          trainerName:      trainerStatic.name,
          serviceName:      service?.name ?? serviceId ?? 'Coaching',
          goal:             goalObj?.label ?? goal ?? 'Transform my body',
          currentSituation: 'Details submitted via coaching request form.',
          challenges:       'See request form submission.',
          timeline:         'As discussed',
          userName:         name ?? 'A new client',
          userPhone:        phone ? `+91${phone}` : 'Shared via app',
        })
      )
    : null

  return (
    <>
      <Navbar />
      <main className="min-h-dvh flex flex-col items-center justify-center px-4 py-24 relative">
        {/* Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(167,139,250,0.08) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-lg w-full text-center">
          {/* Animated success icon */}
          <div className="relative inline-flex mb-8">
            <div className="w-24 h-24 rounded-full bg-[rgba(34,197,94,0.1)] border-2 border-[rgba(34,197,94,0.3)] flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-400" aria-hidden="true" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-20" aria-hidden="true" />
          </div>

          {/* Heading */}
          <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.2em] uppercase text-emerald-400 mb-3">
            Request Submitted
          </p>
          <h1 className="font-[var(--font-heading)] text-4xl md:text-5xl font-bold text-[var(--color-brand-cream)] leading-tight mb-4">
            {trainerStatic?.name
              ? <>Your request is with <span className="text-gradient-gold italic">{trainerStatic.name}</span>!</>
              : 'Your coaching request is sent!'}
          </h1>
          <p className="text-base text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed mb-8">
            {trainerStatic?.name} will review your details and get back to you within{' '}
            <span className="text-[var(--color-brand-cream)] font-semibold">24 hours</span>.
            Tap the button below to send them a WhatsApp message right now for an even faster response.
          </p>

          {/* Request summary card */}
          {(service || goalObj) && (
            <div className="glass rounded-2xl p-5 text-left mb-8">
              <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-gold)] mb-4">
                Your Request Summary
              </p>
              <div className="space-y-3">
                {trainerStatic && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[rgba(202,138,4,0.2)] flex items-center justify-center shrink-0">
                      <span className="text-xs font-[var(--font-heading)] font-bold text-[var(--color-brand-gold)]">
                        {trainerStatic.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">Trainer</p>
                      <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
                        {trainerStatic.name}
                      </p>
                    </div>
                  </div>
                )}
                {service && (
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">Service</span>
                    <span className="text-xs font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">{service.name}</span>
                  </div>
                )}
                {goalObj && (
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">Goal</span>
                    <span className="text-xs font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
                      {goalObj.emoji} {goalObj.label}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* WhatsApp CTA — primary action */}
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 h-14 px-8 rounded-[var(--radius-btn)] mb-4 cursor-pointer font-[var(--font-sans)] font-bold text-lg text-white transition-all duration-200"
              style={{
                background: '#25D366',
                boxShadow: '0 0 28px rgba(37,211,102,0.35)',
              }}
            >
              <MessageCircle className="w-6 h-6" aria-hidden="true" />
              Message {trainerStatic?.name ?? 'Trainer'} on WhatsApp
            </a>
          )}

          <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] mb-8">
            Tapping this opens WhatsApp with your request details pre-filled. One tap and your trainer is notified instantly.
          </p>

          {/* Secondary actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="secondary" size="md" className="flex-1" asChild>
              <Link href="/dashboard/coaching">
                <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                View in Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="md" className="flex-1" asChild>
              <Link href="/plans">
                Browse Plans
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
