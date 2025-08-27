'use client'

import { motion } from 'framer-motion'
import { useAppContext } from './ClientWrapper'

export function BioCard() {
  const { siteMeta, locale } = useAppContext()
  
  const content = siteMeta ? siteMeta[`bio_${locale}` as keyof typeof siteMeta] as string : undefined
  
  // Placeholder content until data files are created
  const defaultContent = {
    en: `# About the Artist

**Cédric Taillon** is a vibrant Montreal-based contemporary artist who has been shaping the visual arts landscape for over 18 years. After studying cartooning in Toronto in 2005, he returned to Montreal where he has since established himself as a dynamic force in the city's art scene.

Known for his expressive use of acrylics and markers on canvas, Taillon creates powerful portraits and abstract works that capture the energy and diversity of Montreal's urban culture.`,
    fr: `# À propos de l'artiste

**Cédric Taillon** est un artiste contemporain dynamique basé à Montréal qui façonne le paysage des arts visuels depuis plus de 18 ans. Après avoir étudié la bande dessinée à Toronto en 2005, il est retourné à Montréal où il s'est depuis établi comme une force dynamique de la scène artistique de la ville.

Reconnu pour son utilisation expressive de l'acrylique et des marqueurs sur toile, Taillon crée des portraits puissants et des œuvres abstraites qui capturent l'énergie et la diversité de la culture urbaine montréalaise.`
  }

  const displayContent = content || defaultContent[locale]

  return (
    <section className="section-padding bg-theme-secondary">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-heading font-bold text-theme-accent mb-8 text-center">
            {locale === 'en' ? 'About the Artist' : 'À propos de l\'artiste'}
          </h2>

          <div className="bg-theme-primary rounded-lg p-8 shadow-lg">
            <div className="prose prose-lg prose-invert max-w-none">
              {/* Simple markdown-like rendering - in a real app you'd use a proper markdown parser */}
              {displayContent.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-2xl font-heading font-bold text-theme-accent mb-4">{line.slice(2)}</h1>
                } else if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={index} className="text-xl font-semibold text-theme-accent mb-4">{line.slice(2, -2)}</p>
                } else if (line.trim() === '') {
                  return <br key={index} />
                } else {
                  return <p key={index} className="text-theme-text mb-4 leading-relaxed">{line}</p>
                }
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}