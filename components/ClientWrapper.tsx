'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { loadPortfolio, loadEvents, loadCommissions, loadStore } from '../lib/clientDataLoader'

interface AppContextType {
  locale: 'en' | 'fr'
  toggleLocale: () => void
  siteMeta: any
  portfolio: any
  events: any
  commissions: any
  store: any
  loading: boolean
  error: string | null
  refreshData: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within a ClientWrapper')
  }
  return context
}

interface ClientWrapperProps {
  children: ReactNode
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  const [locale, setLocale] = useState<'en' | 'fr'>('en')
  const [siteMeta, setSiteMeta] = useState<any>(null)
  const [portfolio, setPortfolio] = useState<any>(null)
  const [events, setEvents] = useState<any>(null)
  const [commissions, setCommissions] = useState<any>(null)
  const [store, setStore] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const applyTheme = (theme: any) => {
    if (typeof document !== 'undefined' && theme) {
      const root = document.documentElement

      // Apply theme colors
      root.style.setProperty('--theme-primary', theme.primaryColor || '#1e40af')
      root.style.setProperty('--theme-secondary', theme.secondaryColor || '#64748b')
      root.style.setProperty('--theme-accent', theme.accentColor || '#f59e0b')
      root.style.setProperty('--theme-background', theme.backgroundColor || '#ffffff')
      root.style.setProperty('--theme-text', theme.textColor || '#1f2937')

      // Apply fonts
      root.style.setProperty('--theme-font-family', theme.fontFamily || 'Inter')
      root.style.setProperty('--theme-heading-font-family', theme.headingFontFamily || 'Playfair Display')

      // Apply layout class to body
      if (theme.layout) {
        document.body.classList.remove('layout-scroll', 'layout-tabbed')
        document.body.classList.add(`layout-${theme.layout}`)
      }
    }
  }

  const loadSiteMetaStatic = async () => {
    try {
      const response = await fetch('/siteMeta.json')
      if (!response.ok) {
        throw new Error('Failed to load site meta')
      }
      return await response.json()
    } catch (error) {
      console.error('Error loading site meta:', error)
      throw error
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [siteMetaData, portfolioData, eventsData, commissionsData, storeData] = await Promise.all([
        loadSiteMetaStatic(),
        loadPortfolio(),
        loadEvents(),
        loadCommissions(),
        loadStore()
      ])
      setSiteMeta(siteMetaData)
      setPortfolio(portfolioData)
      setEvents(eventsData)
      setCommissions(commissionsData)
      setStore(storeData)

      // Apply theme settings immediately
      if (siteMetaData?.theme) {
        applyTheme(siteMetaData.theme)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const toggleLocale = () => setLocale(locale === 'en' ? 'fr' : 'en')

  const refreshData = () => {
    loadData()
  }

  const contextValue: AppContextType = {
    locale,
    toggleLocale,
    siteMeta,
    portfolio,
    events,
    commissions,
    store,
    loading,
    error,
    refreshData
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}
