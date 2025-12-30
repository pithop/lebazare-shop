import React from 'react';

export const metadata = {
    title: 'Politique de Retour et Remboursement | LeBazare',
    description: 'Conditions de retour, d\'échange et de remboursement chez LeBazare.',
};

export default function ReturnPolicyPage() {
    return (
        <div className="bg-beige min-h-screen pt-32 pb-20 px-4 md:px-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-serif text-dark-text mb-12">Politique de Retour</h1>

                <div className="prose prose-stone prose-lg">
                    <p>
                        Chez LeBazare, nous souhaitons que vous soyez pleinement satisfait de vos achats.
                        Conformément à la législation européenne, vous disposez d'un droit de rétractation.
                    </p>

                    <h3>1. Délai de rétractation</h3>
                    <p>
                        Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de <strong>14 jours</strong>.
                        Le délai de rétractation expire quatorze jours après le jour où vous-même, ou un tiers autre que le transporteur et désigné par vous, prend physiquement possession du bien.
                    </p>

                    <h3>2. Exercice du droit de rétractation</h3>
                    <p>
                        Pour exercer le droit de rétractation, vous devez nous notifier votre décision de rétractation du présent contrat au moyen d'une déclaration dénuée d'ambiguïté (par exemple, lettre envoyée par la poste ou courrier électronique) à :
                    </p>
                    <ul>
                        <li>Email : contact@lebazare.fr</li>
                        <li>Adresse : [Votre Adresse Postale Ici]</li>
                    </ul>

                    <h3>3. Effets de la rétractation</h3>
                    <p>
                        En cas de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous, y compris les frais de livraison (à l'exception des frais supplémentaires découlant du fait que vous avez choisi, le cas échéant, un mode de livraison autre que le mode moins coûteux de livraison standard proposé par nous) sans retard excessif et, en tout état de cause, au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation du présent contrat.
                    </p>

                    <h3>4. Frais de retour</h3>
                    <p>
                        Vous devrez renvoyer ou rendre le bien, à nous-mêmes sans retard excessif et, en tout état de cause, au plus tard quatorze jours après que vous nous aurez communiqué votre décision de rétractation du présent contrat. Ce délai est réputé respecté si vous renvoyez le bien avant l'expiration du délai de quatorze jours.
                    </p>
                    <p>
                        <strong>Les frais directs de renvoi du bien sont à votre charge.</strong>
                    </p>

                    <h3>5. État des biens</h3>
                    <p>
                        Votre responsabilité n'est engagée qu'à l'égard de la dépréciation du bien résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et le bon fonctionnement de ce bien. Les articles doivent être retournés dans leur emballage d'origine et en parfait état.
                    </p>

                    <h3>6. Exceptions</h3>
                    <p>
                        Le droit de rétractation ne s'applique pas aux contrats de fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés.
                    </p>
                </div>
            </div>
        </div>
    );
}
