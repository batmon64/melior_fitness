import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function TrainerNotFound() {
  return (
    <div className="min-h-dvh bg-[var(--color-brand-black)] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.2em] uppercase text-[var(--color-brand-gold)] mb-4">
        404
      </p>
      <h1 className="font-[var(--font-heading)] text-4xl md:text-6xl text-[var(--color-brand-cream)] mb-4">
        Trainer not found
      </h1>
      <p className="text-[var(--color-brand-muted)] font-[var(--font-sans)] mb-8 max-w-md">
        The trainer page you're looking for doesn't exist. Meet our coaches below.
      </p>
      <div className="flex gap-4">
        <Button variant="primary" size="md" asChild>
          <Link href="/#trainers">Meet Our Coaches</Link>
        </Button>
        <Button variant="ghost" size="md" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
