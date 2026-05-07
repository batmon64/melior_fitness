'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/constants/data'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-4 left-4 right-4 z-[40] rounded-[var(--radius-card)] transition-all duration-500',
          scrolled
            ? 'bg-[rgba(10,9,8,0.85)] backdrop-blur-xl border border-[rgba(255,255,255,0.07)] shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            : 'bg-transparent border border-transparent'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer" aria-label="Melior Fitness home">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-gold)] flex items-center justify-center">
              <span className="font-[var(--font-heading)] font-bold text-[var(--color-brand-black)] text-sm">M</span>
            </div>
            <span className="font-[var(--font-heading)] font-semibold text-[var(--color-brand-cream)] text-lg tracking-wide group-hover:text-[var(--color-brand-gold)] transition-colors duration-200">
              Melior
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="px-4 py-2 text-sm font-[var(--font-sans)] font-medium text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] transition-colors duration-200 rounded-lg hover:bg-[rgba(255,255,255,0.05)] cursor-pointer"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <button
            className="md:hidden p-2 rounded-lg text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] hover:bg-[rgba(255,255,255,0.05)] transition-colors cursor-pointer"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-[5.5rem] left-4 right-4 z-[39] rounded-[var(--radius-card)] bg-[rgba(10,9,8,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.07)] shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            <ul className="flex flex-col p-4 gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-base font-[var(--font-sans)] font-medium text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-3 mt-2 border-t border-[rgba(255,255,255,0.07)] flex flex-col gap-2">
                <Button variant="ghost" size="md" asChild>
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}>Login</Link>
                </Button>
                <Button variant="primary" size="md" asChild>
                  <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>Get Started Free</Link>
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[38] bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  )
}
