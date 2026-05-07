export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Banner skeleton */}
      <div className="h-32 rounded-2xl bg-[var(--color-brand-dark)]" />
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-[var(--color-brand-dark)]" />
        ))}
      </div>
      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-[var(--color-brand-dark)]" />
        ))}
      </div>
    </div>
  )
}
