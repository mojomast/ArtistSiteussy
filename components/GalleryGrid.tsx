'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { type FeaturedArtwork } from '../lib/types'
import { useAppContext } from './ClientWrapper'

export function GalleryGrid() {
  const { portfolio, locale } = useAppContext()
  const featured = portfolio ? portfolio[`featured_${locale}` as keyof typeof portfolio] as FeaturedArtwork[] : []

  return (
    <section id="portfolio" className="section-padding bg-theme-primary">
      <div className="container-max">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl font-heading font-bold text-theme-accent mb-12 text-center"
        >
          {locale === 'en' ? 'Portfolio' : 'Portefeuille'}
        </motion.h2>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {featured.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="break-inside-avoid bg-theme-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative aspect-square bg-theme-primary">
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className="p-4">
                <h3 className="font-heading font-semibold text-theme-accent mb-2">
                  {artwork.title}
                </h3>
                <p className="text-theme-text text-sm mb-1">
                  {artwork.dimensions}
                </p>
                <p className="text-theme-secondary text-xs">
                  {artwork.medium}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}