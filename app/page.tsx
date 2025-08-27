import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { BioCard } from '@/components/BioCard'
import { GalleryGrid } from '@/components/GalleryGrid'
import { EventsCalendar } from '@/components/EventsCalendar'
import { CommissionsForm } from '@/components/CommissionsForm'
import { ShopGrid } from '@/components/ShopGrid'
import Footer from '@/components/Footer'
import { ClientWrapper } from '@/components/ClientWrapper'

export default function HomePage() {
  return (
    <ClientWrapper>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <BioCard />
        <GalleryGrid />
        <EventsCalendar />
        <CommissionsForm />
        <ShopGrid />
      </main>
      <Footer />
    </ClientWrapper>
  )
}