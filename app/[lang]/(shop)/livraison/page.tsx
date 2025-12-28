export async function generateMetadata({ params }: { params: { lang: string } }) {
    return {
        title: 'Livraison & Retours - LeBazare',
        description: 'Informations sur la livraison et les retours chez LeBazare',
        alternates: {
            canonical: `/${params.lang}/livraison`,
        },
    };
}

export default function LivraisonPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-serif text-terracotta mb-8 text-center">Livraison & Retours</h1>

            <div className="prose prose-lg max-w-none text-dark-text space-y-8">
                <section className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                    <h2 className="text-2xl font-serif text-deep-blue mb-4">Expédition</h2>
                    <p>
                        Nous expédions nos produits dans le monde entier depuis le Maroc.
                        Chaque commande est préparée avec le plus grand soin pour garantir que vos articles arrivent en parfait état.
                    </p>
                    <ul className="list-disc pl-5 mt-4 space-y-2">
                        <li><strong>Délais de préparation :</strong> 1 à 3 jours ouvrés.</li>
                        <li><strong>Délais de livraison :</strong>
                            <ul className="list-circle pl-5 mt-2">
                                <li>Europe : 3 à 7 jours ouvrés</li>
                                <li>Amérique du Nord : 5 à 10 jours ouvrés</li>
                                <li>Reste du monde : 7 à 15 jours ouvrés</li>
                            </ul>
                        </li>
                    </ul>
                </section>

                <section className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                    <h2 className="text-2xl font-serif text-deep-blue mb-4">Frais de Douane</h2>
                    <p>
                        Pour les commandes expédiées hors de l'Union Européenne, des frais de douane peuvent s'appliquer à l'arrivée du colis.
                        Ces frais sont à la charge du client et dépendent de la législation de chaque pays.
                    </p>
                </section>

                <section className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                    <h2 className="text-2xl font-serif text-deep-blue mb-4">Politique de Retour</h2>
                    <p>
                        Nous acceptons les retours sous 14 jours après réception de votre commande.
                        Les articles doivent être retournés dans leur état d'origine.
                    </p>
                    <p className="mt-4">
                        <strong>Comment retourner un article ?</strong><br />
                        Contactez-nous via notre formulaire de contact ou par email pour obtenir les instructions de retour.
                        Les frais de retour sont à la charge de l'acheteur, sauf en cas de défaut avéré du produit.
                    </p>
                </section>
            </div>
        </div>
    );
}
