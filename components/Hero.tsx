'use client'

import { motion } from 'framer-motion'
import { useAppContext } from './ClientWrapper'

export function Hero() {
  const { siteMeta, locale } = useAppContext()
  
  const tagline = siteMeta ? siteMeta[`tagline_${locale}` as keyof typeof siteMeta] as string : (locale === 'en' ? 'Contemporary Artist' : 'Artiste Contemporain')
  const description = locale === 'en' ? 'Montreal-based contemporary artist creating powerful portraits and abstract works' : 'Artiste contemporain basé à Montréal créant des portraits puissants et des œuvres abstraites'

  return (
    <section className="section-padding bg-gradient-to-br from-theme-primary via-theme-secondary to-theme-primary">
      <div className="container-max text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-heading font-bold text-theme-accent mb-6"
        >
          {siteMeta?.artistName || 'Cédric Taillon'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-xl md:text-2xl text-theme-secondary font-body"
        >
          {tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-8 text-lg text-theme-text max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
      </div>
    </section>
  )
}