import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MarketplaceClient } from '@/components/marketplace/MarketplaceClient'

export const metadata: Metadata = {
  title: 'Diet Plans — Melior Fitness',
  description:
    'Browse science-backed diet plans for fat loss, muscle gain, keto, and more. Built by certified coaches Vishal and Sharon.',
  openGraph: {
    title: 'Diet Plans | Melior Fitness',
    description: 'Find the perfect diet plan for your goal.',
    type: 'website',
  },
}

export default function PlansPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Page Hero */}
        <section className="relative pt-32 pb-12 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 80% 40% at 50% -5%, rgba(202,138,4,0.1) 0%, transparent 65%)',
            }}
            aria-hidden="true"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.2em] uppercase text-[var(--color-brand-gold)] mb-4">
              Diet Plans
            </p>
            <h1 className="font-[var(--font-heading)] text-5xl md:text-6xl font-bold text-[var(--color-brand-cream)] leading-tight mb-4">
              Find Your Perfect Plan
            </h1>
            <p className="text-lg text-[var(--color-brand-muted)] font-[var(--font-sans)] max-w-xl leading-relaxed">
              Science-backed nutrition plans built by certified coaches. Every plan is tailored for
              Indian lifestyles, food preferences, and bodies.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              {[
                { value: '6', label: 'Plans available' },
                { value: '2,000+', label: 'Plans sold' },
                { value: '4.8★', label: 'Average rating' },
                { value: '7-day', label: 'Money-back guarantee' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="font-[var(--font-heading)] text-lg font-bold text-[var(--color-brand-gold)]">
                    {s.value}
                  </span>
                  <span className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Marketplace */}
        <MarketplaceClient />
      </main>
      <Footer />
    </>
  )
}
