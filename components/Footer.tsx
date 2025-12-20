import Link from 'next/link';

export default function Footer({ dictionary }: { dictionary: any }) {
  return (
    <footer className="bg-deep-blue text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <h3 className="text-3xl font-serif font-bold text-sand">LeBazare</h3>
            <p className="text-stone-300 text-sm leading-relaxed max-w-xs">
              {dictionary.Footer.about}
            </p>
            <div className="flex space-x-4">
              {/* Instagram */}
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-sand hover:text-deep-blue transition-all duration-300" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              {/* Facebook */}
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-sand hover:text-deep-blue transition-all duration-300" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              {/* Pinterest */}
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-sand hover:text-deep-blue transition-all duration-300" aria-label="Pinterest">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0"></path><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M2 12h2"></path><path d="M20 12h2"></path></svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-sand tracking-wide">{dictionary.Footer.links}</h4>
            <ul className="space-y-4 text-sm text-stone-300">
              <li><Link href="/" className="hover:text-sand transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-sand rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>{dictionary.Navigation.home}</Link></li>
              <li><Link href="/produits" className="hover:text-sand transition-colors flex items-center gap-2">{dictionary.Navigation.products}</Link></li>
              <li><Link href="/a-propos" className="hover:text-sand transition-colors flex items-center gap-2">{dictionary.Navigation.about}</Link></li>
              <li><Link href="/contact" className="hover:text-sand transition-colors flex items-center gap-2">{dictionary.Navigation.contact}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-sand tracking-wide">Informations</h4>
            <ul className="space-y-4 text-sm text-stone-300">
              <li><Link href="/livraison" className="hover:text-sand transition-colors">Livraison & Retours</Link></li>
              <li><Link href="/cgv" className="hover:text-sand transition-colors">CGV</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-sand transition-colors">Mentions Légales</Link></li>
              <li><Link href="/faq" className="hover:text-sand transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-sand tracking-wide">Newsletter</h4>
            <p className="text-stone-300 text-sm mb-6 leading-relaxed">
              Inscrivez-vous pour recevoir nos nouveautés et offres exclusives.
            </p>
            <form className="flex flex-col space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-sand focus:bg-white/10 transition-all"
                />
              </div>
              <button
                type="submit"
                className="bg-sand text-deep-blue px-6 py-3 rounded-lg hover:bg-white transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-stone-500">
          <p>&copy; {new Date().getFullYear()} LeBazare. Tous droits réservés.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Paiement Sécurisé
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
