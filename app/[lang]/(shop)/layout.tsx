import type { Metadata } from 'next'
import '../../globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'
import { Toaster } from '@/components/ui/sonner'
import ClarityAnalytics from '@/components/ClarityAnalytics'
import { Analytics } from "@vercel/analytics/next"
import JsonLd from '@/components/JsonLd'
import AnnouncementBar from '@/components/AnnouncementBar'
import { i18n } from '@/i18n-config'
import FacebookPixel from '@/components/FacebookPixel'
import GoogleAdsTag from '@/components/GoogleAdsTag'

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  return {
    metadataBase: new URL('https://www.lebazare.fr'),
    title: {
      default: 'LeBazare | Mobilier Artisanal Marocain & Décoration Bohème - Le Bazare',
      template: '%s | LeBazare - Le Bazare France'
    },
    description: 'LeBazare (Le Bazare) : Boutique française de mobilier artisanal marocain. Luminaires en paille, chaises tressées, vannerie. Pièces uniques faites main, expédiées sous 48h.',
    keywords: [
      'LeBazare', 'Le Bazare', 'lebazare.fr', 'artisanat marocain', 'décoration bohème', 'mobilier artisanal', 'luminaires paille', 'vintage', 'fait main', 'vannerie', 'chaises bois',
      'moroccan crafts', 'handmade furniture', 'boho decor', 'straw lighting', 'artesanía marroquí', 'muebles artesanos', 'décoration ethnique',
      'bazar marocain', 'marrakech deco', 'artisanat de luxe', 'boutique artisanat maroc'
    ],
    openGraph: {
      type: 'website',
      locale: params.lang,
      alternateLocale: i18n.locales.filter(l => l !== params.lang),
      url: 'https://www.lebazare.fr',
      siteName: 'LeBazare',
      title: 'LeBazare - L\'Authenticité du Mobilier Marocain',
      description: 'Voyagez au cœur du Maroc à travers notre collection unique de trésors artisanaux. Mobilier, luminaires, et décoration bohème chic.',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'LeBazare - Artisanat Marocain Authentique',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'LeBazare - Artisanat Marocain & Déco Bohème',
      description: 'Découvrez nos pièces uniques faites main au Maroc.',
      images: ['/og-image.jpg'],
    },
    alternates: {
      languages: {
        'fr': '/fr',
        'en': '/en',
        'es': '/es',
        'ar': '/ar',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'votre-code-google-search-console', // Remplacez par votre code
      other: {
        'msvalidate.01': 'votre-code-bing-webmaster', // Remplacez par votre code
        'trustpilot-one-time-domain-verification-id': '1a5788c0-0b45-43ea-ab5b-31929f2893de',
      },
    },
  }
}

import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'

// ...

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  const dictionary = await getDictionary(params.lang)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.lebazare.fr/#organization',
    name: 'LeBazare',
    alternateName: ['Le Bazare', 'LeBazare.fr', 'Le Bazare France'],
    url: 'https://www.lebazare.fr',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.lebazare.fr/logo.png',
      width: 512,
      height: 512
    },
    image: 'https://www.lebazare.fr/og-image.jpg',
    description: 'LeBazare - Boutique en ligne de mobilier artisanal marocain, luminaires en paille et décoration bohème. Pièces uniques faites main, expédiées depuis la France.',
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: 'LeBazare Team'
    },
    slogan: 'L\'authenticité du mobilier marocain',
    sameAs: [
      'https://www.instagram.com/le.bazare',
      'https://www.facebook.com/lebazarfr',
      'https://www.etsy.com/shop/LeBazare'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+33-9-72-21-38-99',
      contactType: 'customer service',
      email: 'contact@lebazare.fr',
      areaServed: ['FR', 'BE', 'CH', 'LU', 'DE', 'ES', 'IT'],
      availableLanguage: ['French', 'English', 'Spanish', 'Arabic']
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR'
    }
  }

  return (
    <html lang={params.lang} dir={params.lang === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <JsonLd data={jsonLd} />
        <FacebookPixel />
        <GoogleAdsTag />
        <ClarityAnalytics />
        <Analytics />
        <CartProvider>
          <AnnouncementBar />
          <Header dictionary={dictionary} />
          <CartDrawer />
          <Toaster />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer dictionary={dictionary} />
        </CartProvider>
      </body>
    </html>
  )
}
