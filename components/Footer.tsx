import Link from 'next/link';

export default function Footer({ dictionary }: { dictionary: any }) {
  return (
    <footer className="bg-deep-blue text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-sand">LeBazare</h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              {dictionary.Footer.about}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-sand">{dictionary.Footer.links}</h4>
            <ul className="space-y-3 text-sm text-stone-300">
              <li><Link href="/" className="hover:text-white transition-colors">{dictionary.Navigation.home}</Link></li>
              <li><Link href="/produits" className="hover:text-white transition-colors">{dictionary.Navigation.products}</Link></li>
              <li><Link href="/a-propos" className="hover:text-white transition-colors">{dictionary.Navigation.about}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{dictionary.Navigation.contact}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-sand">Informations</h4>
            <ul className="space-y-3 text-sm text-stone-300">
              <li><Link href="/livraison" className="hover:text-white transition-colors">Livraison & Retours</Link></li>
              <li><Link href="/cgv" className="hover:text-white transition-colors">CGV</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-sand">Newsletter</h4>
            <p className="text-stone-300 text-sm mb-4">
              Inscrivez-vous pour recevoir nos nouveautés et offres exclusives.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Votre email"
                className="bg-white/10 border border-white/20 rounded px-4 py-2 text-white placeholder-stone-400 focus:outline-none focus:border-sand transition-colors"
              />
              <button
                type="submit"
                className="bg-terracotta text-white px-4 py-2 rounded hover:bg-accent-red transition-colors font-medium"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-stone-400">
          <p>&copy; {new Date().getFullYear()} LeBazare. Tous droits réservés.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {/* Social Icons Mock */}
            <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-white cursor-pointer transition-colors">Facebook</span>
            <span className="hover:text-white cursor-pointer transition-colors">Pinterest</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
