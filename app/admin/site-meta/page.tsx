'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUpload } from '@/components/ui/image-upload'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Palette, Settings, Link2, Eye, EyeOff } from 'lucide-react'
import { loadPortfolio, loadEvents, loadCommissions, loadStore } from '@/lib/clientDataLoader'

interface SiteMetaData {
  artistName: string
  siteTitle: string
  bio_en: string
  bio_fr: string
  tagline_en: string
  tagline_fr: string
  contact: {
    email: string
    location: string
  }
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    backgroundColor: string
    textColor: string
    fontFamily: string
    headingFontFamily: string
    layout: string
  }
  sections: {
    hero: boolean
    bio: boolean
    gallery: boolean
    events: boolean
    commissions: boolean
    shop: boolean
  }
  socialMedia: {
    facebook: string
    twitter: string
    instagram: string
    linkedin: string
    youtube: string
    tiktok: string
    behance: string
    dribbble: string
    website: string
  }
  customLinks: Array<{
    name: string
    url: string
    icon: string
  }>
}

export default function SiteMetaEditor() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Update CSS custom properties when theme values change
  const updateThemeCSS = (themeData: any) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      root.style.setProperty('--theme-primary', themeData.primaryColor || '#1e40af')
      root.style.setProperty('--theme-secondary', themeData.secondaryColor || '#64748b')
      root.style.setProperty('--theme-accent', themeData.accentColor || '#f59e0b')
      root.style.setProperty('--theme-background', themeData.backgroundColor || '#ffffff')
      root.style.setProperty('--theme-text', themeData.textColor || '#1f2937')
    }
  }

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<SiteMetaData>()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const response = await fetch('/siteMeta.json')
      if (!response.ok) {
        throw new Error('Failed to load site meta')
      }
      const data = await response.json()
      reset(data)
      // Update CSS with loaded theme data
      updateThemeCSS(data.theme)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: 'Error loading data',
        description: 'Failed to load site meta data',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Watch for theme changes and update CSS
  const watchedTheme = watch('theme')
  useEffect(() => {
    if (watchedTheme) {
      updateThemeCSS(watchedTheme)
    }
  }, [watchedTheme])

  const onSubmit = async (data: SiteMetaData) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: 'siteMeta.json',
          data,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Site meta data saved successfully',
        })
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast({
        title: 'Error saving data',
        description: 'Failed to save site meta data',
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
        <h1 className="text-3xl font-bold text-primary-900">Site Meta Editor</h1>
        <p className="text-primary-600 mt-2">
          Manage biography, contact information, and site metadata
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Artist name and basic site information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="artistName">Artist Name</Label>
              <Input
                id="artistName"
                {...register('artistName', { required: 'Artist name is required' })}
              />
              {errors.artistName && (
                <p className="text-sm text-red-600">{errors.artistName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteTitle">Site Title</Label>
              <Input
                id="siteTitle"
                {...register('siteTitle', { required: 'Site title is required' })}
              />
              {errors.siteTitle && (
                <p className="text-sm text-red-600">{errors.siteTitle.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Biography</CardTitle>
            <CardDescription>
              Artist biography in English and French
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
                  <Label htmlFor="bio_en">Biography (English)</Label>
                  <Textarea
                    id="bio_en"
                    rows={8}
                    {...register('bio_en', { required: 'English biography is required' })}
                  />
                  {errors.bio_en && (
                    <p className="text-sm text-red-600">{errors.bio_en.message}</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="fr" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio_fr">Biography (Français)</Label>
                  <Textarea
                    id="bio_fr"
                    rows={8}
                    {...register('bio_fr', { required: 'French biography is required' })}
                  />
                  {errors.bio_fr && (
                    <p className="text-sm text-red-600">{errors.bio_fr.message}</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taglines</CardTitle>
            <CardDescription>
              Short taglines in English and French
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
                  <Label htmlFor="tagline_en">Tagline (English)</Label>
                  <Input
                    id="tagline_en"
                    {...register('tagline_en', { required: 'English tagline is required' })}
                  />
                  {errors.tagline_en && (
                    <p className="text-sm text-red-600">{errors.tagline_en.message}</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="fr" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tagline_fr">Tagline (Français)</Label>
                  <Input
                    id="tagline_fr"
                    {...register('tagline_fr', { required: 'French tagline is required' })}
                  />
                  {errors.tagline_fr && (
                    <p className="text-sm text-red-600">{errors.tagline_fr.message}</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Email and location information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact.email">Email</Label>
              <Input
                id="contact.email"
                type="email"
                {...register('contact.email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.contact?.email && (
                <p className="text-sm text-red-600">{errors.contact.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact.location">Location</Label>
              <Input
                id="contact.location"
                {...register('contact.location', { required: 'Location is required' })}
              />
              {errors.contact?.location && (
                <p className="text-sm text-red-600">{errors.contact.location.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme Settings
            </CardTitle>
            <CardDescription>
              Choose from preset themes or customize colors and fonts for your website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Theme Presets</Label>
                <p className="text-sm text-gray-500 mt-1">Quickly apply predefined color schemes</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2 border-2 hover:border-blue-500 transition-colors"
                  onClick={() => {
                    const themeData = {
                      primaryColor: '#1e40af',
                      secondaryColor: '#64748b',
                      accentColor: '#f59e0b',
                      backgroundColor: '#ffffff',
                      textColor: '#1f2937',
                      fontFamily: 'Inter',
                      headingFontFamily: 'Playfair Display',
                      layout: watch('theme.layout') || 'scroll'
                    }
                    setValue('theme.primaryColor', themeData.primaryColor)
                    setValue('theme.secondaryColor', themeData.secondaryColor)
                    setValue('theme.accentColor', themeData.accentColor)
                    setValue('theme.backgroundColor', themeData.backgroundColor)
                    setValue('theme.textColor', themeData.textColor)
                    setValue('theme.fontFamily', themeData.fontFamily)
                    setValue('theme.headingFontFamily', themeData.headingFontFamily)
                    setValue('theme.layout', themeData.layout)
                    updateThemeCSS(themeData)
                  }}
                >
                  <div className="w-full flex gap-1">
                    <div className="w-1/4 h-4 bg-blue-600 rounded"></div>
                    <div className="w-1/4 h-4 bg-gray-500 rounded"></div>
                    <div className="w-1/4 h-4 bg-amber-500 rounded"></div>
                    <div className="w-1/4 h-4 bg-white border rounded"></div>
                  </div>
                  <span className="text-xs font-medium">Default</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2 border-2 hover:border-purple-500 transition-colors"
                  onClick={() => {
                    const themeData = {
                      primaryColor: '#7c3aed',
                      secondaryColor: '#a78bfa',
                      accentColor: '#ec4899',
                      backgroundColor: '#ffffff',
                      textColor: '#1f2937',
                      fontFamily: 'Inter',
                      headingFontFamily: 'Playfair Display',
                      layout: watch('theme.layout') || 'scroll'
                    }
                    setValue('theme.primaryColor', themeData.primaryColor)
                    setValue('theme.secondaryColor', themeData.secondaryColor)
                    setValue('theme.accentColor', themeData.accentColor)
                    setValue('theme.backgroundColor', themeData.backgroundColor)
                    setValue('theme.textColor', themeData.textColor)
                    setValue('theme.fontFamily', themeData.fontFamily)
                    setValue('theme.headingFontFamily', themeData.headingFontFamily)
                    setValue('theme.layout', themeData.layout)
                    updateThemeCSS(themeData)
                  }}
                >
                  <div className="w-full flex gap-1">
                    <div className="w-1/4 h-4 bg-purple-600 rounded"></div>
                    <div className="w-1/4 h-4 bg-purple-400 rounded"></div>
                    <div className="w-1/4 h-4 bg-pink-500 rounded"></div>
                    <div className="w-1/4 h-4 bg-white border rounded"></div>
                  </div>
                  <span className="text-xs font-medium">Purple</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2 border-2 hover:border-green-500 transition-colors"
                  onClick={() => {
                    const themeData = {
                      primaryColor: '#059669',
                      secondaryColor: '#10b981',
                      accentColor: '#f59e0b',
                      backgroundColor: '#ffffff',
                      textColor: '#1f2937',
                      fontFamily: 'Inter',
                      headingFontFamily: 'Playfair Display',
                      layout: watch('theme.layout') || 'scroll'
                    }
                    setValue('theme.primaryColor', themeData.primaryColor)
                    setValue('theme.secondaryColor', themeData.secondaryColor)
                    setValue('theme.accentColor', themeData.accentColor)
                    setValue('theme.backgroundColor', themeData.backgroundColor)
                    setValue('theme.textColor', themeData.textColor)
                    setValue('theme.fontFamily', themeData.fontFamily)
                    setValue('theme.headingFontFamily', themeData.headingFontFamily)
                    setValue('theme.layout', themeData.layout)
                    updateThemeCSS(themeData)
                  }}
                >
                  <div className="w-full flex gap-1">
                    <div className="w-1/4 h-4 bg-green-600 rounded"></div>
                    <div className="w-1/4 h-4 bg-green-500 rounded"></div>
                    <div className="w-1/4 h-4 bg-amber-500 rounded"></div>
                    <div className="w-1/4 h-4 bg-white border rounded"></div>
                  </div>
                  <span className="text-xs font-medium">Nature</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2 border-2 hover:border-red-500 transition-colors"
                  onClick={() => {
                    const themeData = {
                      primaryColor: '#dc2626',
                      secondaryColor: '#f87171',
                      accentColor: '#fbbf24',
                      backgroundColor: '#ffffff',
                      textColor: '#1f2937',
                      fontFamily: 'Inter',
                      headingFontFamily: 'Playfair Display',
                      layout: watch('theme.layout') || 'scroll'
                    }
                    setValue('theme.primaryColor', themeData.primaryColor)
                    setValue('theme.secondaryColor', themeData.secondaryColor)
                    setValue('theme.accentColor', themeData.accentColor)
                    setValue('theme.backgroundColor', themeData.backgroundColor)
                    setValue('theme.textColor', themeData.textColor)
                    setValue('theme.fontFamily', themeData.fontFamily)
                    setValue('theme.headingFontFamily', themeData.headingFontFamily)
                    setValue('theme.layout', themeData.layout)
                    updateThemeCSS(themeData)
                  }}
                >
                  <div className="w-full flex gap-1">
                    <div className="w-1/4 h-4 bg-red-600 rounded"></div>
                    <div className="w-1/4 h-4 bg-red-400 rounded"></div>
                    <div className="w-1/4 h-4 bg-yellow-500 rounded"></div>
                    <div className="w-1/4 h-4 bg-white border rounded"></div>
                  </div>
                  <span className="text-xs font-medium">Bold</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2 border-2 hover:border-gray-500 transition-colors"
                  onClick={() => {
                    const themeData = {
                      primaryColor: '#374151',
                      secondaryColor: '#6b7280',
                      accentColor: '#9ca3af',
                      backgroundColor: '#ffffff',
                      textColor: '#1f2937',
                      fontFamily: 'Inter',
                      headingFontFamily: 'Playfair Display',
                      layout: watch('theme.layout') || 'scroll'
                    }
                    setValue('theme.primaryColor', themeData.primaryColor)
                    setValue('theme.secondaryColor', themeData.secondaryColor)
                    setValue('theme.accentColor', themeData.accentColor)
                    setValue('theme.backgroundColor', themeData.backgroundColor)
                    setValue('theme.textColor', themeData.textColor)
                    setValue('theme.fontFamily', themeData.fontFamily)
                    setValue('theme.headingFontFamily', themeData.headingFontFamily)
                    setValue('theme.layout', themeData.layout)
                    updateThemeCSS(themeData)
                  }}
                >
                  <div className="w-full flex gap-1">
                    <div className="w-1/4 h-4 bg-gray-700 rounded"></div>
                    <div className="w-1/4 h-4 bg-gray-500 rounded"></div>
                    <div className="w-1/4 h-4 bg-gray-400 rounded"></div>
                    <div className="w-1/4 h-4 bg-white border rounded"></div>
                  </div>
                  <span className="text-xs font-medium">Minimal</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2 border-2 hover:border-indigo-500 transition-colors"
                  onClick={() => {
                    const themeData = {
                      primaryColor: '#4338ca',
                      secondaryColor: '#6366f1',
                      accentColor: '#06b6d4',
                      backgroundColor: '#ffffff',
                      textColor: '#1f2937',
                      fontFamily: 'Inter',
                      headingFontFamily: 'Playfair Display',
                      layout: watch('theme.layout') || 'scroll'
                    }
                    setValue('theme.primaryColor', themeData.primaryColor)
                    setValue('theme.secondaryColor', themeData.secondaryColor)
                    setValue('theme.accentColor', themeData.accentColor)
                    setValue('theme.backgroundColor', themeData.backgroundColor)
                    setValue('theme.textColor', themeData.textColor)
                    setValue('theme.fontFamily', themeData.fontFamily)
                    setValue('theme.headingFontFamily', themeData.headingFontFamily)
                    setValue('theme.layout', themeData.layout)
                    updateThemeCSS(themeData)
                  }}
                >
                  <div className="w-full flex gap-1">
                    <div className="w-1/4 h-4 bg-indigo-700 rounded"></div>
                    <div className="w-1/4 h-4 bg-indigo-500 rounded"></div>
                    <div className="w-1/4 h-4 bg-cyan-500 rounded"></div>
                    <div className="w-1/4 h-4 bg-white border rounded"></div>
                  </div>
                  <span className="text-xs font-medium">Ocean</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2 border-2 hover:border-orange-500 transition-colors"
                  onClick={() => {
                    const themeData = {
                      primaryColor: '#ea580c',
                      secondaryColor: '#fb923c',
                      accentColor: '#f59e0b',
                      backgroundColor: '#ffffff',
                      textColor: '#1f2937',
                      fontFamily: 'Inter',
                      headingFontFamily: 'Playfair Display',
                      layout: watch('theme.layout') || 'scroll'
                    }
                    setValue('theme.primaryColor', themeData.primaryColor)
                    setValue('theme.secondaryColor', themeData.secondaryColor)
                    setValue('theme.accentColor', themeData.accentColor)
                    setValue('theme.backgroundColor', themeData.backgroundColor)
                    setValue('theme.textColor', themeData.textColor)
                    setValue('theme.fontFamily', themeData.fontFamily)
                    setValue('theme.headingFontFamily', themeData.headingFontFamily)
                    setValue('theme.layout', themeData.layout)
                    updateThemeCSS(themeData)
                  }}
                >
                  <div className="w-full flex gap-1">
                    <div className="w-1/4 h-4 bg-orange-600 rounded"></div>
                    <div className="w-1/4 h-4 bg-orange-400 rounded"></div>
                    <div className="w-1/4 h-4 bg-amber-500 rounded"></div>
                    <div className="w-1/4 h-4 bg-white border rounded"></div>
                  </div>
                  <span className="text-xs font-medium">Warm</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2 border-2 hover:border-teal-500 transition-colors"
                  onClick={() => {
                    const themeData = {
                      primaryColor: '#0d9488',
                      secondaryColor: '#14b8a6',
                      accentColor: '#8b5cf6',
                      backgroundColor: '#ffffff',
                      textColor: '#1f2937',
                      fontFamily: 'Inter',
                      headingFontFamily: 'Playfair Display',
                      layout: watch('theme.layout') || 'scroll'
                    }
                    setValue('theme.primaryColor', themeData.primaryColor)
                    setValue('theme.secondaryColor', themeData.secondaryColor)
                    setValue('theme.accentColor', themeData.accentColor)
                    setValue('theme.backgroundColor', themeData.backgroundColor)
                    setValue('theme.textColor', themeData.textColor)
                    setValue('theme.fontFamily', themeData.fontFamily)
                    setValue('theme.headingFontFamily', themeData.headingFontFamily)
                    setValue('theme.layout', themeData.layout)
                    updateThemeCSS(themeData)
                  }}
                >
                  <div className="w-full flex gap-1">
                    <div className="w-1/4 h-4 bg-teal-600 rounded"></div>
                    <div className="w-1/4 h-4 bg-teal-500 rounded"></div>
                    <div className="w-1/4 h-4 bg-purple-500 rounded"></div>
                    <div className="w-1/4 h-4 bg-white border rounded"></div>
                  </div>
                  <span className="text-xs font-medium">Cool</span>
                </Button>
              </div>
            </div>

            <div className="border-t pt-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">Custom Colors</Label>
                <p className="text-sm text-gray-500 mt-1">Fine-tune individual colors</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme.primaryColor">Primary Color</Label>
                  <Input
                    id="theme.primaryColor"
                    type="color"
                    {...register('theme.primaryColor')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme.secondaryColor">Secondary Color</Label>
                  <Input
                    id="theme.secondaryColor"
                    type="color"
                    {...register('theme.secondaryColor')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme.accentColor">Accent Color</Label>
                  <Input
                    id="theme.accentColor"
                    type="color"
                    {...register('theme.accentColor')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme.backgroundColor">Background Color</Label>
                  <Input
                    id="theme.backgroundColor"
                    type="color"
                    {...register('theme.backgroundColor')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme.textColor">Text Color</Label>
                  <Input
                    id="theme.textColor"
                    type="color"
                    {...register('theme.textColor')}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme.fontFamily">Body Font Family</Label>
                  <Select onValueChange={(value) => setValue('theme.fontFamily', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select font family" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme.headingFontFamily">Heading Font Family</Label>
                  <Select onValueChange={(value) => setValue('theme.headingFontFamily', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select heading font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme.layout">Layout Style</Label>
                <Select onValueChange={(value) => setValue('theme.layout', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select layout style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scroll">Scroll Layout</SelectItem>
                    <SelectItem value="tabbed">Tabbed Layout</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Site Sections
            </CardTitle>
            <CardDescription>
              Enable or disable different sections of your website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <Label htmlFor="sections.hero" className="text-sm font-medium text-gray-700 cursor-pointer">Hero Section</Label>
                <Switch
                  id="sections.hero"
                  checked={watch('sections.hero')}
                  onCheckedChange={(checked) => setValue('sections.hero', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <Label htmlFor="sections.bio" className="text-sm font-medium text-gray-700 cursor-pointer">Biography Section</Label>
                <Switch
                  id="sections.bio"
                  checked={watch('sections.bio')}
                  onCheckedChange={(checked) => setValue('sections.bio', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <Label htmlFor="sections.gallery" className="text-sm font-medium text-gray-700 cursor-pointer">Gallery Section</Label>
                <Switch
                  id="sections.gallery"
                  checked={watch('sections.gallery')}
                  onCheckedChange={(checked) => setValue('sections.gallery', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <Label htmlFor="sections.events" className="text-sm font-medium text-gray-700 cursor-pointer">Events Section</Label>
                <Switch
                  id="sections.events"
                  checked={watch('sections.events')}
                  onCheckedChange={(checked) => setValue('sections.events', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <Label htmlFor="sections.commissions" className="text-sm font-medium text-gray-700 cursor-pointer">Commissions Section</Label>
                <Switch
                  id="sections.commissions"
                  checked={watch('sections.commissions')}
                  onCheckedChange={(checked) => setValue('sections.commissions', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <Label htmlFor="sections.shop" className="text-sm font-medium text-gray-700 cursor-pointer">Shop Section</Label>
                <Switch
                  id="sections.shop"
                  checked={watch('sections.shop')}
                  onCheckedChange={(checked) => setValue('sections.shop', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Social Media Links
            </CardTitle>
            <CardDescription>
              Add your social media profiles and website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="socialMedia.facebook">Facebook</Label>
                <Input
                  id="socialMedia.facebook"
                  placeholder="https://facebook.com/yourpage"
                  {...register('socialMedia.facebook')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialMedia.twitter">Twitter/X</Label>
                <Input
                  id="socialMedia.twitter"
                  placeholder="https://twitter.com/yourhandle"
                  {...register('socialMedia.twitter')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialMedia.instagram">Instagram</Label>
                <Input
                  id="socialMedia.instagram"
                  placeholder="https://instagram.com/yourhandle"
                  {...register('socialMedia.instagram')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialMedia.linkedin">LinkedIn</Label>
                <Input
                  id="socialMedia.linkedin"
                  placeholder="https://linkedin.com/in/yourprofile"
                  {...register('socialMedia.linkedin')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialMedia.youtube">YouTube</Label>
                <Input
                  id="socialMedia.youtube"
                  placeholder="https://youtube.com/channel/yourchannel"
                  {...register('socialMedia.youtube')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialMedia.tiktok">TikTok</Label>
                <Input
                  id="socialMedia.tiktok"
                  placeholder="https://tiktok.com/@yourhandle"
                  {...register('socialMedia.tiktok')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialMedia.behance">Behance</Label>
                <Input
                  id="socialMedia.behance"
                  placeholder="https://behance.net/yourportfolio"
                  {...register('socialMedia.behance')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialMedia.dribbble">Dribbble</Label>
                <Input
                  id="socialMedia.dribbble"
                  placeholder="https://dribbble.com/yourusername"
                  {...register('socialMedia.dribbble')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialMedia.website">Personal Website</Label>
                <Input
                  id="socialMedia.website"
                  placeholder="https://yourwebsite.com"
                  {...register('socialMedia.website')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Custom Links
            </CardTitle>
            <CardDescription>
              Add custom links with icons for your website footer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {watch('customLinks')?.map((_, index) => (
                <div key={index} className="flex gap-2 items-end p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Label>Link Name</Label>
                    <Input
                      {...register(`customLinks.${index}.name`)}
                      placeholder="Link name"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>URL</Label>
                    <Input
                      {...register(`customLinks.${index}.url`)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Icon</Label>
                    <Select
                      onValueChange={(value) => setValue(`customLinks.${index}.icon`, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="globe">Globe</SelectItem>
                        <SelectItem value="link">Link</SelectItem>
                        <SelectItem value="external-link">External Link</SelectItem>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="mail">Mail</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="camera">Camera</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentLinks = watch('customLinks') || []
                      const newLinks = currentLinks.filter((_, i) => i !== index)
                      setValue('customLinks', newLinks)
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const currentLinks = watch('customLinks') || []
                setValue('customLinks', [...currentLinks, { name: '', url: '', icon: 'globe' }])
              }}
            >
              Add Custom Link
            </Button>
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