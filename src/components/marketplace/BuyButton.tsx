'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Loader2, AlertCircle, MessageCircle, ArrowRight, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn, formatPrice } from '@/lib/utils'
import { getTrainerWhatsAppUrl, TRAINER_DATA } from '@/constants/trainers'
import type { DetailedPlan } from '@/constants/plans'

interface BuyButtonProps {
  plan: DetailedPlan
  isAuthenticated: boolean
  /** Whether this plan exists in the Supabase diet_plans table yet */
  isAvailable: boolean
  className?: string
  size?: 'md' | 'lg' | 'xl'
}

export function BuyButton({
  plan,
  isAuthenticated,
  isAvailable,
  className,
  size = 'lg',
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const trainer = TRAINER_DATA[plan.trainerSlug]
  const waUrl   = trainer
    ? getTrainerWhatsAppUrl(trainer, `Hi ${plan.trainerName}! I'd like to purchase the "${plan.title}" plan. Can you help me?`)
    : '#'

  // ── Not in Supabase yet — show WhatsApp fallback ───────────────────────────
  if (!isAvailable) {
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'w-full inline-flex items-center justify-center gap-2.5 rounded-[var(--radius-btn)]',
            'bg-[#25D366] text-white font-[var(--font-sans)] font-semibold transition-all duration-200',
            'hover:bg-[#1ebe5d] shadow-[0_0_24px_rgba(37,211,102,0.25)] hover:shadow-[0_0_36px_rgba(37,211,102,0.4)]',
            'cursor-pointer',
            size === 'xl' ? 'h-15 px-10 text-xl' : size === 'lg' ? 'h-13 px-8 text-lg' : 'h-11 px-6 text-base'
          )}
        >
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
          Buy via WhatsApp
        </a>
        <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] text-center">
          Online checkout coming soon · Message {plan.trainerName} to purchase now
        </p>
      </div>
    )
  }

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        <Button variant="primary" size={size} className="w-full" asChild>
          <Link href={`/auth/signup?plan=${plan.slug}`}>
            <Lock className="w-4 h-4" aria-hidden="true" />
            Sign Up to Purchase
          </Link>
        </Button>
        <p className="text-xs text-center text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          Already have an account?{' '}
          <Link
            href={`/auth/login?redirectTo=/plans/${plan.slug}`}
            className="text-[var(--color-brand-gold)] hover:underline cursor-pointer"
          >
            Log in
          </Link>
        </p>
      </div>
    )
  }

  // ── Authenticated — initiate Stripe checkout ───────────────────────────────
  async function handleBuy() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ planSlug: plan.slug }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.code === 'ALREADY_PURCHASED') {
          setError("You've already purchased this plan. Check your dashboard to download it.")
        } else if (response.status === 404) {
          setError('This plan is not yet available for online purchase. Please contact the trainer on WhatsApp.')
        } else {
          setError(data.error ?? 'Something went wrong. Please try again.')
        }
        return
      }

      if (!data.url) {
        setError('Could not create checkout session. Please try again.')
        return
      }

      // Redirect to Stripe hosted checkout page
      window.location.href = data.url

    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <button
        onClick={handleBuy}
        disabled={loading}
        className={cn(
          'w-full inline-flex items-center justify-center gap-2.5 rounded-[var(--radius-btn)]',
          'bg-[var(--color-brand-gold)] text-[var(--color-brand-black)] font-[var(--font-sans)] font-semibold',
          'transition-all duration-200 cursor-pointer',
          'hover:bg-[var(--color-brand-gold-lt)] shadow-[0_0_24px_rgba(202,138,4,0.3)] hover:shadow-[0_0_36px_rgba(202,138,4,0.5)]',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none',
          'active:scale-[0.98]',
          size === 'xl' ? 'h-15 px-10 text-xl' : size === 'lg' ? 'h-13 px-8 text-lg' : 'h-11 px-6 text-base'
        )}
        aria-label={`Buy ${plan.title} for ${formatPrice(plan.price)}`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            Preparing checkout…
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" aria-hidden="true" />
            Buy Now · {formatPrice(plan.price)}
          </>
        )}
      </button>

      {/* Error message */}
      {error && (
        <div
          className="flex items-start gap-2.5 p-3 rounded-xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)]"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-red-400 font-[var(--font-sans)]">{error}</p>
        </div>
      )}

      {/* Stripe security badge */}
      {!error && (
        <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] text-center flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5" viewBox="0 0 60 25" fill="none" aria-hidden="true">
            <path d="M5.889 23.5H0V0h5.889v23.5zm12.667-12.917c0 2.583-2.056 4.25-4.889 4.25-1 0-1.944-.194-2.778-.555v4.083H5.5V6.417h5.278v.75c.722-.583 1.722-.917 2.944-.917 2.75 0 4.834 1.583 4.834 4.333zM12.278 10.5c0-1-.722-1.583-1.778-1.583-.944 0-1.611.5-1.611 1.583s.667 1.583 1.611 1.583c1.056 0 1.778-.583 1.778-1.583z" fill="currentColor" opacity=".4"/>
          </svg>
          Secured by Stripe · 256-bit encryption
        </p>
      )}
    </div>
  )
}
