import { Suspense } from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, ArrowRight, MessageCircle } from 'lucide-react'
import { stripe } from '@/lib/stripe/client'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = { title: 'Payment Successful — Melior Fitness' }

// ── Success content (reads Stripe session) ─────────────────────────────────

async function SuccessContent({ sessionId }: { sessionId: string }) {
  // Verify the session with Stripe server-side — don't trust URL params alone
  let session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    })
  } catch {
    redirect('/plans')
  }

  // Payment must be paid — reject if not
  if (session.payment_status !== 'paid') {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-[rgba(251,191,36,0.12)] border border-[rgba(251,191,36,0.25)] flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl" aria-hidden="true">⏳</span>
        </div>
        <h1 className="font-[var(--font-heading)] text-3xl text-[var(--color-brand-cream)] mb-3">
          Payment Processing
        </h1>
        <p className="text-[var(--color-brand-muted)] font-[var(--font-sans)] mb-6 max-w-sm mx-auto leading-relaxed">
          Your payment is being confirmed. This usually takes less than a minute.
          You&apos;ll receive an email once confirmed.
        </p>
        <Button variant="secondary" size="md" asChild>
          <Link href="/dashboard">Check Dashboard</Link>
        </Button>
      </div>
    )
  }

  const planName = session.line_items?.data[0]?.description
    ?? session.metadata?.plan_slug?.replace(/-/g, ' ') ?? 'Your Plan'

  const planSlug = session.metadata?.plan_slug ?? ''

  return (
    <div className="text-center max-w-lg mx-auto">
      {/* Animated checkmark */}
      <div className="relative inline-flex mb-8">
        <div className="w-24 h-24 rounded-full bg-[rgba(34,197,94,0.12)] border-2 border-[rgba(34,197,94,0.3)] flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-emerald-400" aria-hidden="true" />
        </div>
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-20" aria-hidden="true" />
      </div>

      {/* Heading */}
      <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.2em] uppercase text-emerald-400 mb-3">
        Payment Confirmed
      </p>
      <h1 className="font-[var(--font-heading)] text-4xl md:text-5xl font-bold text-[var(--color-brand-cream)] leading-tight mb-4">
        Welcome to your transformation!
      </h1>
      <p className="text-base text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed mb-8">
        <span className="text-[var(--color-brand-gold)] font-semibold capitalize">{planName}</span> is now
        unlocked in your dashboard. Download your PDF plan and get started today.
      </p>

      {/* What happens next */}
      <div className="glass rounded-2xl p-6 text-left mb-8">
        <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-gold)] mb-4">
          What happens next
        </p>
        <ol className="space-y-3">
          {[
            { step: '1', text: 'Check your email for your purchase confirmation receipt' },
            { step: '2', text: 'Go to your dashboard to download the PDF plan' },
            { step: '3', text: 'Message your trainer on WhatsApp to introduce yourself' },
            { step: '4', text: 'Start your first day — your transformation begins now' },
          ].map(({ step, text }) => (
            <li key={step} className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold font-[var(--font-sans)] text-[var(--color-brand-black)]"
                style={{ background: '#CA8A04' }}
                aria-hidden="true"
              >
                {step}
              </div>
              <span className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed">
                {text}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="primary" size="lg" className="flex-1" asChild>
          <Link href="/dashboard">
            <Download className="w-5 h-5" aria-hidden="true" />
            Go to Dashboard
          </Link>
        </Button>
        {planSlug && (
          <Button variant="secondary" size="lg" className="flex-1" asChild>
            <Link href={`/plans/${planSlug}`}>
              View Plan
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </Button>
        )}
      </div>

      <p className="mt-6 text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
        Questions? Email us at{' '}
        <a href="mailto:hello@melior.fit" className="text-[var(--color-brand-gold)] hover:underline">
          hello@melior.fit
        </a>
      </p>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id) redirect('/plans')

  return (
    <>
      <Navbar />
      <main className="min-h-dvh relative">
        {/* Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-4 py-24">
          <Suspense
            fallback={
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-[var(--color-brand-gold)] border-t-transparent animate-spin" />
                <p className="text-[var(--color-brand-muted)] font-[var(--font-sans)] text-sm">
                  Verifying your payment…
                </p>
              </div>
            }
          >
            <SuccessContent sessionId={session_id} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
