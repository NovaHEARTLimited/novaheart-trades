'use client'

import { useState } from 'react'
import AISuggestion from './AISuggestion'

interface SectionContentEditorProps {
  sectionId: string
  sectionName: string
  pageTitle: string
  initialValue: string
  isPublished: boolean
  onSave: (sectionId: string, content: string) => Promise<void>
}

export default function SectionContentEditor({
  sectionId,
  sectionName,
  pageTitle,
  initialValue,
  isPublished,
  onSave,
}: SectionContentEditorProps) {
  const [content, setContent] = useState(initialValue)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await onSave(sectionId, content)
    setSaving(false)
  }

  return (
    <div className="mt-2">
      <label htmlFor={`content-${sectionId}`} className="sr-only">
        {sectionName} content
      </label>
      <textarea
        id={`content-${sectionId}`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        disabled={isPublished}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2F6BFF] disabled:bg-gray-50 disabled:text-gray-500"
      />

      {!isPublished && (
        <>
          <AISuggestion
            sectionName={sectionName}
            pageTitle={pageTitle}
            currentContent={content}
            onInsert={(suggestion) => setContent(suggestion)}
          />

          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-[#2F6BFF] px-3 py-2 text-xs font-medium text-white hover:bg-[#2557D6] disabled:bg-gray-400"
            >
              {saving ? 'Saving...' : 'Save draft'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
