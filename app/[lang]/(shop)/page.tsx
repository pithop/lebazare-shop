import Link from 'next/link';
import Image from 'next/image';
import { getStaticProducts } from '@/lib/products';
import HeroCreative from '@/components/HeroCreative';

export default async function Home() {
  // Fetch trending/featured products for the carousel
  const featuredProducts = await getStaticProducts(3);

  return (
    <>
      {/* Hero Section */}
      <HeroCreative products={featuredProducts} />

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-serif text-terracotta mb-8">
              L'Art du Naturel
            </h2>
            <p className="text-lg text-dark-text mb-6 leading-relaxed">
              LeBazare est née d'une passion pour les matières naturelles et le travail artisanal.
              Nous créons des pièces uniques en bois, paille et raphia, dans un esprit bohème et rustique.
            </p>
            <p className="text-lg text-dark-text leading-relaxed">
              Chaque création raconte une histoire et apporte une touche d'authenticité à votre intérieur.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-beige">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif text-terracotta mb-12 text-center">
            Nos Valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-terracotta"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-dark-text mb-3">Fait Main</h3>
              <p className="text-dark-text/80">
                Chaque pièce est façonnée à la main avec soin et attention aux détails.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-ocre/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-ocre"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-dark-text mb-3">Naturel</h3>
              <p className="text-dark-text/80">
                Matières authentiques et durables : bois, paille, raphia et fibres naturelles.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-accent-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-accent-red"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-dark-text mb-3">Unique</h3>
              <p className="text-dark-text/80">
                Pièces uniques ou en édition limitée, pour un intérieur qui vous ressemble.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif text-terracotta mb-6">
            Prêt à Découvrir Nos Créations ?
          </h2>
          <p className="text-lg text-dark-text mb-8 max-w-2xl mx-auto">
            Explorez notre collection et trouvez la pièce parfaite pour votre intérieur.
          </p>
          <Link
            href="/produits"
            className="inline-block bg-accent-red text-white px-8 py-4 rounded-lg text-lg font-medium hover:opacity-90 transition-opacity shadow-lg"
          >
            Voir tous les produits
          </Link>
        </div>
      </section>
    </>
  );
}
