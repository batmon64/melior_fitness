'use client'

import { useState, useMemo, useCallback } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlanCard } from './PlanCard'
import { cn } from '@/lib/utils'
import {
  DETAILED_PLANS,
  CATEGORIES,
  SORT_OPTIONS,
  filterPlans,
  type PlanCategoryKey,
  type SortOption,
} from '@/constants/plans'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function MarketplaceClient() {
  const [search, setSearch]       = useState('')
  const [category, setCategory]   = useState<PlanCategoryKey>('all')
  const [trainer, setTrainer]     = useState('')
  const [sort, setSort]           = useState<SortOption>('featured')
  const [showFilters, setFilters] = useState(false)

  const plans = useMemo(
    () => filterPlans(DETAILED_PLANS, { category, search, trainer, sort }),
    [category, search, trainer, sort]
  )

  const clearFilters = useCallback(() => {
    setSearch(''); setCategory('all'); setTrainer(''); setSort('featured')
  }, [])

  const hasFilters = search || category !== 'all' || trainer || sort !== 'featured'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">

      {/* ── Search + Filter bar ── */}
      <div className="sticky top-20 z-30 py-4 bg-[var(--color-brand-black)]/90 backdrop-blur-xl border-b border-[rgba(255,255,255,0.05)] mb-10">
        <div className="flex flex-col sm:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-brand-muted)]"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search plans, trainers, categories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[var(--color-brand-cream)] text-sm font-[var(--font-sans)] placeholder:text-[var(--color-brand-muted)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-all"
              aria-label="Search plans"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="h-11 px-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[var(--color-brand-cream)] text-sm font-[var(--font-sans)] focus:outline-none focus:border-[var(--color-brand-gold)] cursor-pointer transition-all appearance-none min-w-[160px]"
            aria-label="Sort plans"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#1C1917]">
                {o.label}
              </option>
            ))}
          </select>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setFilters((v) => !v)}
            className={cn(
              'sm:hidden h-11 px-4 rounded-xl border text-sm font-[var(--font-sans)] font-medium flex items-center gap-2 transition-all cursor-pointer',
              showFilters
                ? 'bg-[rgba(202,138,4,0.15)] border-[rgba(202,138,4,0.5)] text-[var(--color-brand-gold)]'
                : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.08)] text-[var(--color-brand-muted)]'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="mt-2 text-xs text-[var(--color-brand-gold)] hover:underline font-[var(--font-sans)] cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="flex gap-8">

        {/* ── Sidebar filters (desktop) ── */}
        <aside className="hidden sm:block w-52 shrink-0">
          <div className="sticky top-40 space-y-6">

            {/* Categories */}
            <div>
              <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-gold)] mb-3">
                Category
              </p>
              <ul className="space-y-1" role="list" aria-label="Filter by category">
                {CATEGORIES.map((cat) => (
                  <li key={cat.key}>
                    <button
                      onClick={() => setCategory(cat.key)}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-[var(--font-sans)] transition-all duration-150 cursor-pointer text-left',
                        category === cat.key
                          ? 'bg-[rgba(202,138,4,0.12)] text-[var(--color-brand-gold)] font-semibold'
                          : 'text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] hover:bg-[rgba(255,255,255,0.04)]'
                      )}
                      aria-pressed={category === cat.key}
                    >
                      <span aria-hidden="true">{cat.emoji}</span>
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trainer filter */}
            <div>
              <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-gold)] mb-3">
                Trainer
              </p>
              <ul className="space-y-1" role="list" aria-label="Filter by trainer">
                {['', 'vishal', 'sharon'].map((t) => (
                  <li key={t || 'all'}>
                    <button
                      onClick={() => setTrainer(t)}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-[var(--font-sans)] transition-all duration-150 cursor-pointer text-left',
                        trainer === t
                          ? 'bg-[rgba(202,138,4,0.12)] text-[var(--color-brand-gold)] font-semibold'
                          : 'text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] hover:bg-[rgba(255,255,255,0.04)]'
                      )}
                      aria-pressed={trainer === t}
                    >
                      {t === '' ? 'All Trainers' : t === 'vishal' ? '🔥 Vishal' : '💪 Sharon'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* ── Mobile filter dropdown ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="sm:hidden overflow-hidden"
            >
              {/* Same category + trainer filters inline */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Plan grid ── */}
        <div className="flex-1 min-w-0">
          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            {/* Category tabs — horizontal scroll on all screens */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar -mx-1 px-1" role="tablist">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  role="tab"
                  aria-selected={category === cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={cn(
                    'shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-[var(--font-sans)] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap',
                    category === cat.key
                      ? 'bg-[var(--color-brand-gold)] text-[var(--color-brand-black)] shadow-[0_0_16px_rgba(202,138,4,0.35)]'
                      : 'glass text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)]'
                  )}
                >
                  <span aria-hidden="true">{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            <span className="shrink-0 text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] ml-4">
              {plans.length} plan{plans.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* No results */}
          {plans.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-[var(--color-brand-muted)]" aria-hidden="true" />
              </div>
              <h3 className="font-[var(--font-heading)] text-xl text-[var(--color-brand-cream)] mb-2">
                No plans found
              </h3>
              <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] mb-4">
                Try adjusting your search or filters.
              </p>
              <button
                onClick={clearFilters}
                className="text-sm text-[var(--color-brand-gold)] hover:underline font-[var(--font-sans)] cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${search}-${trainer}-${sort}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              {plans.map((plan, i) => (
                <PlanCard key={plan.id} plan={plan} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
