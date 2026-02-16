'use client'
import { Plus, X } from 'lucide-react'
import { useMemo, useState } from 'react'

type Props = {
  initialItems?: string[]
  name?: string
}

export default function AccreditationsField({ initialItems, name = 'accreditations' }: Props) {
  const startingItems = useMemo(
    () => (initialItems && initialItems.length > 0 ? initialItems : ['']),
    [initialItems]
  )
  const [items, setItems] = useState<string[]>(startingItems)

  const addItem = () => setItems((prev) => [...prev, ''])
  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
  const updateItem = (index: number, value: string) =>
    setItems((prev) => prev.map((item, itemIndex) => (itemIndex === index ? value : item)))

  const serialized = JSON.stringify(items.map((item) => item.trim()).filter(Boolean))

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={serialized} />
      {items.map((item, index) => (
        <div key={`accreditation-${index}`} className="flex items-center gap-2">
          <input
            value={item}
            onChange={(event) => updateItem(index, event.target.value)}
            placeholder="Add accreditation"
            className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500"
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="rounded-lg border border-gray-800 bg-gray-950 p-2 text-gray-400 hover:text-gray-200"
            aria-label="Remove accreditation"
          >
            <X size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm font-medium text-gray-100 hover:border-gray-700"
      >
        <Plus size={16} /> Add accreditation
      </button>
    </div>
  )
}
