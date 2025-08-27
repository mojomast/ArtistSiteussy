export interface SiteMeta {
  artistName: string
  siteTitle: string
  bio_en: string
  bio_fr: string
  tagline_en: string
  tagline_fr: string
  contact: {
    email: string
    location: string
  }
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    backgroundColor: string
    textColor: string
    fontFamily: string
    headingFontFamily: string
    layout: string
  }
  sections: {
    hero: boolean
    bio: boolean
    gallery: boolean
    events: boolean
    commissions: boolean
    shop: boolean
  }
  socialMedia: {
    facebook: string
    twitter: string
    instagram: string
    linkedin: string
    youtube: string
    tiktok: string
    behance: string
    dribbble: string
    website: string
  }
  customLinks: Array<{
    name: string
    url: string
    icon: string
  }>
}

export interface PortfolioData {
  featured_en: FeaturedArtwork[]
  featured_fr: FeaturedArtwork[]
  collections_en: Collection[]
  collections_fr: Collection[]
}

export interface FeaturedArtwork {
  id: string
  title: string
  year: number
  medium: string
  dimensions: string
  description: string
  imageUrl: string
}

export interface Collection {
  id: string
  name: string
  description: string
  artworks: Artwork[]
}

export interface Artwork {
  id: string
  title: string
  imageUrl: string
}

export interface EventsData {
  events_en: Event[]
  events_fr: Event[]
  upcoming_message_en: string
  upcoming_message_fr: string
}

export interface Event {
  id: string
  title: string
  description: string
  start: string
  end: string
  location: string
  venue: string
  type: string
}

export interface CommissionsData {
  title_en: string
  title_fr: string
  subtitle_en: string
  subtitle_fr: string
  description_en: string
  description_fr: string
  commission_types_en: CommissionType[]
  commission_types_fr: CommissionType[]
  process_en: ProcessStep[]
  process_fr: ProcessStep[]
  terms_en: Terms
  terms_fr: Terms
}

export interface CommissionType {
  id: string
  name: string
  description: string
  sizes?: Size[]
  price_range?: string
  pricing?: string
  note?: string
}

export interface Size {
  name: string
  price: number
}

export interface ProcessStep {
  step: number
  title: string
  description: string
}

export interface Terms {
  deposit: string
  timeline: string
  revisions: string
  authenticity: string
}

export interface StoreData {
  products_en: Product[]
  products_fr: Product[]
  shipping_info_en: ShippingInfo
  shipping_info_fr: ShippingInfo
  limited_edition_prints_en: PrintsInfo
  limited_edition_prints_fr: PrintsInfo
}

export interface Product {
  id: string
  title: string
  description: string
  medium: string
  dimensions: string
  price: number
  currency: string
  is_available: boolean
  sold: boolean
  inventory_quantity: number
  image_url: string
  stripe_price_id: string
  tags: string[]
}

export interface ShippingInfo {
  free_shipping_threshold: number
  montreal_shipping: string
  canada_shipping: string
  international_shipping: string
  flexible_payment: string
}

export interface PrintsInfo {
  description: string
  sizes: string[]
  price_range: string
}
