'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface ProductFiltersProps {
    categories: string[];
    minPrice: number;
    maxPrice: number;
}

export default function ProductFilters({ categories, minPrice: initialMin, maxPrice: initialMax }: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
    const [priceRange, setPriceRange] = useState([
        Number(searchParams.get('minPrice')) || initialMin,
        Number(searchParams.get('maxPrice')) || initialMax
    ]);

    // Update filters when URL changes
    useEffect(() => {
        setSelectedCategory(searchParams.get('category') || 'all');
        setPriceRange([
            Number(searchParams.get('minPrice')) || initialMin,
            Number(searchParams.get('maxPrice')) || initialMax
        ]);
    }, [searchParams, initialMin, initialMax]);

    const updateFilters = (newCategory: string, newMin: number, newMax: number) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newCategory && newCategory !== 'all') {
            params.set('category', newCategory);
        } else {
            params.delete('category');
        }

        if (newMin !== initialMin) {
            params.set('minPrice', newMin.toString());
        } else {
            params.delete('minPrice');
        }

        if (newMax !== initialMax) {
            params.set('maxPrice', newMax.toString());
        } else {
            params.delete('maxPrice');
        }

        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        updateFilters(category, priceRange[0], priceRange[1]);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
        const newVal = Number(e.target.value);
        const newRange = [...priceRange] as [number, number];
        newRange[index] = newVal;
        setPriceRange(newRange);
    };

    const handlePriceCommit = () => {
        updateFilters(selectedCategory, priceRange[0], priceRange[1]);
    };

    return (
        <div className="space-y-8">
            {/* Categories */}
            <div>
                <h3 className="font-serif text-lg text-slate-900 mb-4">Catégories</h3>
                <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="radio"
                            name="category"
                            value="all"
                            checked={selectedCategory === 'all'}
                            onChange={() => handleCategoryChange('all')}
                            className="w-4 h-4 text-slate-900 border-slate-300 focus:ring-slate-900"
                        />
                        <span className={`text-sm group-hover:text-slate-900 transition-colors ${selectedCategory === 'all' ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                            Tout voir
                        </span>
                    </label>
                    {categories.map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                value={cat}
                                checked={selectedCategory === cat}
                                onChange={() => handleCategoryChange(cat)}
                                className="w-4 h-4 text-slate-900 border-slate-300 focus:ring-slate-900"
                            />
                            <span className={`text-sm capitalize group-hover:text-slate-900 transition-colors ${selectedCategory === cat ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                                {cat}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-serif text-lg text-slate-900 mb-4">Prix</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">€</span>
                            <input
                                type="number"
                                value={priceRange[0]}
                                onChange={(e) => handlePriceChange(e, 0)}
                                onBlur={handlePriceCommit}
                                className="w-full pl-6 pr-2 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 outline-none"
                            />
                        </div>
                        <span className="text-slate-400">-</span>
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">€</span>
                            <input
                                type="number"
                                value={priceRange[1]}
                                onChange={(e) => handlePriceChange(e, 1)}
                                onBlur={handlePriceCommit}
                                className="w-full pl-6 pr-2 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 outline-none"
                            />
                        </div>
                    </div>
                    <input
                        type="range"
                        min={initialMin}
                        max={initialMax}
                        value={priceRange[1]}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            setPriceRange([priceRange[0], Math.max(val, priceRange[0])]);
                        }}
                        onMouseUp={handlePriceCommit}
                        onTouchEnd={handlePriceCommit}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                    />
                </div>
            </div>
        </div>
    );
}
