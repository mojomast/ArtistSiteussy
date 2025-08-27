'use client'

import { useAppContext } from './ClientWrapper'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Music, Palette, Globe } from 'lucide-react'

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Music,
  behance: Palette,
  dribbble: Globe,
  website: Globe
}

function Footer() {
  const { siteMeta } = useAppContext()

  if (!siteMeta) return null

  const socialLinks = Object.entries(siteMeta.socialMedia || {})
    .filter(([_, url]) => url && typeof url === 'string' && url.trim() !== '')
    .map(([platform, url]) => ({
      platform,
      url: url as string,
      Icon: socialIcons[platform as keyof typeof socialIcons]
    }))

  return (
    <footer className="bg-theme-primary text-theme-text py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">{siteMeta.artistName}</h3>
            <p className="text-theme-secondary">Contemporary Artist</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map(({ platform, url, Icon }) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-theme-secondary hover:bg-theme-accent transition-colors duration-200"
                aria-label={`Follow on ${platform}`}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}

            {(siteMeta.customLinks || []).map((link: any, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-theme-secondary hover:bg-theme-accent transition-colors duration-200"
                aria-label={link.name}
              >
                <Globe className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-theme-secondary text-center">
          <p className="text-theme-secondary text-sm">
            © {new Date().getFullYear()} {siteMeta.artistName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer