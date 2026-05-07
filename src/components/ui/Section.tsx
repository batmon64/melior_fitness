import { cn } from '@/lib/utils'

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  /** Apply the standard max-width container */
  contained?: boolean
}

export function Section({ children, className, id, contained = true }: SectionProps) {
  return (
    <section id={id} className={cn('py-24 md:py-32', className)}>
      {contained ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      ) : (
        children
      )}
    </section>
  )
}

interface SectionHeadingProps {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeading({ eyebrow, title, subtitle, centered = true, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-16 md:mb-20', centered && 'text-center', className)}>
      {eyebrow && (
        <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.2em] uppercase text-[var(--color-brand-gold)] mb-4">
          {eyebrow}
        </p>
      )}
      <h2 className="font-[var(--font-heading)] text-4xl md:text-5xl lg:text-6xl text-[var(--color-brand-cream)] leading-[1.1]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-lg text-[var(--color-brand-muted)] max-w-2xl leading-relaxed"
          style={centered ? { marginLeft: 'auto', marginRight: 'auto' } : undefined}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
