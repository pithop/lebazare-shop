export async function generateMetadata({ params }: { params: { lang: string } }) {
    return {
        title: 'FAQ - LeBazare',
        description: 'Foire Aux Questions - LeBazare',
        alternates: {
            canonical: `/${params.lang}/faq`,
        },
    };
}

export default function FAQPage() {
    const faqs = [
        {
            question: "D'où viennent vos produits ?",
            answer: "Tous nos produits sont sourcés directement auprès d'artisans au Maroc. Nous travaillons sans intermédiaire pour garantir une rémunération juste aux artisans et une traçabilité totale."
        },
        {
            question: "Les tapis sont-ils vraiment faits main ?",
            answer: "Absolument. Chaque tapis est noué à la main par des femmes berbères selon des techniques ancestrales. Un tapis peut nécessiter plusieurs semaines voire mois de travail."
        },
        {
            question: "Livrez-vous à l'international ?",
            answer: "Oui, nous livrons partout dans le monde. Les frais de port sont calculés automatiquement lors de la validation de votre panier."
        },
        {
            question: "Comment entretenir mon tapis berbère ?",
            answer: "Nous recommandons un aspirateur régulier. Pour un nettoyage en profondeur, privilégiez un nettoyage à sec professionnel. En cas de tache, agissez rapidement avec de l'eau gazeuse et un chiffon propre."
        },
        {
            question: "Puis-je commander un produit sur mesure ?",
            answer: "Oui ! Nous pouvons réaliser certains articles sur mesure (tapis, mobilier). Contactez-nous avec votre projet pour obtenir un devis."
        }
    ];

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-serif text-terracotta mb-12 text-center">Questions Fréquentes</h1>

            <div className="space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 hover:border-sand transition-colors">
                        <h3 className="text-xl font-serif text-deep-blue mb-3">{faq.question}</h3>
                        <p className="text-dark-text/80 leading-relaxed">{faq.answer}</p>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center bg-beige/30 p-8 rounded-xl">
                <p className="text-lg text-dark-text mb-4">Vous n'avez pas trouvé votre réponse ?</p>
                <a
                    href="/contact"
                    className="inline-block bg-terracotta text-white px-8 py-3 rounded-lg font-medium hover:bg-deep-blue transition-colors"
                >
                    Contactez-nous
                </a>
            </div>
        </div>
    );
}
