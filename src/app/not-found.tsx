import Link from 'next/link'
import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = { title: '404 — Page Not Found' }

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-dvh flex flex-col items-center justify-center px-4 text-center relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 30% at 50% 0%, rgba(202,138,4,0.07) 0%, transparent 60%)' }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <p className="font-[var(--font-heading)] text-[10rem] font-bold leading-none text-[rgba(255,255,255,0.04)] select-none mb-0" aria-hidden="true">
            404
          </p>
          <div className="-mt-8">
            <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.2em] uppercase text-[var(--color-brand-gold)] mb-3">
              Page Not Found
            </p>
            <h1 className="font-[var(--font-heading)] text-4xl md:text-5xl font-bold text-[var(--color-brand-cream)] mb-4">
              Nothing here.
            </h1>
            <p className="text-[var(--color-brand-muted)] font-[var(--font-sans)] max-w-sm mx-auto mb-8 leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="primary" size="lg" asChild>
                <Link href="/">Go to Homepage</Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/plans">Browse Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
