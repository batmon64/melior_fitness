'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Download, Lock, Clock, MessageCircle, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { getDownloadUrl } from '@/lib/actions/plans'
import { getTrainerWhatsAppUrl } from '@/constants/trainers'
import { TRAINER_DATA } from '@/constants/trainers'
import type { DetailedPlan } from '@/constants/plans'

interface PlanDownloadButtonProps {
  plan: DetailedPlan
  isAuthenticated: boolean
  isPurchased: boolean
  hasPdf: boolean
}

export function PlanDownloadButton({
  plan,
  isAuthenticated,
  isPurchased,
  hasPdf,
}: PlanDownloadButtonProps) {

  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)

  const trainer = TRAINER_DATA[plan.trainerSlug]
  const waUrl   = trainer
    ? getTrainerWhatsAppUrl(trainer, `Hi ${plan.trainerName}! I purchased the "${plan.title}" plan. When will the PDF be ready?`)
    : '#'

  // ── State: Not logged in ───────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="glass rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(202,138,4,0.12)] flex items-center justify-center">
            <Lock className="w-5 h-5 text-[var(--color-brand-gold)]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
              Sign in to purchase
            </p>
            <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
              Create a free account to get started
            </p>
          </div>
        </div>
        <Button variant="primary" size="md" className="w-full" asChild>
          <Link href={`/auth/signup?plan=${plan.slug}`}>
            Create Account & Buy
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href={`/auth/login?redirectTo=/plans/${plan.slug}`}>
            Already have an account? Log in
          </Link>
        </Button>
      </div>
    )
  }

  // ── State: Not yet purchased ───────────────────────────────────────────────
  if (!isPurchased) {
    return (
      <div
        className="rounded-2xl p-5 flex flex-col gap-4 border"
        style={{
          background: `${plan.accentColor}08`,
          borderColor: `${plan.accentColor}30`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${plan.accentColor}18` }}
          >
            <Lock className="w-5 h-5" style={{ color: plan.accentColor }} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
              PDF unlocks after purchase
            </p>
            <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
              Instant access once payment is confirmed
            </p>
          </div>
        </div>
        <Button variant="primary" size="md" className="w-full" asChild>
          <Link href={`/auth/signup?plan=${plan.slug}`}>
            Purchase to Unlock PDF
          </Link>
        </Button>
      </div>
    )
  }

  // ── State: Purchased but PDF not uploaded yet ──────────────────────────────
  if (isPurchased && !hasPdf) {
    return (
      <div className="glass rounded-2xl p-5 flex flex-col gap-4 border border-[rgba(34,197,94,0.2)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(34,197,94,0.12)] flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-400 font-[var(--font-sans)]">
              Plan purchased ✓
            </p>
            <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
              Your PDF is being prepared
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-[var(--color-brand-muted)] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed">
              Your PDF is being finalised by {plan.trainerName} and will be available within{' '}
              <span className="text-[var(--color-brand-cream)] font-medium">24 hours</span>.
              You&apos;ll be notified by email when it&apos;s ready.
            </p>
          </div>
        </div>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2.5 h-10 px-5 rounded-[var(--radius-btn)] glass font-[var(--font-sans)] font-medium text-sm text-[var(--color-brand-cream)] hover:border-[rgba(37,211,102,0.4)] transition-all cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" style={{ color: '#25D366' }} aria-hidden="true" />
          Message {plan.trainerName} on WhatsApp
        </a>
      </div>
    )
  }

  // ── State: Purchased + PDF ready — show download button ───────────────────
  async function handleDownload() {
    setLoading(true)
    setError('')
    setSuccess(false)

    const result = await getDownloadUrl(plan.slug)

    setLoading(false)

    if (result.status !== 'success' || !result.url) {
      setError(
        result.status === 'not_purchased' ? 'Purchase not found. Contact support.'
        : result.status === 'no_document'  ? 'PDF is not available yet.'
        : result.error ?? 'Something went wrong. Please try again.'
      )
      return
    }

    // Trigger browser download
    const a = document.createElement('a')
    a.href = result.url
    a.download = result.filename ?? `${plan.slug}.pdf`
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    setSuccess(true)
    // Reset success state after 4 seconds
    setTimeout(() => setSuccess(false), 4000)
  }

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-4 border border-[rgba(34,197,94,0.25)]">
      {/* Purchased badge */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[rgba(34,197,94,0.12)] flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-emerald-400" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-400 font-[var(--font-sans)]">
            You own this plan ✓
          </p>
          <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
            Download available anytime
          </p>
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={loading}
        className={cn(
          'w-full h-12 px-6 rounded-[var(--radius-btn)] flex items-center justify-center gap-2.5',
          'font-[var(--font-sans)] font-semibold text-base transition-all duration-200 cursor-pointer',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          success
            ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.35)]'
            : 'bg-[var(--color-brand-gold)] text-[var(--color-brand-black)] hover:bg-[var(--color-brand-gold-lt)] shadow-[0_0_24px_rgba(202,138,4,0.3)] hover:shadow-[0_0_36px_rgba(202,138,4,0.5)]'
        )}
        aria-label={`Download ${plan.title} PDF`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            Generating secure link…
          </>
        ) : success ? (
          <>
            <CheckCircle className="w-5 h-5" aria-hidden="true" />
            Download started!
          </>
        ) : (
          <>
            <Download className="w-5 h-5" aria-hidden="true" />
            Download PDF Plan
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)]">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-red-400 font-[var(--font-sans)]" role="alert">{error}</p>
        </div>
      )}

      {/* Security note */}
      <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] text-center">
        🔒 Secure link · Expires in 1 hour · For personal use only
      </p>
    </div>
  )
}
