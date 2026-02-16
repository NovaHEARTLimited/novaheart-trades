import Link from 'next/link'
import Script from 'next/script'
import Image from 'next/image'

type Page = { id: string; slug: string; title: string }
type Section = {
  id: string
  name: string
  content_published: string
  image_url_published?: string | null
  gallery?: { id: string; image_url_published: string | null }[]
}

export default function PublicSite({
  pages,
  pageTitle,
  sections,
  theme,
  analyticsId,
  basePath,
}: {
  pages: Page[]
  pageTitle: string
  sections: Section[]
  theme?: { primary_color?: string | null; font_family?: string | null; logo_url?: string | null }
  analyticsId?: string | null
  basePath: string
}) {
  const primary = theme?.primary_color ?? '#2F6BFF'
  const homeHref = basePath || '/'
  const pageHref = (slug: string) => (basePath ? `${basePath}/${slug}` : `/${slug}`)

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        fontFamily: theme?.font_family ?? 'Inter',
        ['--brand' as const]: primary,
      } as React.CSSProperties}
    >
      {analyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analyticsId}');
            `}
          </Script>
        </>
      )}

      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {theme?.logo_url ? (
              <Image src={theme.logo_url} alt="Logo" width={32} height={32} className="h-8 w-auto" />
            ) : (
              <div className="text-lg font-semibold">NovaTrades</div>
            )}
          </div>

          <nav className="flex items-center gap-4 text-sm">
            <Link href={homeHref} className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            {pages
              .filter((p) => p.slug !== 'home')
              .map((p) => (
                <Link
                  key={p.id}
                  href={pageHref(p.slug)}
                  className="text-gray-700 hover:text-gray-900"
                >
                  {p.title}
                </Link>
              ))}
          </nav>

          <a
            href="#contact"
            className="rounded-lg px-4 py-2 text-sm text-white"
            style={{ backgroundColor: primary }}
          >
            Get a quote
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <h1 className="text-3xl font-bold">{pageTitle}</h1>

        {sections.length === 0 ? (
          <p className="text-gray-600">No published content yet.</p>
        ) : (
          sections.map((section) => (
            <section key={section.id} className="space-y-3">
              <h2 className="text-2xl font-semibold">{section.name}</h2>

              {section.image_url_published && (
                <Image
                  src={section.image_url_published}
                  alt={section.name}
                  width={500}
                  height={420}
                  className="w-full max-h-105 rounded-lg border object-cover"
                />
              )}

              {section.gallery && section.gallery.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-3">
                  {section.gallery.map((g) =>
                    g.image_url_published ? (
                      <Image
                        key={g.id}
                        src={g.image_url_published}
                        alt="Gallery"
                        width={200}
                        height={112}
                        className="h-28 w-full rounded-md border object-cover"
                      />
                    ) : null
                  )}
                </div>
              )}

              <p className="text-gray-700">{section.content_published}</p>
            </section>
          ))
        )}
      </main>
    </div>
  )
}













