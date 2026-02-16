'use client'

import { useMemo, useState } from 'react'

type Section = {
  id: string
  name: string
  sort_order: number
}

export default function SectionsOrderEditor({
  sections,
  onSave,
}: {
  sections: Section[]
  onSave: (formData: FormData) => void
}) {
  const [order, setOrder] = useState(() => sections.map((s) => s.id))
  const [dragId, setDragId] = useState<string | null>(null)

  const computedOrder = useMemo(() => {
    const ids = sections.map((s) => s.id)
    if (order.length === 0) return ids
    const filtered = order.filter((id) => ids.includes(id))
    const missing = ids.filter((id) => !filtered.includes(id))
    return [...filtered, ...missing]
  }, [order, sections])

  const ordered = computedOrder
    .map((id) => sections.find((s) => s.id === id))
    .filter(Boolean) as Section[]

  function move(id: string, overId: string) {
    if (id === overId) return
    const next = [...computedOrder]
    const from = next.indexOf(id)
    const to = next.indexOf(overId)
    if (from === -1 || to === -1) return
    next.splice(from, 1)
    next.splice(to, 0, id)
    setOrder(next)
  }

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="text-sm font-medium">Reorder sections</div>
      <div className="mt-2 space-y-2">
        {ordered.map((s) => (
          <div
            key={s.id}
            draggable
            onDragStart={() => setDragId(s.id)}
            onDragOver={(e) => {
              e.preventDefault()
              if (dragId) move(dragId, s.id)
            }}
            onDragEnd={() => setDragId(null)}
            className="flex items-center justify-between rounded-md border border-gray-100 bg-white px-3 py-2 text-sm"
          >
            <span>{s.name}</span>
            <span className="text-xs text-gray-400">Drag</span>
          </div>
        ))}
      </div>

      <form action={onSave} className="mt-3 flex justify-end">
        <input type="hidden" name="orderedIds" value={JSON.stringify(computedOrder)} />
        <button
          type="submit"
          className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
        >
          Save order
        </button>
      </form>
    </div>
  )
}
