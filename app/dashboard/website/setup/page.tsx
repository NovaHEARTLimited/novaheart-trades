import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getOrCreateSite, publishSite, setSiteStatus } from '@/lib/website/site'
import { seedStarterContent } from '@/lib/website/content'

export default async function WebsiteSetupPage() {
  await getOrCreateSite()

  async function markInProgress() {
    'use server'
    await setSiteStatus('in_progress')
  }

  async function handlePublish() {
    'use server'
    await publishSite()
    redirect('/dashboard/website')
  }

  async function handleSeed() {
    'use server'
    await seedStarterContent()
    redirect('/dashboard/website/pages')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Website setup</h2>
        <p className="mt-2 text-sm text-muted">
          Follow these steps to launch your site.
        </p>

        <div className="mt-4 grid gap-3">
          <Link
            className="rounded-lg border border-border bg-surface-alt px-4 py-3 text-sm text-foreground hover:bg-surface"
            href="/dashboard/website/templates"
          >
            1. Choose template
          </Link>
          <Link
            className="rounded-lg border border-border bg-surface-alt px-4 py-3 text-sm text-foreground hover:bg-surface"
            href="/dashboard/website/theme"
          >
            2. Add branding
          </Link>
          <Link
            className="rounded-lg border border-border bg-surface-alt px-4 py-3 text-sm text-foreground hover:bg-surface"
            href="/dashboard/website/content"
          >
            3. Edit homepage content
          </Link>
          <Link
            className="rounded-lg border border-border bg-surface-alt px-4 py-3 text-sm text-foreground hover:bg-surface"
            href="/dashboard/website/pages"
          >
            4. Manage pages
          </Link>
        </div>

        <div className="mt-6 flex gap-3">
          <form action={markInProgress}>
            <button
              type="submit"
              className="rounded-lg border border-border bg-surface-alt px-4 py-2 text-sm font-medium text-foreground hover:bg-surface"
            >
              Mark in progress
            </button>
          </form>

          <form action={handleSeed}>
            <button
              type="submit"
              className="rounded-lg border border-border bg-surface-alt px-4 py-2 text-sm font-medium text-foreground hover:bg-surface"
            >
              Add starter content
            </button>
          </form>

          <form action={handlePublish}>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Publish website
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}