import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--color-brand-black)] flex flex-col">
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(202,138,4,0.1) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      {/* Minimal top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="flex items-center gap-2 group cursor-pointer"
          aria-label="Back to Melior Fitness home"
        >
          <div className="w-7 h-7 rounded-lg bg-[var(--color-brand-gold)] flex items-center justify-center">
            <span className="font-[var(--font-heading)] font-bold text-[var(--color-brand-black)] text-xs">M</span>
          </div>
          <span className="font-[var(--font-heading)] font-semibold text-[var(--color-brand-cream)] text-base tracking-wide group-hover:text-[var(--color-brand-gold)] transition-colors duration-200">
            Melior
          </span>
        </Link>
      </header>

      {/* Page content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Footer note */}
      <footer className="relative z-10 pb-6 text-center">
        <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          © {new Date().getFullYear()} Melior Fitness. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
