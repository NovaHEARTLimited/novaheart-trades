import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { site_slug, name, email, phone, message, service } = body

    // Validate required fields
    if (!site_slug || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: site_slug, name, email' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get site owner by slug
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('user_id, name')
      .eq('slug', site_slug)
      .single()

    if (siteError || !site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    // Create lead in the leads table
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        user_id: site.user_id,
        name,
        email,
        phone: phone || null,
        message: message || null,
        service: service || null,
        source: 'website',
        status: 'new',
      })
      .select()
      .single()

    if (leadError) {
      console.error('Failed to create lead:', leadError)
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      )
    }

    // Create an activity for the lead
    await supabase
      .from('activities')
      .insert({
        user_id: site.user_id,
        type: 'note',
        title: `New lead from ${site.name}`,
        content: `Lead submitted via website contact form\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nService: ${service || 'Not specified'}\n\nMessage:\n${message || 'No message'}`,
      })

    return NextResponse.json(
      { success: true, lead_id: lead.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
