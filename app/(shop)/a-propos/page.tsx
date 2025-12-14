export const metadata = {
  title: 'À Propos - LeBazare',
  description: 'Découvrez l\'histoire de LeBazare et notre passion pour l\'artisanat',
};

export default function AProposPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif text-terracotta mb-8 text-center">
          Notre Histoire
        </h1>

        <div className="prose prose-lg max-w-none space-y-6 text-dark-text">
          <p className="text-xl leading-relaxed">
            LeBazare est née d'une passion pour les matières naturelles et le travail artisanal.
            Chaque création raconte une histoire unique, façonnée avec soin et authenticité.
          </p>

          <h2 className="text-3xl font-serif text-terracotta mt-12 mb-6">
            Notre Philosophie
          </h2>

          <p className="leading-relaxed">
            Dans un monde de plus en plus standardisé, nous croyons en la beauté de l'imperfection
            et du fait main. Nos créations en bois, paille et raphia sont le fruit d'un savoir-faire
            artisanal transmis avec passion.
          </p>

          <p className="leading-relaxed">
            Chaque pièce est unique, portant en elle les traces du geste de l'artisan et
            l'authenticité des matières naturelles. Nous privilégions les matériaux durables
            et respectueux de l'environnement, dans une démarche consciente et responsable.
          </p>

          <h2 className="text-3xl font-serif text-terracotta mt-12 mb-6">
            Notre Engagement
          </h2>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-beige p-6 rounded-lg">
              <h3 className="font-serif text-xl text-terracotta mb-3">Artisanat Authentique</h3>
              <p className="text-dark-text/90">
                Chaque pièce est façonnée à la main, avec attention aux détails et respect
                des techniques traditionnelles.
              </p>
            </div>

            <div className="bg-beige p-6 rounded-lg">
              <h3 className="font-serif text-xl text-terracotta mb-3">Matières Naturelles</h3>
              <p className="text-dark-text/90">
                Nous utilisons exclusivement des matériaux naturels : bois, paille, raphia
                et fibres végétales.
              </p>
            </div>

            <div className="bg-beige p-6 rounded-lg">
              <h3 className="font-serif text-xl text-terracotta mb-3">Création Unique</h3>
              <p className="text-dark-text/90">
                Nos pièces sont produites en édition limitée ou sont totalement uniques,
                garantissant leur exclusivité.
              </p>
            </div>

            <div className="bg-beige p-6 rounded-lg">
              <h3 className="font-serif text-xl text-terracotta mb-3">Démarche Durable</h3>
              <p className="text-dark-text/90">
                Nous nous engageons dans une démarche respectueuse de l'environnement
                et des ressources naturelles.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-serif text-terracotta mt-12 mb-6">
            Retrouvez-nous
          </h2>

          <p className="leading-relaxed">
            Découvrez l'ensemble de nos créations sur notre boutique Etsy, où vous pourrez
            également lire les avis de nos clients satisfaits et explorer notre univers bohème
            et authentique.
          </p>

          <div className="text-center mt-8">
            <a
              href="https://www.etsy.com/shop/LeBazare"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-accent-red text-white px-8 py-4 rounded-lg text-lg font-medium hover:opacity-90 transition-opacity shadow-lg"
            >
              Visiter notre boutique Etsy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
