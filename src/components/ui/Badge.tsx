import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'gold' | 'glass' | 'success'
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-[rgba(255,255,255,0.08)] text-[var(--color-brand-muted)] border border-[rgba(255,255,255,0.08)]',
    gold: 'bg-[rgba(202,138,4,0.15)] text-[var(--color-brand-gold)] border border-[rgba(202,138,4,0.25)]',
    glass: 'bg-[rgba(28,25,23,0.6)] backdrop-blur-sm text-[var(--color-brand-cream)] border border-[rgba(255,255,255,0.07)]',
    success: 'bg-[rgba(34,197,94,0.12)] text-emerald-400 border border-[rgba(34,197,94,0.2)]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-[var(--font-sans)] font-medium tracking-wide',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
