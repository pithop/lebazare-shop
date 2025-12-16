import Link from 'next/link';
import Search from './Search';
import CartIcon from './CartIcon';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-beige/80 backdrop-blur-md border-b border-stone-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif font-bold text-terracotta">
          LeBazare
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-dark-text hover:text-terracotta transition-colors font-medium">
            Accueil
          </Link>
          <Link href="/produits" className="text-dark-text hover:text-terracotta transition-colors font-medium">
            Boutique
          </Link>
          <Link href="/a-propos" className="text-dark-text hover:text-terracotta transition-colors font-medium">
            Notre Histoire
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <Search />
          </div>

          <Link href="/compte" className="p-2 text-dark-text hover:text-terracotta transition-colors" aria-label="Compte">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </Link>

          <CartIcon />
        </div>
      </div>
    </header>
  );
}
