export const metadata = {
  title: 'Panier - LeBazare',
  description: 'Votre panier d\'achats',
};

export default function PanierPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif text-terracotta mb-8 text-center">
          Votre Panier
        </h1>

        {/* Free Shipping Progress Mock */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-stone-600">Plus que <strong>55,00 €</strong> pour la livraison offerte</span>
            <span className="text-terracotta font-medium">45%</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2.5">
            <div className="bg-terracotta h-2.5 rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-24 h-24 mx-auto text-dark-text/30 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <p className="text-xl text-dark-text/60 mb-2">
              Votre panier est vide
            </p>
            <p className="text-dark-text/60">
              Découvrez nos créations artisanales uniques
            </p>
          </div>

          <a
            href="/produits"
            className="inline-block bg-accent-red text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Découvrir nos produits
          </a>
        </div>

        <div className="mt-12 bg-beige rounded-lg p-6">
          <h2 className="font-serif text-2xl text-terracotta mb-4 text-center">
            Commande via Etsy
          </h2>
          <p className="text-dark-text text-center mb-4">
            Pour le moment, les commandes sont traitées via notre boutique Etsy
            où vous bénéficiez d'un système de paiement sécurisé et d'une protection acheteur.
          </p>
          <div className="text-center">
            <a
              href="https://www.etsy.com/shop/LeBazare"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-terracotta text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Commander sur Etsy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
