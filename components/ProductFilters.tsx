'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const CATEGORIES = [
    { id: 'all', name: 'Tout voir' },
    { id: 'decoration', name: 'Décoration' },
    { id: 'mobilier', name: 'Mobilier' },
    { id: 'luminaires', name: 'Luminaires' },
    { id: 'tapis', name: 'Tapis' },
];

export default function ProductFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

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
        <div className="space-y-8">
            <div>
                <h3 className="font-serif text-lg font-medium mb-4 text-dark-text">Catégories</h3>
                <ul className="space-y-2">
                    {CATEGORIES.map((category) => (
                        <li key={category.id}>
                            <button
                                onClick={() => handleCategoryChange(category.id)}
                                className={`text-sm transition-colors ${selectedCategory === category.id
                                        ? 'text-terracotta font-medium'
                                        : 'text-stone-600 hover:text-terracotta'
                                    }`}
                            >
                                {category.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3 className="font-serif text-lg font-medium mb-4 text-dark-text">Prix</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <input
                            type="number"
                            min="0"
                            max="1000"
                            value={priceRange[0]}
                            onChange={(e) => handlePriceChange(e, 0)}
                            className="w-20 px-2 py-1 border border-stone-200 rounded text-sm"
                        />
                        <span className="text-stone-400">-</span>
                        <input
                            type="number"
                            min="0"
                            max="1000"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceChange(e, 1)}
                            className="w-20 px-2 py-1 border border-stone-200 rounded text-sm"
                        />
                    </div>
                    <button
                        onClick={applyPriceFilter}
                        className="w-full bg-stone-900 text-white py-2 rounded text-sm hover:bg-terracotta transition-colors"
                    >
                        Filtrer
                    </button>
                </div>
            </div>
        </div>
    );
}
