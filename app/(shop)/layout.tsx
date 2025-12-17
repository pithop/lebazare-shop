import type { Metadata } from 'next'
import '../globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lebazare.fr'),
  title: {
    default: 'LeBazare - Décoration Bohème & Artisanat Marocain Vintage',
    template: '%s | LeBazare'
  },
  description: 'Découvrez notre collection unique de tapis berbères, luminaires en paille, mobilier vintage et vannerie. Artisanat marocain authentique, fait main et éthique.',
  keywords: ['artisanat marocain', 'décoration bohème', 'tapis berbère', 'vintage', 'fait main', 'vannerie', 'luminaires paille', 'mobilier artisanal'],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.lebazare.fr',
    siteName: 'LeBazare',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LeBazare - Artisanat Marocain Authentique',
      },
    ],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          <Header />
          <CartDrawer />
          <Toaster />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
