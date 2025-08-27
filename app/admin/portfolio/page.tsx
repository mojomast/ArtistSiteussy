'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageUpload } from '@/components/ui/image-upload'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { loadPortfolio } from '@/lib/clientDataLoader'

interface Artwork {
  id: string
  title: string
  year: number
  medium: string
  dimensions: string
  description: string
  imageUrl: string
}

interface Collection {
  id: string
  name: string
  description: string
  artworks: Artwork[]
}

interface PortfolioData {
  featured_en: Artwork[]
  featured_fr: Artwork[]
  collections_en: Collection[]
  collections_fr: Collection[]
}

export default function PortfolioEditor() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm<PortfolioData>()

  const {
    fields: featuredEnFields,
    append: appendFeaturedEn,
    remove: removeFeaturedEn,
  } = useFieldArray({
    control,
    name: 'featured_en',
  })

  const {
    fields: featuredFrFields,
    append: appendFeaturedFr,
    remove: removeFeaturedFr,
  } = useFieldArray({
    control,
    name: 'featured_fr',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const data = await loadPortfolio()
      reset(data)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: 'Error loading data',
        description: 'Failed to load portfolio data',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: PortfolioData) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: 'portfolio.json',
          data,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Portfolio data saved successfully',
        })
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast({
        title: 'Error saving data',
        description: 'Failed to save portfolio data',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addFeaturedArtwork = (lang: 'en' | 'fr') => {
    const newArtwork: Artwork = {
      id: '',
      title: '',
      year: new Date().getFullYear(),
      medium: '',
      dimensions: '',
      description: '',
      imageUrl: '',
    }

    if (lang === 'en') {
      appendFeaturedEn(newArtwork)
    } else {
      appendFeaturedFr(newArtwork)
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
        <h1 className="text-3xl font-bold text-primary-900">Portfolio Editor</h1>
        <p className="text-primary-600 mt-2">
          Manage featured artworks and art collections
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Featured Artworks</CardTitle>
            <CardDescription>
              Highlight your best works in English and French
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
                  <Label>Featured Artworks (English)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addFeaturedArtwork('en')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Artwork
                  </Button>
                </div>

                <div className="space-y-4">
                  {featuredEnFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>ID</Label>
                          <Input
                            {...register(`featured_en.${index}.id` as const, { required: 'ID is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            {...register(`featured_en.${index}.title` as const, { required: 'Title is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Input
                            type="number"
                            {...register(`featured_en.${index}.year` as const, { required: 'Year is required', valueAsNumber: true })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Medium</Label>
                          <Input
                            {...register(`featured_en.${index}.medium` as const, { required: 'Medium is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Dimensions</Label>
                          <Input
                            {...register(`featured_en.${index}.dimensions` as const, { required: 'Dimensions are required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Artwork Image</Label>
                          <ImageUpload
                            value={watch(`featured_en.${index}.imageUrl` as any) || ''}
                            onChange={(value) => setValue(`featured_en.${index}.imageUrl` as any, value)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            rows={3}
                            {...register(`featured_en.${index}.description` as const, { required: 'Description is required' })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFeaturedEn(index)}
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
                  <Label>Featured Artworks (Français)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addFeaturedArtwork('fr')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Artwork
                  </Button>
                </div>

                <div className="space-y-4">
                  {featuredFrFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>ID</Label>
                          <Input
                            {...register(`featured_fr.${index}.id` as const, { required: 'ID is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            {...register(`featured_fr.${index}.title` as const, { required: 'Title is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Input
                            type="number"
                            {...register(`featured_fr.${index}.year` as const, { required: 'Year is required', valueAsNumber: true })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Medium</Label>
                          <Input
                            {...register(`featured_fr.${index}.medium` as const, { required: 'Medium is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Dimensions</Label>
                          <Input
                            {...register(`featured_fr.${index}.dimensions` as const, { required: 'Dimensions are required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Artwork Image</Label>
                          <ImageUpload
                            value={watch(`featured_fr.${index}.imageUrl` as any) || ''}
                            onChange={(value) => setValue(`featured_fr.${index}.imageUrl` as any, value)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            rows={3}
                            {...register(`featured_fr.${index}.description` as const, { required: 'Description is required' })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFeaturedFr(index)}
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