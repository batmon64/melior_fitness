export default function PlansLoading() {
  return (
    <div className="min-h-dvh bg-[var(--color-brand-black)] animate-pulse">
      <div className="h-72 bg-[var(--color-brand-dark)]" />
      <div className="max-w-7xl mx-auto px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 rounded-2xl bg-[var(--color-brand-dark)]" />
        ))}
      </div>
    </div>
  )
}
