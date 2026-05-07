import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Star, MessageCircle, Video, Apple, Dumbbell } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Section, SectionHeading } from '@/components/ui/Section'
import { COACHING_SERVICES } from '@/constants/coaching'
import { TRAINERS } from '@/constants/data'
import { getTrainerWhatsAppUrl, TRAINER_DATA } from '@/constants/trainers'

export const metadata: Metadata = {
  title: 'Personal Coaching — Melior Fitness',
  description:
    'Get 1-on-1 coaching from certified trainers Vishal and Sharon. Personalised training, nutrition, and accountability.',
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Dumbbell: <Dumbbell className="w-7 h-7" aria-hidden="true" />,
  Apple:    <Apple    className="w-7 h-7" aria-hidden="true" />,
  Video:    <Video    className="w-7 h-7" aria-hidden="true" />,
}

const WHY_POINTS = [
  { title: 'Plans built for your body', desc: 'Not a template — every macro target, recipe choice, and training day is designed around you.' },
  { title: 'Real accountability', desc: 'Weekly check-ins, WhatsApp access, and a trainer who actually tracks your progress.' },
  { title: 'Indian food, Indian lifestyle', desc: 'No bland chicken and broccoli. Your plan works around your culture, family, and schedule.' },
  { title: '7-day money-back guarantee', desc: "If you're not satisfied in the first 7 days, we refund you in full." },
]

