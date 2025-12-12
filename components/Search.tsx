'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Search() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/produits?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative">
            <input
                type="text"
                placeholder="Rechercher..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-4 pr-10 py-2 rounded-full border border-stone-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-terracotta transition-all text-sm w-48 focus:w-64"
            />
            <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-terracotta transition-colors"
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
