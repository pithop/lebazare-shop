export async function generateMetadata({ params }: { params: { lang: string } }) {
  return {
    title: 'Contact - LeBazare',
    description: 'Contactez-nous pour toute question sur nos créations artisanales. Email : contact@lebazare.fr | Tél : +33 9 72 21 38 99',
    alternates: {
      canonical: `/${params.lang}/contact`,
    },
  };
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif text-terracotta mb-8 text-center">
          Contactez-nous
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <p className="text-lg text-dark-text mb-8 text-center">
            Une question sur votre commande, nos produits ou une demande personnalisée ?
            Notre équipe vous répond sous 24h.
          </p>

          {/* Contact Direct - Prioritaire */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <a
              href="mailto:contact@lebazare.fr"
              className="flex items-center gap-4 p-6 bg-beige rounded-xl hover:bg-terracotta/10 transition-colors group"
            >
              <div className="w-14 h-14 bg-terracotta/20 rounded-full flex items-center justify-center group-hover:bg-terracotta/30 transition-colors">
                <svg className="w-7 h-7 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-dark-text/60 mb-1">Email</p>
                <p className="text-lg font-medium text-dark-text">contact@lebazare.fr</p>
              </div>
            </a>

            <a
              href="tel:+33972213899"
              className="flex items-center gap-4 p-6 bg-beige rounded-xl hover:bg-terracotta/10 transition-colors group"
            >
              <div className="w-14 h-14 bg-terracotta/20 rounded-full flex items-center justify-center group-hover:bg-terracotta/30 transition-colors">
                <svg className="w-7 h-7 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-dark-text/60 mb-1">Téléphone</p>
                <p className="text-lg font-medium text-dark-text">+33 9 72 21 38 99</p>
              </div>
            </a>
          </div>

          {/* Adresse */}
          <div className="text-center mb-12 p-6 border border-dark-text/10 rounded-xl">
            <h2 className="font-serif text-xl text-terracotta mb-3">Notre Adresse</h2>
            <p className="text-dark-text">
              LeBazare<br />
              Aix-en-Provence, 13100<br />
              France
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 border border-dark-text/20 rounded-lg">
              <h3 className="font-serif text-xl text-terracotta mb-3">
                Commandes Personnalisées
              </h3>
              <p className="text-dark-text/90">
                Nous acceptons les commandes sur mesure. Contactez-nous avec vos idées
                et nous serons ravis de créer une pièce unique pour vous.
              </p>
            </div>

            <div className="p-6 border border-dark-text/20 rounded-lg">
              <h3 className="font-serif text-xl text-terracotta mb-3">
                Questions & Support
              </h3>
              <p className="text-dark-text/90">
                Pour toute question sur nos produits, les délais de livraison ou
                l'entretien de vos créations, n'hésitez pas à nous écrire.
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 py-8 border-t border-dark-text/10">
            <div className="flex items-center gap-2 text-dark-text/70">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm">Paiement 100% Sécurisé</span>
            </div>
            <div className="flex items-center gap-2 text-dark-text/70">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-sm">Paiement par Stripe</span>
            </div>
            <div className="flex items-center gap-2 text-dark-text/70">
              <svg className="w-5 h-5 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
              </svg>
              <span className="text-sm">Retour 14 jours</span>
            </div>
          </div>

          {/* FAQ Preview */}
          <div className="mt-12">
            <h2 className="font-serif text-2xl text-terracotta mb-6 text-center">
              Questions Fréquentes
            </h2>

            <div className="space-y-4">
              <details className="bg-beige p-6 rounded-lg cursor-pointer">
                <summary className="font-medium text-dark-text">
                  Quels sont les délais de livraison ?
                </summary>
                <p className="mt-3 text-dark-text/80">
                  Les délais de livraison varient selon les produits et votre localisation.
                  En général, comptez entre 5 et 10 jours ouvrés pour la France métropolitaine.
                </p>
              </details>

              <details className="bg-beige p-6 rounded-lg cursor-pointer">
                <summary className="font-medium text-dark-text">
                  Comment entretenir mes créations en matières naturelles ?
                </summary>
                <p className="mt-3 text-dark-text/80">
                  Nos créations en bois, paille et raphia nécessitent peu d'entretien.
                  Évitez l'exposition prolongée à l'humidité et au soleil direct.
                  Un dépoussiérage régulier suffit à maintenir leur beauté.
                </p>
              </details>

              <details className="bg-beige p-6 rounded-lg cursor-pointer">
                <summary className="font-medium text-dark-text">
                  Puis-je retourner un produit ?
                </summary>
                <p className="mt-3 text-dark-text/80">
                  Oui, vous disposez de 14 jours pour retourner un article non personnalisé,
                  selon les conditions générales de vente. Le produit doit être dans son
                  état d'origine. Les frais de retour sont à la charge du client.
                </p>
              </details>

              <details className="bg-beige p-6 rounded-lg cursor-pointer">
                <summary className="font-medium text-dark-text">
                  Proposez-vous la livraison internationale ?
                </summary>
                <p className="mt-3 text-dark-text/80">
                  Oui, nous livrons dans toute l'Europe et à l'international.
                  Les frais de port et délais varient selon la destination et sont calculés automatiquement au checkout.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

