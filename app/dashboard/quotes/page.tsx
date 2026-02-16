import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function QuotesPage() {
  const supabase = await createClient()

  const { data: quotes } = await supabase
    .from('quotes')
    .select(`
      *,
      jobs (
        id,
        title,
        customers (
          id,
          name
        )
      )
    `)
    .order('created_at', { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'draft':
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quotes</h1>
          <p className="text-gray-700 font-medium mt-1">Manage your quotes and estimates</p>
        </div>
        <Link href="/dashboard/quotes/new">
          <Button>Create New Quote</Button>
        </Link>
      </div>

      {/* Quotes List */}
      {quotes && quotes.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 font-bold">All Quotes</CardTitle>
            <CardDescription className="text-gray-700 font-medium">
              {quotes.length} quote{quotes.length !== 1 ? 's' : ''} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Quote #</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Job</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Valid Until</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        <Link href={`/dashboard/quotes/${quote.id}`} className="text-gray-900 hover:underline">
                          Q-{new Date(quote.created_at).getFullYear()}-{quote.id.slice(-3).toUpperCase()}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {quote.jobs?.customers?.name || 'No Customer'}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {quote.jobs?.title || 'No Job'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${getStatusColor(quote.status)} border-0`}>
                          {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900 font-medium">
                        £{quote.total_amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : 'No expiry'}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {new Date(quote.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes yet</h3>
            <p className="text-gray-700 mb-6">Get started by creating your first quote.</p>
            <Link href="/dashboard/quotes/new">
              <Button>Create New Quote</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
