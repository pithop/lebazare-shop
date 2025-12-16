import type { Metadata } from 'next'
import '../globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'

export const metadata: Metadata = {
  title: 'LeBazare - Boutique Artisanale',
  description: 'Boutique artisanale de produits en matières naturelles - bois, paille, raphia',
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
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
