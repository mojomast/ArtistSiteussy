'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Upload, Image as ImageIcon, Loader2, X } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  label?: string
  accept?: string
  maxSize?: number
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  label = 'Image',
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  className = ''
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a JPEG, PNG, WebP, or GIF image.',
        variant: 'destructive',
      })
      return
    }

    // Validate file size
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: `Please select an image smaller than ${maxSize / 1024 / 1024}MB.`,
        variant: 'destructive',
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        onChange(data.fileUrl)
        toast({
          title: 'Upload successful',
          description: 'Image uploaded successfully.',
        })
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload image.',
        variant: 'destructive',
      })
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange('')
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const displayImage = preview || (value && value.startsWith('/') ? value : null)

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}

      <div className="flex items-center space-x-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={isUploading}
          className="flex items-center space-x-2"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          <span>{isUploading ? 'Uploading...' : 'Choose Image'}</span>
        </Button>

        {displayImage && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            className="flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Remove</span>
          </Button>
        )}
      </div>

      {displayImage && (
        <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={displayImage}
            alt="Preview"
            fill
            className="object-cover"
            sizes="128px"
          />
        </div>
      )}

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or enter image URL manually"
        className="mt-2"
      />
    </div>
  )
}