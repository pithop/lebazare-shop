'use client'

import { useState, useEffect } from 'react'
import AddToCartButton from '@/components/AddToCartButton'

interface Variant {
    id: string
    title: string
    priceV2: {
        amount: string
        currencyCode: string
    }
    availableForSale: boolean
    attributes?: Record<string, string>
}

export default function ProductVariantSelector({
    product,
    variants
}: {
    product: any,
    variants: Variant[]
}) {
    // Extract all available attributes
    const allAttributes: Record<string, Set<string>> = {}
    variants.forEach(v => {
        if (v.attributes) {
            Object.entries(v.attributes).forEach(([key, value]) => {
                if (!allAttributes[key]) allAttributes[key] = new Set()
                allAttributes[key].add(value)
            })
        }
    })

    const hasAttributes = Object.keys(allAttributes).length > 0

    // State for selected options
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)

    // Initialize default selection
    useEffect(() => {
        if (hasAttributes) {
            const defaults: Record<string, string> = {}
            Object.keys(allAttributes).forEach(key => {
                // Select first available value for each attribute
                defaults[key] = Array.from(allAttributes[key])[0]
            })
            setSelectedOptions(defaults)
        } else {
            // If no attributes (simple product), select the first variant
            setSelectedVariant(variants[0])
        }
    }, [])

    // Update selected variant when options change
    useEffect(() => {
        if (hasAttributes) {
            const found = variants.find(v => {
                if (!v.attributes) return false
                return Object.entries(selectedOptions).every(([key, val]) => v.attributes![key] === val)
            })
            setSelectedVariant(found || null)
        }
    }, [selectedOptions, variants, hasAttributes])

    const handleOptionChange = (attribute: string, value: string) => {
        setSelectedOptions(prev => ({ ...prev, [attribute]: value }))
    }

    const currentPrice = selectedVariant
        ? parseFloat(selectedVariant.priceV2.amount)
        : parseFloat(product.priceRange.minVariantPrice.amount)

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="space-y-8">
            {hasAttributes && (
                <div className="space-y-6">
                    {Object.entries(allAttributes).map(([attrName, values]) => (
                        <div key={attrName}>
                            <h3 className="text-sm font-medium text-slate-900 mb-3">{attrName}</h3>
                            <div className="flex flex-wrap gap-3">
                                {Array.from(values).map((value) => {
                                    const isSelected = selectedOptions[attrName] === value
                                    return (
                                        <button
                                            key={value}
                                            onClick={() => handleOptionChange(attrName, value)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${isSelected
                                                ? 'bg-slate-900 text-white border-slate-900'
                                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                                                }`}
                                        >
                                            {value}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 relative overflow-hidden">
                {/* Neuro-Marketing: Scarcity & Offer Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#C05746]/10 text-[#C05746] border border-[#C05746]/20">
                        ✨ Offre Lancement
                    </span>
                    {selectedVariant && selectedVariant.availableForSale && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                            🕰️ Pièce Unique
                        </span>
                    )}
                </div>

                {/* Prestige Pricing Display */}
                <div className="mb-8 p-4 bg-white rounded-lg border border-stone-100 shadow-sm">
                    <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-slate-400 line-through text-lg font-light decoration-slate-400/50">
                            {formatPrice(Math.round(currentPrice / 0.8))}
                        </span>
                        <span className="text-slate-900 text-3xl font-serif font-medium">
                            {formatPrice(currentPrice)}
                        </span>
                    </div>
                    <p className="text-[#C05746] text-xs font-medium italic">
                        Vous économisez {formatPrice(Math.round(currentPrice / 0.8) - currentPrice)} pour le lancement
                    </p>
                </div>

                {/* Ethical Scarcity Signal (Real-time proof simulation) */}
                <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span>3 personnes consultent cette pièce unique</span>
                </div>

                {selectedVariant ? (
                    selectedVariant.availableForSale ? (
                        <AddToCartButton
                            variantId={selectedVariant.id}
                            productId={product.id}
                            productTitle={`${product.title}${selectedVariant.title !== 'Default Title' ? ` - ${selectedVariant.title}` : ''}`}
                            price={currentPrice}
                            image={product.images.edges[0]?.node.url || ''}
                        />
                    ) : (
                        <button
                            disabled
                            className="w-full bg-slate-200 text-slate-500 px-8 py-4 rounded-lg text-lg font-medium cursor-not-allowed"
                        >
                            Cette pièce a trouvé preneur
                        </button>
                    )
                ) : (
                    <button
                        disabled
                        className="w-full bg-slate-200 text-slate-500 px-8 py-4 rounded-lg text-lg font-medium cursor-not-allowed"
                    >
                        Combinaison indisponible
                    </button>
                )}

                {/* Trust Signals */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-stone-100">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-xs text-slate-600">Paiement Sécurisé SSL</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="text-xs text-slate-600">Expédié sous 48h</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
