import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { UsersTable } from '@/components/admin/UsersTable'

export const metadata: Metadata = { title: 'Users' }

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, phone, onboarding_completed, created_at')
    .order('created_at', { ascending: false })

  const users = (data ?? []) as Parameters<typeof UsersTable>[0]['users']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-brand-cream)] mb-1">Users</h1>
        <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          {users.length} registered accounts · Manage roles and onboarding status
        </p>
      </div>
      <UsersTable users={users} />
    </div>
  )
}
