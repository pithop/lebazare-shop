'use client';

import Link from 'next/link';
import { useState } from 'react';
import Search from './Search';
import CartIcon from './CartIcon';

export default function Header({ dictionary }: { dictionary: any }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-beige/90 backdrop-blur-md border-b border-stone-100 transition-all duration-300">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl md:text-3xl font-serif font-bold text-terracotta tracking-tight hover:opacity-90 transition-opacity">
            LeBazare
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-dark-text hover:text-terracotta transition-colors font-medium text-sm uppercase tracking-wide">
              {dictionary.Navigation.home}
            </Link>
            <Link href="/produits" className="text-dark-text hover:text-terracotta transition-colors font-medium text-sm uppercase tracking-wide">
              {dictionary.Navigation.products}
            </Link>
            <Link href="/a-propos" className="text-dark-text hover:text-terracotta transition-colors font-medium text-sm uppercase tracking-wide">
              {dictionary.Navigation.about}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Desktop Search */}
            <div className="hidden md:block">
              <Search />
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 text-dark-text hover:text-terracotta transition-colors"
              aria-label="Rechercher"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* Account */}
            <Link href="/mon-compte" className="p-2 text-dark-text hover:text-terracotta transition-colors" aria-label="Mon Compte">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>

            {/* Cart */}
            <CartIcon />
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-beige/95 backdrop-blur-xl flex flex-col p-4 animate-in fade-in duration-200">
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-dark-text hover:text-terracotta transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="container mx-auto max-w-lg">
            <h2 className="text-2xl font-serif text-terracotta mb-6 text-center">Rechercher</h2>
            <Search isMobile={true} onClose={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
