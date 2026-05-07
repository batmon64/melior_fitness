export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-14 w-48 rounded-xl bg-[var(--color-brand-dark)]" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-[var(--color-brand-dark)]" />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="h-56 rounded-2xl bg-[var(--color-brand-dark)]" />
        <div className="h-56 rounded-2xl bg-[var(--color-brand-dark)]" />
      </div>
    </div>
  )
}
