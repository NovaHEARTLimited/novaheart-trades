'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, ExternalLink, Pencil, Share2 } from 'lucide-react'

type Props = {
  siteUrl: string
}

export default function ProSiteBanner({ siteUrl }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`
  const instagramShare = `https://www.instagram.com/?url=${encodeURIComponent(siteUrl)}`

  return (
    <section className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-6 text-gray-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
            Live
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-emerald-900">
            Your Pro Site is Live!
          </h2>
          <p className="mt-2 text-sm text-emerald-800">
            Share your new site with clients and start winning bigger contracts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={siteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <ExternalLink size={16} /> View Live Site
          </a>
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
          >
            <Pencil size={16} /> Edit Site
          </Link>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
          >
            <Copy size={16} /> {copied ? 'Copied' : 'Copy Site Link'}
          </button>
          <a
            href={facebookShare}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
          >
            <Share2 size={16} /> Share to Facebook
          </a>
          <a
            href={instagramShare}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
          >
            <Share2 size={16} /> Share to Instagram
          </a>
        </div>
      </div>
      <p className="mt-4 text-xs text-emerald-800">{siteUrl}</p>
    </section>
  )
}
