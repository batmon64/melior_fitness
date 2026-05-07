import { cn } from '@/lib/utils'

interface AuthCardProps {
  children: React.ReactNode
  className?: string
  title: string
  subtitle?: string
}

export function AuthCard({ children, className, title, subtitle }: AuthCardProps) {
  return (
    <div
      className={cn(
        'w-full max-w-md glass rounded-2xl p-8 md:p-10',
        className
      )}
    >
      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-[var(--font-heading)] text-3xl md:text-4xl font-bold text-[var(--color-brand-cream)] leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}

/** Reusable form field wrapper */
interface FormFieldProps {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm font-[var(--font-sans)] font-medium text-[var(--color-brand-cream)]"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-400 font-[var(--font-sans)]" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/** Reusable text input styled for dark auth forms */
export function AuthInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full h-11 px-4 rounded-[var(--radius-btn)]',
        'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]',
        'text-[var(--color-brand-cream)] text-sm font-[var(--font-sans)] placeholder:text-[var(--color-brand-muted)]',
        'focus:outline-none focus:border-[var(--color-brand-gold)] focus:bg-[rgba(255,255,255,0.07)]',
        'transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
}

/** Divider with text */
export function AuthDivider({ text = 'or' }: { text?: string }) {
  return (
    <div className="flex items-center gap-3 my-6" aria-hidden="true">
      <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
      <span className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] uppercase tracking-widest">
        {text}
      </span>
      <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
    </div>
  )
}

/** Alert box for errors and success messages */
export function AuthAlert({
  type,
  message,
}: {
  type: 'error' | 'success'
  message: string
}) {
  return (
    <div
      role="alert"
      className={cn(
        'px-4 py-3 rounded-[var(--radius-btn)] text-sm font-[var(--font-sans)] leading-relaxed',
        type === 'error'
          ? 'bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.25)] text-red-400'
          : 'bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] text-emerald-400'
      )}
    >
      {message}
    </div>
  )
}
