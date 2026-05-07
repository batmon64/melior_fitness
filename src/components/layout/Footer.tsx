import Link from 'next/link'
import { MessageCircle, Camera, Mail } from 'lucide-react'
import { NAV_LINKS, TRAINERS } from '@/constants/data'
import { whatsappUrl } from '@/lib/utils'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[var(--color-brand-dark)] border-t border-[var(--color-brand-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group cursor-pointer" aria-label="Melior Fitness home">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-gold)] flex items-center justify-center">
                <span className="font-[var(--font-heading)] font-bold text-[var(--color-brand-black)] text-sm">M</span>
              </div>
              <span className="font-[var(--font-heading)] font-semibold text-[var(--color-brand-cream)] text-lg tracking-wide">
                Melior Fitness
              </span>
            </Link>
            <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed max-w-xs mb-6">
              Premium fitness coaching and science-backed diet plans designed to transform your body and elevate your life.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-[var(--color-brand-muted)] hover:text-[var(--color-brand-gold)] hover:border-[rgba(202,138,4,0.3)] transition-all duration-200 cursor-pointer"
                aria-label="Follow us on Instagram"
              >
                <Camera className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href={`mailto:hello@melior.fit`}
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-[var(--color-brand-muted)] hover:text-[var(--color-brand-gold)] hover:border-[rgba(202,138,4,0.3)] transition-all duration-200 cursor-pointer"
                aria-label="Email us"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
              </a>
              {TRAINERS.map((trainer) => (
                <a
                  key={trainer.id}
                  href={whatsappUrl(trainer.whatsapp, `Hi! I'm interested in Melior Fitness coaching.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-[var(--color-brand-muted)] hover:text-[var(--color-brand-gold)] hover:border-[rgba(202,138,4,0.3)] transition-all duration-200 cursor-pointer"
                  aria-label={`WhatsApp ${trainer.name}`}
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-muted)] mb-5">
              Navigation
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] transition-colors duration-200 font-[var(--font-sans)] cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trainers column */}
          <div>
            <h3 className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-muted)] mb-5">
              Our Coaches
            </h3>
            <ul className="space-y-3">
              {TRAINERS.map((trainer) => (
                <li key={trainer.id}>
                  <Link
                    href={`/trainers/${trainer.slug}`}
                    className="text-sm text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] transition-colors duration-200 font-[var(--font-sans)] cursor-pointer"
                  >
                    {trainer.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/plans"
                  className="text-sm text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] transition-colors duration-200 font-[var(--font-sans)] cursor-pointer"
                >
                  All Diet Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signup"
                  className="text-sm text-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold-lt)] transition-colors duration-200 font-[var(--font-sans)] font-medium cursor-pointer"
                >
                  Get Started →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--color-brand-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
            © {currentYear} Melior Fitness. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] transition-colors duration-200 font-[var(--font-sans)] cursor-pointer"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] transition-colors duration-200 font-[var(--font-sans)] cursor-pointer"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
