'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { loadCommissions } from '@/lib/clientDataLoader'

interface CommissionType {
  id: string
  name: string
  description: string
  sizes?: Array<{
    name: string
    price: number
  }>
  price_range?: string
  pricing?: string
  note?: string
}

interface ProcessStep {
  step: number
  title: string
  description: string
}

interface CommissionsData {
  title_en: string
  title_fr: string
  subtitle_en: string
  subtitle_fr: string
  description_en: string
  description_fr: string
  commission_types_en: CommissionType[]
  commission_types_fr: CommissionType[]
  process_en: ProcessStep[]
  process_fr: ProcessStep[]
  terms_en: {
    deposit: string
    timeline: string
    revisions: string
    authenticity: string
  }
  terms_fr: {
    deposit: string
    timeline: string
    revisions: string
    authenticity: string
  }
}

export default function CommissionsEditor() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommissionsData>()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const data = await loadCommissions()
      reset(data)
    } catch (error) {
      toast({
        title: 'Error loading data',
        description: 'Failed to load commissions data',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: CommissionsData) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: 'commissions.json',
          data,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Commissions data saved successfully',
        })
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast({
        title: 'Error saving data',
        description: 'Failed to save commissions data',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
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
        <h1 className="text-3xl font-bold text-primary-900">Commissions Editor</h1>
        <p className="text-primary-600 mt-2">
          Manage commission types, pricing, and process information
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Headers</CardTitle>
            <CardDescription>
              Main title, subtitle, and description for the commissions page
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
                  <Label htmlFor="title_en">Title (English)</Label>
                  <Input
                    id="title_en"
                    {...register('title_en', { required: 'English title is required' })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle_en">Subtitle (English)</Label>
                  <Input
                    id="subtitle_en"
                    {...register('subtitle_en', { required: 'English subtitle is required' })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_en">Description (English)</Label>
                  <Textarea
                    id="description_en"
                    rows={4}
                    {...register('description_en', { required: 'English description is required' })}
                  />
                </div>
              </TabsContent>
              <TabsContent value="fr" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title_fr">Title (Français)</Label>
                  <Input
                    id="title_fr"
                    {...register('title_fr', { required: 'French title is required' })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle_fr">Subtitle (Français)</Label>
                  <Input
                    id="subtitle_fr"
                    {...register('subtitle_fr', { required: 'French subtitle is required' })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_fr">Description (Français)</Label>
                  <Textarea
                    id="description_fr"
                    rows={4}
                    {...register('description_fr', { required: 'French description is required' })}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Terms & Conditions</CardTitle>
            <CardDescription>
              Deposit, timeline, revisions, and authenticity information
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
                  <Label htmlFor="terms_en.deposit">Deposit</Label>
                  <Input
                    id="terms_en.deposit"
                    {...register('terms_en.deposit', { required: 'Deposit info is required' })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms_en.timeline">Timeline</Label>
                  <Input
                    id="terms_en.timeline"
                    {...register('terms_en.timeline', { required: 'Timeline info is required' })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms_en.revisions">Revisions</Label>
                  <Input
                    id="terms_en.revisions"
                    {...register('terms_en.revisions', { required: 'Revisions info is required' })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms_en.authenticity">Authenticity</Label>
                  <Input
                    id="terms_en.authenticity"
                    {...register('terms_en.authenticity', { required: 'Authenticity info is required' })}
                  />
                </div>
              </TabsContent>
              <TabsContent value="fr" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="terms_fr.deposit">Deposit</Label>
                  <Input
                    id="terms_fr.deposit"
                    {...register('terms_fr.deposit', { required: 'Deposit info is required' })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms_fr.timeline">Timeline</Label>
                  <Input
                    id="terms_fr.timeline"
                    {...register('terms_fr.timeline', { required: 'Timeline info is required' })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms_fr.revisions">Revisions</Label>
                  <Input
                    id="terms_fr.revisions"
                    {...register('terms_fr.revisions', { required: 'Revisions info is required' })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms_fr.authenticity">Authenticity</Label>
                  <Input
                    id="terms_fr.authenticity"
                    {...register('terms_fr.authenticity', { required: 'Authenticity info is required' })}
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