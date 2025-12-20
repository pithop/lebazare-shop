'use client'

import { useState, useEffect } from 'react'

export interface Variant {
    id?: string
    name: string
    price: number
    stock: number
    attributes: Record<string, string>
}

export default function ProductVariantsForm({
    variants,
    setVariants
}: {
    variants: Variant[],
    setVariants: (variants: Variant[]) => void
}) {
    const [attributes, setAttributes] = useState<{ name: string, values: string[] }[]>([])
    const [newAttrName, setNewAttrName] = useState('')
    const [newAttrValue, setNewAttrValue] = useState('')

    // Initialize attributes from existing variants on mount
    useEffect(() => {
        if (variants.length > 0 && attributes.length === 0) {
            const extractedAttributes: Record<string, Set<string>> = {}

            variants.forEach(variant => {
                if (variant.attributes) {
                    Object.entries(variant.attributes).forEach(([key, value]) => {
                        if (!extractedAttributes[key]) {
                            extractedAttributes[key] = new Set()
                        }
                        extractedAttributes[key].add(value)
                    })
                }
            })

            const newAttributes = Object.entries(extractedAttributes).map(([name, valuesSet]) => ({
                name,
                values: Array.from(valuesSet)
            }))

            if (newAttributes.length > 0) {
                setAttributes(newAttributes)
            }
        }
    }, []) // Run once on mount

    const addAttribute = () => {
        if (!newAttrName) return
        setAttributes([...attributes, { name: newAttrName, values: [] }])
        setNewAttrName('')
    }

    const addValueToAttribute = (index: number, value: string) => {
        if (!value) return
        const newAttributes = [...attributes]
        if (!newAttributes[index].values.includes(value)) {
            newAttributes[index].values.push(value)
        }
        setAttributes(newAttributes)
    }

    const generateVariants = () => {
        if (attributes.length === 0) return

        // Helper to generate cartesian product
        const cartesian = (args: string[][]) => {
            const result: string[][] = []
            const max = args.length - 1
            function helper(arr: string[], i: number) {
                for (let j = 0, l = args[i].length; j < l; j++) {
                    const a = arr.slice(0)
                    a.push(args[i][j])
                    if (i == max) result.push(a)
                    else helper(a, i + 1)
                }
            }
            helper([], 0)
            return result
        }

        const combinations = cartesian(attributes.map(a => a.values))

        const newVariants: Variant[] = combinations.map(combo => {
            const attrs: Record<string, string> = {}
            let nameParts: string[] = []

            attributes.forEach((attr, idx) => {
                attrs[attr.name] = combo[idx]
                nameParts.push(combo[idx])
            })

            const name = nameParts.join(' / ')

            // Try to find existing variant with same attributes to preserve ID and stock/price
            const existing = variants.find(v => {
                // Check if attributes match
                const attrMatch = Object.entries(attrs).every(([k, val]) => v.attributes[k] === val)
                return attrMatch
            })

            return {
                id: existing?.id, // Keep ID if exists
                name: name,
                price: existing?.price || 0,
                stock: existing?.stock || 1,
                attributes: attrs
            }
        })

        setVariants(newVariants)
    }

    return (
        <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-medium text-slate-900 mb-4">1. Définir les attributs (ex: Taille, Couleur)</h3>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Nom de l'attribut (ex: Taille)"
                        value={newAttrName}
                        onChange={(e) => setNewAttrName(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-md text-sm"
                    />
                    <button
                        type="button"
                        onClick={addAttribute}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium hover:bg-slate-50"
                    >
                        Ajouter
                    </button>
                </div>

                <div className="space-y-4">
                    {attributes.map((attr, idx) => (
                        <div key={idx} className="bg-white p-3 rounded border border-slate-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-sm">{attr.name}</span>
                                <button
                                    type="button"
                                    onClick={() => setAttributes(attributes.filter((_, i) => i !== idx))}
                                    className="text-xs text-red-500 hover:text-red-700"
                                >
                                    Supprimer
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {attr.values.map((val, vIdx) => (
                                    <span key={vIdx} className="bg-slate-100 px-2 py-1 rounded text-xs flex items-center gap-1">
                                        {val}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newAttrs = [...attributes]
                                                newAttrs[idx].values = newAttrs[idx].values.filter((_, i) => i !== vIdx)
                                                setAttributes(newAttrs)
                                            }}
                                            className="text-slate-400 hover:text-slate-600"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Valeur (ex: S, M, L)"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            addValueToAttribute(idx, e.currentTarget.value)
                                            e.currentTarget.value = ''
                                        }
                                    }}
                                    className="flex-1 px-2 py-1 border border-slate-200 rounded text-sm"
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Appuyez sur Entrée pour ajouter une valeur</p>
                        </div>
                    ))}
                </div>

                {attributes.length > 0 && attributes.every(a => a.values.length > 0) && (
                    <button
                        type="button"
                        onClick={generateVariants}
                        className="mt-4 w-full py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800"
                    >
                        Générer les variantes
                    </button>
                )}
            </div>

            {variants.length > 0 && (
                <div>
                    <h3 className="font-medium text-slate-900 mb-4">2. Configurer les variantes</h3>
                    <div className="space-y-2">
                        {variants.map((variant, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded border border-slate-200">
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{variant.name}</p>
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Prix (€)</label>
                                    <input
                                        type="number"
                                        value={variant.price || ''}
                                        onChange={(e) => {
                                            const newVariants = [...variants]
                                            newVariants[idx].price = parseFloat(e.target.value)
                                            setVariants(newVariants)
                                        }}
                                        placeholder="Défaut"
                                        className="w-24 px-2 py-1 border border-slate-200 rounded text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Stock</label>
                                    <input
                                        type="number"
                                        value={variant.stock}
                                        onChange={(e) => {
                                            const newVariants = [...variants]
                                            newVariants[idx].stock = parseInt(e.target.value)
                                            setVariants(newVariants)
                                        }}
                                        className="w-20 px-2 py-1 border border-slate-200 rounded text-sm"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setVariants(variants.filter((_, i) => i !== idx))}
                                    className="text-red-500 hover:text-red-700 p-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
