import Link from 'next/link';
import NewsletterForm from '@/components/NewsletterForm';

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
            {/* Contact Info - Required for Google Merchant */}
            <div className="text-sm text-stone-300 space-y-2 pt-2 border-t border-white/10">
              <a href="mailto:contact@lebazare.fr" className="flex items-center gap-2 hover:text-sand transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@lebazare.fr
              </a>
              <a href="tel:+33972213899" className="flex items-center gap-2 hover:text-sand transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +33 9 72 21 38 99
              </a>
            </div>
            <div className="flex space-x-4">
              {/* Instagram */}
              <a href="https://www.instagram.com/lebazare.fr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-sand hover:text-deep-blue transition-all duration-300" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              {/* Facebook */}
              <a href="https://www.facebook.com/lebazare.fr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-sand hover:text-deep-blue transition-all duration-300" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              {/* Pinterest */}
              <a href="https://www.pinterest.fr/lebazare" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-sand hover:text-deep-blue transition-all duration-300" aria-label="Pinterest">
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
              <li><Link href="/livraison" className="hover:text-sand transition-colors">Livraison</Link></li>
              <li><Link href="/retours" className="hover:text-sand transition-colors">Politique de Retour (14 jours)</Link></li>
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
            <NewsletterForm />
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

