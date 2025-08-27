'use client'

import Link from 'next/link'
import { siteConfig } from '../siteConfig'
import { useAppContext } from './ClientWrapper'

export function Header() {
  const { locale, toggleLocale, siteMeta } = useAppContext()
  const siteTitle = siteMeta?.siteTitle || siteConfig.siteTitle
  
  return (
    <header className="bg-theme-primary border-b border-theme-secondary sticky top-0 z-50">
      <nav className="container-max section-padding">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-heading font-bold text-theme-accent">
            {siteTitle}
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="#portfolio" className="text-theme-secondary hover:text-theme-accent transition-colors">
              {locale === 'en' ? 'Portfolio' : 'Portefeuille'}
            </Link>
            <Link href="#events" className="text-theme-secondary hover:text-theme-accent transition-colors">
              {locale === 'en' ? 'Events' : 'Événements'}
            </Link>
            <Link href="#commissions" className="text-theme-secondary hover:text-theme-accent transition-colors">
              {locale === 'en' ? 'Commissions' : 'Commissions'}
            </Link>
            <Link href="#shop" className="text-theme-secondary hover:text-theme-accent transition-colors">
              {locale === 'en' ? 'Shop' : 'Boutique'}
            </Link>

            <button
              onClick={toggleLocale}
              className="bg-theme-secondary text-theme-text px-3 py-1 rounded hover:bg-theme-primary transition-colors"
            >
              {locale.toUpperCase()}
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}