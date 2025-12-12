import Link from 'next/link';
import Search from './Search';

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

          <Link href="/panier" className="p-2 text-dark-text hover:text-terracotta transition-colors relative" aria-label="Panier">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 5c.07.286.074.58.012.865-.187.872-1.169 1.343-1.964.938-.47-.237-.853-.66-1.09-1.164a5.99 5.99 0 01-1.932 0C13.93 13.893 14.26 13.5 14.26 13.5h-4.52s.33 1.393-.146 2.646c-.237.504-.62.927-1.09 1.164-.795.405-1.777-.066-1.964-.938a2.53 2.53 0 01.012-.865l1.263-5M9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm7.5 0c0 .414-.168.75-.375.75S16.5 10.164 16.5 9.75s.168-.75.375-.75.375.336.375.75z" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
