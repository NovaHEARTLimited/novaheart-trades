import { createClient } from '@/lib/supabase/server'
import { createJob } from '@/actions/jobs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: customers } = await supabase
    .from('customers')
    .select('id, name, email')
    .order('name')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Job</h1>
        <p className="text-gray-600">Add a new job to your system</p>
      </div>

      <form className="space-y-4" action={createJob}>
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="Enter job title"
            className="bg-white text-black border-gray-300"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter job description"
            rows={4}
            className="bg-white text-black border-gray-300"
          />
        </div>

        <div>
          <Label htmlFor="customer_id">Customer</Label>
          <Select name="customer_id">
            <SelectTrigger>
              <SelectValue placeholder="Select a customer (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" className="text-black">No Customer</SelectItem>
              {customers && customers.length > 0 ? (
                customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id} className="text-black">
                    {customer.name} - {customer.email || 'No email'}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-1 text-sm text-gray-500">
                  No customers yet - create one first
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="estimated_cost">Estimated Cost (£)</Label>
          <Input
            id="estimated_cost"
            name="estimated_cost"
            type="number"
            step="0.01"
            placeholder="0.00"
            className="bg-white text-black border-gray-300"
          />
        </div>

        {params?.message && (
          <div className="text-red-600 text-sm">
            {params.message}
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Create Job</Button>
          <Link href="/dashboard">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}