import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
