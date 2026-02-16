import WebsiteNav from './WebsiteNav'
import WebsiteBreadcrumbs from './WebsiteBreadcrumbs'

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Website</h1>
        <p className="text-sm text-slate-400">
          Build and manage your website from one place.
        </p>
        <div className="mt-2">
          <WebsiteBreadcrumbs />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-2">
          <WebsiteNav />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}