export default function CoachingPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-24 pb-16">
          <div className="absolute inset-0 bg-[var(--color-brand-black)]" aria-hidden="true" />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-15 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, #A78BFA 0%, transparent 70%)' }}
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <Badge variant="gold" className="mb-6 px-4 py-1.5 text-xs mx-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-gold)] animate-pulse" aria-hidden="true" />
              1-on-1 Personal Coaching
            </Badge>

            <h1 className="font-[var(--font-heading)] text-5xl sm:text-6xl md:text-7xl font-bold text-[var(--color-brand-cream)] leading-[1.05] tracking-tight mb-6">
              The coach who{' '}
              <span className="text-gradient-gold italic">actually</span>
              <br className="hidden sm:block" /> knows your name.
            </h1>

            <p className="text-lg text-[var(--color-brand-muted)] font-[var(--font-sans)] max-w-2xl mx-auto leading-relaxed mb-10">
              Work directly with Vishal or Sharon — certified coaches who have transformed 800+ bodies.
              No templates. No guesswork. A plan built entirely around you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button variant="primary" size="xl" asChild>
                <Link href="/coaching/request">
                  Request Coaching
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <Link href="#services">View Services</Link>
              </Button>
            </div>

            {/* Social proof strip */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {[
                { value: '800+', label: 'Clients coached' },
                { value: '97%',  label: 'Satisfaction rate' },
                { value: '11 kg', label: 'Avg result' },
                { value: '7-day', label: 'Money-back guarantee' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="font-[var(--font-heading)] text-xl font-bold text-[var(--color-brand-gold)]">
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

        {/* ── Services ── */}
        <Section id="services" className="bg-[var(--color-brand-dark)] relative">
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent)' }}
            aria-hidden="true"
          />

          <SectionHeading
            eyebrow="Services"
            title={<>Choose How You <span className="text-gradient-gold italic">Want to Work</span></>}
            subtitle="Three ways to get support — from a quick strategy call to full 1-on-1 coaching."
          />

          <div className="grid md:grid-cols-3 gap-6">
            {COACHING_SERVICES.map((service) => (
              <article
                key={service.id}
                className="glass rounded-2xl p-7 flex flex-col hover:border-[rgba(167,139,250,0.25)] transition-all duration-300 group"
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `${service.accentColor}15`, color: service.accentColor }}
                >
                  {ICON_MAP[service.icon] ?? <Dumbbell className="w-7 h-7" aria-hidden="true" />}
                </div>

                {/* Name + price */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-brand-cream)]">
                    {service.name}
                  </h3>
                  <span
                    className="text-xs font-[var(--font-sans)] font-semibold shrink-0 mt-1"
                    style={{ color: service.accentColor }}
                  >
                    {service.priceLabel}
                  </span>
                </div>

                <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed mb-5 flex-1">
                  {service.longDescription}
                </p>

                {/* Includes */}
                <ul className="space-y-2 mb-6" aria-label={`${service.name} includes`}>
                  {service.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <Check
                        className="w-4 h-4 shrink-0"
                        style={{ color: service.accentColor }}
                        aria-hidden="true"
                      />
                      <span className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Best for */}
                <div
                  className="px-3 py-2 rounded-xl text-xs font-[var(--font-sans)] font-medium mb-5"
                  style={{ background: `${service.accentColor}10`, color: service.accentColor }}
                >
                  Best for: {service.bestFor}
                </div>

                <Button variant="secondary" size="md" className="w-full" asChild>
                  <Link href={`/coaching/request?service=${service.id}`}>
                    Get Started
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </Section>

        {/* ── Why get coached ── */}
        <Section>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeading
                eyebrow="Why Coaching Works"
                title={<>Stop guessing. <span className="text-gradient-gold italic">Start transforming.</span></>}
                subtitle="Most people fail at diets and training because they're following advice that wasn't designed for them. Coaching fixes that."
                centered={false}
              />
              <div className="space-y-4 mt-8">
                {WHY_POINTS.map((point) => (
                  <div key={point.title} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-[var(--color-brand-gold)] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-[var(--color-brand-black)]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)] mb-0.5">
                        {point.title}
                      </p>
                      <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trainer cards */}
            <div className="space-y-4">
              {TRAINERS.map((trainer) => {
                const trainerData = TRAINER_DATA[trainer.slug]
                const waUrl = trainerData
                  ? getTrainerWhatsAppUrl(trainerData, `Hi ${trainer.name}! I'd like to discuss coaching options. Can we chat?`)
                  : '#'

                return (
                  <div key={trainer.id} className="glass rounded-2xl p-6 flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-[rgba(202,138,4,0.2)] flex items-center justify-center shrink-0">
                      <span className="font-[var(--font-heading)] font-bold text-[var(--color-brand-gold)] text-2xl">
                        {trainer.name[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-[var(--font-heading)] text-lg font-bold text-[var(--color-brand-cream)]">
                          {trainer.name}
                        </h3>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[var(--color-brand-gold)] text-[var(--color-brand-gold)]" aria-hidden="true" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[var(--color-brand-gold)] font-[var(--font-sans)] mb-2">
                        {trainer.specialization}
                      </p>
                      <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed mb-4">
                        {trainer.bio}
                      </p>
                      <div className="flex gap-3">
                        <Button variant="primary" size="sm" asChild>
                          <Link href={`/coaching/request?trainer=${trainer.slug}`}>
                            Work with {trainer.name}
                          </Link>
                        </Button>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg glass text-xs font-[var(--font-sans)] font-medium text-[var(--color-brand-cream)] hover:border-[rgba(37,211,102,0.4)] transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" style={{ color: '#25D366' }} aria-hidden="true" />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Section>

        {/* ── Final CTA ── */}
        <Section className="bg-[var(--color-brand-dark)] relative">
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(202,138,4,0.4), transparent)' }}
            aria-hidden="true"
          />
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-[var(--font-heading)] text-4xl md:text-5xl font-bold text-[var(--color-brand-cream)] mb-4">
              Ready to start your{' '}
              <span className="text-gradient-gold italic">transformation?</span>
            </h2>
            <p className="text-[var(--color-brand-muted)] font-[var(--font-sans)] mb-8">
              Fill out a short form, choose your service, and your trainer will be in touch within 24 hours.
            </p>
            <Button variant="primary" size="xl" asChild>
              <Link href="/coaching/request">
                Request Coaching Now
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Section>

      </main>
      <Footer />
    </>
  )
}
