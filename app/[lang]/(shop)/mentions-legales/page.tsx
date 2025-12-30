export async function generateMetadata({ params }: { params: { lang: string } }) {
    return {
        title: 'Mentions Légales - LeBazare',
        description: 'Mentions Légales du site LeBazare',
        alternates: {
            canonical: `/${params.lang}/mentions-legales`,
        },
    };
}

export default function MentionsLegalesPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-serif text-terracotta mb-8 text-center">Mentions Légales</h1>

            <div className="prose prose-lg max-w-none text-dark-text bg-white p-8 rounded-xl shadow-sm border border-stone-100 space-y-8">

                <section>
                    <h2 className="text-2xl font-serif text-deep-blue mb-4">Éditeur du site</h2>
                    <p>
                        Le site <strong>LeBazare</strong> est édité par :<br />
                        [Votre Nom ou Raison Sociale]<br />
                        [Adresse]<br />
                        [Code Postal, Ville]<br />
                        Email : contact@lebazare.fr<br />
                        Téléphone : +33 9 72 21 38 99
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-deep-blue mb-4">Hébergement</h2>
                    <p>
                        Le site est hébergé par :<br />
                        <strong>Vercel Inc.</strong><br />
                        340 S Lemon Ave #4133<br />
                        Walnut, CA 91789<br />
                        États-Unis
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-deep-blue mb-4">Propriété Intellectuelle</h2>
                    <p>
                        L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
                        Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-deep-blue mb-4">Données Personnelles</h2>
                    <p>
                        Conformément à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
                        Pour exercer ce droit, contactez-nous par email.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-deep-blue mb-4">Médiation de la Consommation</h2>
                    <p>
                        Conformément aux articles L.616-1 et R.616-1 du code de la consommation, nous proposons un dispositif de médiation de la consommation.
                        L'entité de médiation retenue est : <strong>[Nom du Médiateur - ex: FEVAD ou CM2C]</strong>.
                    </p>
                    <p>
                        En cas de litige, vous pouvez déposer votre réclamation sur son site : <br />
                        [URL du site du médiateur]<br />
                        Ou par voie postale en écrivant à :<br />
                        [Adresse du médiateur]
                    </p>
                </section>

            </div>
        </div>
    );
}
