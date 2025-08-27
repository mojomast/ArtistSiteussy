'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageUpload } from '@/components/ui/image-upload'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { loadStore } from '@/lib/clientDataLoader'

interface Product {
  id: string
  title: string
  description: string
  medium: string
  dimensions: string
  price: number
  currency: string
  is_available: boolean
  sold: boolean
  inventory_quantity: number
  image_url: string
  stripe_price_id: string
  tags: string[]
}

interface StoreData {
  products_en: Product[]
  products_fr: Product[]
  shipping_info_en: {
    free_shipping_threshold: number
    montreal_shipping: string
    canada_shipping: string
    international_shipping: string
    flexible_payment: string
  }
  shipping_info_fr: {
    free_shipping_threshold: number
    montreal_shipping: string
    canada_shipping: string
    international_shipping: string
    flexible_payment: string
  }
  limited_edition_prints_en: {
    description: string
    sizes: string[]
    price_range: string
  }
  limited_edition_prints_fr: {
    description: string
    sizes: string[]
    price_range: string
  }
}

export default function StoreEditor() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm<StoreData>()

  const {
    fields: productsEnFields,
    append: appendProductEn,
    remove: removeProductEn,
  } = useFieldArray({
    control,
    name: 'products_en',
  })

  const {
    fields: productsFrFields,
    append: appendProductFr,
    remove: removeProductFr,
  } = useFieldArray({
    control,
    name: 'products_fr',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const data = await loadStore()
      reset(data)
    } catch (error) {
      toast({
        title: 'Error loading data',
        description: 'Failed to load store data',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: StoreData) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: 'store.json',
          data,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Store data saved successfully',
        })
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast({
        title: 'Error saving data',
        description: 'Failed to save store data',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addProduct = (lang: 'en' | 'fr') => {
    const newProduct: Product = {
      id: '',
      title: '',
      description: '',
      medium: '',
      dimensions: '',
      price: 0,
      currency: 'CAD',
      is_available: true,
      sold: false,
      inventory_quantity: 1,
      image_url: '',
      stripe_price_id: '',
      tags: [],
    }

    if (lang === 'en') {
      appendProductEn(newProduct)
    } else {
      appendProductFr(newProduct)
    }
  }

  const handleAvailabilityToggle = (index: number, lang: 'en' | 'fr', checked: boolean) => {
    const fieldName = `${lang === 'en' ? 'products_en' : 'products_fr'}.${index}.is_available` as any
    setValue(fieldName, checked)
    if (checked) {
      // If making available, ensure not marked as sold
      setValue(`${lang === 'en' ? 'products_en' : 'products_fr'}.${index}.sold` as any, false)
    }
  }

  const handleSoldToggle = (index: number, lang: 'en' | 'fr', checked: boolean) => {
    const fieldName = `${lang === 'en' ? 'products_en' : 'products_fr'}.${index}.sold` as any
    setValue(fieldName, checked)
    if (checked) {
      // If marking as sold, make unavailable
      setValue(`${lang === 'en' ? 'products_en' : 'products_fr'}.${index}.is_available` as any, false)
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
        <h1 className="text-3xl font-bold text-primary-900">Store Editor</h1>
        <p className="text-primary-600 mt-2">
          Manage products, pricing, and availability
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Manage your artwork inventory in English and French
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
                  <Label>Products (English)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addProduct('en')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                <div className="space-y-4">
                  {productsEnFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>ID</Label>
                          <Input
                            {...register(`products_en.${index}.id` as const, { required: 'ID is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            {...register(`products_en.${index}.title` as const, { required: 'Title is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Price (CAD)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`products_en.${index}.price` as const, { required: 'Price is required', valueAsNumber: true })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Medium</Label>
                          <Input
                            {...register(`products_en.${index}.medium` as const, { required: 'Medium is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Dimensions</Label>
                          <Input
                            {...register(`products_en.${index}.dimensions` as const, { required: 'Dimensions are required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Inventory Quantity</Label>
                          <Input
                            type="number"
                            {...register(`products_en.${index}.inventory_quantity` as const, { required: 'Quantity is required', valueAsNumber: true })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Product Image</Label>
                          <ImageUpload
                            value={watch(`products_en.${index}.image_url` as any) || ''}
                            onChange={(value) => setValue(`products_en.${index}.image_url` as any, value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Stripe Price ID</Label>
                          <Input
                            {...register(`products_en.${index}.stripe_price_id` as const)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tags (comma-separated)</Label>
                          <Input
                            {...register(`products_en.${index}.tags` as const)}
                            placeholder="portrait, urban, contemporary"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2 lg:col-span-3">
                          <Label>Description</Label>
                          <Textarea
                            rows={2}
                            {...register(`products_en.${index}.description` as const, { required: 'Description is required' })}
                          />
                        </div>
                        <div className="flex items-center space-x-4 md:col-span-2 lg:col-span-3">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={watch(`products_en.${index}.is_available` as any)}
                              onCheckedChange={(checked) => handleAvailabilityToggle(index, 'en', checked)}
                            />
                            <Label>Available</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={watch(`products_en.${index}.sold` as any)}
                              onCheckedChange={(checked) => handleSoldToggle(index, 'en', checked)}
                            />
                            <Label>Sold</Label>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeProductEn(index)}
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
                  <Label>Products (Français)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addProduct('fr')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                <div className="space-y-4">
                  {productsFrFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>ID</Label>
                          <Input
                            {...register(`products_fr.${index}.id` as const, { required: 'ID is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            {...register(`products_fr.${index}.title` as const, { required: 'Title is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Price (CAD)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`products_fr.${index}.price` as const, { required: 'Price is required', valueAsNumber: true })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Medium</Label>
                          <Input
                            {...register(`products_fr.${index}.medium` as const, { required: 'Medium is required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Dimensions</Label>
                          <Input
                            {...register(`products_fr.${index}.dimensions` as const, { required: 'Dimensions are required' })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Inventory Quantity</Label>
                          <Input
                            type="number"
                            {...register(`products_fr.${index}.inventory_quantity` as const, { required: 'Quantity is required', valueAsNumber: true })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Product Image</Label>
                          <ImageUpload
                            value={watch(`products_fr.${index}.image_url` as any) || ''}
                            onChange={(value) => setValue(`products_fr.${index}.image_url` as any, value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Stripe Price ID</Label>
                          <Input
                            {...register(`products_fr.${index}.stripe_price_id` as const)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tags (comma-separated)</Label>
                          <Input
                            {...register(`products_fr.${index}.tags` as const)}
                            placeholder="portrait, urbain, contemporain"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2 lg:col-span-3">
                          <Label>Description</Label>
                          <Textarea
                            rows={2}
                            {...register(`products_fr.${index}.description` as const, { required: 'Description is required' })}
                          />
                        </div>
                        <div className="flex items-center space-x-4 md:col-span-2 lg:col-span-3">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={watch(`products_fr.${index}.is_available` as any)}
                              onCheckedChange={(checked) => handleAvailabilityToggle(index, 'fr', checked)}
                            />
                            <Label>Available</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={watch(`products_fr.${index}.sold` as any)}
                              onCheckedChange={(checked) => handleSoldToggle(index, 'fr', checked)}
                            />
                            <Label>Sold</Label>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeProductFr(index)}
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