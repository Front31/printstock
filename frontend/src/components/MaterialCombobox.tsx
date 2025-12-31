'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'

type Props = {
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  placeholder?: string
  createLabel?: (value: string) => string
}

export function MaterialCombobox({
  value,
  onChange,
  options,
  placeholder = 'Material wählen...',
  createLabel = (v) => `Neu anlegen: "${v}"`,
}: Props) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')

  const normalized = (s: string) => s.trim().toLowerCase()

  const filtered = React.useMemo(() => {
    const q = normalized(query)
    if (!q) return [...options]
    return options.filter((o) => normalized(o).includes(q))
  }, [options, query])

  const exactMatch = React.useMemo(() => {
    const q = normalized(query)
    if (!q) return false
    return options.some((o) => normalized(o) === q)
  }, [options, query])

  const showCreate = query.trim().length > 0 && !exactMatch

  const select = (v: string) => {
    onChange(v)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded-xl border px-4 py-2
                   bg-white text-gray-900
                   dark:bg-zinc-900 dark:text-zinc-100
                   border-gray-200 dark:border-zinc-700
                   hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
      >
        <span className={value ? '' : 'text-gray-400 dark:text-zinc-400'}>
          {value || placeholder}
        </span>
        <ChevronsUpDown className="h-4 w-4 opacity-70" />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-full rounded-xl border shadow-lg overflow-hidden
                     bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700"
        >
          <div className="p-2 border-b border-gray-200 dark:border-zinc-700">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Suchen oder neu eintragen..."
              className="w-full rounded-lg border px-3 py-2 text-sm
                         bg-gray-50 dark:bg-zinc-950
                         border-gray-200 dark:border-zinc-700
                         text-gray-900 dark:text-zinc-100
                         placeholder:text-gray-400 dark:placeholder:text-zinc-500
                         focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="max-h-64 overflow-auto">
            {showCreate && (
              <button
                type="button"
                onClick={() => select(query.trim())}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm
                           hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
              >
                <Plus className="h-4 w-4 text-primary" />
                <span className="font-medium">{createLabel(query.trim())}</span>
              </button>
            )}

            {filtered.map((opt) => {
              const active = normalized(opt) === normalized(value)
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => select(opt)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm
                             hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                >
                  <span>{opt}</span>
                  {active && <Check className="h-4 w-4 text-primary" />}
                </button>
              )
            })}

            {filtered.length === 0 && !showCreate && (
              <div className="px-3 py-3 text-sm text-gray-500 dark:text-zinc-400">
                Keine Treffer.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
