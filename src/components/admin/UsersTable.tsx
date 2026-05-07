'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Shield, Users, UserCheck, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type Role = 'user' | 'trainer' | 'admin'

interface User {
  id: string
  email: string
  full_name: string | null
  role: Role
  phone: string | null
  onboarding_completed: boolean
  created_at: string
}

const ROLE_CONFIG: Record<Role, { label: string; color: string; bg: string }> = {
  user:    { label: 'User',    color: '#A8A29E', bg: 'rgba(168,162,158,0.12)' },
  trainer: { label: 'Trainer', color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
  admin:   { label: 'Admin',   color: '#F43F5E', bg: 'rgba(244,63,94,0.12)' },
}

export function UsersTable({ users }: { users: User[] }) {
  const router = useRouter()
  const [search, setSearch]           = useState('')
  const [roleFilter, setRoleFilter]   = useState<Role | 'all'>('all')
  const [updatingId, setUpdatingId]   = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = users
    if (roleFilter !== 'all') list = list.filter((u) => u.role === roleFilter)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((u) =>
        (u.full_name ?? '').toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      )
    }
    return list
  }, [users, search, roleFilter])

  async function changeRole(userId: string, newRole: Role) {
    setUpdatingId(userId)
    try {
      await fetch('/api/admin/update-user-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })
      router.refresh()
    } finally {
      setUpdatingId(null)
    }
  }

  const inputCls = 'h-9 px-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[var(--color-brand-cream)] text-sm font-[var(--font-sans)] placeholder:text-[var(--color-brand-muted)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-all'

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-brand-muted)]" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(inputCls, 'w-full pl-9')}
            aria-label="Search users"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'user', 'trainer', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                'px-3 h-9 rounded-xl text-xs font-[var(--font-sans)] font-semibold border transition-all cursor-pointer capitalize',
                roleFilter === r
                  ? 'bg-[rgba(202,138,4,0.15)] border-[rgba(202,138,4,0.5)] text-[var(--color-brand-gold)]'
                  : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-[var(--color-brand-muted)] hover:border-[rgba(202,138,4,0.3)]'
              )}
            >
              {r === 'all' ? `All (${users.length})` : `${r} (${users.filter((u) => u.role === r).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
        {filtered.length} of {users.length} users
      </p>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.06)]">
          {[['User', '4'], ['Email', '4'], ['Role', '2'], ['Onboarded', '1'], ['Actions', '1']].map(([h, span]) => (
            <p key={h} className={`col-span-${span} text-[10px] font-[var(--font-sans)] font-semibold uppercase tracking-wider text-[var(--color-brand-muted)]`}>{h}</p>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
            No users match your search.
          </div>
        ) : (
          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            {filtered.map((user) => {
              const cfg = ROLE_CONFIG[user.role]
              return (
                <div key={user.id} className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  {/* Name */}
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[rgba(202,138,4,0.15)] flex items-center justify-center shrink-0">
                      <span className="text-xs font-[var(--font-heading)] font-bold text-[var(--color-brand-gold)]">
                        {(user.full_name ?? user.email)[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--color-brand-cream)] font-[var(--font-sans)] truncate">
                        {user.full_name ?? '—'}
                      </p>
                      <p className="text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                        {new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <p className="col-span-4 text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] truncate">
                    {user.email}
                  </p>

                  {/* Role badge */}
                  <div className="col-span-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-[var(--font-sans)]"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Onboarded */}
                  <div className="col-span-1 flex justify-center">
                    <div className={cn('w-4 h-4 rounded-full flex items-center justify-center',
                      user.onboarding_completed ? 'bg-emerald-500/20' : 'bg-[rgba(255,255,255,0.06)]'
                    )}>
                      {user.onboarding_completed && <Check className="w-2.5 h-2.5 text-emerald-400" aria-hidden="true" />}
                    </div>
                  </div>

                  {/* Role change */}
                  <div className="col-span-1 flex justify-end">
                    <RoleDropdown
                      currentRole={user.role}
                      loading={updatingId === user.id}
                      onSelect={(r) => changeRole(user.id, r)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function RoleDropdown({ currentRole, loading, onSelect }: {
  currentRole: Role; loading: boolean; onSelect: (r: Role) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        className="flex items-center gap-1 px-2 py-1 rounded-lg glass text-[10px] font-[var(--font-sans)] font-semibold text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] transition-all cursor-pointer disabled:opacity-50"
      >
        {loading ? '…' : 'Role'} <ChevronDown className="w-3 h-3" aria-hidden="true" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 top-full mt-1 z-50 w-28 glass rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            {(['user', 'trainer', 'admin'] as Role[]).map((r) => {
              const cfg = ROLE_CONFIG[r]
              return (
                <button
                  key={r}
                  onClick={() => { onSelect(r); setOpen(false) }}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-xs font-[var(--font-sans)] font-medium transition-colors cursor-pointer',
                    currentRole === r
                      ? 'text-[var(--color-brand-gold)] bg-[rgba(202,138,4,0.1)]'
                      : 'text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] hover:bg-[rgba(255,255,255,0.05)]'
                  )}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} aria-hidden="true" />
                  {cfg.label}
                  {currentRole === r && <Check className="w-3 h-3 ml-auto" aria-hidden="true" />}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
