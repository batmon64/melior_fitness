'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error tracking service in production
    console.error('[GlobalError]', error.message, error.digest)
  }, [error])

  return (
    <div className="min-h-dvh bg-[var(--color-brand-black)] flex flex-col items-center justify-center px-4 text-center">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 30% at 50% 0%, rgba(239,68,68,0.06) 0%, transparent 60%)' }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" aria-hidden="true" />
        </div>

        <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.2em] uppercase text-red-400 mb-3">
          Something went wrong
        </p>
        <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-brand-cream)] mb-3">
          An unexpected error occurred
        </h1>
        <p className="text-[var(--color-brand-muted)] font-[var(--font-sans)] text-sm leading-relaxed mb-2">
          We&apos;ve been notified. If this keeps happening, please contact support.
        </p>
        {error.digest && (
          <p className="text-xs text-[var(--color-brand-muted)] font-mono mb-8">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex items-center justify-center gap-4">
          <Button variant="primary" size="md" onClick={reset}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </Button>
          <Button variant="ghost" size="md" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
