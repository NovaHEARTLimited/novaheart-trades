"use client"
import React, { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface Template {
  id: string | number;
  name: string;
  // Add other properties as needed
}

export default function TemplateShowcase({ templates }: { templates: Template[] }) {
  interface ShowcaseRow {
    id: string | number;
    profiles?: {
      business_name?: string;
      trade_type?: string;
    };
    // Add other properties from 'sites' table as needed
  }

  const [rows, setRows] = useState<ShowcaseRow[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchShowcases() {
      try {
        const { data } = await supabase
          .from('sites')
          .select('*, profiles(business_name, trade_type)')
          .eq('is_template_locked', true)
          .limit(6)
        setRows(data || [])
      } finally {
        setLoading(false)
      }
    }
    fetchShowcases()
  }, [supabase])

  if (loading) return <>Loading templates...</>

  return (
    <div>
      {rows.length > 0
        ? rows.map((row, idx) => (
            <div key={row.id || idx}>
              <div>{row.profiles?.business_name}</div>
              <div>{row.profiles?.trade_type}</div>
            </div>
          ))
        : templates.map((template, idx) => (
            <div key={template.id || idx}>
              <div>{template.name}</div>
            </div>
          ))}
    </div>
  )
}