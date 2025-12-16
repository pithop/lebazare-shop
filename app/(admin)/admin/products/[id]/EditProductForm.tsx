'use client'

import { updateProduct } from '@/actions/products'
import { useState } from 'react'
import Image from 'next/image'
import ProductVariantsForm, { Variant } from '@/components/admin/ProductVariantsForm'

export default function EditProductForm({ product }: { product: any }) {
    const [loading, setLoading] = useState(false)

    // Map existing variants to the format expected by the form
    const initialVariants: Variant[] = product.product_variants?.map((v: any) => ({
        id: v.id,
        name: v.name,
        price: v.price || 0,
        stock: v.stock,
        attributes: v.attributes || {}
    })) || []

    const [variants, setVariants] = useState<Variant[]>(initialVariants)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)

        // Append variants as JSON
        if (variants.length > 0) {
            formData.append('variants', JSON.stringify(variants))
        }

        try {
            await updateProduct(product.id, formData)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
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
                        defaultValue={product.title}
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
                        defaultValue={product.description}
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
                            defaultValue={product.price}
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
                            defaultValue={product.stock}
                            required
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
                        defaultValue={product.category || 'Autre'}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                    >
                        <option value="decoration">Décoration</option>
                        <option value="mobilier">Mobilier</option>
                        <option value="luminaires">Luminaires</option>
                        <option value="art-de-la-table">Art de la table</option>
                        <option value="tapis">Tapis</option>
                        <option value="accessoires">Accessoires</option>
                        <option value="Autre">Autre</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-slate-700 mb-1">
                        Images
                    </label>

                    {product.images && product.images.length > 0 && (
                        <div className="mb-4 grid grid-cols-4 gap-4">
                            {product.images.map((img: string, idx: number) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                                    <Image
                                        src={img}
                                        alt={`Product image ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

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
                            Sélectionnez de nouvelles images pour les AJOUTER aux existantes.
                        </p>

                        <div className="pt-2 border-t border-slate-100">
                            <label htmlFor="image_url" className="block text-xs font-medium text-slate-500 mb-1">
                                Ou ajouter par URL externe
                            </label>
                            <input
                                type="url"
                                id="image_url"
                                name="image_url"
                                placeholder="https://..."
                                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-medium text-slate-900 border-b border-slate-100 pb-2">Variantes</h2>
                <ProductVariantsForm variants={variants} setVariants={setVariants} />
            </div>

            <div className="pt-4 border-t border-slate-100">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
            </div>
        </form>
    )
}
