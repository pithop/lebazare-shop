'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
    { id: 'all', name: 'Tout voir' },
    { id: 'decoration', name: 'Décoration' },
    { id: 'mobilier', name: 'Mobilier' },
    { id: 'luminaires', name: 'Luminaires' },
    { id: 'tapis', name: 'Tapis' },
];

interface ProductFiltersProps {
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
}

export default function ProductFilters({ categories: dynamicCategories, minPrice = 0, maxPrice = 2000 }: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

    // Merge static and dynamic categories if needed, or just use dynamic
    const activeCategories = dynamicCategories && dynamicCategories.length > 0
        ? [{ id: 'all', name: 'Tout voir' }, ...dynamicCategories.map(c => ({ id: c, name: c }))]
        : CATEGORIES;

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        updateParams({ category: categoryId === 'all' ? null : categoryId });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
        const newRange = [...priceRange] as [number, number];
        newRange[index] = parseInt(e.target.value);
        setPriceRange(newRange);
    };

    const applyPriceFilter = () => {
        updateParams({ minPrice: priceRange[0], maxPrice: priceRange[1] });
    };

    const updateParams = (updates: Record<string, string | number | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null) {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });
        router.push(`/produits?${params.toString()}`);
    };

    return (
        <>
            {/* Floating Trigger Pill */}
            <motion.button
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl text-dark-text px-6 py-3 rounded-full flex items-center gap-3 hover:scale-105 transition-transform duration-300 group"
            >
                <SlidersHorizontal className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-sm font-medium uppercase tracking-widest">Filtres</span>
            </motion.button>

            {/* Full Screen Overlay Filter Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-beige/95 backdrop-blur-xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-8 md:p-12">
                            <h2 className="text-4xl md:text-6xl font-serif text-dark-text">Filtres</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-4 hover:rotate-90 transition-transform duration-500"
                            >
                                <X className="w-8 h-8 md:w-12 md:h-12 text-dark-text" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-8 md:px-12 pb-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 max-w-6xl mx-auto">

                                {/* Categories */}
                                <div>
                                    <h3 className="text-sm font-medium uppercase tracking-widest text-stone-400 mb-8">Catégorie</h3>
                                    <ul className="space-y-4">
                                        {activeCategories.map((category) => (
                                            <li key={category.id}>
                                                <button
                                                    onClick={() => handleCategoryChange(category.id)}
                                                    className={`text-3xl md:text-5xl font-serif transition-all duration-300 hover:pl-4 ${selectedCategory === category.id
                                                            ? 'text-terracotta italic'
                                                            : 'text-dark-text/50 hover:text-dark-text'
                                                        }`}
                                                >
                                                    {category.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Price */}
                                <div>
                                    <h3 className="text-sm font-medium uppercase tracking-widest text-stone-400 mb-8">Prix</h3>
                                    <div className="flex items-end gap-4 mb-8">
                                        <div className="text-6xl font-serif text-dark-text">
                                            {priceRange[0]}€
                                        </div>
                                        <span className="text-4xl font-serif text-stone-300 mb-2">—</span>
                                        <div className="text-6xl font-serif text-dark-text">
                                            {priceRange[1]}€
                                        </div>
                                    </div>

                                    <div className="flex gap-8">
                                        <input
                                            type="range"
                                            min="0"
                                            max="2000"
                                            step="10"
                                            value={priceRange[1]}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                setPriceRange([priceRange[0], Math.max(val, priceRange[0])]);
                                            }}
                                            className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-terracotta"
                                        />
                                    </div>

                                    <button
                                        onClick={() => {
                                            applyPriceFilter();
                                            setIsOpen(false);
                                        }}
                                        className="mt-12 bg-dark-text text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-terracotta transition-colors w-full md:w-auto"
                                    >
                                        Voir les résultats
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
