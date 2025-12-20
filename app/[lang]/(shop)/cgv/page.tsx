export const metadata = {
    title: 'Conditions Générales de Vente - LeBazare',
    description: 'Conditions Générales de Vente de la boutique LeBazare',
};

export default function CGVPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-serif text-terracotta mb-8 text-center">Conditions Générales de Vente</h1>

            <div className="prose prose-lg max-w-none text-dark-text bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                <p className="text-sm text-stone-500 mb-8">Dernière mise à jour : {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-serif text-deep-blue mt-8 mb-4">1. Objet</h2>
                <p>
                    Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits artisanaux effectuées sur le site LeBazare.
                </p>

                <h2 className="text-2xl font-serif text-deep-blue mt-8 mb-4">2. Produits</h2>
                <p>
                    Nos produits sont issus de l'artisanat marocain. Chaque pièce étant faite à la main, de légères variations de taille, de couleur ou de motif peuvent exister, ce qui en fait le charme et l'unicité.
                </p>

                <h2 className="text-2xl font-serif text-deep-blue mt-8 mb-4">3. Prix</h2>
                <p>
                    Les prix sont indiqués en Euros (€) et s'entendent hors frais de livraison. LeBazare se réserve le droit de modifier ses prix à tout moment, mais le produit sera facturé sur la base du tarif en vigueur au moment de la validation de la commande.
                </p>

                <h2 className="text-2xl font-serif text-deep-blue mt-8 mb-4">4. Commande</h2>
                <p>
                    La validation de la commande entraîne l'acceptation des présentes CGV. Un email de confirmation vous sera envoyé après validation.
                </p>

                <h2 className="text-2xl font-serif text-deep-blue mt-8 mb-4">5. Paiement</h2>
                <p>
                    Le paiement est exigible immédiatement à la commande. Nous acceptons les paiements par carte bancaire via notre prestataire sécurisé Stripe.
                </p>

                {/* Add more sections as needed */}
            </div>
        </div>
    );
}
