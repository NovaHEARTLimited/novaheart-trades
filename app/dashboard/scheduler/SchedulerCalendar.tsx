'use client'

import { useState, useMemo } from 'react'
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enGB } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import type { ScheduledJob } from './actions'
import Link from 'next/link'

const locales = {
  'en-GB': enGB,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface SchedulerCalendarProps {
  jobs: ScheduledJob[]
}

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: ScheduledJob
}

export function SchedulerCalendar({ jobs }: SchedulerCalendarProps) {
  const [view, setView] = useState<View>('week')
  const [date, setDate] = useState(new Date())

  const events: CalendarEvent[] = useMemo(() => {
    return jobs.map(job => {
      const start = new Date(job.scheduled_date)
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000) // 2 hour default duration

      return {
        id: job.id,
        title: `${job.title} - ${job.customer_name}`,
        start,
        end,
        resource: job,
      }
    })
  }, [jobs])

  function eventStyleGetter(event: CalendarEvent) {
    const status = event.resource.status

    let backgroundColor = '#3B82F6' // blue default
    
    if (status === 'scheduled') backgroundColor = '#8B5CF6' // purple
    if (status === 'in_progress') backgroundColor = '#F59E0B' // orange
    if (status === 'completed') backgroundColor = '#10B981' // green
    if (status === 'paid') backgroundColor = '#059669' // emerald

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '13px',
        padding: '4px 8px',
      },
    }
  }

  return (
    <div className="bg-white rounded-lg p-6" style={{ height: '700px' }}>
      <style jsx global>{`
        .rbc-calendar {
          font-family: inherit;
        }
        .rbc-header {
          padding: 12px 4px;
          font-weight: 600;
          color: #1e293b;
          border-bottom: 2px solid #e2e8f0;
        }
        .rbc-today {
          background-color: #eff6ff;
        }
        .rbc-off-range-bg {
          background-color: #f8fafc;
        }
        .rbc-event {
          cursor: pointer;
        }
        .rbc-event:hover {
          opacity: 1 !important;
        }
        .rbc-toolbar {
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .rbc-toolbar button {
          color: #475569;
          background-color: #f1f5f9;
          border: 1px solid #cbd5e1;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .rbc-toolbar button:hover {
          background-color: #e2e8f0;
          border-color: #94a3b8;
        }
        .rbc-toolbar button.rbc-active {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        .rbc-time-slot {
          border-top: 1px solid #f1f5f9;
        }
        .rbc-current-time-indicator {
          background-color: #ef4444;
          height: 2px;
        }
      `}</style>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        eventPropGetter={eventStyleGetter}
        components={{
          event: ({ event }) => (
            <Link href={`/dashboard/jobs/${event.id}`} className="block">
              <div className="font-medium">{event.title}</div>
              {event.resource.total_value && (
                <div className="text-xs opacity-90">
                  £{event.resource.total_value.toLocaleString()}
                </div>
              )}
            </Link>
          ),
        }}
        style={{ height: '100%' }}
      />
    </div>
  )
}
