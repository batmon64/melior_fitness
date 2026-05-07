'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

const buttonVariants = cva(
  // Base styles shared by all variants
  'inline-flex items-center justify-center gap-2 font-[var(--font-sans)] font-semibold tracking-wide transition-all cursor-pointer select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[var(--color-brand-gold)] focus-visible:outline-offset-3',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-brand-gold)] text-[var(--color-brand-black)] hover:bg-[var(--color-brand-gold-lt)] shadow-[0_0_24px_rgba(202,138,4,0.3)] hover:shadow-[0_0_36px_rgba(202,138,4,0.5)] active:scale-[0.98]',
        secondary:
          'border border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] bg-transparent hover:bg-[rgba(202,138,4,0.08)] active:scale-[0.98]',
        ghost:
          'text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] hover:bg-[rgba(255,255,255,0.05)] active:scale-[0.98]',
        glass:
          'bg-[rgba(28,25,23,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.07)] text-[var(--color-brand-cream)] hover:bg-[rgba(28,25,23,0.8)] hover:border-[rgba(202,138,4,0.3)] active:scale-[0.98]',
        danger:
          'bg-red-600 text-white hover:bg-red-500 active:scale-[0.98]',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-[var(--radius-btn)]',
        md: 'h-11 px-6 text-base rounded-[var(--radius-btn)]',
        lg: 'h-13 px-8 text-lg rounded-[var(--radius-btn)]',
        xl: 'h-15 px-10 text-xl rounded-[var(--radius-btn)]',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  /** Render as child element (e.g. Link) */
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, asChild, ...props }, ref) => {
    // asChild delegates rendering to the child element (e.g. Link) — no spinner support
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(buttonVariants({ variant, size }), className)}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
