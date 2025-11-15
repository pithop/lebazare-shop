import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-3xl font-serif text-terracotta hover:text-accent-red transition-colors">
            LeBazare
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/produits" className="text-dark-text hover:text-terracotta transition-colors">
              Produits
            </Link>
            <Link href="/a-propos" className="text-dark-text hover:text-terracotta transition-colors">
              À propos
            </Link>
            <Link href="/contact" className="text-dark-text hover:text-terracotta transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/panier" 
              className="relative text-dark-text hover:text-terracotta transition-colors"
              aria-label="Panier"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" 
                />
              </svg>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
