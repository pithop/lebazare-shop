
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Conditions Générales de Vente (CGV) - LeBazare',
    description: 'Consultez nos conditions générales de vente. Transparence, droits du consommateur et informations légales.',
};

export default function CGVPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl text-dark-text/80">
            <h1 className="text-4xl font-serif text-terracotta mb-8 text-center">Conditions Générales de Vente</h1>
            <p className="text-center italic mb-12">Dernière mise à jour : Janvier 2026</p>

            <div className="space-y-8 prose mx-auto">
                <section>
                    <h2 className="text-2xl font-serif text-deep-blue mb-4">1. Préambule</h2>
                    <p>
                        Les présentes conditions générales de vente (CGV) s'appliquent à toutes les ventes conclues sur le site internet LeBazare.fr.
                        Le site est édité par LeBazare, micro-entreprise spécialisée dans la vente de mobilier et décoration artisanale.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-deep-blue mb-4">2. Produits et Disponibilité</h2>
                    <p>
                        Les produits proposés à la vente sont ceux décrits sur le site. Nous apportons le plus grand soin à la présentation et à la description de ces produits pour satisfaire au mieux l'information du client.
                        Toutefois, s'agissant d'artisanat fait main, des variations minimes de couleurs ou de dimensions peuvent exister.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-deep-blue mb-4">3. Prix</h2>
                    <p>
                        Les prix de nos produits sont indiqués en euros toutes taxes comprises (TTC). Les frais de traitement et d'expédition sont facturés en supplément et clairement indiqués avant la validation de la commande.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-deep-blue mb-4">4. Commande et Paiement</h2>
                    <p>
                        La validation de la commande vaut acceptation des présentes CGV. Le paiement est exigible immédiatement à la commande.
                        Vous pouvez effectuer le règlement par carte bancaire, Apple Pay, ou autres moyens proposés via notre partenaire sécurisé Stripe.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-deep-blue mb-4">5. Livraison</h2>
                    <p>
                        Les produits sont livrés à l'adresse de livraison indiquée au cours du processus de commande.
                        Les délais indiqués (généralement 48h de préparation + délai transporteur) sont des délais moyens habituels et correspondent aux délais de traitement et de livraison.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-deep-blue mb-4">6. Droit de Rétractation</h2>
                    <p>
                        Conformément aux dispositions légales en vigueur, vous disposez d'un délai de 14 jours à compter de la réception de vos produits pour exercer votre droit de rétractation sans avoir à justifier de motifs ni à payer de pénalité.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-deep-blue mb-4">7. Garanties</h2>
                    <p>
                        Tous nos produits bénéficient de la garantie légale de conformité et de la garantie des vices cachés, prévues par les articles 1641 et suivants du Code civil.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-deep-blue mb-4">8. Litiges</h2>
                    <p>
                        Les présentes conditions de vente à distance sont soumises à la loi française. En cas de litige ou de réclamation, le client s'adressera en priorité au vendeur pour obtenir une solution amiable.
                    </p>
                </section>
            </div>
        </div>
    );
}
