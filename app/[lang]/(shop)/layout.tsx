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

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  return {
    metadataBase: new URL('https://www.lebazare.fr'),
    title: {
      default: 'LeBazare - Artisanat Marocain, Tapis Berbère & Décoration Bohème',
      template: '%s | LeBazare'
    },
    description: 'Découvrez l\'excellence de l\'artisanat marocain : Tapis berbères authentiques, luminaires en paille, mobilier vintage et vannerie. Pièces uniques faites main au Maroc.',
    keywords: [
      'artisanat marocain', 'décoration bohème', 'tapis berbère', 'vintage', 'fait main', 'vannerie', 'luminaires paille', 'mobilier artisanal',
      'moroccan crafts', 'berber rugs', 'boho decor', 'handcrafted', 'artesanía marroquí', 'alfombras bereberes', 'décoration ethnique',
      'bazar marocain', 'marrakech deco', 'artisanat de luxe'
    ],
    openGraph: {
      type: 'website',
      locale: params.lang,
      alternateLocale: i18n.locales.filter(l => l !== params.lang),
      url: 'https://www.lebazare.fr',
      siteName: 'LeBazare',
      title: 'LeBazare - L\'Authenticité de l\'Artisanat Marocain',
      description: 'Voyagez au cœur du Maroc à travers notre collection unique de trésors artisanaux. Tapis, luminaires, et décoration bohème chic.',
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
