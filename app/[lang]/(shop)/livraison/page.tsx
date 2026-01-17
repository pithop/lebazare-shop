
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Livraison & Retours - LeBazare',
    description: 'Informations sur la livraison rapide en 48h et notre politique de retours simple et transparente.',
};

export default function DeliveryPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-serif text-terracotta mb-8 text-center">Livraison & Retours</h1>

            <div className="space-y-12">
                {/* Shipping Section */}
                <section className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="bg-sand/20 p-3 rounded-full text-2xl">🚚</div>
                        <div>
                            <h2 className="text-2xl font-serif text-deep-blue mb-2">Expédition Rapide</h2>
                            <p className="text-dark-text/80 leading-relaxed">
                                Chez LeBazare, nous savons que vous êtes impatients de recevoir vos trésors. Contrairement à de nombreux sites de dropshipping, <strong>nous stockons nos produits en Europe</strong>.
                            </p>
                        </div>
                    </div>

                    <ul className="space-y-4 ml-16 text-dark-text/80">
                        <li className="flex items-center gap-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span><strong>Traitement :</strong> Votre commande est préparée et expédiée sous 24h à 48h ouvrées.</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span><strong>Transporteurs :</strong> Nous travaillons avec Colissimo, DPD et Mondial Relay pour vous offrir le meilleur service.</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span><strong>Suivi :</strong> Un numéro de suivi vous est envoyé par email dès le départ du colis.</span>
                        </li>
                    </ul>
                </section>

                {/* Costs Section */}
                <section className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="bg-sand/20 p-3 rounded-full text-2xl">💰</div>
                        <div>
                            <h2 className="text-2xl font-serif text-deep-blue mb-2">Frais de Livraison</h2>
                            <p className="text-dark-text/80 leading-relaxed">
                                Les frais sont calculés au plus juste en fonction du poids total de votre commande et de votre destination.
                            </p>
                        </div>
                    </div>
                    <div className="ml-16 bg-stone-50 p-6 rounded-lg text-dark-text/80">
                        <p className="mb-2"><strong>France Métropolitaine :</strong></p>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>Livraison standard : À partir de 4,90 €</li>
                            <li><strong>Livraison OFFERTE</strong> dès 150 € d'achat.</li>
                        </ul>
                        <p className="mt-4 mb-2"><strong>International (UE) :</strong></p>
                        <p>Calculé à l'étape du paiement. Pas de frais de douane pour les pays de l'Union Européenne.</p>
                    </div>
                </section>

                {/* Returns Section */}
                <section className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="bg-sand/20 p-3 rounded-full text-2xl">↩️</div>
                        <div>
                            <h2 className="text-2xl font-serif text-deep-blue mb-2">Politique de Retour</h2>
                            <p className="text-dark-text/80 leading-relaxed">
                                Vous changez d'avis ? C'est tout à fait normal. Vous disposez de <strong>14 jours</strong> après réception pour nous retourner vos articles.
                            </p>
                        </div>
                    </div>

                    <div className="ml-16 space-y-4 text-dark-text/80">
                        <p>
                            <strong>Conditions de retour :</strong>
                            <br />
                            Les articles doivent être retournés dans leur état d'origine, emballés avec soin. Les frais de retour sont à la charge du client.
                        </p>
                        <p>
                            <strong>Procédure :</strong>
                            <br />
                            1. Contactez-nous à <a href="mailto:contact@lebazare.fr" className="text-terracotta underline">contact@lebazare.fr</a> pour obtenir votre bon de retour.
                            <br />
                            2. Renvoyez le colis à l'adresse indiquée.
                            <br />
                            3. Le remboursement est effectué sous 14 jours après réception et vérification du colis.
                        </p>
                        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-200 text-sm">
                            <strong>Note sur l'Artisanat :</strong> Nos produits sont faits main. De légères variations de taille ou de couleur ne sont pas des défauts, mais la preuve de leur authenticité.
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
