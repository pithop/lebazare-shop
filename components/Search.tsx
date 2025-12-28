'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

interface SearchProps {
    isMobile?: boolean;
    onClose?: () => void;
}

export default function Search({ isMobile = false, onClose }: SearchProps) {
    const [query, setQuery] = useState('');
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const lang = params.lang as string || 'fr';
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when mobile overlay opens
    useEffect(() => {
        if (isMobile && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isMobile]);

    // Clear query when navigating
    useEffect(() => {
        setQuery(searchParams.get('q') || '');
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/${lang}/produits?q=${encodeURIComponent(query)}`);
            if (onClose) onClose();
        }
    };

    if (isMobile) {
        return (
            <form onSubmit={handleSearch} className="w-full relative">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-terracotta/50 py-4 text-xl text-dark-text placeholder-stone-400 focus:outline-none focus:border-terracotta transition-colors font-serif"
                />
                <button
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-terracotta"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </button>
            </form>
        );
    }

    return (
        <form onSubmit={handleSearch} className="relative group">
            <input
                type="text"
                placeholder="Rechercher..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-4 pr-10 py-2 rounded-full border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-terracotta focus:border-terracotta transition-all text-sm w-48 focus:w-64 text-dark-text placeholder-stone-400"
            />
            <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-terracotta transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                </svg>
            </button>
        </form>
    );
}
