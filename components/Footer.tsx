export default function Footer() {
  return (
    <footer className="bg-ocre text-dark-text mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-2xl mb-4 text-terracotta">LeBazare</h3>
            <p className="text-sm">
              Créations artisanales en matières naturelles : bois, paille, raphia.
              Chaque pièce est unique et fabriquée avec amour.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/produits" className="hover:text-terracotta transition-colors">
                  Produits
                </a>
              </li>
              <li>
                <a href="/a-propos" className="hover:text-terracotta transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-terracotta transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Suivez-nous</h4>
            <p className="text-sm mb-2">
              Retrouvez-nous sur Etsy pour découvrir toutes nos créations.
            </p>
            <a
              href="https://www.etsy.com/shop/LeBazare"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-terracotta text-white px-4 py-2 rounded hover:bg-accent-red transition-colors text-sm"
            >
              Boutique Etsy
            </a>
          </div>
        </div>

        <div className="border-t border-dark-text/20 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} LeBazare. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
