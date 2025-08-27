import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import '../styles/globals.css'
import { siteConfig } from '../siteConfig'
import { loadSiteMeta } from '../lib/dataLoader'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteMeta = await loadSiteMeta()
    return {
      title: siteMeta.siteTitle || siteConfig.siteTitle,
      description: 'Contemporary artist website',
    }
  } catch (error) {
    console.error('Error loading site meta for metadata:', error)
    return {
      title: siteConfig.siteTitle,
      description: 'Contemporary artist website for Cédric Taillon',
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={siteConfig.defaultLocale} className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="font-body">
        {children}
      </body>
    </html>
  )
}