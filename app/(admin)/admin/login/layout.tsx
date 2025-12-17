import '@/app/globals.css'

export const metadata = {
  title: 'Login - LeBazare Admin',
  description: 'Connexion administration',
}

export default function LoginLayout({
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
