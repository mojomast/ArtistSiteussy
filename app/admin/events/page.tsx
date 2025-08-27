'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { loadEvents } from '@/lib/clientDataLoader'

interface Event {
  id: string
  title: string
  description: string
  start: string
  end: string
  location: string
  venue: string
  type: string
}

interface EventsData {
  events_en: Event[]
  events_fr: Event[]
  upcoming_message_en: string
  upcoming_message_fr: string
}

export default function EventsEditor() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm<EventsData>()

  const {
    fields: eventsEnFields,
    append: appendEventEn,
    remove: removeEventEn,
  } = useFieldArray({
    control,
    name: 'events_en',
  })

  const {
    fields: eventsFrFields,
    append: appendEventFr,
    remove: removeEventFr,
  } = useFieldArray({
    control,
    name: 'events_fr',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const data = await loadEvents()
      reset(data)
    } catch (error) {
      toast({
        title: 'Error loading data',
        description: 'Failed to load events data',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: EventsData) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: 'events.json',
          data,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Events data saved successfully',
        })
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast({
        title: 'Error saving data',
        description: 'Failed to save events data',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addEvent = (lang: 'en' | 'fr') => {
    const newEvent: Event = {
      id: '',
      title: '',
      description: '',
      start: '',
      end: '',
      location: '',
      venue: '',
      type: 'exhibition',
    }

    if (lang === 'en') {
      appendEventEn(newEvent)
    } else {
      appendEventFr(newEvent)
    }
  }

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return null
    return new Date(dateString)
  }

  const handleDateChange = (index: number, field: 'start' | 'end', date: Date | null, lang: 'en' | 'fr') => {
    if (date) {
      const isoString = date.toISOString()
      setValue(`${lang === 'en' ? 'events_en' : 'events_fr'}.${index}.${field}` as any, isoString)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900">Events Editor</h1>
        <p className="text-primary-600 mt-2">
          Manage exhibitions, live painting events, and workshops
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Add and manage your upcoming events in English and French
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="fr">Français</TabsTrigger>
              </TabsList>

              <TabsContent value="en" className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Events (English)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addEvent('en')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </div>

                <div className="space-y-4">
                  {eventsEnFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>ID</Label>
                          <Input
                            {...register(`events_en.${index}.id` as const, { required: 'ID is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            {...register(`events_en.${index}.title` as const, { required: 'Title is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select onValueChange={(value) => setValue(`events_en.${index}.type` as any, value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="exhibition">Exhibition</SelectItem>
                              <SelectItem value="live-painting">Live Painting</SelectItem>
                              <SelectItem value="workshop">Workshop</SelectItem>
                              <SelectItem value="collaborative">Collaborative</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            {...register(`events_en.${index}.location` as const, { required: 'Location is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Venue</Label>
                          <Input
                            {...register(`events_en.${index}.venue` as const, { required: 'Venue is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Date & Time</Label>
                          <DatePicker
                            selected={formatDateForInput(watch(`events_en.${index}.start` as any))}
                            onChange={(date) => handleDateChange(index, 'start', date, 'en')}
                            showTimeSelect
                            dateFormat="Pp"
                            className="w-full p-2 border rounded-md"
                            placeholderText="Select start date and time"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date & Time</Label>
                          <DatePicker
                            selected={formatDateForInput(watch(`events_en.${index}.end` as any))}
                            onChange={(date) => handleDateChange(index, 'end', date, 'en')}
                            showTimeSelect
                            dateFormat="Pp"
                            className="w-full p-2 border rounded-md"
                            placeholderText="Select end date and time"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            rows={3}
                            {...register(`events_en.${index}.description` as const, { required: 'Description is required' })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeEventEn(index)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="fr" className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Events (Français)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addEvent('fr')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </div>

                <div className="space-y-4">
                  {eventsFrFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>ID</Label>
                          <Input
                            {...register(`events_fr.${index}.id` as const, { required: 'ID is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            {...register(`events_fr.${index}.title` as const, { required: 'Title is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select onValueChange={(value) => setValue(`events_fr.${index}.type` as any, value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="exhibition">Exhibition</SelectItem>
                              <SelectItem value="live-painting">Live Painting</SelectItem>
                              <SelectItem value="workshop">Workshop</SelectItem>
                              <SelectItem value="collaborative">Collaborative</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            {...register(`events_fr.${index}.location` as const, { required: 'Location is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Venue</Label>
                          <Input
                            {...register(`events_fr.${index}.venue` as const, { required: 'Venue is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Date & Time</Label>
                          <DatePicker
                            selected={formatDateForInput(watch(`events_fr.${index}.start` as any))}
                            onChange={(date) => handleDateChange(index, 'start', date, 'fr')}
                            showTimeSelect
                            dateFormat="Pp"
                            className="w-full p-2 border rounded-md"
                            placeholderText="Select start date and time"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date & Time</Label>
                          <DatePicker
                            selected={formatDateForInput(watch(`events_fr.${index}.end` as any))}
                            onChange={(date) => handleDateChange(index, 'end', date, 'fr')}
                            showTimeSelect
                            dateFormat="Pp"
                            className="w-full p-2 border rounded-md"
                            placeholderText="Select end date and time"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            rows={3}
                            {...register(`events_fr.${index}.description` as const, { required: 'Description is required' })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeEventFr(index)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Message</CardTitle>
            <CardDescription>
              Message displayed for upcoming events section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="fr">Français</TabsTrigger>
              </TabsList>
              <TabsContent value="en" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="upcoming_message_en">Message (English)</Label>
                  <Textarea
                    id="upcoming_message_en"
                    rows={3}
                    {...register('upcoming_message_en', { required: 'English message is required' })}
                  />
                </div>
              </TabsContent>
              <TabsContent value="fr" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="upcoming_message_fr">Message (Français)</Label>
                  <Textarea
                    id="upcoming_message_fr"
                    rows={3}
                    {...register('upcoming_message_fr', { required: 'French message is required' })}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={loadData}
            disabled={isSaving}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}