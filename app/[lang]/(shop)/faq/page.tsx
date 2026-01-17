export async function generateMetadata({ params }: { params: { lang: string } }) {
    return {
        title: 'FAQ - LeBazare',
        description: 'Foire Aux Questions - LeBazare',
        alternates: {
            canonical: `/${params.lang}/faq`,
        },
    };
}

import { FAQSchema } from '@/components/seo/FAQSchema';

export default function FAQPage() {
    const faqs = [
        {
            question: "D'où viennent vos produits ?",
            answer: "Tous nos produits sont sourcés directement auprès d'artisans au Maroc. Nous travaillons sans intermédiaire pour garantir une rémunération juste aux artisans et une traçabilité totale."
        },
        {
            question: "Les produits sont-ils vraiment faits main ?",
            answer: "Absolument. Chaque pièce (tabouret, luminaire, panier) est fabriquée à la main selon des techniques ancestrales. Cela signifie que chaque objet est unique et peut présenter de légères variations, gage de son authenticité."
        },
        {
            question: "Livrez-vous à l'international ?",
            answer: "Oui, nous livrons partout dans le monde. Les frais de port sont calculés automatiquement lors de la validation de votre panier."
        },
        {
            question: "Comment entretenir mes luminaires en paille ou mobilier ?",
            answer: "Pour la paille et l'osier, dépoussiérez régulièrement avec un chiffon sec ou une brosse douce. Évitez l'humidité directe. Pour le bois, un chiffon doux suffit. Nos produits sont conçus pour durer avec un entretien minimal."
        },
        {
            question: "Puis-je commander un produit sur mesure ?",
            answer: "Oui ! Nous pouvons réaliser certains articles sur mesure (mobilier, dimensions spécifiques). Contactez-nous avec votre projet pour obtenir un devis."
        }
    ];

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <FAQSchema faqs={faqs} />
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
