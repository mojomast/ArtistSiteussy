'use client'

import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { type Event } from '../lib/types'
import { useAppContext } from './ClientWrapper'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Calendar, Clock, MapPin, Tag } from 'lucide-react'

export function EventsCalendar() {
  const { events, locale } = useAppContext()
  const eventList = events ? events[`events_${locale}` as keyof typeof events] as Event[] : []
  const message = events ? events[`upcoming_message_${locale}` as keyof typeof events] as string : ''
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleEventClick = (clickInfo: any) => {
    const eventId = clickInfo.event.id
    const event = eventList.find(e => e.id === eventId)
    if (event) {
      setSelectedEvent(event)
      setIsModalOpen(true)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString(locale === 'fr' ? 'fr-CA' : 'en-CA', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <section id="events" className="section-padding bg-theme-secondary">
        <div className="container-max">
          <h2 className="text-3xl font-heading font-bold text-theme-accent mb-8 text-center">
            {locale === 'en' ? 'Upcoming Events' : 'Événements à venir'}
          </h2>

          <p className="text-theme-text text-center mb-8">
            {message}
          </p>

          <div className="bg-theme-primary rounded-lg p-6 shadow-lg">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              initialView="dayGridMonth"
              events={eventList}
              height="auto"
              themeSystem="bootstrap"
              eventDisplay="block"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
              }}
              eventClick={handleEventClick}
              eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
            />
          </div>
        </div>
      </section>

      {/* Event Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {selectedEvent?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <DialogDescription className="text-gray-700 text-base leading-relaxed">
                {selectedEvent.description}
              </DialogDescription>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="h-5 w-5 text-theme-accent flex-shrink-0" />
                  <div>
                    <div className="font-medium">{formatDate(selectedEvent.start)}</div>
                    {selectedEvent.start !== selectedEvent.end && (
                      <div className="text-sm text-gray-600">
                        {locale === 'en' ? 'Until' : 'Jusqu\'au'} {formatDate(selectedEvent.end)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="h-5 w-5 text-theme-accent flex-shrink-0" />
                  <div>
                    <div className="font-medium">
                      {formatTime(selectedEvent.start)}
                      {selectedEvent.end && selectedEvent.start !== selectedEvent.end && (
                        <span> - {formatTime(selectedEvent.end)}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="h-5 w-5 text-theme-accent flex-shrink-0" />
                  <div>
                    <div className="font-medium">{selectedEvent.venue}</div>
                    <div className="text-sm text-gray-600">{selectedEvent.location}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-700">
                  <Tag className="h-5 w-5 text-theme-accent flex-shrink-0" />
                  <div className="font-medium capitalize">
                    {selectedEvent.type.replace('-', ' ')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}