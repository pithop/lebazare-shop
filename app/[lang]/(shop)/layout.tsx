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

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  return {
    metadataBase: new URL('https://www.lebazare.fr'),
    title: {
      default: 'LeBazare - Mobilier Artisanal, Luminaires & Décoration Bohème',
      template: '%s | LeBazare'
    },
    description: 'Découvrez l\'excellence de l\'artisanat marocain : Mobilier en bois, luminaires en paille, chaises tressées et vannerie. Pièces uniques faites main au Maroc.',
    keywords: [
      'artisanat marocain', 'décoration bohème', 'mobilier artisanal', 'luminaires paille', 'vintage', 'fait main', 'vannerie', 'chaises bois',
      'moroccan crafts', 'handmade furniture', 'boho decor', 'straw lighting', 'artesanía marroquí', 'muebles artesanos', 'décoration ethnique',
      'bazar marocain', 'marrakech deco', 'artisanat de luxe'
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
    name: 'LeBazare',
    url: 'https://www.lebazare.fr',
    logo: 'https://www.lebazare.fr/logo.png',
    sameAs: [
      'https://www.instagram.com/lebazare',
      'https://www.facebook.com/lebazare'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+33-9-72-21-38-99',
      contactType: 'customer service',
      areaServed: ['FR', 'BE', 'CH', 'US', 'ES'],
      availableLanguage: ['French', 'English', 'Spanish', 'Arabic']
    }
  }

  return (
    <html lang={params.lang} dir={params.lang === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <JsonLd data={jsonLd} />
        <FacebookPixel />
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
