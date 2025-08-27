'use client'

import { useState } from 'react'
import Image from 'next/image'

interface LightboxProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  currentIndex: number
}

export function Lightbox({ isOpen, onClose, images, currentIndex }: LightboxProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative max-w-4xl max-h-screen p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl hover:text-accent transition-colors"
        >
          ×
        </button>

        <div className="relative aspect-video bg-primary-800 rounded-lg overflow-hidden">
          <Image
            src={images[currentIndex]}
            alt={`Artwork ${currentIndex + 1}`}
            fill
            className="object-contain"
            sizes="80vw"
          />
        </div>

        {images.length > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                title={`View image ${index + 1}`}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-accent' : 'bg-primary-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}