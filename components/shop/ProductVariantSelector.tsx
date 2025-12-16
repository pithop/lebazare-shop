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
        }).format(amount)
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl lg:text-5xl font-serif text-slate-900 mb-4 leading-tight">{product.title}</h1>
                <p className="text-2xl lg:text-3xl font-medium text-accent-red">
                    {formatPrice(currentPrice)}
                </p>
            </div>

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

            <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
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
                            Rupture de stock
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
                <p className="text-sm text-center text-slate-500 mt-4">
                    Expédié via notre partenaire logistique sécurisé.
                </p>
            </div>
        </div>
    )
}
