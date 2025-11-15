export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-serif text-terracotta mb-4">LeBazare</h1>
      <h2 className="text-2xl font-serif text-ocre mb-8">Boutique Artisanale</h2>
      <p className="text-lg text-center max-w-2xl mb-8">
        Bienvenue sur notre boutique en ligne de produits artisanaux en matières naturelles.
        Découvrez notre collection unique de créations en bois, paille et raphia.
      </p>
      <div className="flex gap-4">
        <button className="bg-accent-red text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
          Découvrir nos produits
        </button>
        <button className="bg-terracotta text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
          À propos
        </button>
      </div>
      <div className="mt-12 text-sm text-dark-text opacity-60">
        <p>Configuration réussie ✓</p>
        <p>Next.js 14 + Tailwind CSS + Shopify Headless</p>
      </div>
    </main>
  )
}
