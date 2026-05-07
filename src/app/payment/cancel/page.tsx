import type { Metadata } from 'next'
import Link from 'next/link'
import { XCircle, ArrowLeft, MessageCircle } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { getPlan } from '@/constants/plans'
import { getTrainerWhatsAppUrl, TRAINER_DATA } from '@/constants/trainers'

export const metadata: Metadata = { title: 'Payment Cancelled — Melior Fitness' }

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>
}) {
  const { plan: planSlug } = await searchParams
  const plan   = planSlug ? getPlan(planSlug) : null
  const trainer = plan ? TRAINER_DATA[plan.trainerSlug] : null
  const waUrl  = trainer && plan
    ? getTrainerWhatsAppUrl(trainer, `Hi ${plan.trainerName}! I was trying to purchase "${plan.title}" but had an issue. Can you help?`)
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
              'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(239,68,68,0.05) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-md w-full text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center mx-auto mb-8">
            <XCircle className="w-10 h-10 text-red-400" aria-hidden="true" />
          </div>

          <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.2em] uppercase text-red-400 mb-3">
            Payment Cancelled
          </p>
          <h1 className="font-[var(--font-heading)] text-4xl font-bold text-[var(--color-brand-cream)] mb-4">
            No charge was made
          </h1>
          <p className="text-base text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed mb-8">
            Your payment was cancelled and nothing was charged to your card.
            {plan && (
              <> You can complete your purchase of{' '}
                <span className="text-[var(--color-brand-cream)] font-medium">{plan.title}</span>{' '}
                anytime.
              </>
            )}
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            {plan && (
              <Button variant="primary" size="lg" className="w-full" asChild>
                <Link href={`/plans/${plan.slug}`}>
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  Try Again
                </Link>
              </Button>
            )}

            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 h-11 px-6 rounded-[var(--radius-btn)] glass font-[var(--font-sans)] font-semibold text-sm text-[var(--color-brand-cream)] hover:border-[rgba(37,211,102,0.4)] transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" style={{ color: '#25D366' }} aria-hidden="true" />
                Need help? Chat on WhatsApp
              </a>
            )}

            <Button variant="ghost" size="md" className="w-full" asChild>
              <Link href="/plans">Browse All Plans</Link>
            </Button>
          </div>

          <p className="mt-6 text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
            Having trouble? Email{' '}
            <a href="mailto:hello@melior.fit" className="text-[var(--color-brand-gold)] hover:underline">
              hello@melior.fit
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
