'use client'

import { createProduct } from '@/actions/products'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import ProductVariantsForm, { Variant } from '@/components/admin/ProductVariantsForm'

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [variants, setVariants] = useState<Variant[]>([])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)

        // Append variants as JSON
        if (variants.length > 0) {
            formData.append('variants', JSON.stringify(variants))
        }

        try {
            await createProduct(formData)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="text-slate-500 hover:text-slate-800">
                    ← Retour
                </Link>
                <h1 className="text-3xl font-serif text-slate-800">Nouveau Produit</h1>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <h2 className="text-xl font-medium text-slate-900 border-b border-slate-100 pb-2">Informations Générales</h2>
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                                Titre
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">
                                    Prix (€)
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    step="0.01"
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-slate-700 mb-1">
                                    Stock Global
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    required
                                    defaultValue={1}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                                Catégorie
                            </label>
                            <select
                                id="category"
                                name="category"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                            >
                                <option value="decoration">Décoration</option>
                                <option value="mobilier">Mobilier</option>
                                <option value="luminaires">Luminaires</option>
                                <option value="art-de-la-table">Art de la table</option>
                                <option value="tapis">Tapis</option>
                                <option value="accessoires">Accessoires</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-slate-700 mb-1">
                                Images (vous pouvez en sélectionner plusieurs)
                            </label>
                            <div className="space-y-4">
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    multiple
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                                />
                                <p className="text-xs text-slate-500">
                                    Ou entrez une URL externe (optionnel si fichier sélectionné)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-medium text-slate-900 border-b border-slate-100 pb-2">Variantes (Optionnel)</h2>
                        <ProductVariantsForm variants={variants} setVariants={setVariants} />
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Création...' : 'Créer le produit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
