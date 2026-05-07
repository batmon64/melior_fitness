export default function TrainerLoading() {
  return (
    <div className="min-h-dvh bg-[var(--color-brand-black)] animate-pulse">
      {/* Hero skeleton */}
      <div className="h-screen bg-[var(--color-brand-dark)]" />

      {/* Bio skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-24 space-y-4">
        <div className="h-4 bg-[var(--color-brand-stone)] rounded w-1/4" />
        <div className="h-10 bg-[var(--color-brand-stone)] rounded w-3/4" />
        <div className="h-4 bg-[var(--color-brand-stone)] rounded w-full" />
        <div className="h-4 bg-[var(--color-brand-stone)] rounded w-5/6" />
        <div className="h-4 bg-[var(--color-brand-stone)] rounded w-4/6" />
      </div>
    </div>
  )
}
