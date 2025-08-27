'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { type Product } from '../lib/types'
import { useAppContext } from './ClientWrapper'

export function ShopGrid() {
  const { store, locale } = useAppContext()
  const products = store ? store[`products_${locale}` as keyof typeof store] as Product[] : []
  const title = locale === 'en' ? 'Available Works' : 'Œuvres disponibles'

  const handlePurchase = async (productId: string) => {
    try {
      const response = await fetch('/api/updateInventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productId }),
      })

      if (response.ok) {
        // Refresh the page or update state
        window.location.reload()
      } else {
        console.error('Failed to update inventory')
      }
    } catch (error) {
      console.error('Error updating inventory:', error)
    }
  }

  return (
    <section id="shop" className="section-padding bg-theme-secondary">
      <div className="container-max">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl font-heading font-bold text-theme-accent mb-12 text-center"
        >
          {title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-theme-primary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
            >
              <div className="relative aspect-square bg-theme-primary">
                <Image
                  src={product.image_url}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {!product.is_available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">{locale === 'en' ? 'Sold' : 'Vendu'}</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-heading font-semibold text-theme-accent mb-2 text-lg">
                  {product.title}
                </h3>
                <p className="text-theme-text text-sm mb-2">
                  {product.dimensions}
                </p>
                <p className="text-theme-secondary text-xs mb-4">
                  {product.medium}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-theme-accent">
                    ${product.price.toLocaleString()}
                  </span>
                  <button
                    disabled={!product.is_available}
                    onClick={() => handlePurchase(product.id)}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm px-4 py-2"
                  >
                    {product.is_available ? (locale === 'en' ? 'Add to Cart' : 'Ajouter au panier') : (locale === 'en' ? 'Sold Out' : 'Épuisé')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}