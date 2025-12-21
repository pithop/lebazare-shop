import Image from 'next/image';

export const metadata = {
  title: 'À Propos - LeBazare',
  description: 'Découvrez l\'histoire de LeBazare et notre passion pour l\'artisanat',
};

export default function AProposPage() {
  return (
    <div className="bg-stone-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image
          src="/hero-bg.jpg" // Using existing asset
          alt="Artisanat Marocain"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-lg">
              L'Âme de l'Artisanat
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide">
              Une histoire de passion, de tradition et d'authenticité.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {/* Story Section */}
        <div className="max-w-5xl mx-auto mb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-terracotta font-medium tracking-widest uppercase text-sm">Notre Histoire</span>
              <h2 className="text-4xl font-serif text-deep-blue">
                Des Montagnes de l'Atlas à Votre Intérieur
              </h2>
              <p className="text-dark-text/80 text-lg leading-relaxed">
                LeBazare est née d'une rencontre entre la beauté brute des paysages marocains et l'incroyable savoir-faire de ses artisans.
                Nous parcourons les souks, les villages reculés et les coopératives féminines pour dénicher des trésors uniques.
              </p>
              <p className="text-dark-text/80 text-lg leading-relaxed">
                Plus qu'une boutique, nous sommes un pont entre deux mondes, valorisant le travail manuel et les matières nobles comme la laine, le bois, la paille et le cuir.
              </p>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/images/about-hero.png"
                alt="Artisan au travail"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            {
              title: "Fait Main",
              desc: "Chaque pièce est unique, façonnée avec patience et amour par des artisans experts.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              )
            },
            {
              title: "Matières Naturelles",
              desc: "Nous privilégions les fibres végétales, la laine naturelle et les matériaux durables.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              )
            },
            {
              title: "Éthique",
              desc: "Une rémunération juste pour les artisans et le soutien aux coopératives locales.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              )
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow text-center group">
              <div className="w-16 h-16 mx-auto bg-beige rounded-full flex items-center justify-center text-terracotta mb-6 group-hover:bg-terracotta group-hover:text-white transition-colors duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-serif text-deep-blue mb-4">{item.title}</h3>
              <p className="text-dark-text/70 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Quote Section */}
        <div className="max-w-4xl mx-auto text-center mb-24 relative">
          <span className="text-9xl font-serif text-beige absolute -top-12 -left-12 opacity-50">"</span>
          <blockquote className="text-3xl md:text-4xl font-serif text-deep-blue leading-tight relative z-10">
            Nous ne vendons pas simplement des objets, nous partageons des histoires tissées, sculptées et tressées par des mains expertes.
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-terracotta"></div>
            <span className="text-terracotta font-medium tracking-widest uppercase text-sm">L'équipe LeBazare</span>
            <div className="h-px w-12 bg-terracotta"></div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-deep-blue rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')]"></div> {/* Optional pattern */}
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Envie d'apporter une touche d'authenticité à votre intérieur ?</h2>
            <p className="text-white/80 mb-8 text-lg">
              Explorez notre collection et trouvez la pièce unique qui fera toute la différence.
            </p>
            <a
              href="/produits"
              className="inline-block bg-sand text-deep-blue px-8 py-4 rounded-lg text-lg font-medium hover:bg-white transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform"
            >
              Découvrir la Collection
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

