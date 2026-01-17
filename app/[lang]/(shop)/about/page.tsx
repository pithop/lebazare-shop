
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'À Propos - LeBazare | Authenticité & Artisanat Marocain',
    description: 'Découvrez l\'histoire de LeBazare. Une passion pour l\'artisanat marocain, un engagement éthique auprès des artisans, et une sélection unique de mobilier et décoration.',
};

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-5xl">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-serif text-terracotta mb-6">L'Esprit LeBazare</h1>
                <p className="text-xl text-dark-text/80 max-w-2xl mx-auto leading-relaxed">
                    Plus qu'une boutique, un pont entre le savoir-faire ancestral marocain et votre intérieur moderne.
                </p>
            </div>

            {/* Story Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                <div className="relative aspect-square md:aspect-[4/5] rounded-xl overflow-hidden shadow-lg bg-stone-100">
                    {/* Placeholder image meant to be replaced by actual brand imagery if available, utilizing generic keywords meanwhile */}
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-200 text-stone-400">
                        <span className="italic">Photo Atelier / Artisan</span>
                    </div>
                </div>
                <div className="space-y-6">
                    <h2 className="text-3xl font-serif text-deep-blue">Une Histoire d'Authenticité</h2>
                    <p className="text-dark-text/80 leading-relaxed">
                        LeBazare est né d'une volonté simple : rendre accessible l'excellence de l'artisanat marocain sans les intermédiaires classiques. Nous parcourons le Maroc à la rencontre des vanniers, menuisiers et tisserands qui perpétuent des gestes millénaires.
                    </p>
                    <p className="text-dark-text/80 leading-relaxed">
                        Chaque tabouret en bois de citronnier, chaque suspension en paille, chaque panier est sélectionné pour son caractère unique. Loin de la production de masse, nous célébrons les imperfections qui racontent la main de l'artisan.
                    </p>
                </div>
            </div>

            {/* Values Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-24">
                <div className="bg-sand/10 p-8 rounded-xl text-center hover:bg-sand/20 transition-colors">
                    <div className="text-4xl mb-4">🤝</div>
                    <h3 className="text-xl font-serif text-deep-blue mb-3">Éthique & Direct</h3>
                    <p className="text-dark-text/80">
                        Nous travaillons en direct avec les artisans. Pas de grossiste, pas de négociation agressive. Une rémunération juste pour préserver ces savoir-faire.
                    </p>
                </div>
                <div className="bg-sand/10 p-8 rounded-xl text-center hover:bg-sand/20 transition-colors">
                    <div className="text-4xl mb-4">🌿</div>
                    <h3 className="text-xl font-serif text-deep-blue mb-3">Matériaux Naturels</h3>
                    <p className="text-dark-text/80">
                        Bois d'eucalyptus, feuilles de palmier doum, roseau... Nous privilégions des matières premières naturelles, durables et locales.
                    </p>
                </div>
                <div className="bg-sand/10 p-8 rounded-xl text-center hover:bg-sand/20 transition-colors">
                    <div className="text-4xl mb-4">🚀</div>
                    <h3 className="text-xl font-serif text-deep-blue mb-3">Disponibilité Immédiate</h3>
                    <p className="text-dark-text/80">
                        Contrairement à beaucoup, notre stock est basé en Europe. Vos coups de cœur sont expédiés sous 48h, sans frais de douane cachés.
                    </p>
                </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-deep-blue text-white p-12 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')]"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-serif mb-6">Prêt à faire entrer le soleil chez vous ?</h2>
                    <a
                        href="/produits"
                        className="inline-block bg-terracotta text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-terracotta transition-colors shadow-lg"
                    >
                        Découvrir la Collection
                    </a>
                </div>
            </div>
        </div>
    );
}
