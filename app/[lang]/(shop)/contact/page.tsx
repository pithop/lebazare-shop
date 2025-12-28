export async function generateMetadata({ params }: { params: { lang: string } }) {
  return {
    title: 'Contact - LeBazare',
    description: 'Contactez-nous pour toute question sur nos créations artisanales',
    alternates: {
      canonical: `/${params.lang}/contact`,
    },
  };
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-serif text-terracotta mb-8 text-center">
          Contactez-nous
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <p className="text-lg text-dark-text mb-8 text-center">
            Vous avez une question sur nos produits ou souhaitez une création personnalisée ?
            N'hésitez pas à nous contacter !
          </p>

          <div className="space-y-8">
            {/* Etsy Contact */}
            <div className="text-center p-6 bg-beige rounded-lg">
              <h2 className="font-serif text-2xl text-terracotta mb-4">
                Via Etsy
              </h2>
              <p className="text-dark-text mb-4">
                Le meilleur moyen de nous contacter est via notre boutique Etsy,
                où vous pourrez également consulter nos créations et passer commande.
              </p>
              <a
                href="https://www.etsy.com/shop/LeBazare"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-accent-red text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Nous contacter sur Etsy
              </a>
            </div>

            {/* Info Section */}
            <div className="grid md:grid-cols-2 gap-6">
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
                    état d'origine.
                  </p>
                </details>

                <details className="bg-beige p-6 rounded-lg cursor-pointer">
                  <summary className="font-medium text-dark-text">
                    Proposez-vous la livraison internationale ?
                  </summary>
                  <p className="mt-3 text-dark-text/80">
                    Oui, nous livrons dans le monde entier via notre boutique Etsy.
                    Les frais de port et délais varient selon la destination.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
